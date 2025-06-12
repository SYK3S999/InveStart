"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Briefcase, MessageSquare, FileText, Settings } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import { useTheme } from "next-themes"

type Project = { id: number; title: string; status: string }
type Message = { id: number; from: string; preview: string }
type Contract = { id: number; title: string; status: string }

export default function StartupDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Dummy data for demonstration
    setProjects([
      { id: 1, title: "مشروع تطبيق توصيل", status: "قيد التمويل" },
      { id: 2, title: "منصة تعليم إلكتروني", status: "مكتمل التمويل" },
    ])
    setMessages([
      { id: 1, from: "مستثمر 1", preview: "مهتم بمشروعكم، هل يمكننا..." },
      { id: 2, from: "مستثمر 2", preview: "أود معرفة المزيد عن خطة..." },
    ])
    setContracts([
      { id: 1, title: "عقد استثمار - مشروع 1", status: "قيد المراجعة" },
      { id: 2, title: "عقد استثمار - مشروع 2", status: "موقع" },
    ])
  }, [])

  if (!mounted) {
    return null // Prevent rendering until theme is mounted to avoid hydration mismatch
  }

  return (
    <ProtectedRoute allowedRoles={["startup"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream dark:from-gray-900 dark:to-gray-800 text-primary-900 dark:text-primary-200">
        <Navbar />
        <main className="flex-1 py-12 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary-500 dark:text-primary-400 mb-10 md:mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              لوحة تحكم صاحب المشروع
            </motion.h1>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="bg-white dark:bg-gray-900/90 rounded-xl shadow-lg p-6 border border-primary-100 dark:border-primary-200/20 backdrop-blur-sm"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-300 mb-4 flex items-center">
                  <Briefcase className="mr-2 h-6 w-6" /> مشاريعي
                </h2>
                <ul className="space-y-2">
                  {projects.map((project) => (
                    <li
                      key={project.id}
                      className="flex justify-between items-center text-primary-800 dark:text-primary-200"
                    >
                      <span>{project.title}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{project.status}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-4 w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white dark:text-white"
                >
                  <Link href="/projects/submit">إضافة مشروع جديد</Link>
                </Button>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-900/90 rounded-xl shadow-lg p-6 border border-primary-100 dark:border-primary-200/20 backdrop-blur-sm"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-300 mb-4 flex items-center">
                  <MessageSquare className="mr-2 h-6 w-6" /> الرسائل
                </h2>
                <ul className="space-y-2">
                  {messages.map((message) => (
                    <li
                      key={message.id}
                      className="flex justify-between items-center text-primary-800 dark:text-primary-200"
                    >
                      <span>{message.from}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {message.preview}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-4 w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white dark:text-white">
                  عرض جميع الرسائل
                </Button>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-900/90 rounded-xl shadow-lg p-6 border border-primary-100 dark:border-primary-200/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-300 mb-4 flex items-center">
                  <FileText className="mr-2 h-6 w-6" /> العقود
                </h2>
                <ul className="space-y-2">
                  {contracts.map((contract) => (
                    <li
                      key={contract.id}
                      className="flex justify-between items-center text-primary-800 dark:text-primary-200"
                    >
                      <span>{contract.title}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{contract.status}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-4 w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white dark:text-white"
                >
                  <Link href="/contracts">إدارة العقود</Link>
                </Button>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-900/90 rounded-xl shadow-lg p-6 border border-primary-100 dark:border-primary-200/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-300 mb-4 flex items-center">
                  <Settings className="mr-2 h-6 w-6" /> الإعدادات
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  قم بتحديث معلومات حسابك وتفضيلاتك
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white dark:text-white"
                >
                  <Link href="/settings/startup">تعديل الإعدادات</Link>
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