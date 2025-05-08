"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Moon,
  Sun,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Settings,
  FileText,
  Briefcase,
  LayoutDashboard,
  PlusCircle,
  Users,
  AlertTriangle,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/authContext"; // Assuming you have this context
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth(); // Authentication context
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(2); // Mock data
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Mock data

  // Handle mounting for theme toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Animation variants for mobile menu (from first code)
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  // Navigation items
  const publicNavItems = [
    { href: "/", label: "الرئيسية", icon: null },
    { href: "/projects", label: "المشاريع", icon: null },
    // { href: "/submit", label: "قدّم مشروعك", icon: null },
    // { href: "/dashboard", label: "لوحة التحكم", icon: null },
    { href: "/about", label: "من نحن", icon: null },
    { href: "/contact", label: "تواصل معنا", icon: null },

    { href: "/terms", label: "الشروط والأحكام", icon: null },
    { href: "/security", label: "سياسة الخصوصية", icon: null },
  ];

  const roleBasedNavItems = {
    startup: [
      { href: "/dashboard/startup", label: "لوحة التحكم", icon: <LayoutDashboard className="h-4 w-4 ml-2" /> },
      { href: "/projects/my", label: "مشاريعي", icon: <Briefcase className="h-4 w-4 ml-2" /> },
      { href: "/projects/submit", label: "تقديم مشروع", icon: <PlusCircle className="h-4 w-4 ml-2" /> },
      { href: "/contracts", label: "العقود", icon: <FileText className="h-4 w-4 ml-2" /> },
    ],
    sponsor: [
      { href: "/dashboard/sponsor", label: "لوحة التحكم", icon: <LayoutDashboard className="h-4 w-4 ml-2" /> },
      { href: "/projects", label: "استكشاف المشاريع", icon: <Briefcase className="h-4 w-4 ml-2" /> },
      { href: "/investments", label: "استثماراتي", icon: <Briefcase className="h-4 w-4 ml-2" /> },
      { href: "/contracts", label: "العقود", icon: <FileText className="h-4 w-4 ml-2" /> },
    ],
    admin: [
      { href: "/dashboard/admin", label: "لوحة التحكم", icon: <LayoutDashboard className="h-4 w-4 ml-2" /> },
      { href: "/projects/pending", label: "المشاريع المعلقة", icon: <AlertTriangle className="h-4 w-4 ml-2" /> },
      { href: "/users", label: "إدارة المستخدمين", icon: <Users className="h-4 w-4 ml-2" /> },
      { href: "/reports", label: "التقارير", icon: <FileText className="h-4 w-4 ml-2" /> },
    ],
  };

  const authenticatedNavItems = [
    { href: "/messages", label: "المحادثات", icon: <MessageSquare className="h-4 w-4 ml-2" />, badge: unreadMessages },
    { href: "/notifications", label: "الإشعارات", icon: <Bell className="h-4 w-4 ml-2" />, badge: unreadNotifications },
    { href: "/analytics", label: "التحليلات", icon: <Briefcase className="h-4 w-4 ml-2" /> },
    { href: "/calendar", label: "التقويم", icon: <Calendar className="h-4 w-4 ml-2" /> },
  ];

  // Determine nav items based on user role
  const getNavItems = () => {
    if (!user) return publicNavItems;
    return [...publicNavItems.slice(0, 2), ...(roleBasedNavItems[user.role] || [])];
  };

  const navItems = getNavItems();

  // User menu items
  const userMenuItems = user
    ? [
        { label: "الملف الشخصي", href: `/profile/${user.id}`, icon: <User className="h-4 w-4 ml-2" /> },
        { label: "الإعدادات", href: `/settings/${user.role}`, icon: <Settings className="h-4 w-4 ml-2" /> },
        ...(roleBasedNavItems[user.role] || []),
        ...authenticatedNavItems,
      ]
    : [];

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
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-primary-700 font-medium rounded-full hover:bg-primary-100 hover:text-primary-900 transition-all duration-300 ease-in-out ${
                  pathname === item.href ? "bg-primary-100 text-primary-900" : ""
                }`}
              >
                <motion.span
                  whileHover={{ scale: 1.05, color: "#1e3a8a" }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}

            {/* Authenticated User Quick Access */}
            {user && (
              <div className="flex items-center gap-2 mr-2">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    href="/messages"
                    className={`p-2 rounded-full relative ${
                      pathname === "/messages"
                        ? "bg-primary-100 text-primary-900"
                        : "text-primary-700 hover:bg-primary-100"
                    }`}
                  >
                    <MessageSquare className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <Badge className="absolute -top-1 -left-1 w-5 h-5 p-0 flex items-center justify-center bg-primary-600 text-white">
                        {unreadMessages}
                      </Badge>
                    )}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    href="/notifications"
                    className={`p-2 rounded-full relative ${
                      pathname === "/notifications"
                        ? "bg-primary-100 text-primary-900"
                        : "text-primary-700 hover:bg-primary-100"
                    }`}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <Badge className="absolute -top-1 -left-1 w-5 h-5 p-0 flex items-center justify-center bg-primary-600 text-white">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-primary-100 text-primary-700 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>
            )}
          </nav>

          {/* User Menu (Desktop) */}
          {user ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary-100 text-primary-700"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden lg:inline-block">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center">
                        {item.icon}
                        {item.label}
                        {("badge" in item && typeof item.badge === "number" && item.badge > 0) && (
                          <Badge className="mr-auto bg-primary-600 text-white">{item.badge}</Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 ml-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-primary-700 font-medium hover:text-primary-900 transition-all duration-300"
              >
                تسجيل الدخول
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
          )}

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
              {/* User Info (Mobile) */}
              {user && (
                <div className="flex items-center space-x-4 space-x-reverse mb-4 pb-4 border-b border-primary-100">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-primary-700">{user.name}</p>
                    <p className="text-xs text-primary-500">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              {navItems.map((item) => (
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

              {/* Authenticated User Items */}
              {user && (
                <>
                  <div className="pt-2 border-t border-primary-100">
                    <p className="px-4 py-1 text-sm text-primary-500">الخدمات</p>
                    {authenticatedNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between px-4 py-3 text-primary-700 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-900 transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="flex items-center">
                          {item.icon}
                          {item.label}
                        </span>
                        {(item.badge ?? 0) > 0 && (
                          <Badge className="bg-primary-600 text-white">{item.badge}</Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-primary-100">
                    <p className="px-4 py-1 text-sm text-primary-500">الحساب</p>
                    <Link
                      href={`/profile/${user.id}`}
                      className="block px-4 py-3 text-primary-700 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-900 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4 ml-2" />
                      الملف الشخصي
                    </Link>
                    <Link
                      href={`/settings/${user.role}`}
                      className="block px-4 py-3 text-primary-700 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-900 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 ml-2" />
                      الإعدادات
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center text-right px-4 py-3 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4 ml-2" />
                      تسجيل الخروج
                    </button>
                  </div>
                </>
              )}

              {/* Authentication Buttons */}
              {!user && (
                <div className="px-4 space-y-3">
                  <Link
                    href="/login"
                    className="block mb-3 text-primary-700 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-900 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    تسجيل الدخول
                  </Link>
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
              )}

              {/* Theme Toggle (Mobile) */}
              {mounted && (
                <div className="px-4 pt-2 border-t border-primary-100">
                  <Button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2 text-primary-700 hover:bg-primary-100"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4" />
                        الوضع النهاري
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4" />
                        الوضع الليلي
                      </>
                    )}
                  </Button>
                </div>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}