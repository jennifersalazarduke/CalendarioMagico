"use client"

import { useState } from "react"
import { Check, Star, Calendar, Sparkles, RotateCcw, AlertTriangle } from "lucide-react"
import type { DayProgress } from "@/app/page"

interface ResumenSemanalProps {
  weeklyProgress: DayProgress[]
  dayNames: string[]
  currentDayIndex: number
  onResetWeek?: () => void
}

export function ResumenSemanal({ weeklyProgress, dayNames, currentDayIndex, onResetWeek }: ResumenSemanalProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const totalTokens = weeklyProgress.reduce((sum, day) => sum + day.tokensEarned, 0)
  const totalActivities = weeklyProgress.reduce((sum, day) => sum + day.completedActivities, 0)

  const handleReset = () => {
    if (onResetWeek) {
      onResetWeek()
    }
    setShowConfirmReset(false)
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-gradient-to-r from-strong-pink to-medium-pink rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Mi semana</h2>
          </div>
          {/* Reset button */}
          <button
            onClick={() => setShowConfirmReset(true)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all active:scale-95"
            aria-label="Reiniciar semana"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        <p className="text-white/80">Mira tu progreso semanal</p>
      </div>

      {/* Confirm reset modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-medium-pink">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Nueva semana</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Esto borrara el progreso de la semana. Los tokencitos que ya tienes se mantienen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-3 px-4 rounded-2xl font-bold bg-pastel-pink/50 text-foreground hover:bg-pastel-pink transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-4 rounded-2xl font-bold bg-strong-pink text-white hover:bg-strong-pink/90 transition-all"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Days grid */}
      <div className="space-y-3">
        {dayNames.map((day, index) => {
          const dayProgress = weeklyProgress[index]
          const isToday = index === currentDayIndex
          const hasData = dayProgress && dayProgress.completedActivities > 0
          const isComplete = dayProgress && dayProgress.completedActivities >= 21
          const isPast = index < currentDayIndex

          return (
            <div
              key={day}
              className={`rounded-2xl p-4 transition-all ${
                isToday
                  ? "bg-gradient-to-r from-pastel-pink to-soft-purple border-2 border-strong-pink shadow-lg"
                  : isComplete
                  ? "bg-gradient-to-r from-reward-gold/30 to-pastel-pink/30 border-2 border-reward-gold"
                  : hasData
                  ? "bg-white border-2 border-medium-pink/30"
                  : "bg-white/50 border-2 border-dashed border-pastel-pink"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Day indicator */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                      isToday
                        ? "bg-strong-pink text-white"
                        : isComplete
                        ? "bg-reward-gold text-foreground"
                        : hasData
                        ? "bg-medium-pink/20 text-foreground"
                        : "bg-pastel-pink/30 text-muted-foreground"
                    }`}
                  >
                    {isComplete ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <span className="text-lg">{day.charAt(0)}</span>
                    )}
                  </div>

                  {/* Day info */}
                  <div>
                    <p className={`font-bold ${isToday ? "text-foreground" : "text-foreground"}`}>
                      {day}
                      {isToday && (
                        <span className="ml-2 text-xs bg-strong-pink text-white px-2 py-0.5 rounded-full">
                          Hoy
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {hasData ? (
                        `${dayProgress.completedActivities} actividades`
                      ) : isPast ? (
                        "Sin datos"
                      ) : (
                        "Pendiente"
                      )}
                    </p>
                  </div>
                </div>

                {/* Tokens earned */}
                {hasData && (
                  <div className="flex items-center gap-2 bg-reward-gold/20 px-3 py-2 rounded-xl">
                    <Star className="w-5 h-5 text-reward-gold" />
                    <span className="font-bold text-foreground">
                      {dayProgress.tokensEarned}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar for today */}
              {isToday && hasData && (
                <div className="mt-3">
                  <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-strong-pink rounded-full transition-all duration-500"
                      style={{ width: `${(dayProgress.completedActivities / 21) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Weekly totals */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-pastel-pink">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-reward-gold" />
          Total de la semana
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-pastel-pink/50 to-soft-purple/30 rounded-2xl p-4 text-center">
            <p className="text-3xl font-extrabold text-foreground">{totalActivities}</p>
            <p className="text-sm text-muted-foreground">Actividades</p>
          </div>
          <div className="bg-gradient-to-br from-reward-gold/30 to-pastel-pink/30 rounded-2xl p-4 text-center">
            <p className="text-3xl font-extrabold text-foreground">{totalTokens}</p>
            <p className="text-sm text-muted-foreground">Tokencitos</p>
          </div>
        </div>
      </div>
    </div>
  )
}
