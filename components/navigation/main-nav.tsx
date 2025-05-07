"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRoutes } from "@/components/navigation/route-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/authContext"
import { Badge } from "@/components/ui/badge"

export function MainNav() {
  const pathname = usePathname()
  const { navbarRoutes } = useRoutes()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 space-x-reverse">
      {navbarRoutes.map((item) => {
        // Skip login/register links if user is logged in
        if (user && (item.path === "/login" || item.path === "/register")) {
          return null
        }

        // Skip dashboard link if user is not logged in
        if (!user && item.path === "/dashboard") {
          return null
        }

        const isActive = pathname === item.path

        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center",
              isActive
                ? "text-primary bg-primary-50 shadow-sm"
                : "text-foreground hover:text-primary hover:bg-primary-50/50",
            )}
          >
            {item.label}
            {item.isNew && (
              <Badge variant="outline" className="mr-2 bg-accent text-accent-foreground">
                جديد
              </Badge>
            )}
          </Link>
        )
      })}

      {/* Authentication buttons */}
      {!user && (
        <div className="flex items-center gap-3 mr-4">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <Link href="/register">التسجيل</Link>
          </Button>
          <Button
            asChild
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary-dark transition-all duration-300 hover:shadow-[var(--neon-primary)]"
          >
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
        </div>
      )}
    </nav>
  )
}
