"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import type { Routine, DbActivity, Completion, TokenTransaction, DbReward, Redemption } from "@/lib/supabase/types"

// Maps DB data to the shape page.tsx expects
export interface Activity {
  id: string
  name: string
  icon: string
  completed: boolean
  completedDate?: string
}

export interface RoutineBlock {
  id: string
  title: string
  icon: string
  bgColor: string
  accentColor: string
  activities: Activity[]
}

export interface DayProgress {
  date: string
  totalActivities: number
  completedActivities: number
  percentage: number
  routines: Record<string, { total: number; completed: number }>
}

export interface Reward {
  id: string
  name: string
  icon: string
  price: number
  isActive: boolean
}

function getToday() {
  return new Date().toISOString().split("T")[0]
}

function getWeekDates() {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().split("T")[0]
  })
}

export function useSupabaseData() {
  const { activeChild, family } = useAuth()
  const supabase = createClient()

  const [routines, setRoutines] = useState<Routine[]>([])
  const [activities, setActivities] = useState<DbActivity[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [tokenBalance, setTokenBalance] = useState(0)
  const [rewards, setRewards] = useState<DbReward[]>([])
  const [loading, setLoading] = useState(true)

  const today = getToday()

  const loadAll = useCallback(async () => {
    if (!activeChild || !family) return

    setLoading(true)

    const weekDates = getWeekDates()

    const [routinesRes, rewardsRes, balanceRes, completionsRes] = await Promise.all([
      supabase.from("routines").select("*").eq("child_id", activeChild.id).order("sort_order"),
      supabase.from("rewards").select("*").eq("family_id", family.id).eq("is_active", true),
      supabase.rpc("get_token_balance", { p_child_id: activeChild.id }),
      supabase
        .from("completions")
        .select("*")
        .eq("child_id", activeChild.id)
        .gte("completed_date", weekDates[0])
        .lte("completed_date", weekDates[6]),
    ])

    const rtnData = routinesRes.data || []
    setRoutines(rtnData)
    setRewards(rewardsRes.data || [])
    setTokenBalance(balanceRes.data ?? 0)
    setCompletions(completionsRes.data || [])

    if (rtnData.length > 0) {
      const routineIds = rtnData.map(r => r.id)
      const { data: acts } = await supabase
        .from("activities")
        .select("*")
        .in("routine_id", routineIds)
        .order("sort_order")
      setActivities(acts || [])
    }

    setLoading(false)
  }, [activeChild, family, supabase])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Build routine blocks with today's completion status
  const routineBlocks: RoutineBlock[] = routines.map(r => {
    const acts = activities.filter(a => a.routine_id === r.id)
    return {
      id: r.block_id,
      title: r.title,
      icon: r.icon,
      bgColor: r.bg_color,
      accentColor: r.accent_color,
      activities: acts.map(a => ({
        id: a.id,
        name: a.name_es,
        icon: a.icon,
        completed: completions.some(c => c.activity_id === a.id && c.completed_date === today),
        completedDate: completions.find(c => c.activity_id === a.id && c.completed_date === today)?.completed_date,
      })),
    }
  })

  // Week progress
  const weekDates = getWeekDates()
  const weekProgress: DayProgress[] = weekDates.map(date => {
    const dayCompletions = completions.filter(c => c.completed_date === date)
    const totalActivities = activities.length
    const completedActivities = dayCompletions.length
    const routineProgress: Record<string, { total: number; completed: number }> = {}
    routines.forEach(r => {
      const rActs = activities.filter(a => a.routine_id === r.id)
      const rCompleted = rActs.filter(a => dayCompletions.some(c => c.activity_id === a.id))
      routineProgress[r.block_id] = { total: rActs.length, completed: rCompleted.length }
    })
    return {
      date,
      totalActivities,
      completedActivities,
      percentage: totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0,
      routines: routineProgress,
    }
  })

  const rewardsList: Reward[] = rewards.map(r => ({
    id: r.id,
    name: r.name_es,
    icon: r.icon,
    price: r.price,
    isActive: r.is_active,
  }))

  const completeActivity = useCallback(async (activityId: string, tokens: number = 1) => {
    if (!activeChild) return

    const existing = completions.find(c => c.activity_id === activityId && c.completed_date === today)
    if (existing) return

    await supabase.from("completions").insert({
      child_id: activeChild.id,
      activity_id: activityId,
      completed_date: today,
      tokens_earned: tokens,
    })

    await supabase.from("token_transactions").insert({
      child_id: activeChild.id,
      amount: tokens,
      reason: "activity",
      reference_id: activityId,
    })

    await loadAll()
  }, [activeChild, completions, today, supabase, loadAll])

  const redeemReward = useCallback(async (rewardId: string, price: number) => {
    if (!activeChild || tokenBalance < price) return

    await supabase.from("redemptions").insert({
      child_id: activeChild.id,
      reward_id: rewardId,
      tokens_spent: price,
    })

    await supabase.from("token_transactions").insert({
      child_id: activeChild.id,
      amount: -price,
      reason: "redemption",
      reference_id: rewardId,
    })

    await loadAll()
  }, [activeChild, tokenBalance, supabase, loadAll])

  const subtractTokens = useCallback(async (amount: number, reason: string) => {
    if (!activeChild) return

    await supabase.from("token_transactions").insert({
      child_id: activeChild.id,
      amount: -amount,
      reason: "consequence",
      reference_id: reason,
    })

    await loadAll()
  }, [activeChild, supabase, loadAll])

  const addActivity = useCallback(async (routineBlockId: string, name: string, icon: string) => {
    const routine = routines.find(r => r.block_id === routineBlockId)
    if (!routine) return

    const maxOrder = activities.filter(a => a.routine_id === routine.id).length

    await supabase.from("activities").insert({
      routine_id: routine.id,
      name_es: name,
      name_en: name,
      icon,
      sort_order: maxOrder,
    })

    await loadAll()
  }, [routines, activities, supabase, loadAll])

  const removeActivity = useCallback(async (activityId: string) => {
    await supabase.from("activities").delete().eq("id", activityId)
    await loadAll()
  }, [supabase, loadAll])

  const addReward = useCallback(async (name: string, icon: string, price: number) => {
    if (!family) return
    await supabase.from("rewards").insert({
      family_id: family.id,
      name_es: name,
      icon,
      price,
    })
    await loadAll()
  }, [family, supabase, loadAll])

  const removeReward = useCallback(async (rewardId: string) => {
    await supabase.from("rewards").update({ is_active: false }).eq("id", rewardId)
    await loadAll()
  }, [supabase, loadAll])

  return {
    routineBlocks,
    weekProgress,
    rewards: rewardsList,
    tokenBalance,
    loading,
    completeActivity,
    redeemReward,
    subtractTokens,
    addActivity,
    removeActivity,
    addReward,
    removeReward,
    refreshData: loadAll,
    today,
  }
}
