"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Twitter, Instagram, Linkedin, Clock } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle")
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated form submission
    if (formData.name && formData.email && formData.message) {
      setFormStatus("success")
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setFormStatus("idle"), 3000)
    } else {
      setFormStatus("error")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  return (
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
            اتصل بنا
          </motion.h1>

          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-300 mb-6">نحن هنا لمساعدتك</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                سواء كنت تحتاج إلى مساعدة في استخدام المنصة أو لديك أسئلة حول كيفية عمل التمويل الجماعي، فريقنا جاهز
                للإجابة على جميع استفساراتك.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Phone className="text-primary-500 dark:text-primary-400 mr-3 h-5 w-5" />
                  <span className="text-gray-600 dark:text-gray-300">+213 123 456 789</span>
                </div>
                <div className="flex items-center">
                  <Mail className="text-primary-500 dark:text-primary-400 mr-3 h-5 w-5" />
                  <span className="text-gray-600 dark:text-gray-300">support@investart.dz</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-primary-500 dark:text-primary-400 mr-3 h-5 w-5" />
                  <span className="text-gray-600 dark:text-gray-300">قالمة، الجزائر</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-primary-500 dark:text-primary-400 mr-3 h-5 w-5" />
                  <span className="text-gray-600 dark:text-gray-300">الإثنين - الجمعة: 9:00 ص - 5:00 م</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-600 dark:text-primary-300 mb-4">تابعنا</h3>
                <div className="flex gap-4">
                  <a
                    href="https://twitter.com/investart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-all duration-300"
                    aria-label="تابعنا على تويتر"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a
                    href="https://linkedin.com/company/investart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-all duration-300"
                    aria-label="تابعنا على لينكدإن"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a
                    href="https://instagram.com/investart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-all duration-300"
                    aria-label="تابعنا على إنستغرام"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-primary-100 dark:border-primary-800"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-primary-600 dark:text-primary-300 mb-6">أرسل لنا رسالة</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الاسم
                  </label>
                  <Input
                    id="name"
                    placeholder="أدخل اسمك"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-gray-800 border-primary-200 dark:border-primary-700 text-gray-900 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    البريد الإلكتروني
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-gray-800 border-primary-200 dark:border-primary-700 text-gray-900 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الرسالة
                  </label>
                  <Textarea
                    id="message"
                    placeholder="اكتب رسالتك هنا"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-gray-800 border-primary-200 dark:border-primary-700 text-gray-900 dark:text-gray-200"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary-500 dark:bg-primary-600 text-white dark:text-white rounded-full px-6 py-3 hover:bg-primary-600 dark:hover:bg-primary-700 shadow-md transition-all duration-300"
                >
                  إرسال الرسالة
                </Button>
                {formStatus === "success" && (
                  <div role="alert" className="mt-4 p-4 rounded-md border bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-600 dark:text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                    </svg>
                    <p className="text-sm text-green-700 dark:text-green-300">
                    تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.
                    </p>
                  </div>
                  </div>
                )}
                {formStatus === "error" && (
                  <div role="alert" className="mt-4 p-4 rounded-md border bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-2">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-red-600 dark:text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                    </svg>
                    <p className="text-sm text-red-700 dark:text-red-300">
                    الرجاء ملء جميع الحقول المطلوبة.
                    </p>
                  </div>
                  </div>
                )}
                
              </form>
            </motion.div>
          </div>

          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-300 mb-6 text-center">
              موقعنا في قالمة
            </h2>
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
              <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12825.451942345084!2d7.423086981831056!3d36.46217349999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f05c1f2e59136f%3A0x5f7458bee8562830!2sGuelma!5e0!3m2!1sen!2sdz!4v1637000000000!5m2!1sen!2sdz"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-300 mb-6">الأسئلة الشائعة</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              قبل الاتصال بنا، يمكنك الاطلاع على قسم الأسئلة الشائعة للحصول على إجابات سريعة لأكثر الاستفسارات شيوعًا.
            </p>
            <Button
              className="bg-primary-500 dark:bg-primary-600 text-white dark:text-white rounded-full px-6 py-3 hover:bg-primary-600 dark:hover:bg-primary-700 shadow-md transition-all duration-300"
              asChild
            >
              <a href="/faq" aria-label="الأسئلة الشائعة">الأسئلة الشائعة</a>
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}