"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import { Edit, Plus, Eye, BarChart3, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { calculateProgress } from "@/lib/utils"
import { getProjects, Project } from "@/lib/storage"
import ProtectedRoute from "@/components/protected-route"

export default function MyProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const allProjects = getProjects()
    setProjects(allProjects)
  }, [])

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || getProjectStatus(project) === statusFilter),
  )

  const getProjectStatus = (project: Project) => {
    const progress = calculateProgress(
      project.raised.equipment ? project.raised.equipment.quantity : 0,
      project.goal.equipment ? project.goal.equipment.quantity : 0
    )
    if (progress >= 100) return "مكتمل"
    if (progress > 0) return "جاري التزويد"
    return "جديد"
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "مكتمل":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700"
      case "جاري التزويد":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700"
      case "جديد":
        return "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700"
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["startup"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-primary-900 dark:text-gray-200">
        <Navbar />
        <main className="flex-1 py-12 sm:px-16 lg:px-8 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary-600 dark:text-primary-400 mb-10 md:mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              مشاريعي
            </motion.h1>

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="البحث عن مشروع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-1/2 bg-white dark:bg-gray-800 text-primary-900 dark:text-gray-200 border-primary-200 dark:border-primary-700 focus:ring-primary-400 dark:focus:ring-primary-500 focus:border-primary-400 dark:focus:border-primary-500 rounded-lg"
              />
              <select
                className="border border-primary-200 dark:border-primary-700 rounded-lg px-3 py-2 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">جميع الحالات</option>
                <option value="جديد">جديد</option>
                <option value="جاري التزويد">جاري التزويد</option>
                <option value="مكتمل">مكتمل</option>
              </select>
              <Button asChild className="md:mr-auto bg-primary-500 dark:bg-primary-600 text-white dark:text-gray-200 hover:bg-primary-600 dark:hover:bg-primary-500 rounded-lg">
                <Link href="/projects/submit" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  مشروع جديد
                </Link>
              </Button>
            </div>

            {/* Projects List */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const progress = calculateProgress(
                    project.raised.equipment ? project.raised.equipment.quantity : 0,
                    project.goal.equipment ? project.goal.equipment.quantity : 0
                  )
                  const status = getProjectStatus(project)

                  return (
                    <motion.div
                      key={project.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-primary-100 dark:border-primary-700"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="relative h-40">
                        <Image
                          src={project.images[0] || "/placeholder.svg?height=400&width=600"}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-3 py-1 rounded-full text-sm border ${getStatusClass(status)}`}>
                            {status}{project.blockchainVerified ? " (موثق)" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400 mb-2">{project.title}</h3>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                            <span>
                              {project.raised.equipment ? `${project.raised.equipment.quantity} وحدة ${project.raised.equipment.type}` : "0 وحدة"}
                            </span>
                            <span>
                              {project.goal.equipment ? `${project.goal.equipment.quantity} وحدة ${project.goal.equipment.type}` : "غير محدد"}
                            </span>
                          </div>
                          <div className="w-full bg-primary-200 dark:bg-primary-900 rounded-full h-2">
                            <div className="bg-primary-400 dark:bg-primary-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                          </div>
                          <div className="flex justify-end text-xs text-gray-500 dark:text-gray-400 mt-1">{progress}% مكتمل</div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">{project.description}</p>
                        <div className="flex justify-between">
                          <div className="flex gap-1">
                            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 px-2 py-1 border-primary-500 dark:border-primary-600 text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900">
                              <Link href={`/projects/${project.id}`}>
                                <Eye className="h-3 w-3" />
                                عرض
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 px-2 py-1 border-primary-500 dark:border-primary-600 text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900">
                              <Link href={`/projects/${project.id}/edit`}>
                                <Edit className="h-3 w-3" />
                                تعديل
                              </Link>
                            </Button>
                          </div>
                          <div className="flex gap-1">
                            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 px-2 py-1 border-primary-500 dark:border-primary-600 text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900">
                              <Link href={`/projects/${project.id}?tab=messages`}>
                                <MessageSquare className="h-3 w-3" />
                                <span className="text-xs">{project.messages.length}</span>
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="flex items-center gap-1 px-2 py-1 border-primary-500 dark:border-primary-600 text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900">
                              <Link href={`/projects/stats/${project.id}`}>
                                <BarChart3 className="h-3 w-3" />
                                إحصائيات
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg">
                <div className="h-20 w-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">لا توجد مشاريع</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">لم تقم بإنشاء أي مشاريع بعد</p>
                <Button asChild className="bg-primary-500 dark:bg-primary-600 text-white dark:text-gray-200 hover:bg-primary-600 dark:hover:bg-primary-500 rounded-lg">
                  <Link href="/projects/submit">إنشاء مشروع جديد</Link>
                </Button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}