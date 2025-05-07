import {
    colorPalettes,
    fontSchemes,
    borderRadiusValues,
    densityValues,
    animationDurations,
    shadowValues,
    gradientPresets,
    neonEffects,
  } from "./design-tokens"
  import type { ThemeSettings } from "./theme-context"
  
  // Generate CSS variables based on theme settings
  export function generateCssVariables(settings: ThemeSettings): Record<string, string> {
    const variables: Record<string, string> = {}
  
    // Color scheme variables
    const colorScheme = settings.colorScheme as keyof typeof colorPalettes
    const colors = colorPalettes[colorScheme] || colorPalettes.default
  
    variables["--primary-light"] = colors.primary.light
    variables["--primary"] = colors.primary.main
    variables["--primary-dark"] = colors.primary.dark
  
    variables["--secondary-light"] = colors.secondary.light
    variables["--secondary"] = colors.secondary.main
    variables["--secondary-dark"] = colors.secondary.dark
  
    variables["--accent-light"] = colors.accent.light
    variables["--accent"] = colors.accent.main
    variables["--accent-dark"] = colors.accent.dark
  
    // Font scheme variables
    const fontScheme = settings.fontScheme as keyof typeof fontSchemes
    const fonts = fontSchemes[fontScheme] || fontSchemes.default
  
    variables["--font-heading"] = fonts.heading
    variables["--font-body"] = fonts.body
    variables["--font-mono"] = fonts.mono
    variables["--font-heading-weight"] = fonts.headingWeight
    variables["--font-body-weight"] = fonts.bodyWeight
  
    // Border radius variables
    const borderRadius = settings.borderRadius as keyof typeof borderRadiusValues
    const radius = borderRadiusValues[borderRadius] || borderRadiusValues.medium
  
    variables["--border-radius"] = radius
    variables["--border-radius-sm"] = `calc(${radius} * 0.75)`
    variables["--border-radius-lg"] = `calc(${radius} * 1.5)`
  
    // Density variables
    const density = settings.density as keyof typeof densityValues
    const spacing = densityValues[density] || densityValues.comfortable
  
    variables["--button-padding"] = spacing.buttonPadding
    variables["--input-padding"] = spacing.inputPadding
    variables["--card-padding"] = spacing.cardPadding
    variables["--section-padding"] = spacing.sectionPadding
    variables["--gap"] = spacing.gap
  
    // Animation variables
    const animationLevel = settings.animationLevel as keyof typeof animationDurations
    const durations = animationDurations[animationLevel] || animationDurations.moderate
  
    variables["--animation-fast"] = durations.fast
    variables["--animation-medium"] = durations.medium
    variables["--animation-slow"] = durations.slow
  
    // Effect variables
    variables["--shadow-sm"] = shadowValues.sm
    variables["--shadow-md"] = shadowValues.md
    variables["--shadow-lg"] = shadowValues.lg
    variables["--shadow-xl"] = shadowValues.xl
  
    if (settings.enableGlassmorphism) {
      variables["--glass-shadow"] = shadowValues.glassmorphism
      variables["--glass-background"] = "rgba(255, 255, 255, 0.7)"
      variables["--glass-border"] = "rgba(255, 255, 255, 0.18)"
    }
  
    if (settings.enableNeumorphism) {
      variables["--neumorphic-shadow"] = shadowValues.neumorphic
      variables["--neumorphic-shadow-inset"] = shadowValues["neumorphic-inset"]
    }
  
    if (settings.enableGradients) {
      variables["--gradient-primary"] = gradientPresets.primary
      variables["--gradient-secondary"] = gradientPresets.secondary
      variables["--gradient-accent"] = gradientPresets.accent
      variables["--gradient-vibrant"] = gradientPresets.vibrant
      variables["--gradient-cool"] = gradientPresets.cool
      variables["--gradient-warm"] = gradientPresets.warm
    }
  
    if (settings.enableNeonEffects) {
      variables["--neon-primary"] = neonEffects.primary
      variables["--neon-secondary"] = neonEffects.secondary
      variables["--neon-accent"] = neonEffects.accent
      variables["--neon-vibrant"] = neonEffects.vibrant
    }
  
    return variables
  }
  
  // Apply CSS variables to the document root
  export function applyCssVariables(variables: Record<string, string>): void {
    if (typeof document === "undefined") return
  
    const root = document.documentElement
  
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }
  
  // Get CSS class based on theme settings
  export function getThemeClasses(settings: ThemeSettings): string {
    const classes: string[] = []
  
    // Color scheme class
    classes.push(`color-scheme-${settings.colorScheme}`)
  
    // Font scheme class
    classes.push(`font-scheme-${settings.fontScheme}`)
  
    // Animation level class
    classes.push(`animation-${settings.animationLevel}`)
  
    // Border radius class
    classes.push(`radius-${settings.borderRadius}`)
  
    // Density class
    classes.push(`density-${settings.density}`)
  
    // Effect classes
    if (settings.enableGlassmorphism) classes.push("glassmorphism")
    if (settings.enableNeumorphism) classes.push("neumorphism")
    if (settings.enableGradients) classes.push("gradients")
    if (settings.enableNeonEffects) classes.push("neon-effects")
  
    return classes.join(" ")
  }
  
  // Get a specific design token value
  export function getDesignToken(
    tokenType: "color" | "font" | "radius" | "spacing" | "animation" | "shadow" | "gradient" | "neon",
    tokenName: string,
    settings: ThemeSettings,
  ): string {
    switch (tokenType) {
      case "color": {
        const colorScheme = settings.colorScheme as keyof typeof colorPalettes
        const colors = colorPalettes[colorScheme] || colorPalettes.default
  
        // Parse tokenName like "primary.light" or "accent.dark"
        const [palette, shade] = tokenName.split(".")
        if (palette && shade && colors[palette as keyof typeof colors]) {
          return colors[palette as keyof typeof colors][shade as keyof (typeof colors)[keyof typeof colors]]
        }
        return ""
      }
  
      case "font": {
        const fontScheme = settings.fontScheme as keyof typeof fontSchemes
        const fonts = fontSchemes[fontScheme] || fontSchemes.default
  
        return fonts[tokenName as keyof typeof fonts] || ""
      }
  
      case "radius": {
        const borderRadius = settings.borderRadius as keyof typeof borderRadiusValues
  
        if (tokenName === "base") {
          return borderRadiusValues[borderRadius] || borderRadiusValues.medium
        }
  
        if (tokenName === "sm") {
          const base = borderRadiusValues[borderRadius] || borderRadiusValues.medium
          return `calc(${base} * 0.75)`
        }
  
        if (tokenName === "lg") {
          const base = borderRadiusValues[borderRadius] || borderRadiusValues.medium
          return `calc(${base} * 1.5)`
        }
  
        return ""
      }
  
      case "spacing": {
        const density = settings.density as keyof typeof densityValues
        const spacing = densityValues[density] || densityValues.comfortable
  
        return spacing[tokenName as keyof typeof spacing] || ""
      }
  
      case "animation": {
        const animationLevel = settings.animationLevel as keyof typeof animationDurations
        const durations = animationDurations[animationLevel] || animationDurations.moderate
  
        return durations[tokenName as keyof typeof durations] || ""
      }
  
      case "shadow": {
        return shadowValues[tokenName as keyof typeof shadowValues] || ""
      }
  
      case "gradient": {
        return gradientPresets[tokenName as keyof typeof gradientPresets] || ""
      }
  
      case "neon": {
        return neonEffects[tokenName as keyof typeof neonEffects] || ""
      }
  
      default:
        return ""
    }
  }
  