// app/register/page.tsx
"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { StartupRegistrationForm } from "@/components/startup-registration-form"
import { SponsorRegistrationForm } from "@/components/sponsor-registration-form"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, User, ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<"startup" | "sponsor" | null>(null)

  const handleRoleSelect = useCallback((selectedRole: "startup" | "sponsor") => {
    console.log(`Button clicked: ${selectedRole}`)
    setRole(selectedRole)
  }, [])

  const handleBack = useCallback(() => {
    setRole(null)
  }, [])

  return (
    <div
      lang="ar"
      dir="rtl"
      className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <Navbar />
      <main className="flex-1 py-12 md:min-h-[calc(100vh-200px)] overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-4xl relative">
          <motion.div
            className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/10 to-transparent rounded-2xl pointer-events-none" />
            <h1 className="relative text-3xl md:text-4xl font-bold text-center text-primary-700 dark:text-primary-300 mb-8 z-10">
              إنشاء حساب جديد
            </h1>
            <AnimatePresence mode="wait">
              {!role ? (
                <motion.div
                  key="role-selection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <p className="text-center mb-8 text-gray-600 dark:text-gray-400 text-lg">
                    اختر نوع الحساب الذي تريد إنشاءه
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => handleRoleSelect("startup")}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white dark:text-gray-200 hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-700 dark:hover:to-primary-800 rounded-xl py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                        aria-label="تسجيل كمشروع ناشئ"
                      >
                        <Briefcase className="h-6 w-6" />
مؤسسة ناشئة \ مؤسسة مصغرة                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => handleRoleSelect("sponsor")}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white dark:text-gray-200 hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-700 dark:hover:to-primary-800 rounded-xl py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                        aria-label="تسجيل كراعي مواد"
                      >
                        <User className="h-6 w-6" />
                        راعي المواد
                      </Button>
                    </motion.div>
                  </div>
                  <div className="text-center mt-8">
                    <Link
                      href="/login"
                      className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-sm font-medium"
                    >
                      لديك حساب؟ تسجيل الدخول
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="mb-6 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-2"
                    aria-label="العودة إلى اختيار نوع الحساب"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    العودة إلى اختيار نوع الحساب
                  </Button>
                  {role === "startup" ? (
                    <StartupRegistrationForm onComplete={() => router.push("/dashboard/startup")} />
                  ) : (
                    <SponsorRegistrationForm onComplete={() => router.push("/dashboard/sponsor")} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}