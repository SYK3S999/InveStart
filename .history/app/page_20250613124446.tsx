"use client";
import dynamic from 'next/dynamic';
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FeaturedProjects } from "@/components/featured-projects";
import { Button } from "@/components/ui/button";
import { initializeStorage } from "@/lib/storage";
import { ArrowLeft, Briefcase, Lock, Rocket, Search, Shield, Upload, User } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

const LottiePlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

export default function Home() {
  useEffect(() => {
    initializeStorage();
  }, []);

  // Animation controls
  const heroControls = useAnimation();
  const statsControls = useAnimation();
  const projectsControls = useAnimation();
  const howItWorksControls = useAnimation();
  const featuresControls = useAnimation();
  const ctaControls = useAnimation();

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const projectsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const projectsInView = useInView(projectsRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (heroInView) heroControls.start("visible");
    if (statsInView) statsControls.start("visible");
    if (projectsInView) projectsControls.start("visible");
    if (howItWorksInView) howItWorksControls.start("visible");
    if (featuresInView) featuresControls.start("visible");
    if (ctaInView) ctaControls.start("visible");
  }, [
    heroInView,
    statsInView,
    projectsInView,
    howItWorksInView,
    featuresInView,
    ctaInView,
    heroControls,
    statsControls,
    projectsControls,
    howItWorksControls,
    featuresControls,
    ctaControls,
  ]);

  const statsData = [
    {
      value: "+100",
      label: "مشروع ممول عينيًا",
      icon: <Briefcase className="w-10 h-10 mb-4 text-primary-500 dark:text-primary-400" />,
      bgGradient: "from-primary-100 to-white dark:from-primary-900 dark:to-gray-800",
      accentColor: "primary",
    },
    {
      value: "+200",
      label: "مستثمر ",
      icon: <User className="w-10 h-10 mb-4 text-secondary-600 dark:text-secondary-400" />,
      bgGradient: "from-secondary-100 to-white dark:from-secondary-900 dark:to-gray-800",
      accentColor: "secondary",
    },
    {
      value: "+200",
      label: "صاحب مشروع",
      icon: <Rocket className="w-10 h-10 mb-4 text-accent-400 dark:text-accent-300" />,
      bgGradient: "from-accent-100 to-white dark:from-accent-900 dark:to-gray-800",
      accentColor: "accent",
    },
    {
      value: "+1000",
      label: "عقد على البلوكشين",
      icon: <Lock className="w-10 h-10 mb-4 text-primary-500 dark:text-primary-400" />,
      bgGradient: "from-primary-100 to-white dark:from-primary-900 dark:to-gray-800",
      accentColor: "primary",
    },
  ];

  // Animation variants
  const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } };
  const slideUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };
  const stagger = { visible: { transition: { staggerChildren: 0.2 } } };

  return (
    <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <main>
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          className="relative min-h-screen flex items-center py-20 md:py-28 bg-gradient-to-br from-slate-50 via-primary-50 to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900 text-slate-900 dark:text-gray-200 overflow-hidden"
          initial="hidden"
          animate={heroControls}
          variants={stagger}
        >
          <motion.div
            className="absolute inset-0 bg-[url('/patterns/soft-waves.png')] bg-repeat opacity-8 mix-blend-soft-light dark:opacity-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: 2 }}
          />
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute top-[10%] left-[15%] w-40 h-40 bg-primary-300 dark:bg-primary-700 rounded-full opacity-10 blur-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1], x: [0, 5, 0], y: [0, -5, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[20%] right-[10%] w-56 h-56 bg-primary-400 dark:bg-primary-600 rounded-full opacity-8 blur-3xl"
              animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.12, 0.08], x: [0, -8, 0], y: [0, 8, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div
              className="absolute top-1/3 right-1/3 w-32 h-32 bg-accent-300 dark:bg-accent-700 rounded-full opacity-8 blur-2xl"
              animate={{ scale: [1, 1.05, 1], opacity: [0.08, 0.1, 0.08] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent dark:from-gray-900/20 opacity-30"
              animate={{ opacity: [0.3, 0.35, 0.3] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
              <motion.div className="order-2 md:order-1 text-right font-sans" variants={fadeIn}>
                <motion.div
                  className="inline-flex items-center mb-6 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <span className="inline-block text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-800/80 text-primary-700 dark:text-primary-200 border border-primary-200/50 dark:border-primary-700/50 shadow-sm backdrop-blur-sm">
                    <span className="animate-pulse mr-2 inline-block h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-400"></span>
                  منصة التمويل التأجيري الرائدة في الجزائر
                  </span>
                </motion.div>
                <div className="mb-8">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-relaxed tracking-normal space-y-3">
                    <div className="overflow-hidden">
                      <motion.span
                        className="inline-block text-primary-700 dark:text-primary-300 relative"
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      >
                        INVESTART
                        <motion.span
                          className="absolute -bottom-1 left-0 w-full h-1 bg-accent-400 dark:bg-accent-300 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.8, duration: 0.8 }}
                        />
                      </motion.span>
                    </div>
                    <div className="overflow-hidden mt-6">
                      <motion.span
                        className="inline-block bg-gradient-to-r from-primary-800 to-primary-600 dark:from-primary-600 dark:to-primary-400 bg-clip-text text-transparent font-extrabold leading-relaxed tracking-wide"
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                      >
                        تمويل مشاريعك
                      </motion.span>
                    </div>
                  </h1>
                </div>
                <motion.p
                  className="text-base sm:text-lg mb-8 text-slate-700 dark:text-gray-300 leading-relaxed max-w-lg mr-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  أول منصة رقمية تربط المؤسسات الناشئة، المؤسسات الصغيرة و المصغرة بالمستثمرين بهدف الوصول إلى التمويل التأجيري
                </motion.p>
                <motion.ul
                  className="space-y-4 mb-10 text-slate-700 dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[
                    { text: "تمويل مرن لكل فكرة", icon: "✦", color: "secondary" },
                    { text: "شفافية عالية مضمونة", icon: "✦", color: "primary" },
                    { text: "شبكة مستثمرين واسعة", icon: "✦", color: "accent" },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3 justify-end"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.15, duration: 0.5 }}
                    >
                      <span className="font-medium text-sm sm:text-base">{item.text}</span>
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-full bg-${item.color}-50 dark:bg-${item.color}-900 text-${item.color}-600 dark:text-${item.color}-300 shadow-sm border border-${item.color}-200 dark:border-${item.color}-700 text-xs`}
                      >
                        {item.icon}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-end"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                    
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div className="order-1 md:order-2 relative" variants={slideUp}>
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/90 to-primary-50/90 dark:from-gray-800/90 dark:to-primary-900/90 rounded-2xl backdrop-blur-sm shadow-xl border border-white/40 dark:border-gray-700/40"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <LottiePlayer
                      autoplay
                      loop
                      src="/assets/money.json"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 sm:h-24">
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                fill="#F8FAFC"
                className="dark:fill-gray-800"
                opacity="1"
              />
            </svg>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          ref={statsRef}
          className="py-24 bg-gradient-to-b from-white to-primary-50 dark:from-gray-900 dark:to-primary-900 relative overflow-hidden"
          initial="hidden"
          animate={statsControls}
          variants={stagger}
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-0 left-1/4 w-48 h-48 rounded-full bg-primary-200/20 dark:bg-primary-700/20 blur-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-secondary-200/20 dark:bg-secondary-700/20 blur-3xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-16" variants={fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">إحصائيات منصتنا</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
                اكتشف تأثير منصتنا في دعم المؤسسات في الجزائر بالتمويل التأجيري
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <motion.div
                  key={index}
                  className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center group hover:shadow-xl transition-all duration-300"
                  variants={slideUp}
                  whileHover={{ y: -5 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="relative">
                    {stat.icon}
                    <motion.p
                      className={`text-4xl font-bold text-${stat.accentColor}-600 dark:text-${stat.accentColor}-400 mb-2`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className={`text-${stat.accentColor}-600 dark:text-${stat.accentColor}-400 font-medium`}>{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Featured Projects */}
        <motion.section
          ref={projectsRef}
          className="py-24 bg-gradient-to-b from-white to-secondary-50 dark:from-gray-900 dark:to-secondary-900 relative overflow-hidden"
          initial="hidden"
          animate={projectsControls}
          variants={stagger}
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-10 right-10 w-48 h-48 rounded-full border-2 border-secondary-200/30 dark:border-secondary-700/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-10 left-10 w-64 h-64 rounded-full border-2 border-accent-200/30 dark:border-accent-700/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-16" variants={fadeIn}>
              <span className="inline-block px-4 py-2 bg-secondary-50 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-300 rounded-full text-sm font-medium mb-4">
                مشاريع ناشئة
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-600 dark:text-secondary-400">مشاريع مميزة</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
              تصفح أفضل المشاريع في الجزائر التي تبحث عن تأجير تمويلي
              </p>
              
              <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
ملاحظة: التمويل مقتصر على الدعم العيني في شكل تمويل تاجيري وقد يتعدى إلى شراكات                 </p>
            </motion.div>
            <div className="flex justify-center mb-8">
              <Button
                variant="outline"
                className="border-secondary-500 dark:border-secondary-400 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/50"
              >
                <Search className="w-5 h-5 ml-2" />
                تصفية حسب الولاية أو القطاع
              </Button>
            </div>
            <FeaturedProjects />
            <motion.div className="text-center mt-12" variants={fadeIn}>
              <Button
                asChild
                className="bg-secondary-600 dark:bg-secondary-500 text-white hover:bg-secondary-700 dark:hover:bg-secondary-600 rounded-full px-8 py-3"
              >
                <Link href="/projects">عرض جميع المشاريع</Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          ref={howItWorksRef}
          className="py-24 bg-gradient-to-b from-white to-accent-50 dark:from-gray-900 dark:to-accent-900 relative overflow-hidden"
          initial="hidden"
          animate={howItWorksControls}
          variants={stagger}
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-10 left-10 w-48 h-48 rounded-full border-2 border-accent-200/30 dark:border-accent-700/30"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-64 h-64 rounded-full border-2 border-primary-200/30 dark:border-primary-700/30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-16" variants={fadeIn}>
              <span className="inline-block px-4 py-2 bg-accent-50 dark:bg-accent-900 text-accent-600 dark:text-accent-300 rounded-full text-sm font-medium mb-4">
                كيف نعمل
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-accent-600 dark:text-accent-400">كيف تبدأ مع منصتنا؟</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
                خطوات بسيطة لتحويل فكرتك إلى مشروع ناجح بتمويل عيني آمن
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: "تحقق من هويتك",
                  desc: "سجّل باستخدام رقم هاتفك ووثيقة هوية لضمان الأمان",
                },
                {
                  icon: Upload,
                  title: "قدّم مشروعك",
                  desc: "أضف تفاصيل مشروعك وحدد احتياجاتك العينية (معدات، مواد)",
                },
                {
                  icon: User,
                  title: "تواصل مع المستثمرين",
                  desc: "ابحث عن مستثمرين يقدمون دعمًا عينيًا أو تأجيريًا",
                },
                {
                  icon: Lock,
                  title: "وقّع عقدًا آمنًا",
                  desc: "عقود مسجلة على البلوكشين لضمان الشفافية والحقوق",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center group hover:shadow-xl transition-all duration-300"
                  variants={slideUp}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-accent-600 dark:bg-accent-500 text-white flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 mx-auto mb-4 text-accent-600 dark:text-accent-400 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-bold text-accent-600 dark:text-accent-400 mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          ref={featuresRef}
          className="py-24 bg-gradient-to-b from-white to-primary-50 dark:from-gray-900 dark:to-primary-900 relative overflow-hidden"
          initial="hidden"
          animate={featuresControls}
          variants={stagger}
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-10 left-10 w-48 h-48 rounded-full bg-primary-200/20 dark:bg-primary-700/20 blur-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-secondary-200/20 dark:bg-secondary-700/20 blur-3xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-16" variants={fadeIn}>
              <span className="inline-block px-4 py-2 bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
                ميزاتنا
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">لماذا تختار منصتنا؟</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
                أدوات متطورة لدعم مشروعك الناشئ بأمان وشفافية عبر البلوكشين
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div variants={slideUp}>
                <div className="space-y-6">
                  {[
                    {
                      icon: Briefcase,
                      title: "تمويل تأجيري فقط",
                      desc: "نوفر معدات ومواد عينية بعقود تمويل تاجيري فعالة",
                      color: "primary",
                    },
                    {
                      icon: Lock,
                      title: "عقود بلوكشين آمنة",
                      desc: "كل عقد يُسجل على البلوكشين لضمان الشفافية والحماية",
                      color: "secondary",
                    },
                    {
                      icon: Shield,
                      title: "تخزين سحابي مشفر",
                      desc: "وثائقك وعقودك مخزنة بأمان في السحابة مع تشفير عالي",
                      color: "accent",
                    },
                    {
                      icon: User,
                      title: "لوحة تحكم مخصصة",
                      desc: "لوحة تحكم حسب دورك (صاحب مشروع، مستثمر، إداري) لإدارة كل شيء",
                      color: "primary",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      variants={fadeIn}
                      whileHover={{ y: -5 }}
                    >
                      <div className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900 rounded-full flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-300`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold text-${feature.color}-600 dark:text-${feature.color}-400`}>{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={slideUp}>
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl flex items-center justify-center bg-white dark:bg-gray-700">
                  <LottiePlayer
                    autoplay
                    loop
                    src="/assets/security.json"
                    style={{ width: "80%", height: "80%" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-600/40 to-transparent dark:from-primary-900/40" />
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="inline-block px-4 py-2 bg-white/90 dark:bg-gray-800/90 text-primary-600 dark:text-primary-300 rounded-full text-sm font-medium">
                      منصة موثوقة لبناء مستقبل مشروعك
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          ref={ctaRef}
          className="py-24 bg-gradient-to-b from-white to-accent-50 dark:from-gray-900 dark:to-accent-900 relative overflow-hidden"
          initial="hidden"
          animate={ctaControls}
          variants={stagger}
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-10 left-10 w-48 h-48 rounded-full bg-accent-200/20 dark:bg-accent-700/20 blur-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-primary-200/20 dark:bg-primary-700/20 blur-3xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-16" variants={fadeIn}>
              <span className="inline-block px-4 py-2 bg-accent-50 dark:bg-accent-900 text-accent-600 dark:text-accent-300 rounded-full text-sm font-medium mb-4">
                انطلق الآن
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-accent-600 dark:text-accent-400">
                جاهز باش تبدأ مشروعك أو تدعم فكرة؟
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
                انضم إلى INVESTSTART وابدأ رحلتك نحو النجاح مع عقود أمنة عبر البلوكشين، تمويل تاجيري فقط، بدون نقود! 
              </p>
              <div className="flex justify-center items-center mt-4 text-sm text-primary-600 dark:text-primary-400">
                <Lock className="w-5 h-5 ml-2" />
                <span>عقود موثقة على البلوكشين لضمان الشفافية</span>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={stagger}
            >
              <motion.div
                variants={fadeIn}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group w-full sm:w-auto"
              >
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium text-sm sm:text-base rounded-lg px-6 sm:px-8 py-3 sm:py-4 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Link href="/register">قدّم مشروعك</Link>
                </Button>
                <motion.div
                  className="absolute inset-0 bg-primary-600/20 dark:bg-primary-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              </motion.div>
              <motion.div
                variants={fadeIn}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group w-full sm:w-auto"
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-accent-500 dark:border-accent-400 text-accent-700 dark:text-accent-300 font-medium text-sm sm:text-base rounded-lg px-6 sm:px-8 py-3 sm:py-4 bg-white/80 dark:bg-gray-800/80 hover:bg-accent-50 dark:hover:bg-accent-900/50 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-accent-500/10 dark:hover:shadow-accent-400/10"
                >
                  <Link href="/projects" className="flex items-center gap-2">
                    <span>اكتشف</span>
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}>
                      ←
                    </motion.span>
                  </Link>
                </Button>
                <motion.div
                  className="absolute inset-0 bg-primary-600/20 dark:bg-primary-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
