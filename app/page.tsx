"use client"

import { useState, useCallback } from "react"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/contexts/auth-context"
import { useSupabaseData } from "@/hooks/use-supabase-data"
import { HeaderCalendario } from "@/components/header-calendario"
import { BloqueRutina } from "@/components/bloque-rutina"
import { ResumenSemanal } from "@/components/resumen-semanal"
import { RewardShop } from "@/components/reward-shop"
import { CelebrationModal } from "@/components/celebration-modal"
import { RobotMascota } from "@/components/robot-mascota"
import { SettingsPanel } from "@/components/settings-panel"
import { ConsecuenciasTab } from "@/components/consecuencias-tab"
import { availableActivities } from "@/components/settings-panel"
import type { RoutineBlock as RoutineBlockType } from "@/hooks/use-supabase-data"

// Re-export types for backward compatibility with child components
export type { RoutineBlock, DayProgress } from "@/hooks/use-supabase-data"

export interface Activity {
  id: string
  name: string
  nameEs: string
  nameEn: string
  icon: string
  completed: boolean
  completedDate?: string
}

export interface Reward {
  id: string
  nameEs: string
  icon: string
  price: number
}

const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

// Traducciones EN por nombre ES del catálogo de presets.
// Rescata la traducción de actividades guardadas antes del fix de name_en.
const EN_BY_ES = new Map(availableActivities.map(a => [a.nameEs, a.nameEn]))

function resolveNameEn(nameEs: string, storedEn?: string): string {
  if (storedEn && storedEn !== nameEs) return storedEn
  return EN_BY_ES.get(nameEs) ?? nameEs
}

function getDayOfWeek(): number {
  const day = new Date().getDay()
  return day === 0 ? 6 : day - 1
}

function CalendarioContent() {
  const { activeChild, user, signOut } = useAuth()
  const data = useSupabaseData()

  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<"activity" | "routine" | "day">("activity")
  const [bonusTokens, setBonusTokens] = useState(0)
  const [activeSection, setActiveSection] = useState<"rutinas" | "semana" | "premios" | "consecuencias">("rutinas")
  const [showSettings, setShowSettings] = useState(false)

  const childName = activeChild?.name || "Niño/a"
  const theme = (activeChild?.theme || "pink") as "pink" | "blue"

  const total = data.routineBlocks.reduce((sum, r) => sum + r.activities.length, 0)
  const completed = data.routineBlocks.reduce((sum, r) => sum + r.activities.filter(a => a.completed).length, 0)

  const isRoutineComplete = useCallback((routineId: string) => {
    const routine = data.routineBlocks.find(r => r.id === routineId)
    return routine ? routine.activities.length > 0 && routine.activities.every(a => a.completed) : false
  }, [data.routineBlocks])

  const isAllComplete = useCallback(() => {
    return total > 0 && data.routineBlocks.every(r => r.activities.length === 0 || r.activities.every(a => a.completed))
  }, [data.routineBlocks, total])

  const handleCompleteActivity = useCallback(async (_routineId: string, activityId: string) => {
    await data.completeActivity(activityId, 1)

    // Check for bonuses
    const routine = data.routineBlocks.find(r => r.activities.some(a => a.id === activityId))
    if (routine) {
      const allRoutineComplete = routine.activities.every(a => a.id === activityId ? true : a.completed)
      const allComplete = data.routineBlocks.every(r =>
        r.activities.every(a => a.id === activityId ? true : a.completed)
      )

      if (allComplete && total > 0) {
        setCelebrationType("day")
        setBonusTokens(10)
        await data.awardBonus(10, "day_bonus")
      } else if (allRoutineComplete) {
        setCelebrationType("routine")
        setBonusTokens(3)
        await data.awardBonus(3, "routine_bonus")
      } else {
        setCelebrationType("activity")
        setBonusTokens(0)
      }
      setShowCelebration(true)
    }
  }, [data, total])

  const handleRoutinesChange = useCallback(async (newRoutines: RoutineBlockType[]) => {
    const snapshot = data.routineBlocks

    for (const newRoutine of newRoutines) {
      const current = snapshot.find(r => r.id === newRoutine.id)
      if (!current) continue

      const currentIds = new Set(current.activities.map(a => a.id))
      const newIds = new Set(newRoutine.activities.map(a => a.id))

      // Mismo conjunto de actividades pero en otro orden → persistir sort_order
      const sameSet = currentIds.size === newIds.size && [...currentIds].every(id => newIds.has(id))
      const orderChanged = current.activities.map(a => a.id).join("|") !== newRoutine.activities.map(a => a.id).join("|")
      if (sameSet && orderChanged) {
        await data.updateActivityOrder(newRoutine.id, newRoutine.activities.map(a => a.id))
        continue
      }

      for (const act of newRoutine.activities) {
        if (!currentIds.has(act.id)) {
          const actAny = act as typeof act & { nameEs?: string; nameEn?: string }
          const nameEs = actAny.nameEs ?? act.name
          await data.addActivity(newRoutine.id, nameEs, act.icon, resolveNameEn(nameEs, actAny.nameEn))
        }
      }

      for (const act of current.activities) {
        if (!newIds.has(act.id)) {
          await data.removeActivity(act.id)
        }
      }
    }
  }, [data])

  const handleRedeemReward = useCallback(async (rewardId: string, price: number) => {
    await data.redeemReward(rewardId, price)
    setCelebrationType("activity")
    setBonusTokens(0)
    setShowCelebration(true)
  }, [data])

  // Adapt rewards to the format RewardShop expects
  const rewardsForShop: Reward[] = data.rewards.map(r => ({
    id: r.id,
    nameEs: r.name,
    icon: r.icon,
    price: r.price,
  }))

  // Adapt routineBlocks to the format BloqueRutina expects
  const routinesForBloque = data.routineBlocks.map(r => ({
    ...r,
    activities: r.activities.map(a => ({
      ...a,
      nameEs: a.name,
      nameEn: resolveNameEn(a.name, a.nameEn),
    })),
  }))

  // Weekly progress adapted
  const weeklyForResumen = data.weekProgress.map(d => ({
    date: d.date,
    completedActivities: d.completedActivities,
    totalActivities: d.totalActivities,
    tokensEarned: d.completedActivities,
  }))

  if (data.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pastel-pink/30 via-background to-soft-purple/20">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🌟</div>
          <p className="text-muted-foreground font-semibold">Cargando rutinas...</p>
        </div>
      </div>
    )
  }

  return (
    <main className={`min-h-screen bg-gradient-to-b from-pastel-pink/30 via-background to-soft-purple/20 pb-24 relative ${theme === "blue" ? "theme-blue" : ""}`}>
      <div className="fixed inset-0 pointer-events-none bg-texture-hearts opacity-40" />
      <div className="fixed inset-0 pointer-events-none bg-texture-stars opacity-30" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-sparkle text-reward-gold"
            style={{
              left: `${(i * 7 + 3) % 100}%`,
              top: `${(i * 13 + 5) % 100}%`,
              animationDelay: `${(i * 0.2) % 3}s`,
              fontSize: `${(i % 5) + 6}px`,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      <HeaderCalendario
        tokens={data.tokenBalance}
        completedToday={completed}
        totalToday={total}
        childName={childName}
        onOpenSettings={() => setShowSettings(true)}
      />

      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-medium-pink/30 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-around gap-2">
          {([
            { id: "rutinas" as const, icon: "📋", label: "Rutinas" },
            { id: "semana" as const, icon: "📅", label: "Mi semana" },
            { id: "premios" as const, icon: "🎁", label: "Premios" },
            { id: "consecuencias" as const, icon: "⚖️", label: "Ajustes" },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all ${
                activeSection === tab.id
                  ? "bg-strong-pink text-white shadow-lg scale-105"
                  : "bg-pastel-pink/50 text-foreground hover:bg-pastel-pink"
              }`}
            >
              <span className="block text-xl mb-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-6">
        {activeSection === "rutinas" && completed === 0 && total > 0 && (
          <div className="mb-6 p-4 bg-white/80 backdrop-blur rounded-3xl shadow-lg border-2 border-dashed border-medium-pink text-center">
            <p className="text-lg font-bold text-foreground animate-bounce-soft">
              ¡Hoy puedes empezar con una actividad!
            </p>
            <div className="mt-2 text-3xl animate-float">✨🌟✨</div>
          </div>
        )}

        {activeSection === "rutinas" && isAllComplete() && (
          <div className="mb-6 p-6 bg-gradient-to-r from-reward-gold/40 to-pastel-pink/40 rounded-3xl shadow-lg border-2 border-reward-gold text-center">
            <div className="text-4xl mb-2 animate-bounce-soft">🏆</div>
            <p className="text-xl font-bold text-foreground">Felicidades {childName}!</p>
            <p className="text-muted-foreground">Completaste todas las rutinas de hoy!</p>
          </div>
        )}

        {activeSection === "rutinas" && (
          <div className="space-y-6">
            {routinesForBloque.map(routine => (
              <BloqueRutina
                key={routine.id}
                routine={routine}
                onCompleteActivity={handleCompleteActivity}
                isComplete={isRoutineComplete(routine.id)}
                childName={childName}
                onOpenSettings={() => setShowSettings(true)}
              />
            ))}
          </div>
        )}

        {activeSection === "semana" && (
          <ResumenSemanal
            weeklyProgress={weeklyForResumen}
            dayNames={dayNames}
            currentDayIndex={getDayOfWeek()}
            onResetWeek={data.resetWeek}
          />
        )}

        {activeSection === "premios" && (
          <RewardShop
            rewards={rewardsForShop}
            tokens={data.tokenBalance}
            onRedeem={handleRedeemReward}
            onAddReward={(r) => data.addReward(r.nameEs, r.icon, r.price)}
            onUpdateReward={(id, changes) => data.updateReward(id, changes)}
            onDeleteReward={(id) => data.removeReward(id)}
          />
        )}

        {activeSection === "consecuencias" && (
          <ConsecuenciasTab
            tokens={data.tokenBalance}
            onSubtractTokens={(amount) => data.subtractTokens(amount, "manual")}
            onGiftTokens={(amount) => data.giftTokens(amount)}
            childName={childName}
          />
        )}
      </div>

      <RobotMascota childName={childName} />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        childName={childName}
        onNameChange={data.updateChildName}
        theme={theme}
        onThemeChange={data.updateChildTheme}
        routines={data.routineBlocks.map(r => ({
          ...r,
          activities: r.activities.map(a => ({ ...a, nameEs: a.name, nameEn: resolveNameEn(a.name, a.nameEn) })),
        }))}
        onRoutinesChange={handleRoutinesChange}
        tokens={data.tokenBalance}
        onResetTokens={data.resetTokens}
        onResetAllData={async () => { await data.resetAllData(); setShowSettings(false) }}
        userEmail={user?.email}
        onSignOut={signOut}
      />

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        type={celebrationType}
        bonusTokens={bonusTokens}
        childName={childName}
      />
    </main>
  )
}

export default function CalendarioDeHannah() {
  return (
    <AppShell>
      <CalendarioContent />
    </AppShell>
  )
}
