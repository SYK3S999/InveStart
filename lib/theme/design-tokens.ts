// Design tokens for the INEVESTART application
// These tokens are used to maintain consistent styling throughout the app

// Color palettes for different color schemes
export const colorPalettes = {
    default: {
      primary: {
        light: "hsl(224, 84%, 90%)",
        main: "hsl(224, 76%, 48%)",
        dark: "hsl(224, 76%, 38%)",
      },
      secondary: {
        light: "hsl(174, 84%, 90%)",
        main: "hsl(174, 84%, 32%)",
        dark: "hsl(174, 84%, 22%)",
      },
      accent: {
        light: "hsl(262, 83%, 90%)",
        main: "hsl(262, 83%, 58%)",
        dark: "hsl(262, 83%, 48%)",
      },
    },
    vibrant: {
      primary: {
        light: "hsl(259, 94%, 92%)",
        main: "hsl(259, 94%, 51%)",
        dark: "hsl(259, 94%, 41%)",
      },
      secondary: {
        light: "hsl(326, 100%, 92%)",
        main: "hsl(326, 100%, 60%)",
        dark: "hsl(326, 100%, 50%)",
      },
      accent: {
        light: "hsl(43, 100%, 85%)",
        main: "hsl(43, 100%, 50%)",
        dark: "hsl(43, 100%, 40%)",
      },
    },
    elegant: {
      primary: {
        light: "hsl(210, 40%, 96%)",
        main: "hsl(210, 40%, 36%)",
        dark: "hsl(210, 40%, 26%)",
      },
      secondary: {
        light: "hsl(180, 40%, 92%)",
        main: "hsl(180, 40%, 40%)",
        dark: "hsl(180, 40%, 30%)",
      },
      accent: {
        light: "hsl(43, 80%, 92%)",
        main: "hsl(43, 80%, 60%)",
        dark: "hsl(43, 80%, 50%)",
      },
    },
    modern: {
      primary: {
        light: "hsl(200, 98%, 92%)",
        main: "hsl(200, 98%, 50%)",
        dark: "hsl(200, 98%, 40%)",
      },
      secondary: {
        light: "hsl(333, 100%, 92%)",
        main: "hsl(333, 100%, 50%)",
        dark: "hsl(333, 100%, 40%)",
      },
      accent: {
        light: "hsl(130, 94%, 92%)",
        main: "hsl(130, 94%, 40%)",
        dark: "hsl(130, 94%, 30%)",
      },
    },
    classic: {
      primary: {
        light: "hsl(215, 60%, 92%)",
        main: "hsl(215, 60%, 45%)",
        dark: "hsl(215, 60%, 35%)",
      },
      secondary: {
        light: "hsl(150, 60%, 92%)",
        main: "hsl(150, 60%, 40%)",
        dark: "hsl(150, 60%, 30%)",
      },
      accent: {
        light: "hsl(25, 100%, 92%)",
        main: "hsl(25, 100%, 50%)",
        dark: "hsl(25, 100%, 40%)",
      },
    },
  }
  
  // Font settings for different font schemes
  export const fontSchemes = {
    default: {
      heading: "Cairo, sans-serif",
      body: "Cairo, sans-serif",
      mono: "var(--font-geist-mono), monospace",
      headingWeight: "700",
      bodyWeight: "400",
    },
    modern: {
      heading: "Cairo, sans-serif",
      body: "Cairo, sans-serif",
      mono: "var(--font-geist-mono), monospace",
      headingWeight: "800",
      bodyWeight: "300",
    },
    traditional: {
      heading: "Amiri, serif",
      body: "Cairo, sans-serif",
      mono: "var(--font-geist-mono), monospace",
      headingWeight: "700",
      bodyWeight: "400",
    },
    playful: {
      heading: "Cairo, sans-serif",
      body: "Cairo, sans-serif",
      mono: "var(--font-geist-mono), monospace",
      headingWeight: "800",
      bodyWeight: "400",
    },
    serious: {
      heading: "Cairo, sans-serif",
      body: "Cairo, sans-serif",
      mono: "var(--font-geist-mono), monospace",
      headingWeight: "600",
      bodyWeight: "400",
    },
  }
  
  // Border radius values for different settings
  export const borderRadiusValues = {
    none: "0",
    small: "0.25rem",
    medium: "0.5rem",
    large: "1rem",
    pill: "9999px",
  }
  
  // Spacing values for different density settings
  export const densityValues = {
    compact: {
      buttonPadding: "0.5rem 1rem",
      inputPadding: "0.5rem",
      cardPadding: "1rem",
      sectionPadding: "1.5rem 0",
      gap: "0.5rem",
    },
    comfortable: {
      buttonPadding: "0.75rem 1.5rem",
      inputPadding: "0.75rem",
      cardPadding: "1.5rem",
      sectionPadding: "3rem 0",
      gap: "1rem",
    },
    spacious: {
      buttonPadding: "1rem 2rem",
      inputPadding: "1rem",
      cardPadding: "2rem",
      sectionPadding: "5rem 0",
      gap: "1.5rem",
    },
  }
  
  // Animation durations for different animation levels
  export const animationDurations = {
    none: {
      fast: "0s",
      medium: "0s",
      slow: "0s",
    },
    minimal: {
      fast: "0.1s",
      medium: "0.2s",
      slow: "0.3s",
    },
    moderate: {
      fast: "0.2s",
      medium: "0.3s",
      slow: "0.5s",
    },
    extensive: {
      fast: "0.3s",
      medium: "0.5s",
      slow: "0.8s",
    },
  }
  
  // Shadow values for different effects
  export const shadowValues = {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    glassmorphism: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    neumorphic: "5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff",
    "neumorphic-inset": "inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff",
  }
  
  // Gradient presets
  export const gradientPresets = {
    primary: "linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 50%, var(--primary-dark) 100%)",
    secondary: "linear-gradient(135deg, var(--secondary-light) 0%, var(--secondary) 50%, var(--secondary-dark) 100%)",
    accent: "linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 50%, var(--accent-dark) 100%)",
    vibrant: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)",
    cool: "linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)",
    warm: "linear-gradient(135deg, #F6D365 0%, #FDA085 100%)",
    sunset: "linear-gradient(135deg, #FF512F 0%, #F09819 100%)",
    ocean: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
    forest: "linear-gradient(135deg, #11998E 0%, #38EF7D 100%)",
    nightfall: "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
  }
  
  // Neon effect presets
  export const neonEffects = {
    primary: "0 0 5px rgba(66, 99, 235, 0.5), 0 0 20px rgba(66, 99, 235, 0.3)",
    secondary: "0 0 5px rgba(24, 178, 148, 0.5), 0 0 20px rgba(24, 178, 148, 0.3)",
    accent: "0 0 5px rgba(124, 58, 237, 0.5), 0 0 20px rgba(124, 58, 237, 0.3)",
    vibrant: "0 0 7px rgba(255, 106, 136, 0.7), 0 0 25px rgba(255, 106, 136, 0.5)",
    cool: "0 0 7px rgba(139, 198, 236, 0.7), 0 0 25px rgba(139, 198, 236, 0.5)",
    warm: "0 0 7px rgba(246, 211, 101, 0.7), 0 0 25px rgba(246, 211, 101, 0.5)",
  }
  
  // Z-index values for consistent layering
  export const zIndexValues = {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
    toast: 1700,
  }
  