/**
 * INEVESTART Platform Routing Configuration
 *
 * This file defines the complete routing structure for the application,
 * organizing routes into logical groups and providing metadata for navigation.
 */

export type RouteConfig = {
    path: string
    label: string
    icon?: string
    description?: string
    roles?: Array<"public" | "startup" | "sponsor" | "admin">
    children?: RouteConfig[]
    showInNavbar?: boolean
    showInSidebar?: boolean
    showInFooter?: boolean
    badge?: string
    isNew?: boolean
    isExternal?: boolean
    externalUrl?: string
  }
  
  // Public Routes - Accessible to all users
  export const publicRoutes: RouteConfig[] = [
    {
      path: "/",
      label: "الرئيسية",
      description: "الصفحة الرئيسية للمنصة",
      showInNavbar: true,
      showInFooter: true,
      roles: ["public", "startup", "sponsor", "admin"],
    },
    {
      path: "/about",
      label: "من نحن",
      description: "معلومات عن منصة INEVESTART",
      showInNavbar: true,
      showInFooter: true,
      roles: ["public", "startup", "sponsor", "admin"],
    },
    {
      path: "/projects",
      label: "المشاريع",
      description: "استعراض المشاريع المتاحة للتمويل",
      showInNavbar: true,
      showInFooter: true,
      roles: ["public", "startup", "sponsor", "admin"],
    },
    {
      path: "/sponsors",
      label: "الرعاة",
      description: "قائمة الرعاة والمستثمرين",
      showInNavbar: true,
      showInFooter: true,
      roles: ["public", "startup", "sponsor", "admin"],
    },
    {
      path: "/contact",
      label: "اتصل بنا",
      description: "تواصل مع فريق المنصة",
      showInNavbar: true,
      showInFooter: true,
      roles: ["public", "startup", "sponsor", "admin"],
    },
    {
      path: "/security",
      label: "الأمان والخصوصية",
      description: "معلومات عن أمان وخصوصية البيانات",
      showInNavbar: false,
      showInFooter: true,
      roles: ["public", "startup", "sponsor", "admin"],
    },
    {
      path: "/login",
      label: "تسجيل الدخول",
      description: "تسجيل الدخول إلى حسابك",
      showInNavbar: true,
      showInFooter: false,
      roles: ["public"],
    },
    {
      path: "/register",
      label: "التسجيل",
      description: "إنشاء حساب جديد",
      showInNavbar: true,
      showInFooter: false,
      roles: ["public"],
    },
    {
      path: "/onboarding",
      label: "إعداد الحساب",
      description: "إكمال إعداد حسابك",
      showInNavbar: false,
      showInFooter: false,
      roles: ["startup", "sponsor"],
    },
  ]
  
  // Project Routes - Related to project management
  export const projectRoutes: RouteConfig[] = [
    {
      path: "/projects/my",
      label: "مشاريعي",
      description: "إدارة المشاريع الخاصة بك",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["startup"],
    },
    {
      path: "/projects/submit",
      label: "تقديم مشروع",
      description: "تقديم مشروع جديد للتمويل",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["startup"],
      isNew: true,
    },
    {
      path: "/projects/pending",
      label: "المشاريع المعلقة",
      description: "مراجعة المشاريع المعلقة",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["admin"],
      badge: "new",
    },
    {
      path: "/projects/:id",
      label: "تفاصيل المشروع",
      description: "عرض تفاصيل المشروع",
      showInNavbar: false,
      showInSidebar: false,
      roles: ["public", "startup", "sponsor", "admin"],
    },
    {
      path: "/projects/edit/:id",
      label: "تعديل المشروع",
      description: "تعديل تفاصيل المشروع",
      showInNavbar: false,
      showInSidebar: false,
      roles: ["startup"],
    },
    {
      path: "/projects/stats/:id",
      label: "إحصائيات المشروع",
      description: "عرض إحصائيات المشروع",
      showInNavbar: false,
      showInSidebar: false,
      roles: ["startup", "sponsor"],
    },
  ]
  
  // Dashboard Routes - Related to user dashboards
  export const dashboardRoutes: RouteConfig[] = [
    {
      path: "/dashboard",
      label: "لوحة التحكم",
      description: "لوحة التحكم الرئيسية",
      showInNavbar: true,
      showInSidebar: true,
      roles: ["startup", "sponsor", "admin"],
    },
    {
      path: "/dashboard/startup",
      label: "لوحة تحكم المشروع",
      description: "لوحة تحكم خاصة بأصحاب المشاريع",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["startup"],
    },
    {
      path: "/dashboard/sponsor",
      label: "لوحة تحكم المستثمر",
      description: "لوحة تحكم خاصة بالمستثمرين",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["sponsor"],
    },
    {
      path: "/dashboard/admin",
      label: "لوحة تحكم المشرف",
      description: "لوحة تحكم خاصة بالمشرفين",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["admin"],
    },
  ]
  
  // Investment Routes - Related to investments
  export const investmentRoutes: RouteConfig[] = [
    {
      path: "/investments",
      label: "استثماراتي",
      description: "إدارة استثماراتك",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["sponsor"],
    },
    {
      path: "/investments/:id",
      label: "تفاصيل الاستثمار",
      description: "عرض تفاصيل الاستثمار",
      showInNavbar: false,
      showInSidebar: false,
      roles: ["sponsor"],
    },
  ]
  
  // Communication Routes - Related to messaging and notifications
  export const communicationRoutes: RouteConfig[] = [
    {
      path: "/messages",
      label: "المحادثات",
      description: "إدارة المحادثات",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["startup", "sponsor", "admin"],
      badge: "unread",
    },
    {
      path: "/notifications",
      label: "الإشعارات",
      description: "عرض الإشعارات",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["startup", "sponsor", "admin"],
      badge: "unread",
    },
  ]
  
  // Analytics Routes - Related to data analysis
  export const analyticsRoutes: RouteConfig[] = [
    {
      path: "/analytics",
      label: "التحليلات",
      description: "عرض تحليلات البيانات",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["startup", "sponsor", "admin"],
    },
    {
      path: "/analytics/projects",
      label: "تحليلات المشاريع",
      description: "تحليلات خاصة بالمشاريع",
      showInNavbar: false,
      showInSidebar: false,
      roles: ["startup", "admin"],
    },
    {
      path: "/analytics/investments",
      label: "تحليلات الاستثمارات",
      description: "تحليلات خاصة بالاستثمارات",
      showInNavbar: false,
      showInSidebar: false,
      roles: ["sponsor", "admin"],
    },
  ]
  
  // Management Routes - Related to platform management
  export const managementRoutes: RouteConfig[] = [
    {
      path: "/users",
      label: "إدارة المستخدمين",
      description: "إدارة مستخدمي المنصة",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["admin"],
    },
    {
      path: "/reports",
      label: "التقارير",
      description: "عرض وإدارة التقارير",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["admin"],
    },
  ]
  
  // Settings Routes - Related to user settings
  export const settingsRoutes: RouteConfig[] = [
    {
      path: "/settings/startup",
      label: "إعدادات المشروع",
      description: "إدارة إعدادات المشروع",
      showInNavbar: false,
      showInSidebar: false,
      roles: ["startup"],
    },
    {
      path: "/settings/sponsor",
      label: "إعدادات المستثمر",
      description: "إدارة إعدادات المستثمر",
      showInNavbar: false,
      showInSidebar: false,
      roles: ["sponsor"],
    },
    {
      path: "/settings/admin",
      label: "إعدادات المشرف",
      description: "إدارة إعدادات المشرف",
      showInNavbar: false,
      showInSidebar: false,
      roles: ["admin"],
    },
  ]
  
  // Utility Routes - Miscellaneous utility pages
  export const utilityRoutes: RouteConfig[] = [
    {
      path: "/calendar",
      label: "التقويم",
      description: "عرض وإدارة المواعيد",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["startup", "sponsor", "admin"],
    },
    {
      path: "/contracts",
      label: "العقود",
      description: "عرض وإدارة العقود",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["startup", "sponsor", "admin"],
    },
    {
      path: "/blockchain-explorer",
      label: "مستكشف البلوكتشين",
      description: "استكشاف معاملات البلوكتشين",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["startup", "sponsor", "admin"],
      isNew: true,
    },
    {
      path: "/blockchain-cloud-integration",
      label: "تكامل البلوكتشين والسحابة",
      description: "معلومات عن تكامل البلوكتشين والسحابة",
      showInNavbar: false,
      showInSidebar: true,
      roles: ["startup", "sponsor", "admin"],
      isNew: true,
    },
  ]
  
  // Error Routes - Error pages
  export const errorRoutes: RouteConfig[] = [
    {
      path: "/404",
      label: "صفحة غير موجودة",
      description: "الصفحة غير موجودة",
      showInNavbar: false,
      showInSidebar: false,
      roles: ["public", "startup", "sponsor", "admin"],
    },
    {
      path: "/500",
      label: "خطأ في الخادم",
      description: "حدث خطأ في الخادم",
      showInNavbar: false,
      showInSidebar: false,
      roles: ["public", "startup", "sponsor", "admin"],
    },
    {
      path: "/unauthorized",
      label: "غير مصرح",
      description: "غير مصرح بالوصول",
      showInNavbar: false,
      showInSidebar: false,
      roles: ["public", "startup", "sponsor", "admin"],
    },
  ]
  
  // Combine all routes
  export const allRoutes: RouteConfig[] = [
    ...publicRoutes,
    ...projectRoutes,
    ...dashboardRoutes,
    ...investmentRoutes,
    ...communicationRoutes,
    ...analyticsRoutes,
    ...managementRoutes,
    ...settingsRoutes,
    ...utilityRoutes,
    ...errorRoutes,
  ]
  
  // Helper functions to get routes by role
  export const getRoutesByRole = (role: "public" | "startup" | "sponsor" | "admin"): RouteConfig[] => {
    return allRoutes.filter((route) => route.roles?.includes(role))
  }
  
  // Get navbar routes by role
  export const getNavbarRoutes = (role: "public" | "startup" | "sponsor" | "admin"): RouteConfig[] => {
    return getRoutesByRole(role).filter((route) => route.showInNavbar)
  }
  
  // Get sidebar routes by role
  export const getSidebarRoutes = (role: "public" | "startup" | "sponsor" | "admin"): RouteConfig[] => {
    return getRoutesByRole(role).filter((route) => route.showInSidebar)
  }
  
  // Get footer routes by role
  export const getFooterRoutes = (role: "public" | "startup" | "sponsor" | "admin"): RouteConfig[] => {
    return getRoutesByRole(role).filter((route) => route.showInFooter)
  }
  
  // Check if a user has access to a specific route
  export const hasRouteAccess = (path: string, role: "public" | "startup" | "sponsor" | "admin"): boolean => {
    const route = allRoutes.find((r) => r.path === path)
    return route?.roles?.includes(role) || false
  }
  