"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Search,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(2);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1], staggerChildren: 0.05 },
    },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const publicNavItems = [
    { href: '/', label: 'الرئيسية', icon: null },
    { href: '/projects', label: 'المشاريع', icon: null },
    { href: '/about', label: 'من نحن', icon: null },
    { href: '/contact', label: 'تواصل معنا', icon: null },
  ];

  const roleBasedNavItems = {
    startup: [
      { href: '/dashboard/startup', label: 'لوحة التحكم', icon: <LayoutDashboard className='h-4 w-4 ml-2' /> },
      { href: '/projects/my', label: 'مشاريعي', icon: <Briefcase className='h-4 w-4 ml-2' /> },
      { href: '/projects/submit', label: 'تقديم مشروع', icon: <PlusCircle className='h-4 w-4 ml-2' /> },
      { href: '/contracts', label: 'العقود', icon: <FileText className='h-4 w-4 ml-2' /> },
    ],
    sponsor: [
      { href: '/dashboard/sponsor', label: 'لوحة التحكم', icon: <LayoutDashboard className='h-4 w-4 ml-2' /> },
      { href: '/projects', label: 'استكشاف المشاريع', icon: <Briefcase className='h-4 w-4 ml-2' /> },
      { href: '/investments', label: 'عروضي', icon: <Briefcase className='h-4 w-4 ml-2' /> },
      { href: '/contracts', label: 'العقود', icon: <FileText className='h-4 w-4 ml-2' /> },
    ],
    admin: [
      { href: '/dashboard/admin', label: 'لوحة التحكم', icon: <LayoutDashboard className='h-4 w-4 ml-2' /> },
      { href: '/users', label: 'المستخدمين', icon: <User className='h-4 w-4 ml-2' /> },
      { href: '/projects/pending', label: 'المشاريع المعلقة', icon: <Briefcase className='h-4 w-4 ml-2' /> },
      { href: '/reports', label: 'التقارير', icon: <FileText className='h-4 w-4 ml-2' /> },
    ],
  };

  const authenticatedNavItems = [
    { href: '/messages', label: 'الرسائل', icon: <MessageSquare className='h-4 w-4 ml-2' />, badge: unreadMessages },
    { href: '/notifications', label: 'الإشعارات', icon: <Bell className='h-4 w-4 ml-2' />, badge: unreadNotifications },

  ];

  const getNavItems = () => {
    if (!user) return publicNavItems;
    const role = user.role as keyof typeof roleBasedNavItems;
    return [
      ...publicNavItems.slice(0, 2),
      ...(roleBasedNavItems[role] ?? [])
    ];
  };

  const navItems = getNavItems();

  type UserMenuItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
  };

  const userMenuItems: UserMenuItem[] = user
    ? [
        { label: 'الملف الشخصي', href: `/profile/${user.id}`, icon: <User className='h-4 w-4 ml-2' /> },
        { label: 'الإعدادات', href: `/settings/${user.role}`, icon: <Settings className='h-4 w-4 ml-2' /> },
        ...((user.role === 'startup' || user.role === 'sponsor') ? roleBasedNavItems[user.role] : []),
        ...((user.role !== 'admin') ? authenticatedNavItems : []),
      ]
    : [];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 backdrop-blur-md ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 shadow-lg shadow-primary/5 border-b border-primary/20'
          : 'bg-gradient-to-r from-cream-50/90 via-blue-50/90 to-green-50/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90'
      }`}
    >
      <div className='container mx-auto px-4 lg:px-6'>
        <div className='flex items-center justify-between h-16 lg:h-20'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-3 group'>
            <motion.div
              className='relative'
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className='absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity'></div>
              <div className='relative bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-xl shadow-lg'>
                <Zap className='h-6 w-6 text-white' />
              </div>
            </motion.div>
            <div className='flex flex-col'>
              <span className='text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent'>
                INVESTART
              </span>
              <span className='text-xs text-primary-500 font-medium -mt-1'>منصة التمويل التأجيري</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center'>
            <div className='flex items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full p-1 shadow-sm border border-primary/10'>
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                      pathname === item.href
                        ? 'text-white shadow-lg'
                        : 'text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100'
                    }`}
                  >
                    {pathname === item.href && (
                      <motion.div
                        layoutId='activeTab'
                        className='absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg'
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className='relative z-10'>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className='flex items-center gap-2 lg:gap-4'>
            {/* Search Button (Desktop) */}
            <motion.button
              className='hidden lg:flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-primary/10 hover:border-primary/20 hover:bg-primary-50 dark:hover:bg-gray-800 transition-all duration-300 text-primary-600 dark:text-primary-400'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label='بحث'
            >
              <Search className='h-4 w-4' />
              <span className='text-sm'>بحث</span>
            </motion.button>

            {/* Quick Actions for Authenticated Users */}
            {user && user.role !== 'admin' && (
              <div className='hidden lg:flex items-center gap-1'>
              <Link
                href='/messages'
                className={`relative p-2.5 rounded-full transition-all duration-300 ${
                pathname === '/messages'
                  ? 'bg-primary-100 text-primary-700 shadow-md'
                  : 'text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-gray-800'
                }`}
                aria-label={`الرسائل (${unreadMessages} رسائل غير مقروءة)`}
              >
                <MessageSquare className='h-5 w-5' />
                {unreadMessages > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg'
                >
                  {unreadMessages}
                </motion.div>
                )}
              </Link>
              <Link
                href='/notifications'
                className={`relative p-2.5 rounded-full transition-all duration-300 ${
                pathname === '/notifications'
                  ? 'bg-primary-100 text-primary-700 shadow-md'
                  : 'text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-gray-800'
                }`}
                aria-label={`الإشعارات (${unreadNotifications} إشعارات غير مقروءة)`}
              >
                <Bell className='h-5 w-5' />
                {unreadNotifications > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg'
                >
                  {unreadNotifications}
                </motion.div>
                )}
              </Link>
              </div>
            )}
            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className='p-2.5 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-primary/10 hover:border-primary/20 hover:bg-primary-50 dark:hover:bg-gray-800 text-primary-600 dark:text-primary-400 transition-all duration-300'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={theme === 'dark' ? 'التحويل إلى الوضع الفاتح' : 'التحويل إلى الوضع الداكن'}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
                </motion.div>
              </motion.button>
            )}

            {/* User Menu (Desktop) */}
                        {user ? (
              <div className='hidden lg:block'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      className='flex items-center gap-3 px-3 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-primary/10 hover:border-primary/20 hover:bg-primary-50 dark:hover:bg-gray-800 transition-all duration-300'
                      whileHover={{ scale: 1.02 }}
                      aria-label='قائمة المستخدم'
                    >
                      <Avatar className='h-8 w-8 ring-2 ring-primary/20'>
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`}
                          alt={user.name}
                        />
                        <AvatarFallback className='bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold'>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='hidden xl:block text-right'>
                        <p className='text-sm font-medium text-primary-800 dark:text-primary-200'>{user.name}</p>
                        <p className='text-xs text-primary-600 dark:text-primary-400 capitalize'>
                          {user.role === 'sponsor' ? 'راعي المواد' : 'صاحب المشروع'}
                        </p>
                      </div>
                      <ChevronDown className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg'
                  >
                    <DropdownMenuLabel className='bg-gray-50 dark:bg-gray-700/50'>
                      <div className='flex items-center gap-3 p-2'>
                        <Avatar className='h-10 w-10 ring-2 ring-primary/20'>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`} />
                          <AvatarFallback className='bg-gradient-to-r from-primary-500 to-primary-600 text-white'>
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-sm font-semibold text-gray-900 dark:text-gray-100'>{user.name}</p>
                          <p className='text-xs text-gray-600 dark:text-gray-400'>{user.email}</p>
                          <Badge
                            variant='secondary'
                            className='mt-1 text-xs bg-primary/10 text-primary-700 dark:bg-primary/20 dark:text-primary-300'
                          >
                            {user.role === 'sponsor' ? 'راعي المواد' : 'صاحب المشروع'}
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className='bg-gray-200 dark:bg-gray-700' />
                    {userMenuItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          className='flex items-center justify-between p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                          aria-label={item.label}
                        >
                          <div className='flex items-center'>
                            {item.icon}
                            {item.label}
                          </div>
                          {item.badge !== undefined && item.badge > 0 && (
                            <Badge className='bg-gradient-to-r from-primary-500 to-primary-600 text-white'>
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className='bg-gray-200 dark:bg-gray-700' />
                    <DropdownMenuItem
                      onClick={logout}
                      className='text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 cursor-pointer p-3 hover:bg-red-50 dark:hover:bg-red-900/20'
                      aria-label='تسجيل الخروج'
                    >
                      <LogOut className='h-4 w-4 ml-2' />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className='hidden lg:flex items-center gap-3'>
                <Link
                  href='/login'
                  className='px-4 py-2 text-primary-700 dark:text-primary-300 font-medium hover:text-primary-900 dark:hover:text-primary-100 transition-all duration-300'
                  aria-label='تسجيل الدخول'
                >
                  تسجيل الدخول
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    asChild
                    className='bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300'
                  >
                    <Link href='/register' aria-label='تقديم مشروع'>قدّم مشروعك الآن</Link>
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className='lg:hidden p-2.5 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-primary/10 hover:border-primary/20 hover:bg-primary-50 dark:hover:bg-gray-800 text-primary-600 dark:text-primary-400 transition-all duration-300'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className='lg:hidden overflow-hidden'
              initial='hidden'
              animate='visible'
              exit='exit'
              variants={menuVariants}
            >
              <div className='bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl mt-4 mb-4 border border-primary/20 shadow-xl'>
                {/* User Info (Mobile) */}
                {user && (
                  <motion.div className='p-6 border-b border-primary/10' variants={itemVariants}>
                    <div className='flex items-center gap-4'>
                      <Avatar className='h-12 w-12 ring-2 ring-primary/20'>
                        <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${user.name.charAt(0)}`} />
                        <AvatarFallback className='bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold'>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1'>
                        <p className='text-lg font-semibold text-primary-800 dark:text-primary-200'>{user.name}</p>
                        <p className='text-sm text-primary-600 dark:text-primary-400'>{user.email}</p>
                        <Badge
                          variant='secondary'
                          className='mt-2 bg-primary/10 text-primary-700 dark:text-primary-300'
                        >
                          {user.role === 'sponsor' ? 'راعي المواد' : 'صاحب المشروع'}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Search Bar (Mobile) */}
                <motion.div className='p-4 border-b border-primary/10' variants={itemVariants}>
                  <div className='flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10'>
                    <Search className='h-5 w-5 text-primary-500' />
                    <input
                      type='text'
                      placeholder='البحث في المنصة...'
                      className='flex-1 bg-transparent text-primary-800 dark:text-primary-200 placeholder-primary-500 focus:outline-none'
                      aria-label='البحث'
                    />
                  </div>
                </motion.div>

                {/* Navigation Items */}
                <div className='p-2'>
                  {navItems.map((item) => (
                    <motion.div key={item.href} variants={itemVariants}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 ${
                          pathname === item.href
                            ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-800 dark:text-primary-200 shadow-sm'
                            : 'text-primary-700 dark:text-primary-300 hover:bg-primary/5'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                        aria-label={item.label}
                      >
                        {item.icon}
                        <span className='font-medium'>{item.label}</span>
                        {pathname === item.href && (
                          <div className='ml-auto w-2 h-2 bg-primary-500 rounded-full'></div>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Authenticated User Items */}
                {user && user.role !== 'admin' && (
                  <motion.div variants={itemVariants}>
                  <div className='px-2 pb-2 border-t border-primary/10 mt-2'>
                    <p className='px-4 py-3 text-xs font-semibold text-primary-500 uppercase tracking-wider'>
                    الخدمات السريعة
                    </p>
                    {authenticatedNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className='flex items-center justify-between px-4 py-4 rounded-xl text-primary-700 dark:text-primary-300 hover:bg-primary/5 transition-all duration-300'
                      onClick={() => setIsMenuOpen(false)}
                      aria-label={item.label}
                    >
                      <div className='flex items-center gap-3'>
                      {item.icon}
                      <span className='font-medium'>{item.label}</span>
                      </div>
                      {item.badge > 0 && (
                      <Badge className='bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm'>
                        {item.badge}
                      </Badge>
                      )}
                    </Link>
                    ))}
                  </div>
                  </motion.div>
                )}

                {/* Account Section */}
                {user && (
                  <motion.div variants={itemVariants}>
                    <div className='px-2 pb-4 border-t border-primary/10'>
                      <p className='px-4 py-3 text-xs font-semibold text-primary-500 uppercase tracking-wider'>الحساب</p>
                      <Link
                        href={`/profile/${user.id}`}
                        className='flex items-center gap-3 px-4 py-4 rounded-xl text-primary-700 dark:text-primary-300 hover:bg-primary/5 transition-all duration-300'
                        onClick={() => setIsMenuOpen(false)}
                        aria-label='الملف الشخصي'
                      >
                        <User className='h-5 w-5' />
                        <span className='font-medium'>الملف الشخصي</span>
                      </Link>
                      <Link
                        href={`/settings/${user.role}`}
                        className='flex items-center gap-3 px-4 py-4 rounded-xl text-primary-700 dark:text-primary-300 hover:bg-primary/5 transition-all duration-300'
                        onClick={() => setIsMenuOpen(false)}
                        aria-label='الإعدادات'
                      >
                        <Settings className='h-5 w-5' />
                        <span className='font-medium'>الإعدادات</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className='w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300'
                        aria-label='تسجيل الخروج'
                      >
                        <LogOut className='h-5 w-5' />
                        <span className='font-medium'>تسجيل الخروج</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Authentication Buttons */}
                {!user && (
                  <motion.div className='p-4 border-t border-primary/10' variants={itemVariants}>
                    <div className='space-y-3'>
                      <Link
                        href='/login'
                        className='block w-full px-4 py-3 text-center font-medium text-primary-700 dark:text-primary-300 bg-primary/5 rounded-xl hover:bg-primary/10 transition-all duration-300'
                        onClick={() => setIsMenuOpen(false)}
                        aria-label='تسجيل الدخول'
                      >
                        تسجيل الدخول
                      </Link>
                      <Button
                        asChild
                        className='w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300'
                      >
                        <Link href='/register' onClick={() => setIsMenuOpen(false)} aria-label='تقديم مشروع'>
                          قدّم مشروعك الآن
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}