"use client"

import { useState } from "react"
import { X, Settings, User, Palette, ListChecks, Check, Database, AlertTriangle, Coins, ChevronUp, ChevronDown, GripVertical } from "lucide-react"
import type { RoutineBlock, Activity } from "@/app/page"
import { getActivityIcon, availableIcons } from "./activity-icons"

// All available activities with bilingual support
export const availableActivities: Omit<Activity, "completed">[] = [
  // Morning activities
  { id: "act-1", nameEs: "Levantarse", nameEn: "Wake up", icon: "bed" },
  { id: "act-2", nameEs: "Tomar un vaso de agua", nameEn: "Drink a glass of water", icon: "glass-water" },
  { id: "act-3", nameEs: "Ir al baño", nameEn: "Go to the bathroom", icon: "toilet" },
  { id: "act-4", nameEs: "Ducharse", nameEn: "Take a shower", icon: "shower" },
  { id: "act-5", nameEs: "Ponerse el uniforme", nameEn: "Put on the uniform", icon: "shirt" },
  { id: "act-6", nameEs: "Peinarse", nameEn: "Brush your hair", icon: "brush" },
  { id: "act-7", nameEs: "Desayunar", nameEn: "Have breakfast", icon: "breakfast" },
  { id: "act-8", nameEs: "Lavarse los dientes", nameEn: "Brush your teeth", icon: "teeth" },
  { id: "act-9", nameEs: "Revisar todo para salir", nameEn: "Check everything before leaving", icon: "backpack" },
  { id: "act-10", nameEs: "Ir a la escuela", nameEn: "Go to school", icon: "school" },
  // Afternoon activities
  { id: "act-11", nameEs: "Llegar de la escuela", nameEn: "Arrive from school", icon: "home" },
  { id: "act-12", nameEs: "Almorzar", nameEn: "Have lunch", icon: "lunch" },
  { id: "act-13", nameEs: "Cambiarse el uniforme", nameEn: "Change out of uniform", icon: "clothes" },
  { id: "act-14", nameEs: "Dar comida a los perros", nameEn: "Feed the dogs", icon: "dog" },
  { id: "act-15", nameEs: "Ver televisión, pintar o hacer una actividad", nameEn: "Watch TV, paint or do an activity", icon: "play" },
  { id: "act-16", nameEs: "Tomarse el alguito", nameEn: "Have a snack", icon: "snack" },
  { id: "act-17", nameEs: "Hacer la tarea", nameEn: "Do homework", icon: "homework" },
  { id: "act-18", nameEs: "Leer un libro", nameEn: "Read a book", icon: "book" },
  { id: "act-19", nameEs: "Jugar afuera", nameEn: "Play outside", icon: "play" },
  // Night activities
  { id: "act-20", nameEs: "Comer", nameEn: "Have dinner", icon: "dinner" },
  { id: "act-21", nameEs: "Ponerse la pijama", nameEn: "Put on pajamas", icon: "pajamas" },
  { id: "act-22", nameEs: "Momento de calma o de oración", nameEn: "Calm time or prayer", icon: "pray" },
  { id: "act-23", nameEs: "Dormir", nameEn: "Go to sleep", icon: "sleep" },
  { id: "act-24", nameEs: "Preparar la ropa del día siguiente", nameEn: "Prepare clothes for tomorrow", icon: "clothes" },
  { id: "act-25", nameEs: "Ordenar los juguetes", nameEn: "Tidy up toys", icon: "toys" },
  { id: "act-26", nameEs: "Lavarse las manos", nameEn: "Wash hands", icon: "hands" },
  { id: "act-27", nameEs: "Tender la cama", nameEn: "Make the bed", icon: "bed" },
  { id: "act-28", nameEs: "Dar de comer al gato", nameEn: "Feed the cat", icon: "cat" },
  { id: "act-29", nameEs: "Regar las plantas", nameEn: "Water the plants", icon: "plant" },
  { id: "act-30", nameEs: "Guardar la mochila", nameEn: "Put away backpack", icon: "backpack" },
]

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  childName: string
  onNameChange: (name: string) => void
  theme: "pink" | "blue"
  onThemeChange: (theme: "pink" | "blue") => void
  routines: RoutineBlock[]
  onRoutinesChange: (routines: RoutineBlock[]) => void
  tokens: number
  onResetTokens: () => void
  onResetAllData: () => void
}

export function SettingsPanel({
  isOpen,
  onClose,
  childName,
  onNameChange,
  theme,
  onThemeChange,
  routines,
  onRoutinesChange,
  tokens,
  onResetTokens,
  onResetAllData,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<"name" | "theme" | "routines" | "data">("name")
  const [showConfirmResetTokens, setShowConfirmResetTokens] = useState(false)
  const [showConfirmResetAll, setShowConfirmResetAll] = useState(false)
  const [tempName, setTempName] = useState(childName)
  const [editingRoutine, setEditingRoutine] = useState<string | null>(null)
  const [reorderMode, setReorderMode] = useState<string | null>(null) // routineId when in reorder mode

  if (!isOpen) return null

  const handleSaveName = () => {
    if (tempName.trim()) {
      onNameChange(tempName.trim())
    }
  }

  // Las actividades guardadas tienen UUID de Supabase, los presets tienen id "act-X".
  // Por eso el match es por id O por nombre en español (nameEs o name según el origen).
  const matchesActivity = (a: { id: string; nameEs?: string; name?: string }, preset: Omit<Activity, "completed">) =>
    a.id === preset.id || a.nameEs === preset.nameEs || a.name === preset.nameEs

  const toggleActivityInRoutine = (routineId: string, activity: Omit<Activity, "completed">) => {
    const newRoutines = routines.map((routine) => {
      if (routine.id !== routineId) return routine

      const existingIndex = routine.activities.findIndex((a) => matchesActivity(a, activity))

      if (existingIndex >= 0) {
        // Remove activity
        return {
          ...routine,
          activities: routine.activities.filter((a) => !matchesActivity(a, activity)),
        }
      } else {
        // Add activity
        return {
          ...routine,
          activities: [...routine.activities, { ...activity, completed: false }],
        }
      }
    })

    onRoutinesChange(newRoutines)
  }

  const isActivityInRoutine = (routineId: string, activity: Omit<Activity, "completed">) => {
    const routine = routines.find((r) => r.id === routineId)
    return routine?.activities.some((a) => matchesActivity(a, activity)) ?? false
  }

  const moveActivityUp = (routineId: string, activityIndex: number) => {
    if (activityIndex <= 0) return
    
    const newRoutines = routines.map((routine) => {
      if (routine.id !== routineId) return routine
      
      const newActivities = [...routine.activities]
      const temp = newActivities[activityIndex]
      newActivities[activityIndex] = newActivities[activityIndex - 1]
      newActivities[activityIndex - 1] = temp
      
      return { ...routine, activities: newActivities }
    })
    
    onRoutinesChange(newRoutines)
  }

  const moveActivityDown = (routineId: string, activityIndex: number) => {
    const routine = routines.find((r) => r.id === routineId)
    if (!routine || activityIndex >= routine.activities.length - 1) return
    
    const newRoutines = routines.map((r) => {
      if (r.id !== routineId) return r
      
      const newActivities = [...r.activities]
      const temp = newActivities[activityIndex]
      newActivities[activityIndex] = newActivities[activityIndex + 1]
      newActivities[activityIndex + 1] = temp
      
      return { ...r, activities: newActivities }
    })
    
    onRoutinesChange(newRoutines)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel */}
      <div className="relative bg-card w-full max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Configuracion</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("name")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "name"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-4 h-4 mx-auto mb-1" />
            Nombre
          </button>
          <button
            onClick={() => setActiveTab("theme")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "theme"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Palette className="w-4 h-4 mx-auto mb-1" />
            Tema
          </button>
          <button
            onClick={() => setActiveTab("routines")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "routines"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListChecks className="w-4 h-4 mx-auto mb-1" />
            Rutinas
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "data"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Database className="w-4 h-4 mx-auto mb-1" />
            Datos
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Name Tab */}
          {activeTab === "name" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Ingresa el nombre del dueño del calendario. Este nombre aparecera en el titulo y en los tokencitos.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nombre</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Ej: Sofia, Carlos, Maria..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none text-lg"
                />
              </div>
              <button
                onClick={handleSaveName}
                disabled={!tempName.trim()}
                className="w-full py-3 px-4 rounded-2xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar nombre
              </button>
              
              {/* Preview */}
              <div className="mt-6 p-4 bg-muted rounded-2xl">
                <p className="text-sm text-muted-foreground mb-2">Vista previa:</p>
                <p className="text-lg font-bold text-foreground">Calendario de {tempName || "..."}</p>
                <p className="text-sm text-muted-foreground">{tempName || "..."} Tokencitos</p>
              </div>
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === "theme" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Elige el tema de colores para el calendario.
              </p>
              
              {/* Pink theme */}
              <button
                onClick={() => onThemeChange("pink")}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  theme === "pink"
                    ? "border-[#EC407A] bg-[#FCE4EC]"
                    : "border-border hover:border-[#F48FB1]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    <div className="w-8 h-8 rounded-full bg-[#F9C5D5]" />
                    <div className="w-8 h-8 rounded-full bg-[#F48FB1]" />
                    <div className="w-8 h-8 rounded-full bg-[#EC407A]" />
                    <div className="w-8 h-8 rounded-full bg-[#E1BEE7]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-foreground">Rosa</p>
                    <p className="text-sm text-muted-foreground">Tema rosa y purpura</p>
                  </div>
                  {theme === "pink" && (
                    <div className="w-6 h-6 rounded-full bg-[#EC407A] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>

              {/* Blue theme */}
              <button
                onClick={() => onThemeChange("blue")}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  theme === "blue"
                    ? "border-[#2196F3] bg-[#E3F2FD]"
                    : "border-border hover:border-[#64B5F6]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    <div className="w-8 h-8 rounded-full bg-[#BBDEFB]" />
                    <div className="w-8 h-8 rounded-full bg-[#64B5F6]" />
                    <div className="w-8 h-8 rounded-full bg-[#2196F3]" />
                    <div className="w-8 h-8 rounded-full bg-[#B3E5FC]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-foreground">Azul</p>
                    <p className="text-sm text-muted-foreground">Tema azul y celeste</p>
                  </div>
                  {theme === "blue" && (
                    <div className="w-6 h-6 rounded-full bg-[#2196F3] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Routines Tab */}
          {activeTab === "routines" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Selecciona las actividades para cada rutina y organiza su orden.
              </p>
              
              {routines.map((routine) => (
                <div key={routine.id} className="border-2 border-border rounded-2xl overflow-hidden">
                  <button
                    onClick={() => {
                      setEditingRoutine(editingRoutine === routine.id ? null : routine.id)
                      setReorderMode(null)
                    }}
                    className={`w-full p-4 flex items-center justify-between transition-colors ${
                      editingRoutine === routine.id ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${routine.bgColor} flex items-center justify-center`}>
                        {routine.icon === "sun" && <span className="text-xl">☀️</span>}
                        {routine.icon === "cloud-sun" && <span className="text-xl">🌤️</span>}
                        {routine.icon === "moon" && <span className="text-xl">🌙</span>}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-foreground">{routine.title}</p>
                        <p className="text-sm text-muted-foreground">{routine.activities.length} actividades</p>
                      </div>
                    </div>
                    <div className={`transform transition-transform ${editingRoutine === routine.id ? "rotate-180" : ""}`}>
                      ▼
                    </div>
                  </button>
                  
                  {editingRoutine === routine.id && (
                    <div className="border-t border-border bg-muted/30">
                      {/* Toggle between add mode and reorder mode */}
                      <div className="flex border-b border-border">
                        <button
                          onClick={() => setReorderMode(null)}
                          className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                            reorderMode !== routine.id
                              ? "bg-primary/10 text-primary border-b-2 border-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Agregar
                        </button>
                        <button
                          onClick={() => setReorderMode(routine.id)}
                          disabled={routine.activities.length < 2}
                          className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                            reorderMode === routine.id
                              ? "bg-primary/10 text-primary border-b-2 border-primary"
                              : "text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                          }`}
                        >
                          Ordenar
                        </button>
                      </div>

                      <div className="p-4 max-h-64 overflow-y-auto">
                        {reorderMode === routine.id ? (
                          /* Reorder mode - show selected activities with up/down buttons */
                          <div className="space-y-2">
                            {routine.activities.length === 0 ? (
                              <p className="text-center text-muted-foreground py-4">
                                Primero agrega actividades para ordenarlas
                              </p>
                            ) : (
                              routine.activities.map((activity, index) => {
                                const IconComponent = getActivityIcon(activity.icon)
                                const isFirst = index === 0
                                const isLast = index === routine.activities.length - 1
                                
                                return (
                                  <div
                                    key={activity.id}
                                    className="flex items-center gap-2 p-2 rounded-xl bg-card border-2 border-border"
                                  >
                                    <div className="text-muted-foreground">
                                      <GripVertical className="w-4 h-4" />
                                    </div>
                                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                                      {index + 1}
                                    </span>
                                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                      <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-foreground text-sm truncate">{activity.nameEs}</p>
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => moveActivityUp(routine.id, index)}
                                        disabled={isFirst}
                                        className="p-1.5 rounded-lg bg-muted hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Mover arriba"
                                      >
                                        <ChevronUp className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => moveActivityDown(routine.id, index)}
                                        disabled={isLast}
                                        className="p-1.5 rounded-lg bg-muted hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Mover abajo"
                                      >
                                        <ChevronDown className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                )
                              })
                            )}
                          </div>
                        ) : (
                          /* Add mode - show all available activities */
                          <div className="grid grid-cols-1 gap-2">
                            {availableActivities.map((activity) => {
                              const isSelected = isActivityInRoutine(routine.id, activity)
                              const IconComponent = getActivityIcon(activity.icon)
                              
                              return (
                                <button
                                  key={activity.id}
                                  onClick={() => toggleActivityInRoutine(routine.id, activity)}
                                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                    isSelected
                                      ? "bg-primary/20 border-2 border-primary"
                                      : "bg-card border-2 border-transparent hover:border-border"
                                  }`}
                                >
                                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                                    <IconComponent className="w-6 h-6" />
                                  </div>
                                  <div className="flex-1 text-left">
                                    <p className="font-medium text-foreground text-sm">{activity.nameEs}</p>
                                    <p className="text-xs text-muted-foreground">{activity.nameEn}</p>
                                  </div>
                                  {isSelected && (
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                      <Check className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Data Tab */}
          {activeTab === "data" && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Administra los datos guardados del calendario. Usa estas opciones con cuidado.
              </p>
              
              {/* Current tokens display */}
              <div className="p-4 bg-muted rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-reward-gold to-yellow-500 rounded-full flex items-center justify-center">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tokencitos actuales</p>
                    <p className="text-2xl font-bold text-foreground">{tokens}</p>
                  </div>
                </div>
              </div>

              {/* Reset tokens button */}
              <div className="border-2 border-border rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Coins className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">Reiniciar tokencitos</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pone los tokencitos en cero. Util si quieres empezar de nuevo o cambiar de usuario.
                    </p>
                    <button
                      onClick={() => setShowConfirmResetTokens(true)}
                      className="mt-3 px-4 py-2 rounded-xl font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all"
                    >
                      Reiniciar tokencitos
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset all data button */}
              <div className="border-2 border-destructive/30 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">Borrar todo</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Borra todos los datos: tokencitos, progreso semanal, premios personalizados y configuracion. Ideal para empezar con un nuevo usuario.
                    </p>
                    <button
                      onClick={() => setShowConfirmResetAll(true)}
                      className="mt-3 px-4 py-2 rounded-xl font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
                    >
                      Borrar todos los datos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Reset Tokens Modal */}
        {showConfirmResetTokens && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm">
            <div className="bg-card rounded-3xl p-6 max-w-sm w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Reiniciar tokencitos</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Esto pondra los {tokens} tokencitos en cero. Esta accion no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmResetTokens(false)}
                  className="flex-1 py-3 px-4 rounded-2xl font-bold bg-muted text-foreground hover:bg-muted/80 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onResetTokens()
                    setShowConfirmResetTokens(false)
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all"
                >
                  Reiniciar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Reset All Modal */}
        {showConfirmResetAll && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm">
            <div className="bg-card rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-destructive/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Borrar todo</h3>
              </div>
              <p className="text-muted-foreground mb-2">
                Esto borrara permanentemente:
              </p>
              <ul className="text-sm text-muted-foreground mb-6 list-disc list-inside space-y-1">
                <li>{tokens} tokencitos</li>
                <li>Progreso semanal</li>
                <li>Premios personalizados</li>
                <li>Configuracion de rutinas</li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmResetAll(false)}
                  className="flex-1 py-3 px-4 rounded-2xl font-bold bg-muted text-foreground hover:bg-muted/80 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onResetAllData()
                    setShowConfirmResetAll(false)
                    onClose()
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all"
                >
                  Borrar todo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
