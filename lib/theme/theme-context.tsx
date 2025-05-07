"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type ColorScheme = "default" | "vibrant" | "elegant" | "modern" | "classic"
export type FontScheme = "default" | "modern" | "traditional" | "playful" | "serious"
export type AnimationLevel = "none" | "minimal" | "moderate" | "extensive"
export type BorderRadius = "none" | "small" | "medium" | "large" | "pill"
export type Density = "compact" | "comfortable" | "spacious"

export interface ThemeSettings {
  colorScheme: ColorScheme
  fontScheme: FontScheme
  animationLevel: AnimationLevel
  borderRadius: BorderRadius
  density: Density
  enableGlassmorphism: boolean
  enableNeumorphism: boolean
  enableGradients: boolean
  enableNeonEffects: boolean
}

const defaultThemeSettings: ThemeSettings = {
  colorScheme: "default",
  fontScheme: "default",
  animationLevel: "moderate",
  borderRadius: "medium",
  density: "comfortable",
  enableGlassmorphism: true,
  enableNeumorphism: false,
  enableGradients: true,
  enableNeonEffects: true,
}

interface ThemeContextType {
  settings: ThemeSettings
  updateSettings: (newSettings: Partial<ThemeSettings>) => void
  resetSettings: () => void
  applyPreset: (preset: "default" | "minimal" | "futuristic" | "traditional" | "playful") => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings)
  const [mounted, setMounted] = useState(false)

  // Update the theme settings
  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("inevestart-theme-settings", JSON.stringify({ ...settings, ...newSettings }))
    }

    // Apply CSS variables and classes based on settings
    applyThemeSettings({ ...settings, ...newSettings })
  }

  // Reset to default settings
  const resetSettings = () => {
    setSettings(defaultThemeSettings)
    if (typeof window !== "undefined") {
      localStorage.removeItem("inevestart-theme-settings")
    }
    applyThemeSettings(defaultThemeSettings)
  }

  // Apply theme presets
  const applyPreset = (preset: "default" | "minimal" | "futuristic" | "traditional" | "playful") => {
    let presetSettings: ThemeSettings = { ...defaultThemeSettings }

    switch (preset) {
      case "minimal":
        presetSettings = {
          ...defaultThemeSettings,
          colorScheme: "elegant",
          animationLevel: "minimal",
          borderRadius: "small",
          enableGlassmorphism: false,
          enableNeumorphism: false,
          enableGradients: false,
          enableNeonEffects: false,
        }
        break
      case "futuristic":
        presetSettings = {
          ...defaultThemeSettings,
          colorScheme: "vibrant",
          fontScheme: "modern",
          animationLevel: "extensive",
          borderRadius: "large",
          enableGlassmorphism: true,
          enableNeumorphism: false,
          enableGradients: true,
          enableNeonEffects: true,
        }
        break
      case "traditional":
        presetSettings = {
          ...defaultThemeSettings,
          colorScheme: "classic",
          fontScheme: "traditional",
          animationLevel: "minimal",
          borderRadius: "small",
          density: "comfortable",
          enableGlassmorphism: false,
          enableNeumorphism: false,
          enableGradients: false,
          enableNeonEffects: false,
        }
        break
      case "playful":
        presetSettings = {
          ...defaultThemeSettings,
          colorScheme: "vibrant",
          fontScheme: "playful",
          animationLevel: "extensive",
          borderRadius: "large",
          density: "spacious",
          enableGlassmorphism: true,
          enableNeumorphism: false,
          enableGradients: true,
          enableNeonEffects: true,
        }
        break
      default:
        presetSettings = { ...defaultThemeSettings }
    }

    setSettings(presetSettings)
    if (typeof window !== "undefined") {
      localStorage.setItem("inevestart-theme-settings", JSON.stringify(presetSettings))
    }
    applyThemeSettings(presetSettings)
  }

  // Apply theme settings to the DOM
  const applyThemeSettings = (settings: ThemeSettings) => {
    if (typeof document === "undefined") return

    const root = document.documentElement

    // Apply color scheme
    root.setAttribute("data-color-scheme", settings.colorScheme)

    // Apply font scheme
    root.setAttribute("data-font-scheme", settings.fontScheme)

    // Apply animation level
    root.setAttribute("data-animation-level", settings.animationLevel)

    // Apply border radius
    root.setAttribute("data-border-radius", settings.borderRadius)

    // Apply density
    root.setAttribute("data-density", settings.density)

    // Apply effect toggles
    root.setAttribute("data-glassmorphism", settings.enableGlassmorphism ? "true" : "false")
    root.setAttribute("data-neumorphism", settings.enableNeumorphism ? "true" : "false")
    root.setAttribute("data-gradients", settings.enableGradients ? "true" : "false")
    root.setAttribute("data-neon", settings.enableNeonEffects ? "true" : "false")
  }

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true)

    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("inevestart-theme-settings")
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings) as ThemeSettings
          setSettings(parsedSettings)
          applyThemeSettings(parsedSettings)
        } catch (e) {
          console.error("Failed to parse saved theme settings", e)
          resetSettings()
        }
      } else {
        applyThemeSettings(defaultThemeSettings)
      }
    }
  }, [])

  // Avoid rendering with incorrect settings during SSR
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, resetSettings, applyPreset }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeSettings = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeSettings must be used within a ThemeProvider")
  }
  return context
}
