"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"
import type { Profile, Family, Child } from "@/lib/supabase/types"

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  family: Family | null
  children: Child[]
  activeChild: Child | null
  loading: boolean
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  setupFamily: (familyName: string, childName: string) => Promise<{ error: string | null }>
  joinFamily: (inviteCode: string) => Promise<{ error: string | null }>
  addChild: (name: string) => Promise<void>
  setActiveChild: (child: Child) => void
  refreshData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export function AuthProvider({ children: reactChildren }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    family: null,
    children: [],
    activeChild: null,
    loading: true,
  })

  const supabase = createClient()

  const loadUserData = useCallback(async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (!profile?.family_id) {
      setState(prev => ({ ...prev, profile, loading: false }))
      return
    }

    const [{ data: family }, { data: kids }] = await Promise.all([
      supabase.from("families").select("*").eq("id", profile.family_id).single(),
      supabase.from("children").select("*").eq("family_id", profile.family_id).order("created_at"),
    ])

    const savedActiveChildId = localStorage.getItem("active-child-id")
    const activeChild = kids?.find(c => c.id === savedActiveChildId) || kids?.[0] || null

    setState(prev => ({
      ...prev,
      profile,
      family,
      children: kids || [],
      activeChild,
      loading: false,
    }))
  }, [supabase])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({ ...prev, user: session?.user ?? null, session }))
      if (session?.user) {
        loadUserData(session.user.id)
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(prev => ({ ...prev, user: session?.user ?? null, session }))
      if (session?.user) {
        loadUserData(session.user.id)
      } else {
        setState(prev => ({
          ...prev,
          profile: null,
          family: null,
          children: [],
          activeChild: null,
          loading: false,
        }))
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, loadUserData])

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    return { error: error?.message ?? null }
  }, [supabase])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [supabase])

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    })
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  const setupFamily = useCallback(async (familyName: string, childName: string): Promise<{ error: string | null }> => {
    if (!state.user) return { error: "No autenticado" }

    const { data, error } = await supabase.rpc("setup_family", {
      p_family_name: familyName || "Mi Familia",
      p_child_name: childName,
    })

    if (error) return { error: error.message }

    await loadUserData(state.user.id)
    if (data?.child_id) {
      localStorage.setItem("active-child-id", data.child_id)
    }
    return { error: null }
  }, [supabase, state.user, loadUserData])

  const joinFamily = useCallback(async (inviteCode: string) => {
    if (!state.user) return { error: "No autenticado" }

    const { data: family } = await supabase
      .from("families")
      .select("id")
      .eq("invite_code", inviteCode.trim().toLowerCase())
      .single()

    if (!family) return { error: "Código no válido" }

    await supabase
      .from("profiles")
      .update({ family_id: family.id })
      .eq("id", state.user.id)

    await loadUserData(state.user.id)
    return { error: null }
  }, [supabase, state.user, loadUserData])

  const addChild = useCallback(async (name: string) => {
    if (!state.family) return

    const { data: child } = await supabase
      .from("children")
      .insert({ family_id: state.family.id, name })
      .select()
      .single()

    if (child) {
      // Create default routine blocks
      const blocks = [
        { child_id: child.id, block_id: "manana", title: "Rutina de la mañana", icon: "sun", bg_color: "bg-morning-yellow", accent_color: "border-yellow-400", sort_order: 0 },
        { child_id: child.id, block_id: "tarde", title: "Rutina de la tarde", icon: "cloud-sun", bg_color: "bg-afternoon-orange", accent_color: "border-orange-400", sort_order: 1 },
        { child_id: child.id, block_id: "noche", title: "Rutina de la noche", icon: "moon", bg_color: "bg-night-indigo", accent_color: "border-indigo-400", sort_order: 2 },
      ]
      await supabase.from("routines").insert(blocks)

      await loadUserData(state.user!.id)
      setState(prev => ({ ...prev, activeChild: child }))
      localStorage.setItem("active-child-id", child.id)
    }
  }, [supabase, state.family, state.user, loadUserData])

  const setActiveChildFn = useCallback((child: Child) => {
    setState(prev => ({ ...prev, activeChild: child }))
    localStorage.setItem("active-child-id", child.id)
  }, [])

  const refreshData = useCallback(async () => {
    if (state.user) await loadUserData(state.user.id)
  }, [state.user, loadUserData])

  return (
    <AuthContext.Provider value={{
      ...state,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      setupFamily,
      joinFamily,
      addChild,
      setActiveChild: setActiveChildFn,
      refreshData,
    }}>
      {reactChildren}
    </AuthContext.Provider>
  )
}
