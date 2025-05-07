"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRoutes } from "@/components/navigation/route-provider"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Bell,
  BarChart,
  Calendar,
  PlusCircle,
  AlertTriangle,
  TrendingUp,
  Flag,
  Database,
} from "lucide-react"

// Map of route paths to icons
const iconMap = {
  "/dashboard": <LayoutDashboard className="h-5 w-5 ml-2" />,
  "/dashboard/startup": <LayoutDashboard className="h-5 w-5 ml-2" />,
  "/dashboard/sponsor": <LayoutDashboard className="h-5 w-5 ml-2" />,
  "/dashboard/admin": <LayoutDashboard className="h-5 w-5 ml-2" />,
  "/projects/my": <Briefcase className="h-5 w-5 ml-2" />,
  "/projects/submit": <PlusCircle className="h-5 w-5 ml-2" />,
  "/projects/pending": <AlertTriangle className="h-5 w-5 ml-2" />,
  "/investments": <TrendingUp className="h-5 w-5 ml-2" />,
  "/messages": <MessageSquare className="h-5 w-5 ml-2" />,
  "/notifications": <Bell className="h-5 w-5 ml-2" />,
  "/analytics": <BarChart className="h-5 w-5 ml-2" />,
  "/users": <Users className="h-5 w-5 ml-2" />,
  "/reports": <Flag className="h-5 w-5 ml-2" />,
  "/calendar": <Calendar className="h-5 w-5 ml-2" />,
  "/contracts": <FileText className="h-5 w-5 ml-2" />,
  "/blockchain-explorer": <Database className="h-5 w-5 ml-2" />,
  "/blockchain-cloud-integration": <Database className="h-5 w-5 ml-2" />,
}

export function SidebarNav() {
  const pathname = usePathname()
  const { sidebarRoutes } = useRoutes()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full p-4 border-l border-border">
      <div className="space-y-1">
        {sidebarRoutes.map((item) => {
          const isActive = pathname === item.path
          const icon = iconMap[item.path as keyof typeof iconMap] || <FileText className="h-5 w-5 ml-2" />

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                isActive ? "text-primary bg-primary-light/10" : "text-foreground hover:text-primary hover:bg-muted/50",
              )}
            >
              {icon}
              <span>{item.label}</span>
              {item.badge === "unread" && (
                <Badge className="mr-auto" variant="default">
                  2
                </Badge>
              )}
              {item.badge === "new" && (
                <Badge className="mr-auto" variant="outline">
                  جديد
                </Badge>
              )}
              {item.isNew && (
                <Badge variant="outline" className="mr-auto bg-accent text-accent-foreground">
                  جديد
                </Badge>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
