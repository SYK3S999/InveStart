"use client";

import { useState, useEffect } from "react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/authContext";
import {
  Bell,
  CheckCircle,
  DollarSign,
  FileText,
  MessageSquare,
  Star,
  Trash2,
  Calendar,
  Search,
  Archive,
  Undo2,
  Package,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";
import toast, { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/navbar";

// Mock notifications data with equipment and archive flag
const mockNotifications = [
  {
    id: 1,
    type: "message",
    title: "رسالة جديدة",
    content: "لديك رسالة جديدة من أحمد محمد",
    timestamp: "2023-11-15T14:30:00Z",
    isRead: false,
    isArchived: false,
    actionUrl: "/messages",
    sender: {
      name: "أحمد محمد",
      avatar: "/placeholder.svg?height=40&width=40&text=أ",
    },
  },
  {
    id: 2,
    type: "investment",
    title: "استثمار جديد",
    content: "تم استثمار 500,000 دج في مشروعك 'تطبيق توصيل الطعام'",
    timestamp: "2023-11-15T10:15:00Z",
    isRead: false,
    isArchived: false,
    actionUrl: "/projects/1",
    amount: 500000,
    equipment: [
      { name: "أجهزة حاسوب", quantity: 3, valueDZD: 150000 },
      { name: "خوادم", quantity: 1, valueDZD: 200000 },
    ],
  },
  {
    id: 3,
    type: "document",
    title: "وثيقة جديدة",
    content: "تمت إضافة وثيقة جديدة إلى مشروع 'منصة تعليم إلكتروني'",
    timestamp: "2023-11-14T16:45:00Z",
    isRead: true,
    isArchived: false,
    actionUrl: "/projects/2",
    document: {
      name: "خطة العمل المحدثة.pdf",
    },
  },
  {
    id: 4,
    type: "meeting",
    title: "اجتماع جديد",
    content: "تم جدولة اجتماع مع المستثمر سارة علي",
    timestamp: "2023-11-14T09:20:00Z",
    isRead: true,
    isArchived: false,
    actionUrl: "/calendar",
    meeting: {
      date: "2023-11-20T11:00:00Z",
      duration: 60,
    },
  },
  {
    id: 5,
    type: "project_update",
    title: "تحديث حالة المشروع",
    content: "تمت الموافقة على مشروعك 'مشروع زراعي مستدام'",
    timestamp: "2023-11-13T11:30:00Z",
    isRead: true,
    isArchived: false,
    actionUrl: "/projects/3",
    status: "approved",
  },
  {
    id: 6,
    type: "contract",
    title: "عقد جديد",
    content: "تم إنشاء عقد استثمار جديد بينك وبين المستثمر عمر حسن",
    timestamp: "2023-11-12T14:20:00Z",
    isRead: true,
    isArchived: false,
    actionUrl: "/contracts",
  },
  {
    id: 7,
    type: "milestone",
    title: "إنجاز مرحلة",
    content: "تم إكمال المرحلة الأولى من مشروع 'تطبيق توصيل الطعام'",
    timestamp: "2023-11-11T10:45:00Z",
    isRead: true,
    isArchived: false,
    actionUrl: "/projects/1",
  },
  {
    id: 8,
    type: "system",
    title: "تحديث النظام",
    content: "تم تحديث منصة INEVESTART بميزات جديدة",
    timestamp: "2023-11-10T09:00:00Z",
    isRead: true,
    isArchived: false,
    actionUrl: "/updates",
  },
];

export default function NotificationsPage() {
  const { user } = useAuth();
  type Notification = typeof mockNotifications[number];
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "type">("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const markAsRead = (notificationId: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
    toast.success("تم تعيين الإشعار كمقروء");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })));
    toast.success("تم تعيين جميع الإشعارات كمقروءة");
  };

  const deleteNotification = (notificationId: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== notificationId));
    toast.success("تم حذف الإشعار");
  };

  const archiveNotification = (notificationId: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isArchived: true } : notification
      )
    );
    toast.success("تم أرشفة الإشعار");
  };

  const restoreNotification = (notificationId: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isArchived: false } : notification
      )
    );
    toast.success("تم استعادة الإشعار");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("تم مسح جميع الإشعارات");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-400" />;
      case "investment":
        return <DollarSign className="h-5 w-5 text-green-400" />;
      case "document":
        return <FileText className="h-5 w-5 text-amber-400" />;
      case "meeting":
        return <Calendar className="h-5 w-5 text-purple-400" />;
      case "project_update":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "contract":
        return <FileText className="h-5 w-5 text-red-400" />;
      case "milestone":
        return <Star className="h-5 w-5 text-yellow-400" />;
      case "system":
        return <Bell className="h-5 w-5 text-gray-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString("ar-DZ", { day: "numeric", month: "numeric" });
  };

  const formatDZD = (amount: number) => `${amount.toLocaleString("ar-DZ")} د.ج`;

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter((notification) => {
      if (selectedCategory && notification.type !== selectedCategory) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          notification.title.toLowerCase().includes(searchLower) ||
          notification.content.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "newest") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortOption === "oldest") return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      if (sortOption === "type") return a.type.localeCompare(b.type);
      return 0;
    });

  const unreadNotifications = filteredNotifications.filter((notification) => !notification.isRead && !notification.isArchived);
  const archivedNotifications = filteredNotifications.filter((notification) => notification.isArchived);

  // Notification categories
  const categories = [
    { id: null, label: "الكل" },
    { id: "message", label: "الرسائل" },
    { id: "investment", label: "الاستثمارات" },
    { id: "document", label: "الوثائق" },
    { id: "meeting", label: "الاجتماعات" },
    { id: "project_update", label: "تحديثات المشروع" },
    { id: "contract", label: "العقود" },
    { id: "milestone", label: "الإنجازات" },
    { id: "system", label: "النظام" },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <ProtectedRoute allowedRoles={["startup", "sponsor"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
        <Toaster position="top-right" toastOptions={{ style: { background: '#1F2937', color: '#E5E7EB' } }} />
        <Navbar />
        <main className="flex-1 py-12 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-blue-400 mb-10 md:mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              الإشعارات
            </motion.h1>

            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <Bell className="h-6 w-6 text-blue-400" />
                  <h2 className="text-xl font-semibold">إشعاراتك</h2>
                  {unreadNotifications.length > 0 && (
                    <Badge className="bg-blue-500 text-white">{unreadNotifications.length} جديد</Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="ابحث في الإشعارات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-3 pr-10 rounded-full bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600">
                        ترتيب حسب: {sortOption === "newest" ? "الأحدث" : sortOption === "oldest" ? "الأقدم" : "النوع"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 text-gray-100 border-gray-700">
                      <DropdownMenuItem onClick={() => setSortOption("newest")}>الأحدث</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption("oldest")}>الأقدم</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption("type")}>النوع</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {unreadNotifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead} className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600">
                      تعيين الكل كمقروء
                    </Button>
                  )}
                  {notifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearAllNotifications} className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600">
                      مسح الكل
                    </Button>
                  )}
                </div>
              </div>

              {/* Category Filters */}
              <div className="p-4 sm:p-6 border-b border-gray-700 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id || "all"}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    className={selectedCategory === category.id ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

              <Tabs defaultValue="unread" className="w-full">
                <TabsList className="grid grid-cols-3 p-4 bg-gray-900">
                  <TabsTrigger value="unread" className="relative data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400">
                    غير مقروءة
                    {unreadNotifications.length > 0 && (
                      <Badge className="absolute -top-2 -left-2 bg-blue-500 text-white">
                        {unreadNotifications.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="all" className="data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400">جميع الإشعارات</TabsTrigger>
                  <TabsTrigger value="archived" className="data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400">الأرشيف</TabsTrigger>
                </TabsList>

                <TabsContent value="unread" className="p-4 sm:p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    </div>
                  ) : unreadNotifications.length > 0 ? (
                    <div className="grid gap-4">
                      {unreadNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200"
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <div className="flex items-start gap-4">
                            {notification.sender && (
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={notification.sender.avatar} alt={notification.sender.name} />
                                <AvatarFallback className="bg-gray-700 text-gray-100">{notification.sender.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                            {!notification.sender && (
                              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                {getNotificationIcon(notification.type)}
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                                  {notification.title}
                                  {!notification.isRead && (
                                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                                  )}
                                </h3>
                                <span className="text-xs text-gray-400">{formatNotificationTime(notification.timestamp)}</span>
                              </div>
                              <p className="text-sm text-gray-300 mt-1">{notification.content}</p>

                              {notification.type === "investment" && (
                                <div className="mt-3 p-3 bg-green-900 rounded-md text-sm text-green-300">
                                  <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span>قيمة الاستثمار: {formatDZD(notification.amount || 0)}</span>
                                  </div>
                                  <p className="font-medium flex items-center gap-2">
                                    <Package className="h-4 w-4" /> المعدات المقدمة:
                                  </p>
                                  <ul className="list-disc pr-5 mt-1">
                                    {notification.equipment?.map((item, index) => (
                                      <li key={index}>
                                        {item.name} (الكمية: {item.quantity}، القيمة: {formatDZD(item.valueDZD)})
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {notification.type === "meeting" && (
                                <div className="mt-3 p-3 bg-purple-900 rounded-md text-sm text-purple-300 flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {notification.meeting?.date
                                      ? new Date(notification.meeting.date).toLocaleDateString("ar-DZ")
                                      : ""}{" "}
                                    -{" "}
                                    {notification.meeting?.date
                                      ? new Date(notification.meeting.date).toLocaleTimeString("ar-DZ", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : ""}
                                  </span>
                                </div>
                              )}

                              {notification.type === "document" && (
                                <div className="mt-3 p-3 bg-amber-900 rounded-md text-sm text-amber-300 flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span>{notification.document?.name}</span>
                                </div>
                              )}

                              <div className="mt-3 flex gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button asChild variant="default" size="sm" className="bg-blue-500 text-white hover:bg-blue-600">
                                        <Link href={notification.actionUrl}>عرض</Link>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                      <p>عرض التفاصيل</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)} className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600">
                                        تعيين كمقروء
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                      <p>وضع علامة كمقروء</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => archiveNotification(notification.id)}
                                        className="text-gray-400 hover:text-blue-400"
                                      >
                                        <Archive className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                      <p>أرشفة الإشعار</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteNotification(notification.id)}
                                        className="text-gray-400 hover:text-red-400"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                      <p>حذف الإشعار</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="bg-gray-700 rounded-full p-6 mb-4">
                        <CheckCircle className="h-12 w-12 text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-100 mb-2">لا توجد إشعارات غير مقروءة</h3>
                      <p className="text-gray-400 text-center max-w-md mb-4">
                        لقد قمت بقراءة جميع الإشعارات. ستظهر هنا الإشعارات الجديدة عند وصولها.
                      </p>
                      <Button asChild className="bg-blue-500 text-white hover:bg-blue-600">
                        <Link href="/projects">تصفح المشاريع</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="all" className="p-4 sm:p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    </div>
                  ) : filteredNotifications.filter((n) => !n.isArchived).length > 0 ? (
                    <div className="grid gap-4">
                      {filteredNotifications
                        .filter((n) => !n.isArchived)
                        .map((notification) => (
                          <motion.div
                            key={notification.id}
                            className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <div className="flex items-start gap-4">
                              {notification.sender && (
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={notification.sender.avatar} alt={notification.sender.name} />
                                  <AvatarFallback className="bg-gray-700 text-gray-100">{notification.sender.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              )}
                              {!notification.sender && (
                                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                  {getNotificationIcon(notification.type)}
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                                    {notification.title}
                                    {!notification.isRead && (
                                      <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                                    )}
                                  </h3>
                                  <span className="text-xs text-gray-400">{formatNotificationTime(notification.timestamp)}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{notification.content}</p>

                                {notification.type === "investment" && (
                                  <div className="mt-3 p-3 bg-green-900 rounded-md text-sm text-green-300">
                                    <div className="flex items-center gap-2 mb-2">
                                      <DollarSign className="h-4 w-4" />
                                      <span>قيمة الاستثمار: {formatDZD(notification.amount || 0)}</span>
                                    </div>
                                    <p className="font-medium flex items-center gap-2">
                                      <Package className="h-4 w-4" /> المعدات المقدمة:
                                    </p>
                                    <ul className="list-disc pr-5 mt-1">
                                      {notification.equipment?.map((item, index) => (
                                        <li key={index}>
                                          {item.name} (الكمية: {item.quantity}، القيمة: {formatDZD(item.valueDZD)})
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {notification.type === "meeting" && (
                                  <div className="mt-3 p-3 bg-purple-900 rounded-md text-sm text-purple-300 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {notification.meeting?.date
                                        ? new Date(notification.meeting.date).toLocaleDateString("ar-DZ")
                                        : ""}{" "}
                                      -{" "}
                                      {notification.meeting?.date
                                        ? new Date(notification.meeting.date).toLocaleTimeString("ar-DZ", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : ""}
                                    </span>
                                  </div>
                                )}

                                {notification.type === "document" && (
                                  <div className="mt-3 p-3 bg-amber-900 rounded-md text-sm text-amber-300 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span>{notification.document?.name}</span>
                                  </div>
                                )}

                                <div className="mt-3 flex gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button asChild variant="default" size="sm" className="bg-blue-500 text-white hover:bg-blue-600">
                                          <Link href={notification.actionUrl}>عرض</Link>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                        <p>عرض التفاصيل</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  {!notification.isRead && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)} className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600">
                                            تعيين كمقروء
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                          <p>وضع علامة كمقروء</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => archiveNotification(notification.id)}
                                          className="text-gray-400 hover:text-blue-400"
                                        >
                                          <Archive className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                        <p>أرشفة الإشعار</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-gray-400 hover:text-red-400"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                          <p>حذف الإشعار</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="bg-gray-700 rounded-full p-6 mb-4">
                            <Bell className="h-12 w-12 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-100 mb-2">لا توجد إشعارات</h3>
                          <p className="text-gray-400 text-center max-w-md mb-4">
                            ستظهر هنا الإشعارات عند وصولها.
                          </p>
                          <Button asChild className="bg-blue-500 text-white hover:bg-blue-600">
                            <Link href="/projects">تصفح المشاريع</Link>
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="archived" className="p-4 sm:p-6">
                      {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                        </div>
                      ) : archivedNotifications.length > 0 ? (
                        <div className="grid gap-4">
                          {archivedNotifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200"
                              variants={cardVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <div className="flex items-start gap-4">
                                {notification.sender && (
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={notification.sender.avatar} alt={notification.sender.name} />
                                    <AvatarFallback className="bg-gray-700 text-gray-100">{notification.sender.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                )}
                                {!notification.sender && (
                                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                      {notification.title}
                                    </h3>
                                    <span className="text-xs text-gray-400">{formatNotificationTime(notification.timestamp)}</span>
                                  </div>
                                  <p className="text-sm text-gray-400 mt-1">{notification.content}</p>

                                  {notification.type === "investment" && (
                                    <div className="mt-3 p-3 bg-green-900 rounded-md text-sm text-green-300">
                                      <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="h-4 w-4" />
                                        <span>قيمة الاستثمار: {formatDZD(notification.amount || 0)}</span>
                                      </div>
                                      <p className="font-medium flex items-center gap-2">
                                        <Package className="h-4 w-4" /> المعدات المقدمة:
                                      </p>
                                      <ul className="list-disc pr-5 mt-1">
                                        {notification.equipment?.map((item, index) => (
                                          <li key={index}>
                                            {item.name} (الكمية: {item.quantity}، القيمة: {formatDZD(item.valueDZD)})
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {notification.type === "meeting" && (
                                    <div className="mt-3 p-3 bg-purple-900 rounded-md text-sm text-purple-300 flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        {notification.meeting?.date
                                          ? new Date(notification.meeting.date).toLocaleDateString("ar-DZ")
                                          : ""}{" "}
                                        -{" "}
                                        {notification.meeting?.date
                                          ? new Date(notification.meeting.date).toLocaleTimeString("ar-DZ", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })
                                          : ""}
                                      </span>
                                    </div>
                                  )}

                                  {notification.type === "document" && (
                                    <div className="mt-3 p-3 bg-amber-900 rounded-md text-sm text-amber-300 flex items-center gap-2">
                                      <FileText className="h-4 w-4" />
                                      <span>{notification.document?.name}</span>
                                    </div>
                                  )}

                                  <div className="mt-3 flex gap-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button asChild variant="default" size="sm" className="bg-blue-500 text-white hover:bg-blue-600">
                                            <Link href={notification.actionUrl}>عرض</Link>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                          <p>عرض التفاصيل</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => restoreNotification(notification.id)}
                                            className="text-gray-400 hover:text-blue-400"
                                          >
                                            <Undo2 className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                          <p>استعادة الإشعار</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-gray-400 hover:text-red-400"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                          <p>حذف الإشعار</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="bg-gray-700 rounded-full p-6 mb-4">
                            <Archive className="h-12 w-12 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-100 mb-2">لا توجد إشعارات مؤرشفة</h3>
                          <p className="text-gray-400 text-center max-w-md mb-4">
                            يمكنك أرشفة الإشعارات لتنظيمها هنا.
                          </p>
                          <Button asChild className="bg-blue-500 text-white hover:bg-blue-600">
                            <Link href="/messages">View Messages</Link>
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </ProtectedRoute>
      );
    }