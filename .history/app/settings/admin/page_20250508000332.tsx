"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import { User, Settings, Shield, Save, Database, Cloud, Lock, Globe } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function AdminSettingsPage() {
  const { user } = useAuth()
  type Features = {
    enableBlockchain: boolean
    enableCloudStorage: boolean
    enableMultiLanguage: boolean
    enableAnalytics: boolean
  }

  type Security = {
    twoFactorAuth: boolean
    passwordExpiry: string
    sessionTimeout: string
  }

  type Fees = {
    platformFee: string
    transactionFee: string
  }

  type FormData = {
    platformName: string
    platformDescription: string
    contactEmail: string
    supportPhone: string
    features: Features
    security: Security
    fees: Fees
  }

  const [formData, setFormData] = useState<FormData>({
    platformName: "INEVESTART",
    platformDescription: "منصة التمويل الجماعي الرائدة في الجزائر",
    contactEmail: "admin@inevestart.dz",
    supportPhone: "0555123456",
    features: {
      enableBlockchain: true,
      enableCloudStorage: true,
      enableMultiLanguage: false,
      enableAnalytics: true,
    },
    security: {
      twoFactorAuth: true,
      passwordExpiry: "90",
      sessionTimeout: "30",
    },
    fees: {
      platformFee: "5",
      transactionFee: "2.5",
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".") as [keyof FormData, string]
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent] as any),
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

  const handleSwitchChange = (name: string, checked: boolean) => {
    const [parent, child] = name.split(".")
    setFormData({
      ...formData,
      [parent]: {
        ...(formData[parent as keyof FormData] as any),
        [child]: checked,
      },
    })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // Here you would typically save the platform settings to an API
    alert("تم حفظ إعدادات المنصة بنجاح!")
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
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
              إعدادات المنصة
            </motion.h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100">
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-primary-600 flex items-center">
                      <Settings className="mr-2 h-5 w-5" /> الإعدادات العامة
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="platformName" className="block text-sm font-medium text-gray-700 mb-1">
                          اسم المنصة
                        </label>
                        <Input
                          id="platformName"
                          name="platformName"
                          value={formData.platformName}
                          onChange={handleChange}
                          className="w-full"
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
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="platformDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        وصف المنصة
                      </label>
                      <Textarea
                        id="platformDescription"
                        name="platformDescription"
                        value={formData.platformDescription}
                        onChange={handleChange}
                        rows={3}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label htmlFor="supportPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        رقم هاتف الدعم
                      </label>
                      <Input
                        id="supportPhone"
                        name="supportPhone"
                        value={formData.supportPhone}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <hr className="border-primary-100" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-primary-600 flex items-center">
                      <Shield className="mr-2 h-5 w-5" /> الميزات
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-primary-500" />
                          <div>
                            <h4 className="font-medium">تفعيل تقنية البلوكتشين</h4>
                            <p className="text-sm text-gray-500">تمكين توثيق العقود والمعاملات باستخدام البلوكتشين</p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.features.enableBlockchain}
                          onCheckedChange={(checked) => handleSwitchChange("features.enableBlockchain", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Cloud className="h-5 w-5 text-primary-500" />
                          <div>
                            <h4 className="font-medium">تفعيل التخزين السحابي</h4>
                            <p className="text-sm text-gray-500">تمكين تخزين الملفات والوثائق في السحابة</p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.features.enableCloudStorage}
                          onCheckedChange={(checked) => handleSwitchChange("features.enableCloudStorage", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-primary-500" />
                          <div>
                            <h4 className="font-medium">تفعيل تعدد اللغات</h4>
                            <p className="text-sm text-gray-500">تمكين دعم لغات متعددة في المنصة</p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.features.enableMultiLanguage}
                          onCheckedChange={(checked) => handleSwitchChange("features.enableMultiLanguage", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Settings className="h-5 w-5 text-primary-500" />
                          <div>
                            <h4 className="font-medium">تفعيل التحليلات</h4>
                            <p className="text-sm text-gray-500">تمكين تحليلات المنصة والإحصائيات</p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.features.enableAnalytics}
                          onCheckedChange={(checked) => handleSwitchChange("features.enableAnalytics", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-primary-100" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-primary-600 flex items-center">
                      <Lock className="mr-2 h-5 w-5" /> الأمان
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary-500" />
                        <div>
                          <h4 className="font-medium">تفعيل المصادقة الثنائية</h4>
                          <p className="text-sm text-gray-500">تمكين المصادقة الثنائية لجميع المستخدمين</p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.security.twoFactorAuth}
                        onCheckedChange={(checked) => handleSwitchChange("security.twoFactorAuth", checked)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                          مدة صلاحية كلمة المرور (بالأيام)
                        </label>
                        <Input
                          id="passwordExpiry"
                          name="security.passwordExpiry"
                          type="number"
                          value={formData.security.passwordExpiry}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                          مهلة انتهاء الجلسة (بالدقائق)
                        </label>
                        <Input
                          id="sessionTimeout"
                          name="security.sessionTimeout"
                          type="number"
                          value={formData.security.sessionTimeout}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-primary-100" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-primary-600 flex items-center">
                      <User className="mr-2 h-5 w-5" /> الرسوم
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="platformFee" className="block text-sm font-medium text-gray-700 mb-1">
                          رسوم المنصة (%)
                        </label>
                        <Input
                          id="platformFee"
                          name="fees.platformFee"
                          type="number"
                          value={formData.fees.platformFee}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="transactionFee" className="block text-sm font-medium text-gray-700 mb-1">
                          رسوم المعاملات (%)
                        </label>
                        <Input
                          id="transactionFee"
                          name="fees.transactionFee"
                          type="number"
                          value={formData.fees.transactionFee}
                          onChange={handleChange}
                          className="w-full"
                        />
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
