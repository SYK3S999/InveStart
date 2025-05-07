"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import ProtectedRoute from "@/components/protected-route"

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    siteName: "",
    description: "",
    contactEmail: "",
    termsOfService: "",
    privacyPolicy: "",
  })

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData)
    // Add logic to update site settings
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Navbar />
        <main className="flex-1 py-12 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary-500 mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              إعدادات الموقع
            </motion.h1>
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-lg p-8 border border-primary-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-6">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                    اسم الموقع
                  </label>
                  <Input id="siteName" name="siteName" value={formData.siteName} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    وصف الموقع
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني للتواصل
                  </label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="termsOfService" className="block text-sm font-medium text-gray-700 mb-1">
                    شروط الخدمة
                  </label>
                  <Textarea
                    id="termsOfService"
                    name="termsOfService"
                    value={formData.termsOfService}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="privacyPolicy" className="block text-sm font-medium text-gray-700 mb-1">
                    سياسة الخصوصية
                  </label>
                  <Textarea
                    id="privacyPolicy"
                    name="privacyPolicy"
                    value={formData.privacyPolicy}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  حفظ التغييرات
                </Button>
              </div>
            </motion.form>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
