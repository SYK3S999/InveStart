import Link from "next/link"
import Image from "next/image"
import { Building, Cpu, Leaf, Users } from "lucide-react"
import { calculateProgress } from "@/lib/utils"
import type { Project } from "@/lib/storage"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = calculateProgress(project.raised.cash, project.goal.cash)

  const getCategoryIcon = () => {
    switch (project.category) {
      case "صناعة":
        return <Building className="h-5 w-5" />
      case "تكنولوجيا":
        return <Cpu className="h-5 w-5" />
      case "زراعة":
        return <Leaf className="h-5 w-5" />
      case "خدمات":
        return <Users className="h-5 w-5" />
      default:
        return <Building className="h-5 w-5" />
    }
  }

  const getCategoryColor = () => {
    switch (project.category) {
      case "صناعة":
        return "bg-primary-100 text-primary-800"
      case "تكنولوجيا":
        return "bg-secondary-100 text-secondary-800"
      case "زراعة":
        return "bg-green-100 text-green-800"
      case "خدمات":
        return "bg-accent-100 text-accent-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="card card-hover">
      <div className="relative h-48">
        <Image
          src={project.images[0] || "/placeholder.svg?height=400&width=600"}
          alt={project.title}
          fill
          className="object-cover"
        />
        <Badge className={`absolute top-2 left-2 flex items-center gap-1 ${getCategoryColor()}`} variant="outline">
          {getCategoryIcon()}
          {project.category}
        </Badge>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 line-clamp-1">{project.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{new Intl.NumberFormat("ar-DZ").format(project.raised.cash)} دج</span>
            <span className="text-muted-foreground">{new Intl.NumberFormat("ar-DZ").format(project.goal.cash)} دج</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">{project.messages.length} رسالة</span>
            <span className="text-xs font-medium text-primary">{progress}%</span>
          </div>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="block w-full text-center bg-primary hover:bg-primary-600 text-white py-2.5 rounded-md transition-colors font-medium"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  )
}

