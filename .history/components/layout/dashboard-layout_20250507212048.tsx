"use client"

import type { ReactNode } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SidebarNav } from "@/components/navigation/sidebar-nav"
import { Breadcrumb } from "@/components/navigation/breadcrumb"
import { RouteProvider } from "@/components/navigation/route-provider"
import { useAuth } from "@/lib/authContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface DashboardLayoutProps {
  children: ReactNode
  requireAuth?: boolean
  allowedRoles?: Array<"startup" | "sponsor" | "admin">
}

export function DashboardLayout({
  children,
  requireAuth = true,
  allowedRoles = ["startup", "sponsor", "admin"],
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && requireAuth) {
      // Redirect to login if not authenticated
      if (!user) {
        router.push("/login")
        return
      }

      // Redirect to unauthorized if not in allowed roles
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role as any)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [user, isLoading, requireAuth, allowedRoles, router])

  // Show loading state while checking authentication
  if (isLoading && requireAuth) {
    return <div>Loading...</div>
  }

  return (
    <RouteProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          {/* Sidebar - only shown for authenticated users */}
          {user && (
            <div className="hidden md:block w-64 border-l border-border">
              <SidebarNav />
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 p-6">
            <Breadcrumb />
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </RouteProvider>
  )
}
