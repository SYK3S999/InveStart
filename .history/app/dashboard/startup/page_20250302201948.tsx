"use client";

import { getCurrentUser } from "@/lib/auth";
import { ProtectedRoute } from "@/components/protected-route";
import { initialProjects } from "@/lib/storage"; // Assuming this is exported
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StartupDashboardPage() {
  const user = getCurrentUser();
  const myProjects = initialProjects.filter((p) => p.updates.some((u) => u.content.includes(user?.email || "")));

  return (
    <ProtectedRoute allowedRole="startup-owner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary-500 mb-4">لوحة تحكم صاحب الفكرة</h1>
          <p className="text-gray-600 text-sm md:text-base">مرحبًا، {user?.email}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {myProjects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-primary-100/50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-primary-500 mb-2">{project.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              <Button
                asChild
                className="bg-primary-500 text-white rounded-full px-6 py-2 hover:bg-primary-600 transition-all duration-300"
              >
                <Link href={`/projects/${project.id}`}>عرض التفاصيل</Link>
              </Button>
            </motion.div>
          ))}
          {myProjects.length === 0 && (
            <p className="text-gray-600 text-center col-span-full">لم تقم بإضافة مشاريع بعد.</p>
          )}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button
            asChild
            className="bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
          >
            <Link href="/projects/submit">أضف مشروعًا جديدًا</Link>
          </Button>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}