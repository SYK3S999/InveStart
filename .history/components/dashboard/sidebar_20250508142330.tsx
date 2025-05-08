'use client'

import { FileText, Flag, Layers, TrendingUp, Users, Clock } from "lucide-react"

interface User {
  role: string
}

interface SidebarProps {
  user: User | null | undefined
}

const Sidebar = ({ user }: SidebarProps) => {
  let sidebarItems = [
    {
      name: "الرئيسية",
      href: "/",
      icon: <Layers className="h-5 w-5" />,
    },
  ]

  const roleBasedItems = () => {
    let items: any[] = []

    if (user?.role === "startup") {
      items = [
        ...items,
        {
          name: "مشاريعي",
          href: "/projects/my",
          icon: <Layers className="h-5 w-5" />,
        },
        {
          name: "العقود",
          href: "/contracts",
          icon: <FileText className="h-5 w-5" />,
        },
      ]
    }

    if (user?.role === "sponsor") {
      items = [
        ...items,
        {
          name: "استثماراتي",
          href: "/investments",
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          name: "العقود",
          href: "/contracts",
          icon: <FileText className="h-5 w-5" />,
        },
      ]
    }

    if (user?.role === "admin") {
      items = [
        ...items,
        {
          name: "المستخدمون",
          href: "/users",
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: "المشاريع المعلقة",
          href: "/projects/pending",
          icon: <Clock className="h-5 w-5" />,
        },
        {
          name: "التقارير",
          href: "/reports",
          icon: <Flag className="h-5 w-5" />,
        },
        {
          name: "العقود",
          href: "/contracts",
          icon: <FileText className="h-5 w-5" />,
        },
      ]
    }

    return items
  }

  sidebarItems = [...sidebarItems, ...roleBasedItems()]

  return (
    <div className="w-64 bg-gray-100 h-full p-4">
      <ul>
        {sidebarItems.map((item, index) => (
          <li key={index} className="mb-2">
            <a href={item.href} className="flex items-center">
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
