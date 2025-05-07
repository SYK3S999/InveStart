"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Users, Video, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ProtectedRoute from "@/components/ProtectedRoute"

// Mock calendar events data
const mockEvents = [
  {
    id: 1,
    title: "اجتماع مع المستثمر أحمد محمد",
    date: "2023-11-20T11:00:00Z",
    endDate: "2023-11-20T12:00:00Z",
    type: "meeting",
    location: "عبر الإنترنت",
    description: "مناقشة تفاصيل الاستثمار في مشروع تطبيق توصيل الطعام",
    attendees: [
      { id: 101, name: "أحمد محمد", avatar: "/placeholder.svg?height=40&width=40&text=أ" },
      { id: 102, name: "سارة علي", avatar: "/placeholder.svg?height=40&width=40&text=س" },
    ],
    isOnline: true,
  },
  {
    id: 2,
    title: "عرض تقديمي لمشروع منصة تعليم إلكتروني",
    date: "2023-11-22T14:30:00Z",
    endDate: "2023-11-22T15:30:00Z",
    type: "presentation",
    location: "مقر الشركة - قاعة الاجتماعات الرئيسية",
    description: "عرض تقديمي للمستثمرين المحتملين حول مشروع منصة التعليم الإلكتروني",
    attendees: [
      { id: 103, name: "محمد خالد", avatar: "/placeholder.svg?height=40&width=40&text=م" },
      { id: 104, name: "فاطمة أحمد", avatar: "/placeholder.svg?height=40&width=40&text=ف" },
      { id: 105, name: "عمر حسن", avatar: "/placeholder.svg?height=40&width=40&text=ع" },
    ],
    isOnline: false,
  },
  {
    id: 3,
    title: "موعد تسليم المرحلة الأولى من المشروع",
    date: "2023-11-25T00:00:00Z",
    endDate: "2023-11-25T23:59:59Z",
    type: "deadline",
    description: "الموعد النهائي لتسليم المرحلة الأولى من مشروع تطبيق توصيل الطعام",
  },
  {
    id: 4,
    title: "اجتماع متابعة مع فريق العمل",
    date: "2023-11-18T10:00:00Z",
    endDate: "2023-11-18T11:00:00Z",
    type: "meeting",
    location: "عبر الإنترنت",
    description: "اجتماع أسبوعي لمتابعة تقدم العمل في المشروع",
    attendees: [
      { id: 106, name: "ليلى سعيد", avatar: "/placeholder.svg?height=40&width=40&text=ل" },
      { id: 107, name: "يوسف علي", avatar: "/placeholder.svg?height=40&width=40&text=ي" },
    ],
    isOnline: true,
  },
  {
    id: 5,
    title: "موعد دفع الدفعة الثانية من التمويل",
    date: "2023-11-30T00:00:00Z",
    endDate: "2023-11-30T23:59:59Z",
    type: "payment",
    description: "موعد استلام الدفعة الثانية من التمويل لمشروع منصة التعليم الإلكتروني",
  },
]

export default function CalendarPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState("month") // month, week, day

  useEffect(() => {
    // Simulate API call to fetch events
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
      setEvents(mockEvents)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ar-DZ", { day: "numeric", month: "long", year: "numeric" })
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" })
  }

  const getEventsByDate = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month && eventDate.getDate() === day
    })
  }

  const getEventTypeColor = (type) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "presentation":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "deadline":
        return "bg-red-100 text-red-800 border-red-200"
      case "payment":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />
      case "presentation":
        return <Presentation className="h-4 w-4" />
      case "deadline":
        return <Clock className="h-4 w-4" />
      case "payment":
        return <DollarSign className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayEvents = getEventsByDate(date)
      const isToday = new Date().toDateString() === date.toDateString()

      days.push(
        <div
          key={`day-${day}`}
          className={`h-24 border border-gray-200 p-1 overflow-hidden ${isToday ? "bg-primary-50" : ""}`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm font-medium ${isToday ? "text-primary-500" : ""}`}>{day}</span>
            {dayEvents.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {dayEvents.length}
              </Badge>
            )}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-16">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
                title={event.title}
              >
                {formatTime(event.date)} {event.title}
              </div>
            ))}
          </div>
        </div>,
      )
    }

    return days
  }

  const renderUpcomingEvents = () => {
    const now = new Date()
    const upcomingEvents = events
      .filter((event) => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5)

    return (
      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(event.date)} - {formatTime(event.date)}
                  </p>
                </div>
                <Badge className={getEventTypeColor(event.type)} variant="outline">
                  {event.type === "meeting"
                    ? "اجتماع"
                    : event.type === "presentation"
                      ? "عرض تقديمي"
                      : event.type === "deadline"
                        ? "موعد نهائي"
                        : event.type === "payment"
                          ? "دفعة مالية"
                          : "حدث"}
                </Badge>
              </div>

              {event.description && <p className="text-sm text-gray-600 mb-2">{event.description}</p>}

              {event.location && (
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 ml-1" />
                  <span>{event.location}</span>
                  {event.isOnline && (
                    <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700 border-blue-200">
                      <Video className="h-3 w-3 ml-1" />
                      عبر الإنترنت
                    </Badge>
                  )}
                </div>
              )}

              {event.attendees && event.attendees.length > 0 && (
                <div className="flex items-center mt-2">
                  <span className="text-xs text-gray-500 ml-2">الحضور:</span>
                  <div className="flex -space-x-2 space-x-reverse">
                    {event.attendees.map((attendee) => (
                      <Avatar key={attendee.id} className="h-6 w-6 border-2 border-white">
                        <AvatarImage src={attendee.avatar} alt={attendee.name} />
                        <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {event.attendees.length > 3 && (
                    <span className="text-xs text-gray-500 mr-2">+{event.attendees.length - 3}</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {upcomingEvents.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">لا توجد أحداث قادمة</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["startup", "sponsor", "admin"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Navbar />
        <main className="flex-1 py-12 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <motion.div
              className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-500">التقويم</h1>

              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={prevMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-medium">
                  {currentDate.toLocaleDateString("ar-DZ", { month: "long", year: "numeric" })}
                </h2>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة حدث
                </Button>
              </div>
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>التقويم</CardTitle>
                      <CardDescription>جميع الأحداث والمواعيد</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Days of the week header */}
                      <div className="grid grid-cols-7 gap-px mb-px">
                        {["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"].map((day) => (
                          <div key={day} className="text-center py-2 bg-gray-50 font-medium text-sm">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 gap-px">{renderCalendar()}</div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>الأحداث القادمة</CardTitle>
                      <CardDescription>الأحداث المقبلة في التقويم</CardDescription>
                    </CardHeader>
                    <CardContent>{renderUpcomingEvents()}</CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}

import { Presentation, DollarSign } from "lucide-react"
