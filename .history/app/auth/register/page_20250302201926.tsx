"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { register } from "@/lib/auth";
import { motion } from "framer-motion";
import { Link } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"investor" | "startup-owner">("startup-owner");
  const [error, setError] = useState("");

  const handleRegister = () => {
    const user = register(email, password, role);
    if (user) {
      router.push("/auth/login");
    } else {
      setError("البريد الإلكتروني مسجل مسبقًا");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-cream p-4">
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md border border-primary-100/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-primary-500 mb-6 text-center">إنشاء حساب</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full border border-primary-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">كلمة المرور</label>
            <input
              type="password"
              className="w-full border border-primary-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">نوع الحساب</label>
            <select
              className="w-full border border-primary-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
              value={role}
              onChange={(e) => setRole(e.target.value as "investor" | "startup-owner")}
            >
              <option value="startup-owner">صاحب فكرة</option>
              <option value="investor">مستثمر</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            onClick={handleRegister}
            className="w-full bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
          >
            إنشاء حساب
          </Button>
          <p className="text-gray-600 text-sm text-center">
            لديك حساب؟{" "}
            <Link href="/auth/login" className="text-primary-500 hover:text-primary-600">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}