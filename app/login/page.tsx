'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Mail, Loader2, Lock, X } from 'lucide-react';

// Toast component definition (updated for dark mode)
const Toast = ({
  message,
  type,
  onClose,
  className,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border max-w-md mx-auto ${
      type === 'success'
        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700'
        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700'
    } ${className}`}
    role="alert"
    aria-live="polite"
  >
    <span className="flex-1 text-sm">{message}</span>
    <Button
      variant="ghost"
      size="icon"
      onClick={onClose}
      className="إغلاق التنبيه text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
    >
      <X className="h-4 w-4" />
    </Button>
  </motion.div>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { login, isLoading } = useAuth();

  const validateForm = useCallback((field: 'email' | 'password', value: string) => {
    const newErrors = { ...errors };

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        newErrors.email = 'البريد الإلكتروني مطلوب';
      } else if (!emailRegex.test(value)) {
        newErrors.email = 'البريد الإلكتروني غير صالح';
      } else {
        delete newErrors.email;
      }
    }

    if (field === 'password') {
      if (!value) {
        newErrors.password = 'كلمة المرور مطلوبة';
      } else if (value.length < 8) {
        newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [errors]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    validateForm('email', email);
    validateForm('password', password);

    if (errors.email || errors.password || !email || !password) return;

    try {
      await login(email, password);
      setToast({ message: 'تم تسجيل الدخول بنجاح!', type: 'success' });
      setEmail('');
      setPassword('');
    } catch (err) {
      const errorMessage = err instanceof Error && err.message.includes('email')
        ? 'البريد الإلكتروني غير مسجل'
        : 'بيانات الدخول غير صحيحة';
      setErrors({ general: errorMessage });
      setToast({ message: errorMessage, type: 'error' });
    }
  }, [email, password, errors, login, validateForm]);

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <div
      lang="ar"
      dir="rtl"
      className="flex flex-col min-h-screen font-amiri bg-gradient-to-br from-white via-cream-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <Navbar />
      <main className="flex-1 py-12 md:min-h-64 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg relative">
          <motion.div
            className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-10 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/10 to-transparent dark:from-primary-900/10 dark:to-transparent rounded-2xl pointer-events-none" />
            <h1 className="relative text-3xl md:text-4xl font-bold text-center text-primary-700 dark:text-primary-300 mb-8 z-10">
              تسجيل الدخول
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg">
              ادخل إلى منصة التمويل العيني
            </p>
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
              />
            )}
            <AnimatePresence>
              {errors.general && (
                <motion.p
                  className="text-red-500 dark:text-red-400 text-center mb-6 text-sm"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  role="alert"
                  aria-live="polite"
                >
                  {errors.general}
                </motion.p>
              )}
            </AnimatePresence>
            <form
              role="form"
              aria-label="تسجيل الدخول"
              onSubmit={handleLogin}
              className="space-y-6"
              noValidate
            >
              <motion.div
                custom={0}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  البريد الإلكتروني
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        <p>أدخل بريدك الإلكتروني المسجل</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateForm('email', e.target.value);
                    }}
                    placeholder="أدخل بريدك الإلكتروني"
                    className={`pr-10 rounded-lg shadow-sm transition-all duration-200 ${
                      errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    } focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    required
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      id="email-error"
                      className="text-red-500 dark:text-red-400 text-xs mt-1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div
                custom={1}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  كلمة المرور
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        <p>كلمة المرور يجب أن تكون 8 أحرف على الأقل</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validateForm('password', e.target.value);
                    }}
                    placeholder="أدخل كلمة المرور"
                    className={`pr-10 rounded-lg shadow-sm transition-all duration-200 ${
                      errors.password ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    } focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200`}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    required
                  />
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      id="password-error"
                      className="text-red-500 dark:text-red-400 text-xs mt-1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div
                custom={2}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row justify-between gap-4 text-sm"
              >
                <Link
                  href="/forgot-password"
                  className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold underline transition-colors text-center"
                  aria-label="نسيت كلمة المرور"
                >
                  نسيت كلمة المرور؟
                </Link>
                <Link
                  href="/register"
                  className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold underline transition-colors text-center"
                  aria-label="إنشاء حساب جديد"
                >
                  ليس لديك حساب؟ سجل الآن
                </Link>
              </motion.div>
              <motion.div
                custom={3}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 rounded-xl py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto touch-action-manipulation"
                  disabled={isLoading || !!errors.email || !!errors.password || !email || !password}
                  aria-label="تسجيل الدخول"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-white dark:text-gray-200" />
                      جاري التحميل...
                    </span>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}