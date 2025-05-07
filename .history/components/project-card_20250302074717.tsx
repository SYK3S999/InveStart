import Link from "next/link"
import Image from "next/image"
import { Building, Cpu, Leaf, Users, Clock, MessageCircle } from "lucide-react"
import { calculateProgress } from "@/lib/utils"
import type { Project } from "@/lib/storage"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = calculateProgress(project.raised.cash, project.goal.cash)
  const progressColor = progress < 30 ? "bg-amber-500" : progress < 70 ? "bg-blue-500" : "bg-emerald-500"

  const getCategoryIcon = () => {
    switch (project.category) {
      case "صناعة":
        return <Building className="h-4 w-4" />
      case "تكنولوجيا":
        return <Cpu className="h-4 w-4" />
      case "زراعة":
        return <Leaf className="h-4 w-4" />
      case "خدمات":
        return <Users className="h-4 w-4" />
      default:
        return <Building className="h-4 w-4" />
    }
  }

  const getCategoryColor = () => {
    switch (project.category) {
      case "صناعة":
        return "bg-primary-100 text-primary-800 border-primary-200"
      case "تكنولوجيا":
        return "bg-secondary-100 text-secondary-800 border-secondary-200"
      case "زراعة":
        return "bg-green-100 text-green-800 border-green-200"
      case "خدمات":
        return "bg-accent-100 text-accent-800 border-accent-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const timeLeft = "30 يوم" // This would be calculated from project data

  return (
    <motion.div 
      className="group overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={project.images[0] || "/placeholder.svg?height=400&width=600"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge 
            className={`flex items-center gap-1.5 px-3 py-1.5 border ${getCategoryColor()} backdrop-blur-sm shadow-sm`} 
            variant="outline"
          >
            {getCategoryIcon()}
            {project.category}
          </Badge>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{timeLeft}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{project.messages.length} رسالة</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 line-clamp-1 text-gray-800">{project.title}</h3>
        <p className="text-muted-foreground text-sm mb-5 line-clamp-2">{project.description}</p>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">تم جمع</span>
              <span className="font-bold text-gray-800">{new Intl.NumberFormat("ar-DZ").format(project.raised.cash)} دج</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground">الهدف</span>
              <span className="font-medium text-gray-600">{new Intl.NumberFormat("ar-DZ").format(project.goal.cash)} دج</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className={`${progressColor} h-2 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${progress}%` }}></div>
          </div>
          
          <div className="mt-2 text-center">
            <span className="inline-block px-3 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-700">
              تم تحقيق <span className="text-primary font-bold">{progress}%</span> من الهدف
            </span>
          </div>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="block w-full text-center bg-primary hover:bg-primary-700 text-white py-3 rounded-lg transition-colors font-medium shadow-sm hover:shadow group relative overflow-hidden"
        >
          <span className="relative z-10">عرض التفاصيل</span>
          <span className="absolute inset-0 bg-primary-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
        </Link>
      </div>
    </motion.div>
  )
}