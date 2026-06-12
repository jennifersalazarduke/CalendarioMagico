"use client"

import { useState } from "react"
import { Settings, X, Check } from "lucide-react"
import { useTheme, type ThemeType } from "@/contexts/theme-context"

export function ThemeSelector() {
  const { theme, setTheme, childName, setChildName } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [tempName, setTempName] = useState(childName)

  const handleSave = () => {
    if (tempName.trim()) {
      setChildName(tempName.trim())
    }
    setIsOpen(false)
  }

  const themes: { id: ThemeType; label: string; icon: string; colors: string[] }[] = [
    {
      id: "pink",
      label: "Rosa",
      icon: "girl",
      colors: ["#F9C5D5", "#F48FB1", "#EC407A"],
    },
    {
      id: "blue",
      label: "Azul",
      icon: "boy",
      colors: ["#BBDEFB", "#64B5F6", "#2196F3"],
    },
  ]

  return (
    <>
      {/* Settings button */}
      <button
        onClick={() => {
          setTempName(childName)
          setIsOpen(true)
        }}
        className="fixed top-4 right-4 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border-2 border-medium-pink hover:scale-110 transition-transform active:scale-95"
        aria-label="Configuracion"
      >
        <Settings className="w-5 h-5 text-strong-pink" />
      </button>

      {/* Settings modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm">
          <div className="bg-card rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-medium-pink">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Configuracion</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Child name input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-foreground mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Nombre del nino/nina"
                className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-input text-foreground font-medium focus:outline-none focus:border-strong-pink transition-colors"
                maxLength={20}
              />
            </div>

            {/* Theme selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-foreground mb-3">
                Tema de colores
              </label>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`relative p-4 rounded-2xl border-3 transition-all ${
                      theme === t.id
                        ? "border-strong-pink shadow-lg scale-105"
                        : "border-border hover:border-medium-pink"
                    }`}
                  >
                    {/* Selected indicator */}
                    {theme === t.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-strong-pink rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Icon */}
                    <div className="text-4xl mb-2">
                      {t.id === "pink" ? (
                        <svg viewBox="0 0 48 48" className="w-12 h-12 mx-auto">
                          {/* Girl face */}
                          <circle cx="24" cy="24" r="18" fill="#FFDAB9" />
                          {/* Hair */}
                          <path d="M6 24 Q6 6 24 6 Q42 6 42 24 Q42 16 36 12 Q30 8 24 10 Q18 8 12 12 Q6 16 6 24Z" fill="#8B4513" />
                          <ellipse cx="10" cy="28" rx="4" ry="8" fill="#8B4513" />
                          <ellipse cx="38" cy="28" rx="4" ry="8" fill="#8B4513" />
                          {/* Eyes */}
                          <circle cx="18" cy="22" r="2" fill="#5D4037" />
                          <circle cx="30" cy="22" r="2" fill="#5D4037" />
                          {/* Smile */}
                          <path d="M18 30 Q24 36 30 30" stroke="#E91E63" strokeWidth="2" fill="none" strokeLinecap="round" />
                          {/* Bow */}
                          <path d="M20 6 Q24 10 28 6" fill="#EC407A" />
                          <circle cx="24" cy="6" r="2" fill="#EC407A" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 48 48" className="w-12 h-12 mx-auto">
                          {/* Boy face */}
                          <circle cx="24" cy="24" r="18" fill="#FFDAB9" />
                          {/* Hair */}
                          <path d="M8 20 Q8 8 24 8 Q40 8 40 20 L38 18 Q30 12 24 14 Q18 12 10 18 Z" fill="#5D4037" />
                          {/* Eyes */}
                          <circle cx="18" cy="22" r="2" fill="#5D4037" />
                          <circle cx="30" cy="22" r="2" fill="#5D4037" />
                          {/* Smile */}
                          <path d="M18 30 Q24 36 30 30" stroke="#2196F3" strokeWidth="2" fill="none" strokeLinecap="round" />
                          {/* Cap */}
                          <path d="M10 16 Q10 4 24 4 Q38 4 38 16 L36 14 Q32 8 24 8 Q16 8 12 14 Z" fill="#2196F3" />
                          <rect x="36" y="10" width="6" height="3" rx="1" fill="#1976D2" />
                        </svg>
                      )}
                    </div>

                    {/* Label */}
                    <span className="block text-sm font-bold text-foreground">
                      {t.label}
                    </span>

                    {/* Color preview */}
                    <div className="flex justify-center gap-1 mt-2">
                      {t.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              className="w-full py-4 rounded-2xl bg-strong-pink text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-98"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
