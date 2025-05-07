"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { User, Briefcase } from "lucide-react"
import { StartupRegistrationForm } from "@/components/startup-registration-form"
// import SponsorRegistrationForm from its correct path if it exists, e.g.:
import { SponsorRegistrationForm } from "@/components/ui/sponsor-registration-form"

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<"startup" | "sponsor" | null>(null)

  return (
    <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
      <Navbar />
      <main className="flex-1 py-12 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl relative z-10">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 border border-primary-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-center text-primary-500 mb-8">إنشاء حساب جديد</h1>
            {!role ? (
              <div>
                <p className="text-center mb-6">اختر نوع الحساب الذي تريد إنشاءه:</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => setRole("startup")} className="flex items-center justify-center">
                    <Briefcase className="mr-2" />
                    مشروع ناشئ
                  </Button>
                  <Button onClick={() => setRole("sponsor")} className="flex items-center justify-center">
                    <User className="mr-2" />
                    راعي / مستثمر
                  </Button>
                </div>
              </div>
            ) : role === "startup" ? (
              <StartupRegistrationForm onComplete={() => router.push("/dashboard/startup")} />
            ) : (
              <SponsorRegistrationForm onComplete={() => router.push("/dashboard/sponsor")} />
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
