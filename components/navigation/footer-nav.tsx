"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRoutes } from "@/components/navigation/route-provider"

export function FooterNav() {
  const { footerRoutes } = useRoutes()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Group routes into columns for better organization
  const routeGroups = [
    footerRoutes.slice(0, Math.ceil(footerRoutes.length / 3)),
    footerRoutes.slice(Math.ceil(footerRoutes.length / 3), Math.ceil(footerRoutes.length / 3) * 2),
    footerRoutes.slice(Math.ceil(footerRoutes.length / 3) * 2),
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
      {routeGroups.map((group, index) => (
        <div key={index} className="space-y-4">
          {group.map((route) => (
            <div key={route.path}>
              <Link href={route.path} className="text-gray-600 hover:text-primary transition-colors duration-300">
                {route.label}
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
