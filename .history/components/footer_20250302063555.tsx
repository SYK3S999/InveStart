"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { motion, useAnimation } from "framer-motion"; // For animations

export function Footer() {
  const controls = useAnimation();

  // Animate footer on scroll into view
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 100) {
        controls.start("visible");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  // Animation variants
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.footer
      className="bg-gradient-to-t from-cream-50 to-white border-t border-primary/10 mt-auto"
      initial="hidden"
      animate={controls}
      variants={footerVariants}
    >
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-extrabold text-primary-700 mb-4 flex items-center gap-2">
              <motion.span
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                INVESTART
              </motion.span>
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            </h3>
            <p className="text-primary-600 text-sm leading-relaxed mb-6">
              منصة تمويل جماعي تربط أصحاب الأفكار بالمستثمرين في الجزائر لدعم المشاريع الناشئة بمرونة وشفافية.
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
                  className="text-primary-500 hover:text-primary-700 transition-colors duration-200"
                  aria-label={social.label}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={22} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-primary-800 mb-4 border-b border-primary-200 pb-2">
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/projects", label: "المشاريع" },
                { href: "/submit", label: "قدّم مشروعك" },
                { href: "/dashboard", label: "لوحة التحكم" },
              ].map((link) => (
                <motion.li key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-primary-400 rounded-full"></span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-primary-800 mb-4 border-b border-primary-200 pb-2">
              الدعم
            </h3>
            <ul className="space-y-3">
              {[
                { href: "#", label: "الأسئلة الشائعة" },
                { href: "#", label: "سياسة الخصوصية" },
                { href: "#", label: "شروط الاستخدام" },
                { href: "#", label: "اتصل بنا" },
              ].map((link) => (
                <motion.li key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-primary-400 rounded-full"></span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-primary-800 mb-4 border-b border-primary-200 pb-2">
              تواصل معنا
            </h3>
            <ul className="space-y-3 text-primary-600 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary-500">البريد:</span>
                <a
                  href="mailto:info@manasati.dz"
                  className="hover:text-primary-800 transition-colors duration-200"
                >
                  info@manasati.dz
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-500">الهاتف:</span>
                <a
                  href="tel:+213123456789"
                  className="hover:text-primary-800 transition-colors duration-200"
                >
                  0123 456 789
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-500">العنوان:</span>
                <span>الجزائر العاصمة، الجزائر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/10 mt-8 pt-8 text-center">
          <motion.p
            className="text-primary-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            © {new Date().getFullYear()} INVESTART. جميع الحقوق محفوظة.
          </motion.p>
        </div>
      </div>
    </motion.footer>
  );
}