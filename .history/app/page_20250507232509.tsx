"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FeaturedProjects } from "@/components/featured-projects";
import { Button } from "@/components/ui/button";
import { initializeStorage } from "@/lib/storage";
import { ArrowLeft, BarChart3, Briefcase, Lightbulb, Quote, Rocket, Search, User, Users } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";

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
      value: "+١٠٠", 
      label: "مشروع ممول", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-4 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
      bgGradient: "from-primary-100 to-cream",
      accentColor: "primary",
    },
    { 
      value: "+٥٠٠", 
      label: "مستثمر نشط", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-4 text-secondary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      bgGradient: "from-secondary-100 to-cream",
      accentColor: "secondary",
    },
    { 
      value: "+٢٠٠", 
      label: "صاحب فكرة", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-4 text-accent-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6" />
          <path d="M14 3v5h5M18 16.66A2 2 0 1 0 18 21a2 2 0 1 0 0-4.34V16.66z" />
          <path d="M18 20V8" />
        </svg>
      ),
      bgGradient: "from-accent-100 to-cream",
      accentColor: "accent",
    },
    { 
      value: "+١٠٠م", 
      label: "دينار مستثمر", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-4 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      bgGradient: "from-primary-100 to-cream",
      accentColor: "primary",
    },
  ];

  // Animation variants
  const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } };
  const slideUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };
  const stagger = { visible: { transition: { staggerChildren: 0.2 } } };
  const pulse = { hidden: { scale: 1 }, visible: { scale: [1, 1.05, 1], transition: { duration: 2, repeat: Infinity } } };

  return (
    <div className="flex flex-col min-h-screen bg-cream font-amiri">
      {/* <Navbar /> */}

      <main>
        {/* Hero Section */}

    <motion.section
      ref={heroRef}
      className="relative min-h-screen flex items-center py-20 md:py-28 bg-gradient-to-br from-slate-50 via-primary-50 to-primary-100 text-slate-900 overflow-hidden"
      initial="hidden"
      animate={heroControls}
      variants={stagger}
    >
      {/* Optimized Background Elements */}
      <motion.div
        className="absolute inset-0 bg-[url('/patterns/soft-waves.png')] bg-repeat opacity-8 mix-blend-soft-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 2 }}
      />

      {/* Refined Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[10%] left-[15%] w-40 h-40 bg-primary-300 rounded-full opacity-10 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1], x: [0, 5, 0], y: [0, -5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[10%] w-56 h-56 bg-primary-400 rounded-full opacity-8 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.12, 0.08], x: [0, -8, 0], y: [0, 8, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-32 h-32 bg-accent-300 rounded-full opacity-8 blur-2xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.08, 0.1, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-30"
          animate={{ opacity: [0.3, 0.35, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div className="order-2 md:order-1 text-right font-sans" variants={fadeIn}>
            <motion.div
              className="inline-flex items-center mb-6 overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="inline-block text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full bg-primary-100/80 text-primary-700 border border-primary-200/50 shadow-sm backdrop-blur-sm">
                <span className="animate-pulse mr-2 inline-block h-2 w-2 rounded-full bg-primary-500"></span>
                منصة التمويل الجماعي الرائدة في الجزائر
              </span>
            </motion.div>

            <div className="mb-8">
  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-relaxed tracking-normal space-y-3">
    <div className="overflow-hidden">
      <motion.span
        className="inline-block text-primary-700 relative"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        INVESTART
        <motion.span
          className="absolute -bottom-1 left-0 w-full h-1 bg-accent-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />
      </motion.span>
    </div>
    <div className="overflow-hidden mt-6">
  <motion.span
    className="inline-block bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent font-extrabold leading-relaxed tracking-wide"
    initial={{ y: 60, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
  >
    تمويل أفكارك
  </motion.span>
</div>

  </h1>
</div>

            <motion.p
              className="text-base sm:text-lg mb-8 text-slate-700 leading-relaxed max-w-lg mr-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              منصة تمويل جماعي متطورة تربط رواد الأعمال بالمستثمرين في الجزائر، مع دعم نقدي وعيني (معدات، أراضي) بنظام الاعتماد المستندي.
            </motion.p>

            <motion.ul
              className="space-y-4 mb-10 text-slate-700"
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
                    className={`flex items-center justify-center w-6 h-6 rounded-full bg-${item.color}-50 text-${item.color}-600 shadow-sm border border-${item.color}-200 text-xs`}
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
                <Button
                  asChild
                  size="lg"
                  className="bg-primary-600 text-white font-medium text-sm sm:text-base rounded-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 border border-primary-500/30 group"
                >
                  <Link href="/submit" className="relative overflow-hidden">
                    <span className="relative z-10">إبدأ الآن</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <motion.span
                      className="absolute right-full top-0 h-full w-[150%] bg-white/20 skew-x-12"
                      animate={{ right: "-150%" }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-accent-500 text-accent-700 font-medium text-sm sm:text-base rounded-lg px-6 sm:px-8 py-3 sm:py-4 bg-white/80 hover:bg-accent-50 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-accent-500/10"
                >
                  <Link href="/projects" className="flex items-center gap-2">
                    <span>اكتشف</span>
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}>
                      ←
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Lottie Animation */}
          <motion.div className="order-1 md:order-2 relative" variants={slideUp}>
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/90 to-primary-50/90 rounded-2xl backdrop-blur-sm shadow-xl border border-white/40"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Player
                  autoplay
                  loop
                  src="/assets/money.json" // Crowdfunding-themed animation
                  style={{ width: "100%", height: "100%" }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Bottom Wave Transition */}
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
            opacity="1"
          />
        </svg>
      </motion.div>
    </motion.section>
  );

        {/* Stats Section */}
        <motion.section
  ref={statsRef}
  className="py-24 bg-gradient-to-b from-cream to-primary-100 relative overflow-hidden"
  initial="hidden"
  animate={statsControls}
  variants={stagger}
>
  {/* Background decoration elements */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-primary-200/30 blur-2xl"></div>
    <div className="absolute top-1/2 -right-24 w-72 h-72 rounded-full bg-primary-300/20 blur-3xl"></div>
    <div className="absolute -bottom-16 left-1/4 w-48 h-48 rounded-full bg-primary-400/10 blur-xl"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    <motion.div className="text-center mb-20" variants={fadeIn}>
      <h2 className="text-3xl md:text-5xl font-bold mb-5">
        <span className="text-primary-600">احصائيات</span> <span className="text-primary-500">المنصة</span>
      </h2>
      <div className="w-20 h-1.5 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full"></div>
    </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {statsData.map((stat, index) => (
        <motion.div
          key={index}
          className="relative backdrop-blur-sm rounded-3xl transition-all duration-300 group"
          variants={fadeIn}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-3xl opacity-90`}></div>
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 filter brightness-105`}></div>
          
          <div className="relative p-8 flex flex-col items-center text-center">
            <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
              {stat.icon}
            </div>
            <div className="flex flex-col items-center">
              <motion.p 
                className={`text-5xl md:text-6xl font-extrabold mb-3 text-${stat.accentColor}-700`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {stat.value}
              </motion.p>
              <p className={`text-${stat.accentColor}-700 font-medium text-lg`}>{stat.label}</p>
            </div>
            
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-${stat.accentColor}-300 rounded-t-full opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>


        {/* Featured Projects */}
{/* Featured Projects */}
<motion.section
  ref={projectsRef}
  className="py-24 bg-gradient-to-b from-white to-cream relative overflow-hidden"
  initial="hidden"
  animate={projectsControls}
  variants={stagger}
>
  {/* New geometric background elements to match How It Works section */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    <div className="absolute top-10 right-10 w-64 h-64 rounded-full border-4 border-dashed border-primary-200/30 opacity-50"></div>
    <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full border-2 border-primary-300/20"></div>
    <div className="absolute top-1/3 left-1/3 w-16 h-16 rotate-45 border-2 border-primary-200/30"></div>
    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-primary-200/30 rounded-lg rotate-12"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    <motion.div className="text-center mb-16" variants={fadeIn}>
      <span className="inline-block px-5 py-2 bg-primary-50 text-primary-500 rounded-full text-sm font-semibold mb-4 shadow-sm">
        أفضل المشاريع
      </span>
      <h2 className="text-3xl md:text-5xl font-bold mb-5 text-primary-500">مشاريع مميزة</h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        استكشف أبرز المشاريع المبتكرة التي تنتظر دعمك لتحلق عاليًا
      </p>
    </motion.div>

    <FeaturedProjects />

    <motion.div 
      className="text-center mt-16" 
      variants={fadeIn}
      whileHover="hover"
    >
      <Button
        asChild
        variant="outline"
        className="relative overflow-hidden group border-2 border-primary-500 text-primary-500 font-semibold rounded-full px-8 py-3 bg-white/80 hover:bg-primary-50 transition-all duration-300 shadow-md"
      >
        <Link href="/projects" className="flex items-center gap-3">
          <span className="relative z-10">عرض جميع المشاريع</span>
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-2 transition-transform duration-300 relative z-10" />
          <span className="absolute inset-0 bg-gradient-to-r from-primary-200 to-primary-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Link>
      </Button>
    </motion.div>
  </div>
</motion.section>
        {/* How It Works */}
<motion.section
  ref={howItWorksRef}
  className="py-24 bg-gradient-to-b from-white to-cream relative overflow-hidden"
  initial="hidden"
  animate={howItWorksControls}
  variants={stagger}
>
  {/* New geometric background elements */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    <div className="absolute top-10 right-10 w-64 h-64 rounded-full border-4 border-dashed border-primary-200/30 opacity-50"></div>
    <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full border-2 border-primary-300/20"></div>
    <div className="absolute top-1/3 left-1/3 w-16 h-16 rotate-45 border-2 border-primary-200/30"></div>
    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-primary-200/30 rounded-lg rotate-12"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    <motion.div className="text-center mb-16" variants={fadeIn}>
      <span className="inline-block px-5 py-2 bg-primary-50 text-primary-500 rounded-full text-sm font-semibold mb-4 shadow-sm">
        دليل بسيط
      </span>
      <h2 className="text-3xl md:text-5xl font-bold mb-5 text-primary-500">كيف تعمل منصتنا؟</h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        خطوات سهلة وحديثة لتحويل أفكارك إلى مشاريع ناجحة
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
      {/* Steps connection line - using dots instead of solid line */}
      <div className="hidden md:flex absolute top-20 left-0 right-0 justify-center space-x-4">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent"></div>
      </div>
      
      {[
        { icon: Lightbulb, title: "قدّم مشروعك", desc: "أنشئ صفحتك وأضف التفاصيل لجذب الدعم" },
        { icon: Users, title: "تواصل مع المستثمرين", desc: "ابنِ الثقة عبر رسائل مدمجة" },
        { icon: Rocket, title: "احصل على التمويل", desc: "استلم الدعم وانطلق بمشروعك" },
      ].map((step, index) => (
        <motion.div
          key={index}
          className="relative group"
          variants={slideUp}
          whileHover={{ y: -5 }}
        >
          {/* Number indicator circle */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-primary-100 flex items-center justify-center z-10">
            <span className="text-primary-500 font-bold">{index + 1}</span>
          </div>
          
          {/* Main card with clean design */}
          <div className="bg-white rounded-xl p-8 pt-10 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100/50 h-full">
            {/* Icon container */}
            <div className="w-16 h-16 mx-auto mb-6 text-primary-500 transform transition-transform duration-300 group-hover:scale-110 group-hover:text-primary-600">
              <step.icon className="h-full w-full" />
            </div>
            
            <h3 className="text-xl font-bold mb-4 text-primary-500 text-center">{step.title}</h3>
            <p className="text-gray-600 text-center">{step.desc}</p>
          </div>
          
          {/* Bottom accent bar */}
          <div className="h-1.5 w-0 group-hover:w-full bg-primary-400 mx-auto rounded-b-xl transition-all duration-300 ease-out"></div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>
     



{/* Features Section */}
<motion.section
  ref={featuresRef}
  className="py-24 bg-gradient-to-b from-cream via-white to-accent-50 relative overflow-hidden"
  initial="hidden"
  animate={featuresControls}
  variants={stagger}
>
  {/* Background Decoration Elements */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    <motion.div
      className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-primary-300/30 blur-3xl shadow-neumorphic"
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-primary-400/20 blur-3xl shadow-neumorphic-hover"
      animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.div
      className="absolute -bottom-20 right-1/5 w-56 h-56 rounded-full bg-primary-500/15 blur-2xl"
      animate={{ scale: [1, 1.1, 1], x: [0, 10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
  </div>

  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <motion.div
      className="text-center mb-12 md:mb-16"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <motion.span
        className="inline-block px-5 py-2 bg-primary-50 text-primary-500 rounded-full text-sm md:text-base font-semibold mb-4 shadow-neumorphic border border-primary-200/50 backdrop-blur-sm"
        whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)" }}
        transition={{ duration: 0.3 }}
      >
        ميزات حصرية
      </motion.span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-500 mt-10 mb-10 py-5 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
      مميزات لنمو مشروعك
      </h2>
      <motion.div
        className="w-20 h-1.5 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-500 mx-auto rounded-full mb-6"
        initial={{ width: 0 }}
        animate={{ width: 80 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-5">
        أدوات متطورة وخدمات متميزة لضمان نجاح مشروعك من البداية إلى التمويل
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
      <motion.div variants={slideUp} className="order-2 md:order-1">
        <div className="space-y-8">
          {[
            {
              icon: Briefcase,
              title: "تمويل نقدي وعيني",
              desc: "حلول تمويلية مرنة تشمل الدعم النقدي والعيني (معدات، أراضي) لتلبية احتياجات مشروعك",
              color: "primary",
            },
            {
              icon: BarChart3,
              title: "متابعة التقدم",
              desc: "لوحة تحكم متطورة مع إحصائيات في الوقت الفعلي لمراقبة نمو مشروعك وتحليل الأداء",
              color: "primary",
            },
            {
              icon: Users,
              title: "شبكة مستثمرين",
              desc: "اتصال مباشر بمجتمع من المستثمرين المؤهلين المهتمين بدعم المشاريع المبتكرة",
              color: "primary",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="flex gap-6 p-6 rounded-2xl bg-white shadow-neumorphic hover:shadow-neumorphic-hover hover:bg-primary-50 transition-all duration-500 group"
              variants={fadeIn}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className={`flex-shrink-0 w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-500 shadow-md group-hover:bg-primary-200 group-hover:text-primary-600 transition-all duration-300`}
              >
                <feature.icon className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-primary-500 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div className="relative order-1 md:order-2" variants={slideUp}>
        <div className="relative h-96 md:h-[28rem] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 border-8 border-white/80 backdrop-blur-sm">
          <Image
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
            alt="مميزات منصة INVESTART"
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-500/40 via-transparent to-transparent"></div>
          <motion.div
            className="absolute bottom-8 left-0 right-0 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="inline-block px-6 py-3 bg-white/90 text-primary-500 rounded-full text-lg font-semibold shadow-lg backdrop-blur-sm border border-primary-200/50 hover:bg-primary-50 transition-all duration-300">
              بيئة مثالية للنمو والابتكار
            </span>
          </motion.div>
        </div>
        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-300 rounded-full opacity-20 blur-2xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -top-10 -right-10 w-40 h-40 bg-primary-400 rounded-full opacity-20 blur-2xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.div>
    </div>
  </div>
</motion.section>

{/* Call to Action */}
<motion.section
  ref={ctaRef}
  className="py-24 bg-gradient-to-b from-cream via-white to-accent-50 relative overflow-hidden"
  initial="hidden"
  animate={ctaControls}
  variants={stagger}
>
  {/* Background Decoration Elements */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    <motion.div
      className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-primary-300/30 blur-3xl shadow-neumorphic"
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-primary-400/20 blur-3xl shadow-neumorphic-hover"
      animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.div
      className="absolute -bottom-20 right-1/5 w-56 h-56 rounded-full bg-primary-500/15 blur-2xl"
      animate={{ scale: [1, 1.1, 1], x: [0, 10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
  </div>

  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <motion.div
      className="text-center mb-12 md:mb-16"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <motion.span
        className="inline-block px-5 py-2 bg-primary-50 text-primary-500 rounded-full text-sm md:text-base font-semibold mb-4 shadow-neumorphic border border-primary-200/50 backdrop-blur-sm"
        whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)" }}
        transition={{ duration: 0.3 }}
      >
        انطلق الآن
      </motion.span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-500 mt-10 mb-10 py-5 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
  جاهز لتحقيق حلمك؟
</h2>

      <motion.div
        className="w-20 h-1.5 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-500 mx-auto rounded-full mb-6"
        initial={{ width: 0 }}
        animate={{ width: 80 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            اليوم وابدأ رحلتك نحو النجاح مع دعم المستثمرين INVESTART انضم إلى
      </p>
    </motion.div>

    <motion.div
      className="flex flex-col sm:flex-row gap-6 justify-center items-center"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={fadeIn}
        whileHover={{ scale: 1.1, y: -8 }}
        whileTap={{ scale: 0.95 }}
        className="relative group w-full sm:w-auto"
      >
        <Button
          asChild
          size="lg"
          className="bg-primary-500 text-white font-semibold rounded-full px-10 py-4 shadow-neumorphic hover:bg-primary-600 hover:shadow-neumorphic-hover transition-all duration-500 border border-primary-400/50 backdrop-blur-sm w-full sm:w-auto"
        >
          <Link href="/submit">قدّم مشروعك الآن</Link>
        </Button>
        <motion.div
          className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      </motion.div>
      <motion.div
        variants={fadeIn}
        whileHover={{ scale: 1.1, y: -8 }}
        whileTap={{ scale: 0.95 }}
        className="relative group w-full sm:w-auto"
      >
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-primary-500 text-primary-500 font-semibold rounded-full px-10 py-4 bg-white hover:bg-primary-100 hover:shadow-neumorphic transition-all duration-500 shadow-md w-full sm:w-auto"
        >
          <Link href="/projects">استكشف المشاريع</Link>
        </Button>
        <motion.div
          className="absolute inset-0 bg-primary-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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