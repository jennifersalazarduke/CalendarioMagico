"use client"

import { Sparkles, Settings } from "lucide-react"

interface HeaderCalendarioProps {
  tokens: number
  completedToday: number
  totalToday: number
  childName: string
  onOpenSettings?: () => void
}

export function HeaderCalendario({ tokens, completedToday, totalToday, childName, onOpenSettings }: HeaderCalendarioProps) {
  const progress = totalToday > 0 ? (completedToday / totalToday) * 100 : 0

  return (
    <header className="relative bg-gradient-to-r from-strong-pink via-medium-pink to-soft-purple pt-8 pb-12 px-4 rounded-b-[3rem] shadow-xl overflow-hidden">
      {/* Settings button */}
      <button
        onClick={onOpenSettings}
        className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all active:scale-95"
        aria-label="Configuracion"
      >
        <Settings className="w-5 h-5 text-white" />
      </button>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/20 animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${20 + i * 4}px`,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">
            Calendario de {childName}
          </h1>
          <p className="text-white/90 text-lg mt-1 font-medium">
            Mis rutinas del dia
          </p>
        </div>

        {/* Token display */}
        <div className="flex justify-center">
          <div className="bg-white/95 backdrop-blur rounded-2xl px-6 py-3 shadow-lg flex items-center gap-3 animate-pulse-glow">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-reward-gold to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {childName} Tokencitos
              </p>
              <p className="text-3xl font-extrabold text-foreground">
                {tokens}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 px-4">
          <div className="flex justify-between text-white/90 text-sm font-medium mb-2">
            <span>Progreso de hoy</span>
            <span>{completedToday} / {totalToday}</span>
          </div>
          <div className="h-4 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
