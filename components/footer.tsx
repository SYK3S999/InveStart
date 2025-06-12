"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, ChevronUp } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Footer() {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  // Animation Variants
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.1 } },
  };

  const socialVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.4, delay: 0.2 } },
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      ref={ref}
      className="relative bg-gradient-to-t from-gray-900 to-gray-800 border-t border-gray-700 mt-auto overflow-hidden"
      initial="hidden"
      animate={controls}
      variants={footerVariants}
    >
      {/* Subtle Background Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <motion.div
            className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-right"
            variants={itemVariants}
          >
            <h3 className="text-2xl md:text-3xl font-extrabold text-blue-400 mb-4 flex items-center gap-2">
              <motion.span
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                INVESTART
                <span className="absolute -top-2 -right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              </motion.span>
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
              منصة تمويل جماعي متطورة تربط رواد الأعمال بالمستثمرين في الجزائر بأسلوب مبتكر وشفاف.
            </p>
            <div className="flex space-x-4 space-x-reverse mt-4">
              {[
                { icon: Facebook, label: "فيسبوك", href: "#" },
                { icon: Twitter, label: "تويتر", href: "#" },
                { icon: Linkedin, label: "لينكد إن", href: "#" },
                { icon: Instagram, label: "انستغرام", href: "#" },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="text-blue-400 bg-gray-700 p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                  aria-label={social.label}
                  variants={socialVariants}
                  whileHover={{ scale: 1.2, rotate: 360, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg md:text-xl font-semibold text-gray-100 mb-4 border-b border-gray-600 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/projects", label: "المشاريع" },
                { href: "/submit", label: "قدّم مشروعك" },
                { href: "/dashboard", label: "لوحة التحكم" },
              ].map((link) => (
                <motion.li
                  key={link.href}
                  className="group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm md:text-base font-medium flex items-center gap-2 hover:text-blue-400 transition-colors duration-300"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-blue-500 transition-colors duration-300"></span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg md:text-xl font-semibold text-gray-100 mb-4 border-b border-gray-600 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              الدعم
            </h3>
            <ul className="space-y-3">
              {[
                { href: "#", label: "الأسئلة الشائعة" },
                { href: "#", label: "سياسة الخصوصية" },
                { href: "#", label: "شروط الاستخدام" },
                { href: "#", label: "اتصل بنا" },
              ].map((link) => (
                <motion.li
                  key={link.href}
                  className="group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm md:text-base font-medium flex items-center gap-2 hover:text-blue-400 transition-colors duration-300"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-blue-500 transition-colors duration-300"></span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg md:text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-600 pb-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              تواصل معنا
            </h3>
            <div className="space-y-4 text-gray-400 text-sm md:text-sm">
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-medium">البريد:</span>
                <motion.a
                  href="mailto:info@manasati.dz"
                  className="text-gray-600 hover:text-blue-400 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                >
                  info@manasati.dz
                </motion.a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-medium">الهاتف:</span>
                <motion.a
                  href="tel:+2131234567890"
                  className="text-gray-600 hover:text-blue-400 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                >
                  0123 456 789
                </motion.a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-medium">العنوان:</span>
                <span>الجزائر العاصمة، الجزائر</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-8 text-center relative">
          <motion.div
            className="flex justify-center items-center gap-4 text-gray-400 text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p>© {new Date().getFullYear()} INVESTART. جميع الحقوق محفوظة.</p>
            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
            <Link href="/privacy" className="hover:text-blue-400 transition-colors duration-300">
              سياسة الخصوصية
            </Link>
            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
            <Link href="/terms" className="hover:text-blue-400 transition-colors duration-300">
              شروط الاستخدام
            </Link>
          </motion.div>

          {/* Back to Top Button */}
          <motion.div
            className="absolute right-4 md:right-8 bottom-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Button
              onClick={scrollToTop}
              className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              aria-label="العودة إلى الأعلى"
            >
              <ChevronUp size={24} />
            </Button>
          </motion.div>
        </div>

        {/* Floating Gradient Orb */}
        <motion.div
          className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-full blur-3xl opacity-30 pointer-events-none"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.footer>
  );
}