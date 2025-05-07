"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/authContext"

type ProtectedRouteProps = {
  children: React.ReactNode
  allowedRoles: ("startup" | "sponsor" | "admin")[]
  fallback?: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, fallback = null }) => {
  const { user, isLoading, hasRole } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Wait until auth state is loaded
    if (isLoading) return

    // Check if user is authenticated and has required role
    if (!user) {
      router.push("/login")
      return
    }

    // Check if user has required role
    if (!hasRole(allowedRoles)) {
      // Redirect to appropriate dashboard based on role
      if (user.role === "startup") {
        router.push("/dashboard/startup")
      } else if (user.role === "sponsor") {
        router.push("/dashboard/sponsor")
      } else if (user.role === "admin") {
        router.push("/dashboard/admin")
      } else {
        router.push("/")
      }
      return
    }

    // User is authenticated and authorized
    setIsAuthorized(true)
  }, [user, isLoading, router, allowedRoles, hasRole])

  // Show loading state or fallback while checking authorization
  if (isLoading || !isAuthorized) {
    return (
      fallback || (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )
    )
  }

  // Render children if authorized
  return <>{children}</>
}

export default ProtectedRoute
