"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

type Step = "choose" | "create" | "join" | "add-child"

export function FamilySetup() {
  const { createFamily, joinFamily, addChild, family, children } = useAuth()
  const [step, setStep] = useState<Step>(family ? "add-child" : "choose")
  const [familyName, setFamilyName] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [childName, setChildName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await createFamily(familyName || "Mi Familia")
    setLoading(false)
    setStep("add-child")
  }

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await joinFamily(inviteCode)
    if (error) setError(error)
    else setStep("add-child")
    setLoading(false)
  }

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await addChild(childName)
    setChildName("")
    setLoading(false)
  }

  if (step === "choose") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pastel-pink/30 via-background to-soft-purple/20 p-4">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">👨‍👩‍👧</div>
          <h2 className="text-xl font-bold mb-2">Configurá tu familia</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Creá una familia nueva o unite a una existente con un código de invitación.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setStep("create")}
              className="w-full py-3 bg-strong-pink text-white font-bold rounded-2xl hover:bg-strong-pink/90 transition-colors"
            >
              Crear familia nueva
            </button>
            <button
              onClick={() => setStep("join")}
              className="w-full py-3 border-2 border-strong-pink text-strong-pink font-bold rounded-2xl hover:bg-pastel-pink/20 transition-colors"
            >
              Unirme con código
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "create") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pastel-pink/30 via-background to-soft-purple/20 p-4">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🏠</div>
            <h2 className="text-xl font-bold">Nombre de tu familia</h2>
          </div>
          <form onSubmit={handleCreateFamily} className="space-y-4">
            <input
              type="text"
              placeholder="Ej: Familia Salazar"
              value={familyName}
              onChange={e => setFamilyName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-medium-pink/30 focus:border-strong-pink focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-strong-pink text-white font-bold rounded-2xl hover:bg-strong-pink/90 disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear familia"}
            </button>
            <button type="button" onClick={() => setStep("choose")} className="w-full text-sm text-muted-foreground hover:underline">
              Volver
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (step === "join") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pastel-pink/30 via-background to-soft-purple/20 p-4">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🔑</div>
            <h2 className="text-xl font-bold">Código de invitación</h2>
          </div>
          <form onSubmit={handleJoinFamily} className="space-y-4">
            <input
              type="text"
              placeholder="Ej: a1b2c3d4"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-medium-pink/30 focus:border-strong-pink focus:outline-none text-center text-lg tracking-widest"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-strong-pink text-white font-bold rounded-2xl hover:bg-strong-pink/90 disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Unirme"}
            </button>
            <button type="button" onClick={() => setStep("choose")} className="w-full text-sm text-muted-foreground hover:underline">
              Volver
            </button>
          </form>
        </div>
      </div>
    )
  }

  // add-child step
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pastel-pink/30 via-background to-soft-purple/20 p-4">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">👧</div>
          <h2 className="text-xl font-bold">Agregá un niño/a</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Cada niño/a tiene sus propias rutinas y tokens.
          </p>
        </div>

        {children.length > 0 && (
          <div className="mb-4 space-y-2">
            {children.map(c => (
              <div key={c.id} className="flex items-center gap-2 p-3 bg-pastel-pink/30 rounded-2xl">
                <span className="text-xl">✅</span>
                <span className="font-semibold">{c.name}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddChild} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre del niño/a"
            value={childName}
            onChange={e => setChildName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl border-2 border-medium-pink/30 focus:border-strong-pink focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !childName.trim()}
            className="w-full py-3 bg-strong-pink text-white font-bold rounded-2xl hover:bg-strong-pink/90 disabled:opacity-50"
          >
            {loading ? "Agregando..." : "Agregar"}
          </button>
        </form>

        {children.length > 0 && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full py-3 border-2 border-strong-pink text-strong-pink font-bold rounded-2xl hover:bg-pastel-pink/20"
          >
            Listo, empezar →
          </button>
        )}
      </div>
    </div>
  )
}
