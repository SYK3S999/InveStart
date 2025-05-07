"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
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
            اتصل بنا
          </motion.h1>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-primary-600 mb-6">نحن هنا لمساعدتك</h2>
              <p className="text-gray-600 mb-8">
                سواء كنت تحتاج إلى مساعدة في استخدام المنصة أو لديك أسئلة حول كيفية عمل التمويل الجماعي، فريقنا جاهز
                للإجابة على جميع استفساراتك.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="text-primary-500 mr-3" />
                  <span className="text-gray-600">+213 123 456 789</span>
                </div>
                <div className="flex items-center">
                  <Mail className="text-primary-500 mr-3" />
                  <span className="text-gray-600">support@investart.dz</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-primary-500 mr-3" />
                  <span className="text-gray-600">الجزائر العاصمة، الجزائر</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 border border-primary-100"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-primary-600 mb-6">أرسل لنا رسالة</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم
                  </label>
                  <Input id="name" placeholder="أدخل اسمك" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <Input id="email" type="email" placeholder="أدخل بريدك الإلكتروني" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    الرسالة
                  </label>
                  <Textarea id="message" placeholder="اكتب رسالتك هنا" rows={4} />
                </div>
                <Button className="w-full bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300">
                  إرسال الرسالة
                </Button>
              </form>
            </motion.div>
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary-600 mb-6">الأسئلة الشائعة</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              قبل الاتصال بنا، يمكنك الاطلاع على قسم الأسئلة الشائعة للحصول على إجابات سريعة لأكثر الاستفسارات شيوعًا.
            </p>
            <Button className="bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300">
              الأسئلة الشائعة
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
