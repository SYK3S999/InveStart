"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion"; // For animations

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for subtle shadow/gradient change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants for mobile menu
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-md border-b border-primary/10"
          : "bg-gradient-to-r from-cream-50 via-blue-50 to-green-50 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-4 lg:py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-extrabold text-primary-700 hover:text-primary-900 transition-colors duration-200 flex items-center gap-2"
          >
            <motion.span
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              INVESTART
            </motion.span>
            {/* Subtle logo accent */}
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 space-x-reverse">
            {[
              { href: "/", label: "الرئيسية" },
              { href: "/projects", label: "المشاريع" },
              { href: "/submit", label: "قدّم مشروعك" },
              { href: "/dashboard", label: "لوحة التحكم" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-primary-700 font-medium rounded-full hover:bg-primary-100 hover:text-primary-900 transition-all duration-300 ease-in-out"
              >
                <motion.span
                  whileHover={{ scale: 1.05, color: "#1e3a8a" }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-primary-700 font-medium hover:text-primary-900 transition-all duration-300"
            >
              Login Now
            </Link>
            <Button
              asChild
              variant="default"
              size="default"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-full px-6 py-2 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Link href="/submit">قدّم مشروعك الآن</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-primary-100 text-primary-700 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="md:hidden mt-4 pb-4 space-y-3"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
            >
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/projects", label: "المشاريع" },
                { href: "/submit", label: "قدّم مشروعك" },
                { href: "/dashboard", label: "لوحة التحكم" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-primary-700 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-900 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              ))}
              <div className="px-4">
                <Link
                  href="/login"
                  className="block mb-3 text-primary-700 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-900 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login Now
                </Link>
              </div>
              <div className="pt-2">
                <Button
                  asChild
                  variant="default"
                  size="default"
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-full py-3 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Link href="/submit" onClick={() => setIsMenuOpen(false)}>
                    قدّم مشروعك الآن
                  </Link>
                </Button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}