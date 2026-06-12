"use client"

import { useAuth } from "@/contexts/auth-context"
import { AuthScreen } from "@/components/auth-screen"
import { FamilySetup } from "@/components/family-setup"
import type { ReactNode } from "react"

export function AppShell({ children }: { children: ReactNode }) {
  const { user, family, children: kids, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pastel-pink/30 via-background to-soft-purple/20">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🌟</div>
          <p className="text-muted-foreground font-semibold">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) return <AuthScreen />
  if (!family || kids.length === 0) return <FamilySetup />

  return <>{children}</>
}
