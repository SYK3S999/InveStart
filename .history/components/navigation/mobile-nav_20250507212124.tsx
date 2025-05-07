"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRoutes } from "@/components/navigation/route-provider"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/authContext"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { navbarRoutes, sidebarRoutes } = useRoutes()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  }

  if (!mounted) {
    return null
  }

  // Combine navbar and sidebar routes for mobile
  const mobileRoutes = [
    ...navbarRoutes.filter((route) => {
      // Skip login/register links if user is logged in
      if (user && (route.path === "/login" || route.path === "/register")) {
        return false
      }
      // Skip dashboard link if user is not logged in
      if (!user && route.path === "/dashboard") {
        return false
      }
      return true
    }),
    ...sidebarRoutes,
  ]

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="p-2 rounded-lg text-foreground hover:text-primary hover:bg-muted transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
      >
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="absolute top-full left-0 right-0 z-50 mt-2 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg border-t border-border"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <div className="space-y-1">
              {mobileRoutes.map((item) => {
                const isActive = pathname === item.path

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                      isActive
                        ? "text-primary bg-primary-light/10"
                        : "text-foreground hover:text-primary hover:bg-muted/50",
                    )}
                  >
                    <span>{item.label}</span>
                    {item.badge === "unread" && <Badge variant="default">2</Badge>}
                    {item.badge === "new" ||
                      (item.isNew && (
                        <Badge variant="outline" className="bg-accent text-accent-foreground">
                          جديد
                        </Badge>
                      ))}
                  </Link>
                )
              })}
            </div>

            {/* Authentication buttons */}
            {!user && (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Link href="/register">التسجيل</Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary-dark transition-all duration-300"
                >
                  <Link href="/login">تسجيل الدخول</Link>
                </Button>
              </div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
