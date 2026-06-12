"use client"

import { useState } from "react"
import { Gift, Sparkles, Check, Lock, Plus, Pencil, Trash2, X, Save } from "lucide-react"
import { getActivityIcon, availableIcons } from "./activity-icons"
import type { Reward } from "@/app/page"

interface RewardShopProps {
  rewards: Reward[]
  tokens: number
  onRedeem: (rewardId: string, price: number) => void
  onAddReward: (reward: Omit<Reward, "id">) => void
  onUpdateReward: (id: string, reward: Partial<Omit<Reward, "id">>) => void
  onDeleteReward: (id: string) => void
}

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

export function RewardShop({ rewards, tokens, onRedeem, onAddReward, onUpdateReward, onDeleteReward }: RewardShopProps) {
  const [redeemingId, setRedeemingId] = useState<string | null>(null)
  const [justRedeemed, setJustRedeemed] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Form state
  const [editName, setEditName] = useState("")
  const [editIcon, setEditIcon] = useState("star")
  const [editPrice, setEditPrice] = useState(5)

  const handleRedeem = (reward: Reward) => {
    if (tokens < reward.price || redeemingId || editMode) return

    setRedeemingId(reward.id)
    
    // Play sweet bilingual redeem sound
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      
      const spanishUtterance = new SpeechSynthesisUtterance(`¡Premio! ${reward.nameEs}`)
      spanishUtterance.lang = "es-MX"
      spanishUtterance.rate = 0.85
      spanishUtterance.pitch = 1.4
      const spanishVoice = getSweetVoice("es")
      if (spanishVoice) spanishUtterance.voice = spanishVoice
      
      const englishUtterance = new SpeechSynthesisUtterance("You got a prize!")
      englishUtterance.lang = "en-US"
      englishUtterance.rate = 0.85
      englishUtterance.pitch = 1.4
      const englishVoice = getSweetVoice("en")
      if (englishVoice) englishUtterance.voice = englishVoice
      
      spanishUtterance.onend = () => {
        setTimeout(() => {
          window.speechSynthesis.speak(englishUtterance)
        }, 400)
      }
      
      window.speechSynthesis.speak(spanishUtterance)
    }

    setTimeout(() => {
      onRedeem(reward.id, reward.price)
      setJustRedeemed(reward.id)
      setRedeemingId(null)

      setTimeout(() => {
        setJustRedeemed(null)
      }, 2000)
    }, 500)
  }

  const startEdit = (reward: Reward) => {
    setEditingId(reward.id)
    setEditName(reward.nameEs)
    setEditIcon(reward.icon)
    setEditPrice(reward.price)
  }

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdateReward(editingId, {
        nameEs: editName.trim(),
        icon: editIcon,
        price: editPrice,
      })
      setEditingId(null)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const startAdd = () => {
    setShowAddForm(true)
    setEditName("")
    setEditIcon("star")
    setEditPrice(5)
  }

  const saveNewReward = () => {
    if (editName.trim()) {
      onAddReward({
        nameEs: editName.trim(),
        icon: editIcon,
        price: editPrice,
      })
      setShowAddForm(false)
    }
  }

  const cancelAdd = () => {
    setShowAddForm(false)
  }

  // Icons available for rewards
  const rewardIcons = availableIcons

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-soft-purple to-medium-pink rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Mis premios</h2>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`p-2 rounded-xl transition-all ${
              editMode ? "bg-white text-strong-pink" : "bg-white/20 text-white hover:bg-white/30"
            }`}
            aria-label={editMode ? "Terminar de editar" : "Editar premios"}
          >
            {editMode ? <Check className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-white/80">
          {editMode ? "Toca un premio para editarlo" : "Canjea tus Tokencitos por premios"}
        </p>
        
        {/* Current balance */}
        <div className="mt-4 bg-white/20 rounded-2xl p-3 flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-reward-gold" />
          <span className="text-2xl font-bold">{tokens} Tokencitos</span>
        </div>
      </div>

      {/* Add new reward button */}
      {editMode && !showAddForm && (
        <button
          onClick={startAdd}
          className="w-full p-4 rounded-3xl border-2 border-dashed border-medium-pink bg-white/50 text-foreground hover:bg-pastel-pink/30 hover:border-strong-pink transition-all flex items-center justify-center gap-3"
        >
          <Plus className="w-6 h-6" />
          <span className="font-bold">Agregar nuevo premio</span>
        </button>
      )}

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-3xl p-5 bg-white border-2 border-strong-pink shadow-lg">
          <h3 className="font-bold text-lg mb-4 text-foreground">Nuevo premio</h3>
          
          {/* Name input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Nombre del premio
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Ej: Ir al parque"
              className="w-full p-3 rounded-xl border-2 border-pastel-pink bg-white text-foreground focus:border-strong-pink focus:outline-none"
            />
          </div>

          {/* Icon selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Icono
            </label>
            <div className="grid grid-cols-6 gap-2">
              {rewardIcons.map((iconName) => {
                const IconComponent = getActivityIcon(iconName)
                return (
                  <button
                    key={iconName}
                    onClick={() => setEditIcon(iconName)}
                    className={`p-2 rounded-xl transition-all ${
                      editIcon === iconName
                        ? "bg-strong-pink ring-2 ring-strong-pink ring-offset-2"
                        : "bg-pastel-pink/30 hover:bg-pastel-pink"
                    }`}
                  >
                    <IconComponent className="w-8 h-8" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Price input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Precio en Tokencitos
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditPrice(Math.max(1, editPrice - 1))}
                className="w-12 h-12 rounded-xl bg-pastel-pink text-foreground font-bold text-xl hover:bg-medium-pink hover:text-white transition-all"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-bold text-foreground">{editPrice}</span>
                <Sparkles className="w-5 h-5 text-reward-gold inline-block ml-2" />
              </div>
              <button
                onClick={() => setEditPrice(editPrice + 1)}
                className="w-12 h-12 rounded-xl bg-pastel-pink text-foreground font-bold text-xl hover:bg-medium-pink hover:text-white transition-all"
              >
                +
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={cancelAdd}
              className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-bold hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
            <button
              onClick={saveNewReward}
              disabled={!editName.trim()}
              className="flex-1 py-3 rounded-xl bg-strong-pink text-white font-bold hover:bg-strong-pink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Rewards grid */}
      <div className="space-y-4">
        {rewards.map((reward) => {
          const canAfford = tokens >= reward.price
          const isRedeeming = redeemingId === reward.id
          const wasRedeemed = justRedeemed === reward.id
          const isEditing = editingId === reward.id
          const IconComponent = getActivityIcon(reward.icon)

          if (isEditing) {
            return (
              <div
                key={reward.id}
                className="rounded-3xl p-5 bg-white border-2 border-strong-pink shadow-lg"
              >
                <h3 className="font-bold text-lg mb-4 text-foreground">Editar premio</h3>
                
                {/* Name input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Nombre del premio
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-pastel-pink bg-white text-foreground focus:border-strong-pink focus:outline-none"
                  />
                </div>

                {/* Icon selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Icono
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {rewardIcons.map((iconName) => {
                      const Icon = getActivityIcon(iconName)
                      return (
                        <button
                          key={iconName}
                          onClick={() => setEditIcon(iconName)}
                          className={`p-2 rounded-xl transition-all ${
                            editIcon === iconName
                              ? "bg-strong-pink ring-2 ring-strong-pink ring-offset-2"
                              : "bg-pastel-pink/30 hover:bg-pastel-pink"
                          }`}
                        >
                          <Icon className="w-8 h-8" />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Price input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Precio en Tokencitos
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditPrice(Math.max(1, editPrice - 1))}
                      className="w-12 h-12 rounded-xl bg-pastel-pink text-foreground font-bold text-xl hover:bg-medium-pink hover:text-white transition-all"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-3xl font-bold text-foreground">{editPrice}</span>
                      <Sparkles className="w-5 h-5 text-reward-gold inline-block ml-2" />
                    </div>
                    <button
                      onClick={() => setEditPrice(editPrice + 1)}
                      className="w-12 h-12 rounded-xl bg-pastel-pink text-foreground font-bold text-xl hover:bg-medium-pink hover:text-white transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={cancelEdit}
                    className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-bold hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                  <button
                    onClick={() => onDeleteReward(reward.id)}
                    className="py-3 px-4 rounded-xl bg-destructive text-white font-bold hover:bg-destructive/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={saveEdit}
                    disabled={!editName.trim()}
                    className="flex-1 py-3 rounded-xl bg-strong-pink text-white font-bold hover:bg-strong-pink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Guardar
                  </button>
                </div>
              </div>
            )
          }

          return (
            <div
              key={reward.id}
              onClick={() => editMode && startEdit(reward)}
              className={`rounded-3xl p-5 transition-all ${
                editMode
                  ? "bg-white border-2 border-dashed border-medium-pink hover:border-strong-pink cursor-pointer"
                  : wasRedeemed
                  ? "bg-gradient-to-r from-reward-gold/40 to-pastel-pink/40 border-2 border-reward-gold animate-pulse-glow"
                  : canAfford
                  ? "bg-white border-2 border-medium-pink hover:border-strong-pink hover:shadow-lg"
                  : "bg-white/50 border-2 border-dashed border-pastel-pink"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Reward icon */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    canAfford || editMode ? "bg-pastel-pink/50" : "bg-muted/30"
                  }`}
                >
                  <IconComponent className={`w-12 h-12 ${!canAfford && !editMode ? "opacity-50" : ""}`} />
                </div>

                {/* Reward info */}
                <div className="flex-1">
                  <p
                    className={`text-lg font-bold ${
                      canAfford || editMode ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {reward.nameEs}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Sparkles className={`w-4 h-4 ${canAfford || editMode ? "text-reward-gold" : "text-muted-foreground"}`} />
                    <span className={`font-bold ${canAfford || editMode ? "text-foreground" : "text-muted-foreground"}`}>
                      {reward.price} Tokencitos
                    </span>
                  </div>
                </div>

                {/* Edit indicator or Redeem button */}
                {editMode ? (
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-soft-purple/30 text-foreground">
                    <Pencil className="w-6 h-6" />
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRedeem(reward)
                    }}
                    disabled={!canAfford || isRedeeming}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      wasRedeemed
                        ? "bg-reward-gold text-foreground"
                        : isRedeeming
                        ? "bg-medium-pink text-white animate-pulse"
                        : canAfford
                        ? "bg-strong-pink text-white hover:scale-110 active:scale-95"
                        : "bg-muted/30 text-muted-foreground cursor-not-allowed"
                    }`}
                    aria-label={canAfford ? "Canjear premio" : "No tienes suficientes Tokencitos"}
                  >
                    {wasRedeemed ? (
                      <Check className="w-7 h-7" />
                    ) : canAfford ? (
                      <Gift className="w-7 h-7" />
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </button>
                )}
              </div>

              {/* Progress to afford */}
              {!canAfford && !editMode && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progreso</span>
                    <span>{tokens} / {reward.price}</span>
                  </div>
                  <div className="h-2 bg-pastel-pink/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-medium-pink rounded-full transition-all"
                      style={{ width: `${(tokens / reward.price) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Te faltan {reward.price - tokens} Tokencitos
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Encouragement */}
      {tokens < 3 && !editMode && (
        <div className="bg-pastel-pink/30 rounded-2xl p-4 text-center">
          <p className="text-muted-foreground">
            Completa mas actividades para ganar Tokencitos
          </p>
        </div>
      )}
    </div>
  )
}
