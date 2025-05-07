"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Sun, Moon, Laptop, Zap, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const themes = [
    { id: "light", name: "Light", icon: Sun },
    { id: "dark", name: "Dark", icon: Moon },
    { id: "system", name: "System", icon: Laptop },
    { id: "cyberpunk", name: "Cyberpunk", icon: Zap, className: "theme-cyberpunk" },
    { id: "neumorphic", name: "Neumorphic", icon: Layers, className: "theme-neumorphic" },
  ]

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm border border-border/50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
      >
        {themes.find((t) => t.id === theme)?.icon ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {(() => {
              const Icon = themes.find((t) => t.id === theme)?.icon || Sun
              return <Icon className="h-5 w-5" />
            })()}
          </motion.div>
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full mt-2 right-0 z-50 p-2 rounded-xl glass-card min-w-[180px] shadow-lg"
        >
          <div className="space-y-1">
            {themes.map((themeOption) => (
              <Button
                key={themeOption.id}
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${theme === themeOption.id ? "bg-primary/10 text-primary" : ""}`}
                onClick={() => handleThemeChange(themeOption.id)}
              >
                <themeOption.icon className="mr-2 h-4 w-4" />
                {themeOption.name}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
