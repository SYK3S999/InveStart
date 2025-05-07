"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { useThemeSettings } from "@/lib/theme/theme-context"
import { motion } from "framer-motion"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high"
  children: React.ReactNode
}

export function GlassCard({ intensity = "medium", className, children, ...props }: GlassCardProps) {
  const { settings } = useThemeSettings()

  if (!settings.enableGlassmorphism) {
    return (
      <div className={cn("rounded-[var(--radius)] bg-card p-4 shadow-sm", className)} {...props}>
        {children}
      </div>
    )
  }

  const intensityMap = {
    low: "bg-background/60 backdrop-blur-sm",
    medium: "bg-background/40 backdrop-blur-md",
    high: "bg-background/20 backdrop-blur-lg",
  }

  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-white/10 shadow-sm theme-transition",
        intensityMap[intensity],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high"
  children: React.ReactNode
}

export function NeumorphicCard({ intensity = "medium", className, children, ...props }: NeumorphicCardProps) {
  const { settings } = useThemeSettings()

  if (!settings.enableNeumorphism) {
    return (
      <div className={cn("rounded-[var(--radius)] bg-card p-4 shadow-sm", className)} {...props}>
        {children}
      </div>
    )
  }

  const intensityMap = {
    low: "shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.4)]",
    medium: "shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.5)]",
    high: "shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.6)]",
  }

  return (
    <div
      className={cn("rounded-[var(--radius)] bg-background theme-transition", intensityMap[intensity], className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface GradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "accent" | "custom"
  customColors?: string
  animated?: boolean
  children: React.ReactNode
}

export function GradientBackground({
  variant = "primary",
  customColors,
  animated = false,
  className,
  children,
  ...props
}: GradientBackgroundProps) {
  const { settings } = useThemeSettings()

  if (!settings.enableGradients) {
    const bgColorMap = {
      primary: "bg-primary",
      secondary: "bg-secondary",
      accent: "bg-accent",
      custom: "bg-background",
    }

    return (
      <div className={cn(bgColorMap[variant], className)} {...props}>
        {children}
      </div>
    )
  }

  const gradientMap = {
    primary: "bg-gradient-to-br from-primary to-primary/60",
    secondary: "bg-gradient-to-br from-secondary to-secondary/60",
    accent: "bg-gradient-to-br from-accent to-accent/60",
    custom: customColors || "bg-gradient-to-br from-primary to-secondary",
  }

  if (animated && settings.animationLevel !== "none") {
    return (
      <div className={cn("relative overflow-hidden theme-transition", className)} {...props}>
        <div
          className={cn(
            "absolute inset-0 theme-transition",
            gradientMap[variant],
            animated ? "animate-gradient-xy" : "",
          )}
        />
        <div className="relative z-10">{children}</div>
      </div>
    )
  }

  return (
    <div className={cn(gradientMap[variant], "theme-transition", className)} {...props}>
      {children}
    </div>
  )
}

interface NeonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "primary" | "secondary" | "accent" | "white"
  intensity?: "low" | "medium" | "high"
  children: React.ReactNode
}

export function NeonText({ color = "primary", intensity = "medium", className, children, ...props }: NeonTextProps) {
  const { settings } = useThemeSettings()

  if (!settings.enableNeonEffects) {
    const textColorMap = {
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      white: "text-white",
    }

    return (
      <div className={cn(textColorMap[color], className)} {...props}>
        {children}
      </div>
    )
  }

  const colorMap = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    white: "text-white",
  }

  const intensityMap = {
    low:
      color === "white"
        ? "text-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
        : "text-shadow-[0_0_5px_hsla(var(--primary),0.5)]",
    medium:
      color === "white"
        ? "text-shadow-[0_0_5px_rgba(255,255,255,0.5),0_0_10px_rgba(255,255,255,0.3)]"
        : "text-shadow-[0_0_5px_hsla(var(--primary),0.5),0_0_10px_hsla(var(--primary),0.3)]",
    high:
      color === "white"
        ? "text-shadow-[0_0_5px_rgba(255,255,255,0.5),0_0_10px_rgba(255,255,255,0.3),0_0_15px_rgba(255,255,255,0.2)]"
        : "text-shadow-[0_0_5px_hsla(var(--primary),0.5),0_0_10px_hsla(var(--primary),0.3),0_0_15px_hsla(var(--primary),0.2)]",
  }

  return (
    <div className={cn(colorMap[color], intensityMap[intensity], "theme-transition", className)} {...props}>
      {children}
    </div>
  )
}

interface AnimatedElementProps extends React.HTMLAttributes<HTMLDivElement> {
  animation: "fade" | "slide" | "scale" | "bounce" | "pulse" | "none"
  delay?: number
  duration?: number
  children: React.ReactNode
}

export function AnimatedElement({
  animation = "fade",
  delay = 0,
  duration = 0.5,
  className,
  children,
  ...props
}: AnimatedElementProps) {
  const { settings } = useThemeSettings()

  if (animation === "none" || settings.animationLevel === "none") {
    return (
      <div className={cn(className)} {...props}>
        {children}
      </div>
    )
  }

  const animationVariants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slide: {
      hidden: { x: -20, opacity: 0 },
      visible: { x: 0, opacity: 1 },
    },
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 },
    },
    bounce: {
      hidden: { y: -20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 15,
          delay,
          duration,
        },
      },
    },
    pulse: {
      hidden: { scale: 1 },
      visible: {
        scale: [1, 1.05, 1],
        transition: {
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          duration: 1.5,
          ease: "easeInOut",
          delay,
        },
      },
    },
  }

  const transitionDuration = {
    none: 0,
    minimal: 0.2,
    moderate: 0.5,
    extensive: 0.8,
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants[animation]}
      transition={{
        duration: animation === "pulse" ? 1.5 : transitionDuration[settings.animationLevel],
        delay,
        ease: "easeOut",
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
