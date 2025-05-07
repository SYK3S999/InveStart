"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import { CheckCircle, XCircle, Eye, FileText, Calendar, Building } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProtectedRoute from "@/components/protected-route"

// Mock pending projects data
const mockPendingProjects = [
  {
    id: 101,
    title: "تطبيق توصيل الطعام",
    description: "منصة لتوصيل الطعام من المطاعم المحلية إلى المنازل بسرعة وكفاءة",
    category: "تكنولوجيا",
    goal: 500000,
    submittedBy: "شركة التوصيل السريع",
    submittedDate: "2023-10-15",
    documents: [
      { name: "خطة العمل.pdf", status: "قيد التحقق" },
      { name: "دراسة الجدوى.pdf", status: "قيد التحقق" },
    ],
    image: "/placeholder.svg?height=400&width=600&text=تطبيق_توصيل",
  },
  {
    id: 102,
    title: "مشروع زراعي مستدام",
    description: "زراعة محاصيل عضوية باستخدام تقنيات الزراعة المائية الحديثة",
    category: "زراعة",
    goal: 750000,
    submittedBy: "مزارع المستقبل",
    submittedDate: "2023-10-10",
    documents: [
      { name: "خطة المشروع.pdf", status: "قيد التحقق" },
      { name: "تراخيص الزراعة.pdf", status: "تمت المصادقة" },
    ],
    image: "/placeholder.svg?height=400&width=600&text=مشروع_زراعي",
  },
  {
    id: 103,
    title: "منصة تعليمية تفاعلية",
    description: "منصة تعليمية تفاعلية للطلاب في المراحل الابتدائية والمتوسطة",
    category: "تكنولوجيا",
    goal: 350000,
    submittedBy: "شركة التعليم الذكي",
    submittedDate: "2023-10-18",
    documents: [
      { name: "خطة التطوير.pdf", status: "قيد التحقق" },
      { name: "نموذج أولي.pdf", status: "قيد التحقق" },
    ],
    image: "/placeholder.svg?height=400&width=600&text=منصة_تعليمية",
  },
  {
    id: 104,
    title: "مصنع ملابس محلية",
    description: "مصنع لإنتاج ملابس تقليدية بتصاميم عصرية للسوق المحلي والتصدير",
    category: "صناعة",
    goal: 1200000,
    submittedBy: "أزياء الأصالة",
    submittedDate: "2023-10-05",
    documents: [
      { name: "خطة التصنيع.pdf", status: "قيد التحقق" },
      { name: "دراسة السوق.pdf", status: "قيد التحقق" },
    ],
    image: "/placeholder.svg?height=400&width=600&text=مصنع_ملابس",
  },
]

type Project = {
  id: number
  title: string
  description: string
  category: string
  goal: number
  submittedBy: string
  submittedDate: string
  documents: { name: string; status: string }[]
  image: string
}

export default function PendingProjectsPage() {
  const { user } = useAuth()
  const [pendingProjects, setPendingProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    // In a real app, you would fetch pending projects from an API
    // For now, we'll use the mock data
    setPendingProjects(mockPendingProjects)
  }, [])

  const filteredProjects = pendingProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all" || project.category === categoryFilter),
  )

  const handleApproveProject = (projectId: number) => {
    // In a real app, you would call an API to approve the project
    alert(`تمت الموافقة على المشروع رقم ${projectId}`)
    // Update the local state to remove the approved project
    setPendingProjects(pendingProjects.filter((project) => project.id !== projectId))
  }

  const handleRejectProject = (projectId: number) => {
    // In a real app, you would call an API to reject the project
    alert(`تم رفض المشروع رقم ${projectId}`)
    // Update the local state to remove the rejected project
    setPendingProjects(pendingProjects.filter((project) => project.id !== projectId))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "تكنولوجيا":
        return "💻"
      case "زراعة":
        return "🌱"
      case "صناعة":
        return "🏭"
      case "خدمات":
        return "🛎️"
      default:
        return "📋"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Navbar />
        <main className="flex-1 py-12 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary-500 mb-10 md:mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              المشاريع المعلقة
            </motion.h1>

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="البحث عن مشروع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-1/2"
              />
              <select
                className="border border-primary-200 rounded-lg px-3 py-2 text-primary-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">جميع الفئات</option>
                <option value="تكنولوجيا">تكنولوجيا</option>
                <option value="زراعة">زراعة</option>
                <option value="صناعة">صناعة</option>
                <option value="خدمات">خدمات</option>
              </select>
            </div>

            {/* Pending Projects List */}
            {filteredProjects.length > 0 ? (
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 relative h-auto md:h-full">
                        <Image
                          src={project.image || "/placeholder.svg?height=400&width=600"}
                          alt={project.title}
                          width={300}
                          height={200}
                          className="object-cover w-full h-48 md:h-full"
                        />
                      </div>
                      <div className="p-6 md:w-3/4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div className="flex items-center gap-2 mb-2 md:mb-0">
                            <span className="text-xl">{getCategoryIcon(project.category)}</span>
                            <h2 className="text-xl font-bold text-primary-500">{project.title}</h2>
                            <span className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800 border border-amber-200">
                              قيد المراجعة
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{project.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-primary-500" />
                            <span className="text-sm font-medium text-gray-500">المؤسس:</span>
                            <span>{project.submittedBy}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary-500" />
                            <span className="text-sm font-medium text-gray-500">تاريخ التقديم:</span>
                            <span>{new Date(project.submittedDate).toLocaleDateString("ar-DZ")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary-500" />
                            <span className="text-sm font-medium text-gray-500">الوثائق:</span>
                            <span>{project.documents.length}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.documents.map((doc, index) => (
                            <div
                              key={index}
                              className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center gap-1"
                            >
                              <FileText className="h-3 w-3" />
                              {doc.name}
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                            <Link href={`/projects/${project.id}`}>
                              <Eye className="h-4 w-4" />
                              عرض التفاصيل
                            </Link>
                          </Button>
                          <Button
                            onClick={() => handleApproveProject(project.id)}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            الموافقة على المشروع
                          </Button>
                          <Button
                            onClick={() => handleRejectProject(project.id)}
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            رفض المشروع
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-primary-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">لا توجد مشاريع معلقة</h3>
                <p className="text-gray-500 mb-6">تمت مراجعة جميع المشاريع المقدمة</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("all")
                  }}
                >
                  تحديث القائمة
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
