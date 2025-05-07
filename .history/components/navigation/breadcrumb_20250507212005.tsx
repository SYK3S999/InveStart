"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { allRoutes } from "@/app/routes"

export function Breadcrumb() {
  const pathname = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ path: string; label: string }>>([])

  useEffect(() => {
    const generateBreadcrumbs = () => {
      // Home is always the first breadcrumb
      const crumbs: Array<{ path: string; label: string }> = [{ path: "/", label: "الرئيسية" }]

      if (pathname === "/") {
        return crumbs
      }

      // Split the pathname into segments
      const segments = pathname.split("/").filter(Boolean)

      // Build up the breadcrumbs based on the segments
      let currentPath = ""

      segments.forEach((segment, index) => {
        currentPath += `/${segment}`

        // Check if this is a dynamic segment (starts with '[' or ':')
        if (segment.startsWith("[") || segment.startsWith(":")) {
          // This is a dynamic segment, try to find a matching route
          const dynamicRoutes = allRoutes.filter((route) => {
            const routeSegments = route.path.split("/").filter(Boolean)
            return (
              routeSegments.length === segments.length &&
              routeSegments.slice(0, index).join("/") === segments.slice(0, index).join("/")
            )
          })

          if (dynamicRoutes.length > 0) {
            // Use the first matching route's label
            crumbs.push({
              path: currentPath,
              label: dynamicRoutes[0].label,
            })
          } else {
            // Fallback to a formatted version of the segment
            crumbs.push({
              path: currentPath,
              label: segment.replace(/[[\]:]/g, ""),
            })
          }
        } else {
          // Find the matching route for this path
          const matchingRoute = allRoutes.find((route) => route.path === currentPath)

          if (matchingRoute) {
            crumbs.push({
              path: currentPath,
              label: matchingRoute.label,
            })
          } else {
            // Fallback to a formatted version of the segment
            crumbs.push({
              path: currentPath,
              label: segment.charAt(0).toUpperCase() + segment.slice(1),
            })
          }
        }
      })

      return crumbs
    }

    setBreadcrumbs(generateBreadcrumbs())
  }, [pathname])

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4">
      <ol className="flex items-center space-x-2 space-x-reverse">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && <ChevronLeft className="h-4 w-4 mx-2" />}

              {isLast ? (
                <span className="font-medium text-primary">{crumb.label}</span>
              ) : (
                <Link href={crumb.path} className="hover:text-primary transition-colors duration-300">
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
