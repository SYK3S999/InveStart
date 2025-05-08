"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutPage() {
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
            عن منصتنا
          </motion.h1>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-primary-600 mb-4">مهمتنا</h2>
              <p className="text-gray-600 mb-6">
              نسعى لتمكين رواد الأعمال والمستثمرين في الجزائر من خلال منصة تمويل جماعي آمنة وشفافة، تدعم النمو
              الاقتصادي وتعزز الابتكار في مختلف القطاعات.
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-600 mb-4">رؤيتنا</h2>
              <p className="text-gray-600">
              نطمح لأن نكون المنصة الرائدة في الجزائر والمنطقة، التي تجمع بين أصحاب الأفكار الإبداعية والمستثمرين
              الطموحين، لخلق فرص استثمارية مجزية وتحقيق تنمية مستدامة.
              </p>
            </motion.div>
            <motion.div
              className="relative h-64 md:h-96"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Image
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=384&q=80"
              alt="فريق العمل"
              fill
              className="object-cover rounded-lg shadow-lg"
              />
            </motion.div>
            </div>

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary-600 mb-6">فريقنا</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              يتكون فريقنا من خبراء في مجالات التمويل، التكنولوجيا، وريادة الأعمال. نحن ملتزمون بتقديم أفضل الخدمات
              وضمان تجربة استخدام متميزة لجميع مستخدمي المنصة.
            </p>
            <Button className="bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300">
              تعرف على فريقنا
            </Button>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 border border-primary-100"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary-600 mb-6 text-center">قيمنا</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "الشفافية", description: "نؤمن بأهمية الوضوح والصراحة في جميع تعاملاتنا" },
                { title: "الابتكار", description: "نسعى دائماً لتطوير حلول مبتكرة لتلبية احتياجات السوق" },
                { title: "النزاهة", description: "نلتزم بأعلى معايير الأخلاق والمهنية في عملنا" },
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-xl font-bold text-primary-500 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
