"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, CheckCircle2, Sparkles, Settings } from "lucide-react"
import { TarjetaActividad } from "./tarjeta-actividad"
import { getActivityIcon } from "./activity-icons"
import type { RoutineBlock } from "@/app/page"

interface BloqueRutinaProps {
  routine: RoutineBlock
  onCompleteActivity: (routineId: string, activityId: string) => void
  isComplete: boolean
  childName?: string
  onOpenSettings?: () => void
}

export function BloqueRutina({ routine, onCompleteActivity, isComplete, childName = "amigo", onOpenSettings }: BloqueRutinaProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  const completedCount = routine.activities.filter((a) => a.completed).length
  const totalCount = routine.activities.length
  const hasActivities = totalCount > 0
  const progress = hasActivities ? (completedCount / totalCount) * 100 : 0

  const IconComponent = getActivityIcon(routine.icon)

  const bgColorClass = {
    "bg-morning-yellow": "bg-morning-yellow",
    "bg-afternoon-orange": "bg-afternoon-orange",
    "bg-night-indigo": "bg-night-indigo",
  }[routine.bgColor] || "bg-pastel-pink"

  return (
    <div
      className={`rounded-3xl overflow-hidden shadow-lg transition-all duration-300 ${
        isComplete ? "ring-4 ring-reward-gold" : ""
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full ${bgColorClass} p-5 flex items-center justify-between transition-all hover:brightness-105`}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center shadow-md">
            <IconComponent className="w-10 h-10" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-foreground">{routine.title}</h2>
            <p className="text-sm text-muted-foreground">
              {completedCount} / {totalCount} actividades
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isComplete && (
            <div className="flex items-center gap-1 bg-reward-gold/80 text-foreground px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <Sparkles className="w-4 h-4 animate-sparkle" />
            </div>
          )}
          <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center">
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-foreground" />
            ) : (
              <ChevronDown className="w-6 h-6 text-foreground" />
            )}
          </div>
        </div>
      </button>

      {/* Progress bar */}
      <div className="h-2 bg-white/50">
        <div
          className="h-full bg-strong-pink transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Activities */}
      {isExpanded && (
        <div className="bg-white p-4 space-y-3">
          {hasActivities ? (
            routine.activities.map((activity, index) => (
              <TarjetaActividad
                key={activity.id}
                activity={activity}
                onComplete={() => onCompleteActivity(routine.id, activity.id)}
                index={index}
                childName={childName}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">
                No hay actividades configuradas
              </p>
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all"
                >
                  Configurar rutina
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
