"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type UserRole = "startup" | "sponsor" | "admin"

type User = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  hasRole: (roles: UserRole | UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demonstration purposes
const mockUsers: User[] = [
  {
    id: "1",
    name: "صاحب المشروع",
    email: "startup@example.com",
    role: "startup",
    avatar: "/placeholder.svg?height=40&width=40&text=ص",
  },
  {
    id: "2",
    name: "المستثمر",
    email: "investor@example.com",
    role: "sponsor",
    avatar: "/placeholder.svg?height=40&width=40&text=م",
  },
  {
    id: "3",
    name: "المشرف",
    email: "admin@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40&text=ا",
  },
]

// Define protected routes with their allowed roles
const protectedRoutes: Record<string, UserRole[]> = {
  "/dashboard/startup": ["startup"],
  "/dashboard/sponsor": ["sponsor"],
  "/dashboard/admin": ["admin"],
  "/contracts": ["startup", "sponsor", "admin"],
  "/projects/my": ["startup"],
  "/projects/submit": ["startup"],
  "/projects/pending": ["admin"],
  "/users": ["admin"],
  "/reports": ["admin"],
  "/investments": ["sponsor"],
  "/messages": ["startup", "sponsor", "admin"],
  "/notifications": ["startup", "sponsor", "admin"],
  "/analytics": ["startup", "sponsor", "admin"],
  "/calendar": ["startup", "sponsor", "admin"],
  "/settings/startup": ["startup"],
  "/settings/sponsor": ["sponsor"],
  "/settings/admin": ["admin"],
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Check if current route is protected and redirect if necessary
  useEffect(() => {
    if (isLoading) return

    // Find if current path matches any protected route pattern
    const matchingRoute = Object.keys(protectedRoutes).find((route) => {
      // Exact match
      if (pathname === route) return true

      // Match with dynamic segments (e.g., /projects/[id])
      if (route.includes("[") && pathname.startsWith(route.split("[")[0])) return true

      return false
    })

    if (matchingRoute) {
      const allowedRoles = protectedRoutes[matchingRoute]

      // Not authenticated or doesn't have required role
      if (!user || !allowedRoles.includes(user.role)) {
        router.push("/login")
      }
    }
  }, [pathname, user, isLoading, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

      const foundUser = mockUsers.find((u) => u.email === email)
      if (!foundUser || password !== "password") {
        // Using 'password' as the password for all mock users
        throw new Error("Invalid credentials")
      }

      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))

      // Redirect based on role
      router.push(`/dashboard/${foundUser.role}`)
    } catch (error) {
      console.error("Login error:", error)
      throw error // Re-throw the error so it can be caught in the login page
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  // Check if user has one of the specified roles
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false

    if (Array.isArray(roles)) {
      return roles.includes(user.role)
    }

    return user.role === roles
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
