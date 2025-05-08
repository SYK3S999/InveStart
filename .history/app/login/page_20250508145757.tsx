// app/login/page.tsx
"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar"; // Adjust path as needed
import { Footer } from "@/components/footer"; // Adjust path as needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/authContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const { login, isLoading } = useAuth();

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("البريد الإلكتروني مطلوب");
    } else if (!emailRegex.test(value)) {
      setEmailError("البريد الإلكتروني غير صالح");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    validateEmail(email);
    if (emailError || !password) return;

    try {
      await login(email, password);
    } catch (err) {
      setError("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
      <Navbar />
      <main className="flex-1 py-12 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md relative z-10">
          <motion.div
                      className="bg-white rounded-xl shadow-lg p-8 border border-primary-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
            <h1 className="text-3xl font-bold text-center text-primary-500 mb-8">تسجيل الدخول</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  required
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={emailError ? "border-red-500" : ""}
                />
                {emailError && (
                  <p id="email-error" className="text-red-500 text-sm mt-1">
                    {emailError}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-describedby="password-error"
                />
              </div>
              <div className="flex justify-between text-sm">
                <Link
                  href="/forgot-password"
                  className="text-primary-500 hover:text-primary-700 transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
                <Link
                  href="/register"
                  className="text-primary-500 hover:text-primary-700 transition-colors"
                >
                  ليس لديك حساب؟ سجل الآن
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                disabled={isLoading || !!emailError || !email || !password}
              >
                {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
              </Button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}