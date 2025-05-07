"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import { AlertTriangle, CheckCircle, XCircle, MessageSquare, Flag, User, Calendar } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/ProtectedRoute"

// Mock reports data
const mockReports = [
  {
    id: 1,
    title: "مخالفة شروط الاستخدام",
    description: "المشروع يحتوي على معلومات غير دقيقة ومضللة للمستثمرين",
    reportedItem: {
      type: "project",
      id: 2,
      name: "منصة تعليم إلكتروني",
    },
    reportedBy: "مستثمر أ",
    date: "2023-10-15",
    status: "قيد المراجعة",
    priority: "عالية",
  },
  {
    id: 2,
    title: "محتوى غير لائق",
    description: "الصور المستخدمة في المشروع غير مناسبة وتحتاج إلى مراجعة",
    reportedItem: {
      type: "project",
      id: 3,
      name: "تطبيق خدمات منزلية",
    },
    reportedBy: "مستخدم ب",
    date: "2023-10-10",
    status: "تم الحل",
    priority: "متوسطة",
  },
  {
    id: 3,
    title: "مشكلة في الدفع",
    description: "لم يتم تسجيل مبلغ الاستثمار بشكل صحيح في النظام",
    reportedItem: {
      type: "payment",
      id: 5,
      name: "استثمار في مشروع زراعي",
    },
    reportedBy: "مستثمر ج",
    date: "2023-10-18",
    status: "قيد المراجعة",
    priority: "عالية",
  },
  {
    id: 4,
    title: "سلوك مسيء",
    description: "أحد المستخدمين يرسل رسائل غير لائقة عبر نظام المراسلة",
    reportedItem: {
      type: "user",
      id: 7,
      name: "مستخدم د",
    },
    reportedBy: "صاحب مشروع أ",
    date: "2023-10-05",
    status: "مرفوض",
    priority: "منخفضة",
  },
  {
    id: 5,
    title: "مشكلة تقنية",
    description: "خطأ في عرض بيانات المشروع على الصفحة الرئيسية",
    reportedItem: {
      type: "system",
      id: null,
      name: "صفحة المشاريع",
    },
    reportedBy: "مستخدم هـ",
    date: "2023-10-20",
    status: "قيد المراجعة",
    priority: "متوسطة",
  },
]

export default function ReportsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    // In a real app, you would fetch reports from an API
    // For now, we'll use the mock data
    setReports(mockReports)
  }, [])

  const filteredReports = reports.filter(
    (report) =>
      (report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedItem.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || report.status === statusFilter) &&
      (priorityFilter === "all" || report.priority === priorityFilter),
  )

  const getStatusIcon = (status) => {
    switch (status) {
      case "تم الحل":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "قيد المراجعة":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "مرفوض":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "تم الحل":
        return "bg-green-100 text-green-800 border-green-200"
      case "قيد المراجعة":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "مرفوض":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "عالية":
        return "bg-red-100 text-red-800 border-red-200"
      case "متوسطة":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "منخفضة":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleResolveReport = (reportId) => {
    // In a real app, you would call an API to resolve the report
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: "تم الحل" } : report)))
  }

  const handleRejectReport = (reportId) => {
    // In a real app, you would call an API to reject the report
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: "مرفوض" } : report)))
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
              التقارير والشكاوى
            </motion.h1>

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="البحث في التقارير..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-1/2"
              />
              <select
                className="border border-primary-200 rounded-lg px-3 py-2 text-primary-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">جميع الحالات</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
                <option value="تم الحل">تم الحل</option>
                <option value="مرفوض">مرفوض</option>
              </select>
              <select
                className="border border-primary-200 rounded-lg px-3 py-2 text-primary-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">جميع الأولويات</option>
                <option value="عالية">عالية</option>
                <option value="متوسطة">متوسطة</option>
                <option value="منخفضة">منخفضة</option>
              </select>
            </div>

            {/* Reports List */}
            {filteredReports.length > 0 ? (
              <div className="space-y-6">
                {filteredReports.map((report) => (
                  <motion.div
                    key={report.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                          <Flag className="h-5 w-5 text-primary-500" />
                          <h2 className="text-xl font-bold text-primary-500">{report.title}</h2>
                          <div className="flex gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm border ${getStatusClass(
                                report.status,
                              )} flex items-center gap-1`}
                            >
                              {getStatusIcon(report.status)}
                              {report.status}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm border ${getPriorityClass(report.priority)}`}
                            >
                              {report.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{report.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4 text-primary-500" />
                          <span className="text-sm font-medium text-gray-500">العنصر المبلغ عنه:</span>
                          <span>
                            {report.reportedItem.type === "project" ? (
                              <Link
                                href={`/projects/${report.reportedItem.id}`}
                                className="text-primary-500 hover:underline"
                              >
                                {report.reportedItem.name}
                              </Link>
                            ) : (
                              report.reportedItem.name
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary-500" />
                          <span className="text-sm font-medium text-gray-500">المبلغ:</span>
                          <span>{report.reportedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary-500" />
                          <span className="text-sm font-medium text-gray-500">تاريخ البلاغ:</span>
                          <span>{new Date(report.date).toLocaleDateString("ar-DZ")}</span>
                        </div>
                      </div>

                      {report.status === "قيد المراجعة" && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Button
                            onClick={() => handleResolveReport(report.id)}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            تم الحل
                          </Button>
                          <Button
                            onClick={() => handleRejectReport(report.id)}
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            رفض
                          </Button>
                          <Button variant="outline" className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            إرسال رد
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-primary-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">لا توجد تقارير</h3>
                <p className="text-gray-500 mb-6">لم يتم العثور على أي تقارير تطابق معايير البحث</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setPriorityFilter("all")
                  }}
                >
                  عرض جميع التقارير
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
