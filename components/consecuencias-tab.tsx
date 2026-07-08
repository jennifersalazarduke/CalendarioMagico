"use client"

import { useState, useEffect, useCallback } from "react"
import { Coins, Minus, Plus, FileText, Clock, AlertCircle, Gift } from "lucide-react"

// Deduction entry type
export interface Deduction {
  id: string
  amount: number
  reason: string
  customReason?: string
  note?: string
  timestamp: string
  date: string
  kind?: "deduct" | "gift"
}

// Preset reasons
const DEDUCTION_REASONS = [
  { value: "no-recoger", label: "No recoger" },
  { value: "no-escuchar", label: "No escuchar" },
  { value: "mala-actitud", label: "Mala actitud" },
  { value: "pegar", label: "Pegar" },
  { value: "gritar", label: "Gritar" },
  { value: "no-cumplir-regla", label: "No cumplir una regla" },
  { value: "otro", label: "Otro" },
]

const STORAGE_KEY_DEDUCTIONS = "calendario-deductions"

interface ConsecuenciasTabProps {
  tokens: number
  onSubtractTokens: (amount: number) => void
  onGiftTokens?: (amount: number) => void
  childName: string
}

// Get current week's start date (Monday)
function getWeekStartDate(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  return monday.toISOString().split("T")[0]
}

export function ConsecuenciasTab({ tokens, onSubtractTokens, onGiftTokens, childName }: ConsecuenciasTabProps) {
  const [deductions, setDeductions] = useState<Deduction[]>([])
  const [amount, setAmount] = useState(1)
  const [reason, setReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [note, setNote] = useState("")
  const [showWarning, setShowWarning] = useState(false)

  // Load deductions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DEDUCTIONS)
    if (saved) {
      setDeductions(JSON.parse(saved))
    }
  }, [])

  // Save deductions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DEDUCTIONS, JSON.stringify(deductions))
  }, [deductions])

  // Calculate weekly deductions (los regalos no cuentan como descuento)
  const weeklyDeductions = useCallback(() => {
    const weekStart = getWeekStartDate()
    return deductions
      .filter((d) => d.date >= weekStart && d.kind !== "gift")
      .reduce((sum, d) => sum + d.amount, 0)
  }, [deductions])

  // Handle form deduction
  const handleDeduct = useCallback(() => {
    if (amount <= 0 || !reason) return

    const actualDeduction = Math.min(amount, tokens)
    
    if (actualDeduction < amount) {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 3000)
    }

    if (actualDeduction > 0) {
      const newDeduction: Deduction = {
        id: `ded-${Date.now()}`,
        amount: actualDeduction,
        reason: reason === "otro" ? "otro" : DEDUCTION_REASONS.find(r => r.value === reason)?.label || reason,
        customReason: reason === "otro" ? customReason : undefined,
        note: note || undefined,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split("T")[0],
      }

      setDeductions((prev) => [newDeduction, ...prev])
      onSubtractTokens(actualDeduction)

      // Reset form
      setAmount(1)
      setReason("")
      setCustomReason("")
      setNote("")
    }
  }, [amount, reason, customReason, note, tokens, onSubtractTokens])

  // Quick deduction
  const handleQuickDeduct = useCallback((quickAmount: number) => {
    const actualDeduction = Math.min(quickAmount, tokens)
    
    if (actualDeduction < quickAmount) {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 3000)
    }

    if (actualDeduction > 0) {
      const newDeduction: Deduction = {
        id: `ded-${Date.now()}`,
        amount: actualDeduction,
        reason: "Descuento rapido",
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split("T")[0],
      }

      setDeductions((prev) => [newDeduction, ...prev])
      onSubtractTokens(actualDeduction)
    }
  }, [tokens, onSubtractTokens])

  // Quick gift
  const handleQuickGift = useCallback((quickAmount: number) => {
    if (!onGiftTokens) return

    const newEntry: Deduction = {
      id: `gift-${Date.now()}`,
      amount: quickAmount,
      reason: "Regalo de mama o papa",
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
      kind: "gift",
    }

    setDeductions((prev) => [newEntry, ...prev])
    onGiftTokens(quickAmount)
  }, [onGiftTokens])

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/80 to-primary rounded-3xl p-6 text-primary-foreground shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="w-7 h-7" />
          <h2 className="text-2xl font-bold">Consecuencias</h2>
        </div>
        <p className="text-primary-foreground/80 text-sm">
          Ajustes de saldo por decisiones de mama o papa
        </p>
        <div className="mt-3 inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
          Uso de adultos
        </div>
      </div>

      {/* Current Balance Card */}
      <div className="bg-card border-2 border-border rounded-3xl p-5 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-reward-gold to-yellow-500 rounded-2xl flex items-center justify-center shadow-md">
            <Coins className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              {childName} Tokencitos disponibles
            </p>
            <p className="text-4xl font-extrabold text-foreground">{tokens}</p>
          </div>
        </div>
      </div>

      {/* Warning message */}
      {showWarning && (
        <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl text-amber-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>El saldo no puede ser menor a cero.</span>
        </div>
      )}

      {/* Quick Gift Buttons */}
      {onGiftTokens && (
        <div className="bg-card border-2 border-reward-gold/50 rounded-3xl p-5 shadow-md">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-reward-gold" />
            Regalar Tokencitos
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Para premiar algo especial fuera de las rutinas.
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 5, 10].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => handleQuickGift(quickAmount)}
                className="py-4 px-2 rounded-2xl font-bold text-lg bg-reward-gold/15 text-amber-600 hover:bg-reward-gold/30 transition-all active:scale-95"
              >
                +{quickAmount}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Deduction Buttons */}
      <div className="bg-card border-2 border-border rounded-3xl p-5 shadow-md">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Minus className="w-5 h-5" />
          Descuento rapido
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 5, 10].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => handleQuickDeduct(quickAmount)}
              disabled={tokens === 0}
              className="py-4 px-2 rounded-2xl font-bold text-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -{quickAmount}
            </button>
          ))}
        </div>
      </div>

      {/* Deduction Form */}
      <div className="bg-card border-2 border-border rounded-3xl p-5 shadow-md">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Registrar descuento
        </h3>

        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Cantidad de Tokencitos
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAmount((a) => Math.max(1, a - 1))}
                className="w-12 h-12 rounded-xl bg-muted hover:bg-muted/80 text-xl font-bold transition-all"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 h-12 rounded-xl bg-muted text-center text-xl font-bold text-foreground border-0 focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => setAmount((a) => a + 1)}
                className="w-12 h-12 rounded-xl bg-muted hover:bg-muted/80 text-xl font-bold transition-all"
              >
                +
              </button>
            </div>
          </div>

          {/* Reason dropdown */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Razon
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-12 rounded-xl bg-muted text-foreground px-4 border-0 focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="">Selecciona una razon...</option>
              {DEDUCTION_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom reason input (shown when "Otro" is selected) */}
          {reason === "otro" && (
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Especifica la razon
              </label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Escribe la razon..."
                className="w-full h-12 rounded-xl bg-muted text-foreground px-4 border-0 focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Note (optional) */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Nota (opcional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Detalles adicionales..."
              rows={2}
              className="w-full rounded-xl bg-muted text-foreground px-4 py-3 border-0 focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Submit button */}
          <button
            onClick={handleDeduct}
            disabled={!reason || amount <= 0 || tokens === 0}
            className="w-full py-4 rounded-2xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Restar Tokencitos
          </button>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-card border-2 border-border rounded-3xl p-5 shadow-md">
        <h3 className="font-bold text-foreground mb-3">
          Tokencitos descontados esta semana
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Minus className="w-6 h-6 text-primary" />
          </div>
          <span className="text-3xl font-extrabold text-foreground">
            {weeklyDeductions()}
          </span>
        </div>
      </div>

      {/* Deduction History */}
      <div className="bg-card border-2 border-border rounded-3xl p-5 shadow-md">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Historial de ajustes
        </h3>

        {deductions.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No hay ajustes registrados
          </p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {deductions.slice(0, 20).map((deduction) => (
              <div
                key={deduction.id}
                className="p-4 bg-muted/50 rounded-2xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <span className={deduction.kind === "gift" ? "text-green-600" : "text-primary"}>
                        {deduction.kind === "gift" ? "+" : "-"}{deduction.amount}
                      </span>
                      Tokencitos
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {deduction.reason === "otro" && deduction.customReason
                        ? deduction.customReason
                        : deduction.reason}
                    </p>
                    {deduction.note && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        Nota: {deduction.note}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(deduction.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
