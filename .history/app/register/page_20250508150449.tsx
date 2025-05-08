// app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, ArrowRight } from "lucide-react";
import { StartupRegistrationForm } from "@/components/startup-registration-form"; // Adjust path
import { SponsorRegistrationForm } from "@/components/sponsor-registration-form"; // Adjust path

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"startup" | "sponsor" | null>(null);

  const handleRoleSelect = (selectedRole: "startup" | "sponsor") => {
    setRole(selectedRole);
  };

  const handleBack = () => {
    setRole(null);
  };

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
            <h1 className="text-3xl font-bold text-center text-primary-500 mb-8">إنشاء حساب جديد</h1>
            <AnimatePresence mode="wait">
              {!role ? (
                <motion.div
                  key="role-selection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-center mb-6 text-gray-700">اختر نوع الحساب الذي تريد إنشاءه:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => handleRoleSelect("startup")}
                        className="w-full flex items-center justify-center bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                      >
                        <Briefcase className="ml-2 h-5 w-5" />
                        مشروع ناشئ
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => handleRoleSelect("sponsor")}
                        className="w-full flex items-center justify-center bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                      >
                        <User className="ml-2 h-5 w-5" />
                        راعي / مستثمر
                      </Button>
                    </motion.div>
                  </div>
                  <div className="text-center mt-6">
                    <Link
                      href="/login"
                      className="text-primary-500 hover:text-primary-700 transition-colors text-sm"
                    >
                      لديك حساب؟ تسجيل الدخول
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="mb-4 text-primary-500 hover:text-primary-700 flex items-center"
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                    العودة إلى اختيار نوع الحساب
                  </Button>
                  {role === "startup" ? (
                    <StartupRegistrationForm onComplete={() => router.push("/dashboard/startup")} />
                  ) : (
                    <SponsorRegistrationForm onComplete={() => router.push("/dashboard/sponsor")} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}