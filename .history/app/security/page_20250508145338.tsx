"use client";

import { BlockchainDemo } from "@/components/blockchain-demo";
import { CloudDemo } from "@/components/cloud-demo";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary-500 mb-4">
            الأمان وتنفيذ الصفقات
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            نضمن أعلى معايير الأمان والشفافية باستخدام تقنيات متطورة مثل Blockchain والتخزين السحابي.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <BlockchainDemo />
          <CloudDemo />
        </div>
      </div>
    </>
  );
}