"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import { Bell, CheckCircle, DollarSign, FileText, MessageSquare, Star, Trash2, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "message",
    title: "رسالة جديدة",
    content: "لديك رسالة جديدة من أحمد محمد",
    timestamp: "2023-11-15T14:30:00Z",
    isRead: false,
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
    actionUrl: "/projects/1",
    amount: 500000,
  },
  {
    id: 3,
    type: "document",
    title: "وثيقة جديدة",
    content: "تمت إضافة وثيقة جديدة إلى مشروع 'منصة تعليم إلكتروني'",
    timestamp: "2023-11-14T16:45:00Z",
    isRead: true,
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
    actionUrl: "/contracts",
  },
  {
    id: 7,
    type: "milestone",
    title: "إنجاز مرحلة",
    content: "تم إكمال المرحلة الأولى من مشروع 'تطبيق توصيل الطعام'",
    timestamp: "2023-11-11T10:45:00Z",
    isRead: true,
    actionUrl: "/projects/1",
  },
  {
    id: 8,
    type: "system",
    title: "تحديث النظام",
    content: "تم تحديث منصة INEVESTART بميزات جديدة",
    timestamp: "2023-11-10T09:00:00Z",
    isRead: true,
    actionUrl: "/updates",
  },
]

export default function NotificationsPage() {
  const { user } = useAuth()
  type Notification = typeof mockNotifications[number]
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch notifications
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
      setNotifications(mockNotifications)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const unreadNotifications = notifications.filter((notification) => !notification.isRead)
  const readNotifications = notifications.filter((notification) => notification.isRead)

  const markAsRead = (notificationId: any) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (notificationId: any) => {
    setNotifications(notifications.filter((notification) => notification.id !== notificationId))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: any) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "investment":
        return <DollarSign className="h-5 w-5 text-green-500" />
      case "document":
        return <FileText className="h-5 w-5 text-amber-500" />
      case "meeting":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "project_update":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "contract":
        return <FileText className="h-5 w-5 text-red-500" />
      case "milestone":
        return <Star className="h-5 w-5 text-yellow-500" />
      case "system":
        return <Bell className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatNotificationTime = (timestamp: string | number | Date) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `منذ ${diffMins} دقيقة`
    } else if (diffHours < 24) {
      return `منذ ${diffHours} ساعة`
    } else if (diffDays < 7) {
      return `منذ ${diffDays} يوم`
    } else {
      return date.toLocaleDateString("ar-DZ", { day: "numeric", month: "numeric" })
    }
  }

  return (
    <ProtectedRoute allowedRole="startup-owner">
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Navbar />
        <main className="flex-1 py-12 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary-500 mb-10 md:mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              الإشعارات
            </motion.h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-primary-500 ml-2" />
                  <h2 className="text-lg font-medium">إشعاراتك</h2>
                  {unreadNotifications.length > 0 && (
                    <Badge variant="secondary" className="mr-2">
                      {unreadNotifications.length} جديد
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {unreadNotifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                      تعيين الكل كمقروء
                    </Button>
                  )}
                  {notifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearAllNotifications}>
                      مسح الكل
                    </Button>
                  )}
                </div>
              </div>

              <Tabs defaultValue="unread" className="w-full">
                <TabsList className="grid grid-cols-2 p-4">
                  <TabsTrigger value="unread" className="relative">
                    غير مقروءة
                    {unreadNotifications.length > 0 && (
                      <Badge variant="secondary" className="absolute -top-2 -left-2">
                        {unreadNotifications.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="all">جميع الإشعارات</TabsTrigger>
                </TabsList>

                <TabsContent value="unread" className="p-0">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  ) : unreadNotifications.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {unreadNotifications.map((notification) => (
                        <li key={notification.id} className="relative hover:bg-gray-50 transition-colors duration-150">
                          <div className="p-4">
                            <div className="flex">
                              <div className="flex-shrink-0 mt-1">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                  {getNotificationIcon(notification.type)}
                                </div>
                              </div>
                              <div className="mr-4 flex-1">
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                                  <span className="text-xs text-gray-500">
                                    {formatNotificationTime(notification.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{notification.content}</p>

                                {notification.type === "investment" && (
                                  <div className="mt-2 p-2 bg-green-50 rounded-md text-sm text-green-700 flex items-center">
                                    <DollarSign className="h-4 w-4 ml-1" />
                                    <span>{notification.amount?.toLocaleString("ar-DZ")} دج</span>
                                  </div>
                                )}

                                {notification.type === "meeting" && (
                                  <div className="mt-2 p-2 bg-purple-50 rounded-md text-sm text-purple-700 flex items-center">
                                    <Calendar className="h-4 w-4 ml-1" />
                                    <span>
                                      {notification.meeting?.date ? new Date(notification.meeting.date).toLocaleDateString("ar-DZ") : ""} -{" "}
                                      {notification.meeting?.date
                                        ? new Date(notification.meeting.date).toLocaleTimeString("ar-DZ", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : ""}
                                    </span>
                                  </div>
                                )}

                                <div className="mt-2 flex gap-2">
                                  <Button asChild variant="outline" size="sm">
                                    <Link href={notification.actionUrl}>عرض</Link>
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                    تعيين كمقروء
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="bg-gray-100 rounded-full p-6 mb-4">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-700 mb-2">لا توجد إشعارات غير مقروءة</h3>
                      <p className="text-gray-500 text-center max-w-md">
                        لقد قمت بقراءة جميع الإشعارات. ستظهر هنا الإشعارات الجديدة عند وصولها.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="all" className="p-0">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  ) : notifications.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {notifications.map((notification) => (
                        <li key={notification.id} className="relative hover:bg-gray-50 transition-colors duration-150">
                          <div className="p-4">
                            <div className="flex">
                              <div className="flex-shrink-0 mt-1">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                  {getNotificationIcon(notification.type)}
                                </div>
                              </div>
                              <div className="mr-4 flex-1">
                                <div className="flex justify-between">
                                  <h3
                                    className={`text-sm font-medium ${notification.isRead ? "text-gray-700" : "text-gray-900"}`}
                                  >
                                    {notification.title}
                                    {!notification.isRead && (
                                      <span className="mr-2 inline-block w-2 h-2 bg-primary-500 rounded-full"></span>
                                    )}
                                  </h3>
                                  <span className="text-xs text-gray-500">
                                    {formatNotificationTime(notification.timestamp)}
                                  </span>
                                </div>
                                <p
                                  className={`text-sm mt-1 ${notification.isRead ? "text-gray-500" : "text-gray-600"}`}
                                >
                                  {notification.content}
                                </p>

                                {notification.type === "investment" && (
                                  <div className="mt-2 p-2 bg-green-50 rounded-md text-sm text-green-700 flex items-center">
                                    <DollarSign className="h-4 w-4 ml-1" />
                                    <span>{notification.amount?.toLocaleString("ar-DZ")} دج</span>
                                  </div>
                                )}

                                {notification.type === "meeting" && (
                                  <div className="mt-2 p-2 bg-purple-50 rounded-md text-sm text-purple-700 flex items-center">
                                    <Calendar className="h-4 w-4 ml-1" />
                                    <span>
                                      {notification.meeting?.date ? new Date(notification.meeting.date).toLocaleDateString("ar-DZ") : ""} -{" "}
                                      {notification.meeting?.date
                                        ? new Date(notification.meeting.date).toLocaleTimeString("ar-DZ", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : ""}
                                    </span>
                                  </div>
                                )}

                                <div className="mt-2">
                                  <Button asChild variant="outline" size="sm">
                                    <Link href={notification.actionUrl}>عرض</Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="bg-gray-100 rounded-full p-6 mb-4">
                        <Bell className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-700 mb-2">لا توجد إشعارات</h3>
                      <p className="text-gray-500 text-center max-w-md">ستظهر هنا الإشعارات عند وصولها.</p>
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
  )
}
