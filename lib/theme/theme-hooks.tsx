"use client"

import { useEffect, useState } from "react"
import { useThemeSettings } from "./theme-context"
import { generateCssVariables, applyCssVariables, getThemeClasses, getDesignToken } from "./theme-utils"

// Hook to apply theme settings to the DOM
export function useApplyTheme() {
  const { settings } = useThemeSettings()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Generate and apply CSS variables
    const cssVariables = generateCssVariables(settings)
    applyCssVariables(cssVariables)

    // Apply theme classes to the document root
    const themeClasses = getThemeClasses(settings)
    document.documentElement.className = document.documentElement.className
      .split(" ")
      .filter(
        (cls) =>
          !cls.startsWith("color-scheme-") &&
          !cls.startsWith("font-scheme-") &&
          !cls.startsWith("animation-") &&
          !cls.startsWith("radius-") &&
          !cls.startsWith("density-") &&
          cls !== "glassmorphism" &&
          cls !== "neumorphism" &&
          cls !== "gradients" &&
          cls !== "neon-effects",
      )
      .concat(themeClasses.split(" "))
      .join(" ")
  }, [settings])

  return mounted
}

// Hook to get a design token value
export function useDesignToken(
  tokenType: "color" | "font" | "radius" | "spacing" | "animation" | "shadow" | "gradient" | "neon",
  tokenName: string,
) {
  const { settings } = useThemeSettings()
  const [value, setValue] = useState("")

  useEffect(() => {
    setValue(getDesignToken(tokenType, tokenName, settings))
  }, [tokenType, tokenName, settings])

  return value
}

// Hook to get animation duration based on current settings
export function useAnimationDuration(speed: "fast" | "medium" | "slow" = "medium") {
  const { settings } = useThemeSettings()
  const [duration, setDuration] = useState("0.3s")

  useEffect(() => {
    setDuration(getDesignToken("animation", speed, settings))
  }, [speed, settings])

  return duration
}

// Hook to check if glassmorphism is enabled
export function useGlassmorphism() {
  const { settings } = useThemeSettings()
  return settings.enableGlassmorphism
}

// Hook to check if neumorphism is enabled
export function useNeumorphism() {
  const { settings } = useThemeSettings()
  return settings.enableNeumorphism
}

// Hook to check if gradients are enabled
export function useGradients() {
  const { settings } = useThemeSettings()
  return settings.enableGradients
}

// Hook to check if neon effects are enabled
export function useNeonEffects() {
  const { settings } = useThemeSettings()
  return settings.enableNeonEffects
}
