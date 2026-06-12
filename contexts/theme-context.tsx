"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type ThemeType = "pink" | "blue"

interface ThemeContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  childName: string
  setChildName: (name: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEYS = {
  THEME: "calendario-theme",
  CHILD_NAME: "calendario-child-name",
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>("pink")
  const [childName, setChildNameState] = useState("Hannah")
  const [mounted, setMounted] = useState(false)

  // Load theme and name from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeType | null
    const savedName = localStorage.getItem(STORAGE_KEYS.CHILD_NAME)
    
    if (savedTheme) {
      setThemeState(savedTheme)
    }
    if (savedName) {
      setChildNameState(savedName)
    }
    setMounted(true)
  }, [])

  // Apply theme class to document
  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    root.classList.remove("theme-pink", "theme-blue")
    if (theme === "blue") {
      root.classList.add("theme-blue")
    }
  }, [theme, mounted])

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
  }

  const setChildName = (name: string) => {
    setChildNameState(name)
    localStorage.setItem(STORAGE_KEYS.CHILD_NAME, name)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, childName, setChildName }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
