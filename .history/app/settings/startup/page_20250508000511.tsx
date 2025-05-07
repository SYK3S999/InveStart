"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import { User, Building, FileText, Save, Upload } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function StartupSettingsPage() {
  const { user } = useAuth()
  type SocialMedia = {
    facebook: string
    twitter: string
    linkedin: string
  }

  type FormData = {
    name: string
    email: string
    phone: string
    companyName: string
    bio: string
    address: string
    website: string
    socialMedia: SocialMedia
  }

  const [formData, setFormData] = useState<FormData>({
    name: "شركة التطوير",
    email: "contact@example.com",
    phone: "0555123456",
    companyName: "تطبيق توصيل الطعام",
    bio: "شركة ناشئة متخصصة في تطوير تطبيقات توصيل الطعام باستخدام أحدث التقنيات.",
    address: "الجزائر العاصمة، الجزائر",
    website: "www.example.com",
    socialMedia: {
      facebook: "facebook.com/example",
      twitter: "twitter.com/example",
      linkedin: "linkedin.com/company/example",
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".") as ["socialMedia", keyof SocialMedia]
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof FormData] as SocialMedia,
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // Here you would typically save the user data to an API
    alert("تم حفظ الإعدادات بنجاح!")
  }

  return (
    <ProtectedRoute allowedRoles={["startup"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Navbar />
        <main className="flex-1 py-12 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary-500 mb-10 md:mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              إعدادات الحساب
            </motion.h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100">
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex flex-col items-center">
                      <div className="relative w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                        <User className="h-16 w-16 text-primary-300" />
                        <button
                          type="button"
                          className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full shadow-md hover:bg-primary-600 transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                      </div>
                      <h2 className="text-xl font-bold text-primary-500">{formData.companyName}</h2>
                      <p className="text-sm text-gray-500">صاحب مشروع</p>
                    </div>

                    <div className="md:w-2/3 space-y-4">
                      <h3 className="text-lg font-bold text-primary-600 flex items-center">
                        <User className="mr-2 h-5 w-5" /> المعلومات الشخصية
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            الاسم الكامل
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            البريد الإلكتروني
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            رقم الهاتف
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                            اسم المشروع
                          </label>
                          <Input
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                          نبذة تعريفية
                        </label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows={4}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-primary-100" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-primary-600 flex items-center">
                      <Building className="mr-2 h-5 w-5" /> معلومات المشروع
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          العنوان
                        </label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                          الموقع الإلكتروني
                        </label>
                        <Input
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <h4 className="text-md font-medium text-primary-500">وسائل التواصل الاجتماعي</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                          فيسبوك
                        </label>
                        <Input
                          id="facebook"
                          name="socialMedia.facebook"
                          value={formData.socialMedia.facebook}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                          تويتر
                        </label>
                        <Input
                          id="twitter"
                          name="socialMedia.twitter"
                          value={formData.socialMedia.twitter}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                          لينكد إن
                        </label>
                        <Input
                          id="linkedin"
                          name="socialMedia.linkedin"
                          value={formData.socialMedia.linkedin}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-primary-100" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-primary-600 flex items-center">
                      <FileText className="mr-2 h-5 w-5" /> الوثائق والمستندات
                    </h3>

                    <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
                      <p className="text-sm text-gray-600 mb-3">
                        قم بتحميل المستندات المطلوبة للتحقق من هويتك ومشروعك. يجب أن تكون جميع المستندات بصيغة PDF أو
                        JPG.
                      </p>
                      <div className="flex flex-col gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          تحميل هوية شخصية
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          تحميل سجل تجاري
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          تحميل خطة عمل
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      حفظ الإعدادات
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
