"use client"

import { useEffect, useState } from "react"
import { Sparkles, Star, Trophy, PartyPopper } from "lucide-react"

interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  type: "activity" | "routine" | "day"
  bonusTokens: number
  childName?: string
}

const confettiColors = ["#F9C5D5", "#F48FB1", "#EC407A", "#E1BEE7", "#FFE082", "#FFF59D"]

// Get a sweet female voice for celebrations
const getSweetVoice = (lang: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices()
  const preferredSpanish = ["Paulina", "Monica", "Conchita", "Lucia", "Elena", "Penelope"]
  
  for (const name of preferredSpanish) {
    const voice = voices.find(v => v.name.includes(name) && v.lang.startsWith(lang.slice(0, 2)))
    if (voice) return voice
  }
  
  const femaleVoice = voices.find(v => 
    v.lang.startsWith(lang.slice(0, 2)) && 
    (v.name.toLowerCase().includes("female") || !v.name.toLowerCase().includes("male"))
  )
  if (femaleVoice) return femaleVoice
  
  return voices.find(v => v.lang.startsWith(lang.slice(0, 2))) || null
}

// Play celebration audio with sweet voice
const playCelebrationAudio = (message: string) => {
  if (!window.speechSynthesis) return
  
  window.speechSynthesis.cancel()
  
  const utterance = new SpeechSynthesisUtterance(message)
  utterance.lang = "es-MX"
  utterance.rate = 0.85
  utterance.pitch = 1.4
  utterance.volume = 1.0
  
  const sweetVoice = getSweetVoice("es")
  if (sweetVoice) utterance.voice = sweetVoice
  
  window.speechSynthesis.speak(utterance)
}

export function CelebrationModal({ isOpen, onClose, type, bonusTokens, childName = "amigo" }: CelebrationModalProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([])

  useEffect(() => {
    if (isOpen) {
      // Generate confetti
      const newConfetti = [...Array(30)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.random() * 0.5,
      }))
      setConfetti(newConfetti)

      // Play celebration audio based on type
      setTimeout(() => {
        if (type === "day") {
          playCelebrationAudio(`Increible, ${childName}! Completaste todo el dia!`)
        } else if (type === "routine") {
          playCelebrationAudio(`Excelente, ${childName}! Terminaste la rutina!`)
        }
      }, 300)

      // Auto-close after animation
      const timer = setTimeout(() => {
        onClose()
      }, type === "day" ? 4000 : type === "routine" ? 3000 : 2000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose, type])

  if (!isOpen) return null

  const getMessage = () => {
    switch (type) {
      case "day":
        return {
          title: "¡Día perfecto!",
          subtitle: "¡Completaste todas las rutinas!",
          icon: <Trophy className="w-20 h-20 text-reward-gold" />,
        }
      case "routine":
        return {
          title: "¡Rutina completa!",
          subtitle: "¡Ganaste un bonus!",
          icon: <PartyPopper className="w-16 h-16 text-strong-pink" />,
        }
      default:
        return {
          title: "¡Muy bien!",
          subtitle: "+1 Tokencito",
          icon: <Star className="w-14 h-14 text-reward-gold" />,
        }
    }
  }

  const { title, subtitle, icon } = getMessage()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-3 h-3 rounded-full animate-confetti"
            style={{
              left: `${piece.x}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center transform animate-bounce-soft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sparkles decoration */}
        <div className="absolute -top-4 -left-4 animate-sparkle">
          <Sparkles className="w-8 h-8 text-reward-gold" />
        </div>
        <div className="absolute -top-4 -right-4 animate-sparkle" style={{ animationDelay: "0.3s" }}>
          <Sparkles className="w-8 h-8 text-medium-pink" />
        </div>
        <div className="absolute -bottom-4 -left-4 animate-sparkle" style={{ animationDelay: "0.6s" }}>
          <Sparkles className="w-8 h-8 text-soft-purple" />
        </div>
        <div className="absolute -bottom-4 -right-4 animate-sparkle" style={{ animationDelay: "0.9s" }}>
          <Sparkles className="w-8 h-8 text-reward-gold" />
        </div>

        {/* Icon */}
        <div className="mb-4 flex justify-center animate-float">
          <div className="p-4 bg-gradient-to-br from-pastel-pink to-soft-purple rounded-full shadow-lg">
            {icon}
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-extrabold text-foreground mb-2">{title}</h2>
        <p className="text-lg text-muted-foreground mb-4">{subtitle}</p>

        {/* Bonus tokens */}
        {bonusTokens > 0 && (
          <div className="bg-gradient-to-r from-reward-gold/30 to-pastel-pink/30 rounded-2xl p-4 mb-4">
            <p className="text-sm text-muted-foreground">Bonus</p>
            <p className="text-3xl font-extrabold text-foreground">
              +{bonusTokens} <span className="text-lg">Tokencitos</span>
            </p>
          </div>
        )}

        {/* Token animation */}
        <div className="relative h-12 flex justify-center items-center">
          <div className="animate-coin-pop flex items-center gap-2 bg-reward-gold/80 text-foreground px-4 py-2 rounded-full font-bold">
            <Sparkles className="w-5 h-5" />
            <span>+1</span>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 bg-strong-pink text-white font-bold rounded-2xl hover:bg-medium-pink transition-colors"
        >
          ¡Genial!
        </button>
      </div>
    </div>
  )
}
