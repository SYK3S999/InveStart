"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<"startup" | "fournisseur" | null>(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    bio: "",
    interests: "",
  })

  useEffect(() => {
    const roleParam = searchParams.get("role") as "startup" | "fournisseur" | null
    if (roleParam) {
      setRole(roleParam)
    } else {
      router.push("/register")
    }
  }, [searchParams, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Here you would typically save the user data
      console.log("User data:", formData)
      router.push(role === "startup" ? "/dashboard/startup" : "/dashboard/fournisseur")
    }
  }

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
            <h1 className="text-3xl font-bold text-center text-primary-500 mb-8">
              {role === "startup" ? "إعداد حساب صاحب المشروع" : "إعداد حساب المستثمر"}
            </h1>
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      s <= step ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div className="mt-2 h-1 bg-gray-200">
                <div
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                ></div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الكامل
                    </label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      {role === "startup" ? "اسم المشروع" : "اسم الشركة"}
                    </label>
                    <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
                  </div>
                </>
              )}
              {step === 2 && (
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    نبذة تعريفية
                  </label>
                  <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} required />
                </div>
              )}
              {step === 3 && (
                <div>
                  <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
                    {role === "startup" ? "مجالات المشروع" : "مجالات الاستثمار المفضلة"}
                  </label>
                  <Textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
              )}
              <Button type="submit" className="w-full bg-primary-500 text-white">
                {step < 3 ? "التالي" : "إنهاء الإعداد"}
              </Button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
