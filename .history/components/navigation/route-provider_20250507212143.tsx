"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAuth } from "@/lib/authContext"
import {
  getRoutesByRole,
  getNavbarRoutes,
  getSidebarRoutes,
  getFooterRoutes,
  hasRouteAccess,
  type RouteConfig,
} from "@/app/routes"

type RouteContextType = {
  routes: RouteConfig[]
  navbarRoutes: RouteConfig[]
  sidebarRoutes: RouteConfig[]
  footerRoutes: RouteConfig[]
  hasAccess: (path: string) => boolean
}

const RouteContext = createContext<RouteContextType | undefined>(undefined)

export function RouteProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  // Default to public routes if user is not authenticated
  const role = user?.role || "public"

  const routes = getRoutesByRole(role)
  const navbarRoutes = getNavbarRoutes(role)
  const sidebarRoutes = getSidebarRoutes(role)
  const footerRoutes = getFooterRoutes(role)

  const hasAccess = (path: string) => hasRouteAccess(path, role)

  return (
    <RouteContext.Provider
      value={{
        routes,
        navbarRoutes,
        sidebarRoutes,
        footerRoutes,
        hasAccess,
      }}
    >
      {children}
    </RouteContext.Provider>
  )
}

export function useRoutes() {
  const context = useContext(RouteContext)
  if (context === undefined) {
    throw new Error("useRoutes must be used within a RouteProvider")
  }
  return context
}
