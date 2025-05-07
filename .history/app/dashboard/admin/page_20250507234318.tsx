"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Users, Briefcase, AlertTriangle, Settings } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"

export default function AdminDashboard() {
  const [users, setUsers] = useState({ total: 0, startups: 0, investors: 0 })
  const [projects, setProjects] = useState({ total: 0, pending: 0, active: 0 })
  type Report = { id: number; type: string; status: string }
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    // Here you would typically fetch the admin data from an API
    // For now, we'll use dummy data
    setUsers({ total: 1000, startups: 600, investors: 400 })
    setProjects({ total: 50, pending: 10, active: 40 })
    setReports([
      { id: 1, type: "مخالفة شروط الاستخدام", status: "قيد المراجعة" },
      { id: 2, type: "شكوى من مستخدم", status: "تم الحل" },
    ])
  }, [])

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
              لوحة تحكم المشرف
            </motion.h1>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                  <Users className="mr-2" /> إحصائيات المستخدمين
                </h2>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>إجمالي المستخدمين</span>
                    <span className="text-sm text-gray-500">{users.total}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>أصحاب المشاريع</span>
                    <span className="text-sm text-gray-500">{users.startups}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>المستثمرون</span>
                    <span className="text-sm text-gray-500">{users.investors}</span>
                  </li>
                </ul>
                <Button asChild className="mt-4 w-full">
                  <Link href="/users">إدارة المستخدمين</Link>
                </Button>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                  <Briefcase className="mr-2" /> إحصائيات المشاريع
                </h2>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>إجمالي المشاريع</span>
                    <span className="text-sm text-gray-500">{projects.total}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>المشاريع قيد المراجعة</span>
                    <span className="text-sm text-gray-500">{projects.pending}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>المشاريع النشطة</span>
                    <span className="text-sm text-gray-500">{projects.active}</span>
                  </li>
                </ul>
                <Button asChild className="mt-4 w-full">
                  <Link href="/projects/pending">مراجعة المشاريع المعلقة</Link>
                </Button>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                  <AlertTriangle className="mr-2" /> التقارير والشكاوى
                </h2>
                <ul className="space-y-2">
                  {reports.map((report) => (
                    <li key={report.id} className="flex justify-between items-center">
                      <span>{report.type}</span>
                      <span className="text-sm text-gray-500">{report.status}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-4 w-full">
                  <Link href="/reports">عرض جميع التقارير</Link>
                </Button>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                  <Settings className="mr-2" /> إعدادات المنصة
                </h2>
                <p className="text-gray-600 mb-4">قم بتعديل إعدادات المنصة وسياسات الاستخدام</p>
                <Button asChild className="w-full">
                  <Link href="/settings/admin">تعديل الإعدادات</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
