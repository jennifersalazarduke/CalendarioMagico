"use client"

import { useState, useCallback } from "react"

interface RobotMascotaProps {
  childName?: string
}

// Motivational phrases in Spanish and English (name will be inserted)
const motivationalPhrases = [
  { es: "Tu puedes, {name}!", en: "You can do it, {name}!" },
  { es: "Eres increible!", en: "You are amazing!" },
  { es: "Sigue adelante!", en: "Keep going!" },
  { es: "Lo estas haciendo genial!", en: "You are doing great!" },
  { es: "Eres una estrella, {name}!", en: "You are a star, {name}!" },
  { es: "Que orgullosa estoy de ti!", en: "I am so proud of you!" },
  { es: "Tu esfuerzo vale mucho!", en: "Your effort is worth a lot!" },
  { es: "Cada dia eres mejor!", en: "Every day you are better!" },
  { es: "Eres muy especial, {name}!", en: "You are very special, {name}!" },
  { es: "Nunca te rindas!", en: "Never give up!" },
  { es: "Hoy sera un gran dia!", en: "Today will be a great day!" },
  { es: "Te quiero mucho, {name}!", en: "I love you so much, {name}!" },
  { es: "Eres valiente!", en: "You are brave!" },
  { es: "Sonrie!", en: "Smile!" },
  { es: "Puedes lograr todo!", en: "You can achieve anything!" },
]

// Get a sweet female voice
const getSweetVoice = (lang: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices()
  const preferredSpanish = ["Paulina", "Monica", "Conchita", "Lucia", "Elena", "Penelope"]
  const preferredEnglish = ["Samantha", "Victoria", "Karen", "Moira", "Fiona", "Tessa"]
  const preferred = lang.startsWith("es") ? preferredSpanish : preferredEnglish

  for (const name of preferred) {
    const voice = voices.find((v) => v.name.includes(name) && v.lang.startsWith(lang.slice(0, 2)))
    if (voice) return voice
  }

  const femaleVoice = voices.find(
    (v) =>
      v.lang.startsWith(lang.slice(0, 2)) &&
      (v.name.toLowerCase().includes("female") || !v.name.toLowerCase().includes("male"))
  )
  if (femaleVoice) return femaleVoice

  return voices.find((v) => v.lang.startsWith(lang.slice(0, 2))) || null
}

export function RobotMascota({ childName = "amigo" }: RobotMascotaProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [currentPhrase, setCurrentPhrase] = useState({ es: "", en: "" })

  const speakPhrase = useCallback(async () => {
    if (isAnimating || !window.speechSynthesis) return

    setIsAnimating(true)

    // Select random phrase and replace name placeholder
    const basePhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]
    const phrase = {
      es: basePhrase.es.replace("{name}", childName),
      en: basePhrase.en.replace("{name}", childName),
    }
    setCurrentPhrase(phrase)
    setShowBubble(true)

    window.speechSynthesis.cancel()

    // Ensure voices are loaded
    if (window.speechSynthesis.getVoices().length === 0) {
      await new Promise<void>((resolve) => {
        window.speechSynthesis.onvoiceschanged = () => resolve()
        setTimeout(resolve, 500)
      })
    }

    // Spanish phrase
    const spanishUtterance = new SpeechSynthesisUtterance(phrase.es)
    spanishUtterance.lang = "es-MX"
    spanishUtterance.rate = 0.85
    spanishUtterance.pitch = 1.4
    spanishUtterance.volume = 1.0
    const spanishVoice = getSweetVoice("es")
    if (spanishVoice) spanishUtterance.voice = spanishVoice

    // English phrase
    const englishUtterance = new SpeechSynthesisUtterance(phrase.en)
    englishUtterance.lang = "en-US"
    englishUtterance.rate = 0.85
    englishUtterance.pitch = 1.4
    englishUtterance.volume = 1.0
    const englishVoice = getSweetVoice("en")
    if (englishVoice) englishUtterance.voice = englishVoice

    // Play Spanish first
    spanishUtterance.onend = () => {
      setTimeout(() => {
        window.speechSynthesis.speak(englishUtterance)
      }, 500)
    }

    englishUtterance.onend = () => {
      setTimeout(() => {
        setIsAnimating(false)
        setShowBubble(false)
      }, 1500)
    }

    window.speechSynthesis.speak(spanishUtterance)
  }, [isAnimating, childName])

  return (
    <div className="fixed bottom-28 right-4 z-30">
      {/* Speech bubble */}
      {showBubble && (
        <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-white rounded-2xl shadow-lg border-2 border-medium-pink animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-sm font-bold text-foreground">{currentPhrase.es}</p>
          <p className="text-xs text-muted-foreground mt-1">{currentPhrase.en}</p>
          {/* Bubble tail */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r-2 border-b-2 border-medium-pink rotate-45" />
        </div>
      )}

      {/* Robot button */}
      <button
        onClick={speakPhrase}
        disabled={isAnimating}
        className={`w-16 h-16 rounded-full shadow-lg transition-all active:scale-95 ${
          isAnimating ? "animate-pulse-glow" : "hover:scale-110"
        }`}
        aria-label="Robot motivacional"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Robot body background */}
          <circle cx="32" cy="32" r="30" fill="#F9C5D5" />
          <circle cx="32" cy="32" r="27" fill="#FCE4EC" />

          {/* Robot head */}
          <rect x="16" y="18" width="32" height="26" rx="8" fill="#F48FB1" />
          <rect x="18" y="20" width="28" height="22" rx="6" fill="#FCE4EC" />

          {/* Antenna */}
          <rect x="30" y="10" width="4" height="10" rx="2" fill="#EC407A" />
          <circle cx="32" cy="8" r="4" fill="#FFE082" className={isAnimating ? "animate-pulse" : ""} />

          {/* Eyes */}
          <g className={isAnimating ? "" : "animate-robot-blink"}>
            <ellipse cx="24" cy="30" rx="4" ry="5" fill="#4A1942" />
            <ellipse cx="40" cy="30" rx="4" ry="5" fill="#4A1942" />
            {/* Eye shine */}
            <circle cx="22" cy="28" r="1.5" fill="white" />
            <circle cx="38" cy="28" r="1.5" fill="white" />
          </g>

          {/* Cheeks */}
          <ellipse cx="18" cy="35" rx="3" ry="2" fill="#F48FB1" opacity="0.6" />
          <ellipse cx="46" cy="35" rx="3" ry="2" fill="#F48FB1" opacity="0.6" />

          {/* Smile */}
          <path
            d="M24 38 Q32 46 40 38"
            stroke="#EC407A"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className={isAnimating ? "animate-pulse" : ""}
          />

          {/* Heart on body */}
          <path
            d="M32 52 Q28 48 26 46 Q24 43 26 41 Q28 39 30 41 Q31 42 32 44 Q33 42 34 41 Q36 39 38 41 Q40 43 38 46 Q36 48 32 52Z"
            fill="#EC407A"
            className={isAnimating ? "animate-pulse" : ""}
          />
        </svg>
      </button>
    </div>
  )
}
