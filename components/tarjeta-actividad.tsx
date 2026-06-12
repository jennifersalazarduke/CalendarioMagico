"use client"

import { useState } from "react"
import { Check, Volume2, RotateCcw, Sparkles } from "lucide-react"
import { getActivityIcon } from "./activity-icons"
import type { Activity } from "@/app/page"

interface TarjetaActividadProps {
  activity: Activity
  onComplete: () => void
  index: number
  childName?: string
}

export function TarjetaActividad({ activity, onComplete, index, childName = "amigo" }: TarjetaActividadProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  const IconComponent = getActivityIcon(activity.icon)

  // Get a sweet female voice for the specified language
  const getSweetVoice = (lang: string): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices()
    
    // Preferred female voices for sweeter sound
    const preferredSpanish = ["Paulina", "Monica", "Conchita", "Lucia", "Elena", "Penelope"]
    const preferredEnglish = ["Samantha", "Victoria", "Karen", "Moira", "Fiona", "Tessa"]
    const preferred = lang.startsWith("es") ? preferredSpanish : preferredEnglish
    
    // First try to find preferred voices
    for (const name of preferred) {
      const voice = voices.find(v => v.name.includes(name) && v.lang.startsWith(lang.slice(0, 2)))
      if (voice) return voice
    }
    
    // Otherwise find any female voice for the language
    const femaleVoice = voices.find(v => 
      v.lang.startsWith(lang.slice(0, 2)) && 
      (v.name.toLowerCase().includes("female") || 
       !v.name.toLowerCase().includes("male"))
    )
    if (femaleVoice) return femaleVoice
    
    // Fallback to any voice for the language
    return voices.find(v => v.lang.startsWith(lang.slice(0, 2))) || null
  }

  // Play bilingual audio using speechSynthesis with sweet voice
  const playAudio = async () => {
    if (isPlaying || !window.speechSynthesis) return
    
    setIsPlaying(true)
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    // Ensure voices are loaded
    if (window.speechSynthesis.getVoices().length === 0) {
      await new Promise<void>(resolve => {
        window.speechSynthesis.onvoiceschanged = () => resolve()
        setTimeout(resolve, 500)
      })
    }

    // Create Spanish utterance with sweet settings
    const spanishUtterance = new SpeechSynthesisUtterance(activity.nameEs)
    spanishUtterance.lang = "es-MX" // Mexican Spanish often sounds warmer
    spanishUtterance.rate = 0.8 // Slower for clarity
    spanishUtterance.pitch = 1.3 // Higher pitch for sweetness
    spanishUtterance.volume = 0.9
    const spanishVoice = getSweetVoice("es")
    if (spanishVoice) spanishUtterance.voice = spanishVoice

    // Create English utterance with sweet settings
    const englishUtterance = new SpeechSynthesisUtterance(activity.nameEn)
    englishUtterance.lang = "en-US"
    englishUtterance.rate = 0.8 // Slower for clarity
    englishUtterance.pitch = 1.3 // Higher pitch for sweetness
    englishUtterance.volume = 0.9
    const englishVoice = getSweetVoice("en")
    if (englishVoice) englishUtterance.voice = englishVoice

    // Play Spanish first
    window.speechSynthesis.speak(spanishUtterance)

    // Play English after Spanish finishes
    spanishUtterance.onend = () => {
      setTimeout(() => {
        window.speechSynthesis.speak(englishUtterance)
      }, 600)
    }

    englishUtterance.onend = () => {
      setIsPlaying(false)
    }

    englishUtterance.onerror = () => {
      setIsPlaying(false)
    }
  }

  const handleComplete = () => {
    if (activity.completed) return
    
    setJustCompleted(true)
    onComplete()
    
    // Play sweet bilingual celebration sound
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      
      // Spanish celebration first
      const spanishCelebration = new SpeechSynthesisUtterance(`Muy bien, ${childName}!`)
      spanishCelebration.lang = "es-MX"
      spanishCelebration.rate = 0.85
      spanishCelebration.pitch = 1.4
      spanishCelebration.volume = 1.0
      const spanishVoice = getSweetVoice("es")
      if (spanishVoice) spanishCelebration.voice = spanishVoice
      
      // English celebration after
      const englishCelebration = new SpeechSynthesisUtterance(`Good job, ${childName}!`)
      englishCelebration.lang = "en-US"
      englishCelebration.rate = 0.85
      englishCelebration.pitch = 1.4
      englishCelebration.volume = 1.0
      const englishVoice = getSweetVoice("en")
      if (englishVoice) englishCelebration.voice = englishVoice
      
      // Play Spanish first, then English
      spanishCelebration.onend = () => {
        setTimeout(() => {
          window.speechSynthesis.speak(englishCelebration)
        }, 400)
      }
      
      window.speechSynthesis.speak(spanishCelebration)
    }

    setTimeout(() => setJustCompleted(false), 1500)
  }

  return (
    <div
      className={`relative rounded-2xl p-4 transition-all duration-300 ${
        activity.completed
          ? "bg-gradient-to-r from-pastel-pink/50 to-soft-purple/30 border-2 border-medium-pink"
          : "bg-gradient-to-r from-white to-pastel-pink/20 border-2 border-pastel-pink hover:border-medium-pink hover:shadow-md"
      } ${justCompleted ? "animate-pulse-glow scale-105" : ""}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Sparkles when just completed */}
      {justCompleted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(6)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-reward-gold animate-sparkle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`,
                width: `${16 + Math.random() * 12}px`,
                height: `${16 + Math.random() * 12}px`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Activity Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
            activity.completed
              ? "bg-white/80 shadow-md"
              : "bg-white shadow-sm"
          }`}
        >
          <IconComponent className="w-12 h-12" />
        </div>

        {/* Activity Name */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-base font-bold leading-tight ${
              activity.completed ? "text-muted-foreground line-through" : "text-foreground"
            }`}
          >
            {activity.nameEs}
          </p>
          {activity.completed && (
            <p className="text-xs text-medium-pink font-medium mt-1">
              ¡Completado!
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Audio Button */}
          <button
            onClick={playAudio}
            disabled={isPlaying}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isPlaying
                ? "bg-medium-pink text-white animate-pulse"
                : "bg-soft-purple/50 text-foreground hover:bg-soft-purple hover:scale-110"
            }`}
            aria-label="Escuchar audio"
          >
            {isPlaying ? (
              <RotateCcw className="w-6 h-6 animate-spin" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={activity.completed}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activity.completed
                ? "bg-strong-pink text-white"
                : "bg-pastel-pink text-foreground hover:bg-strong-pink hover:text-white hover:scale-110 active:scale-95"
            }`}
            aria-label={activity.completed ? "Completado" : "Marcar como completado"}
          >
            <Check className={`w-6 h-6 ${activity.completed ? "" : "opacity-70"}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
