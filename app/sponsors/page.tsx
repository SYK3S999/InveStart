"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"

export default function SponsorsPage() {
  const sponsors = [
    {
      name: "شركة الاستثمار الجزائرية",
      logo: "/placeholder.svg?height=100&width=100",
      description: "شريك استراتيجي في تمويل المشاريع الناشئة",
    },
    {
      name: "بنك التنمية المحلية",
      logo: "/placeholder.svg?height=100&width=100",
      description: "داعم رئيسي للمشاريع الصغيرة والمتوسطة",
    },
    {
      name: "صندوق الابتكار الوطني",
      logo: "/placeholder.svg?height=100&width=100",
      description: "يدعم المشاريع التكنولوجية والابتكارية",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
      <Navbar />
      <main className="flex-1 py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-center text-primary-500 mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            الرعاة والشركاء
          </motion.h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Image
                  src={sponsor.logo || "/placeholder.svg"}
                  alt={sponsor.name}
                  width={100}
                  height={100}
                  className="mb-4"
                />
                <h2 className="text-xl font-bold text-primary-600 mb-2">{sponsor.name}</h2>
                <p className="text-gray-600 text-center">{sponsor.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
