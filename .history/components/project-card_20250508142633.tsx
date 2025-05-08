'use client'

import Image from "next/image"
import { Building, Cpu, Leaf, Users, Clock, MessageCircle, Heart, Share2 } from "lucide-react"
import { calculateProgress } from "@/lib/utils"
import type { Project } from "@/lib/storage"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const progress = calculateProgress(project.raised.cash, project.goal.cash)
  
  // Enhanced progress color with smoother gradient
  const getProgressColor = () => {
    if (progress < 30) return "from-amber-400 to-amber-500"
    if (progress < 70) return "from-blue-400 to-blue-500"
    return "from-emerald-400 to-emerald-500"
  }

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
        return "bg-primary-100/80 text-primary-800 border-primary-200 backdrop-blur-md"
      case "تكنولوجيا":
        return "bg-secondary-100/80 text-secondary-800 border-secondary-200 backdrop-blur-md"
      case "زراعة":
        return "bg-green-100/80 text-green-800 border-green-200 backdrop-blur-md"
      case "خدمات":
        return "bg-accent-100/80 text-accent-800 border-accent-200 backdrop-blur-md"
      default:
        return "bg-gray-100/80 text-gray-800 border-gray-200 backdrop-blur-md"
    }
  }

  const timeLeft = "30 يوم" // This would be calculated from project data
  const percentageToShow = Math.min(100, progress) // Ensure progress doesn't exceed 100% visually

  return (
    <motion.div 
      className={cn(
        "group overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100",
        featured && "md:col-span-2 lg:col-span-2"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className={cn("relative overflow-hidden", featured ? "h-64" : "h-52")}>
        <Image
          src={project.images[0] || "/placeholder.svg?height=400&width=600"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
        
        {/* Badge positioning */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          <Badge 
            className={`flex items-center gap-1.5 px-3 py-1.5 border ${getCategoryColor()} shadow-sm font-medium`} 
            variant="outline"
          >
            {getCategoryIcon()}
            {project.category}
          </Badge>
          
          {/* Featured badge */}
          {featured && (
            <Badge className="bg-primary/90 text-white border-none shadow-sm backdrop-blur-md py-1 px-3">
              مشروع مميز
            </Badge>
          )}
        </div>
        
        {/* Bottom info bar, always visible but more pronounced on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{timeLeft}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{project.messages.length} رسالة</span>
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-red-400 transition-colors"
              >
                <Heart className="h-4 w-4" />
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-1.5 line-clamp-1 text-gray-800 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
        </div>

        <div className="pt-1">
          <div className="flex justify-between text-sm mb-2.5">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">تم جمع</span>
              <span className="font-bold text-gray-800">{new Intl.NumberFormat("ar-DZ").format(project.raised.cash)} دج</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground">الهدف</span>
              <span className="font-medium text-gray-600">{new Intl.NumberFormat("ar-DZ").format(project.goal.cash)} دج</span>
            </div>
          </div>
          
          {/* Enhanced progress bar with gradient */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className={`bg-gradient-to-r ${getProgressColor()} h-2.5 rounded-full`} 
              initial={{ width: "0%" }}
              animate={{ width: `${percentageToShow}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            ></motion.div>
          </div>
          
          <div className="mt-2.5 text-center">
            <span className="inline-block px-4 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-700 shadow-sm">
              تم تحقيق <span className="text-primary font-bold">{progress}%</span> من الهدف
            </span>
          </div>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="block w-full text-center bg-primary hover:bg-primary-700 text-white py-3.5 rounded-xl transition-all duration-300 font-medium shadow-sm hover:shadow-md group relative overflow-hidden"
        >
          <span className="relative z-10">عرض التفاصيل</span>
          <motion.span 
            className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          ></motion.span>
        </Link>
      </div>
    </motion.div>
  )
}