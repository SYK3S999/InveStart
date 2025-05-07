"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import {
  Send,
  Search,
  Star,
  MoreVertical,
  Phone,
  Video,
  Info,
  Paperclip,
  ImageIcon,
  Smile,
  MessageSquare,
  Check,
  Download,
  FileText,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ProtectedRoute from "@/components/ProtectedRoute"

// Mock conversations data
const mockConversations = [
  {
    id: 1,
    recipient: {
      id: 101,
      name: "أحمد محمد",
      avatar: "/placeholder.svg?height=40&width=40&text=أ",
      role: "startup",
      project: "تطبيق توصيل الطعام",
      lastSeen: "متصل الآن",
      isOnline: true,
    },
    lastMessage: {
      content: "شكراً لاهتمامك بمشروعنا، هل لديك أي أسئلة محددة؟",
      timestamp: "2023-11-15T14:30:00Z",
      isRead: true,
      sender: "them",
    },
    unreadCount: 0,
    isFavorite: true,
  },
  {
    id: 2,
    recipient: {
      id: 102,
      name: "سارة علي",
      avatar: "/placeholder.svg?height=40&width=40&text=س",
      role: "investor",
      lastSeen: "قبل 5 دقائق",
      isOnline: false,
    },
    lastMessage: {
      content: "أود معرفة المزيد عن خطة التوسع للسنة القادمة",
      timestamp: "2023-11-15T10:15:00Z",
      isRead: false,
      sender: "them",
    },
    unreadCount: 2,
    isFavorite: false,
  },
  {
    id: 3,
    recipient: {
      id: 103,
      name: "محمد خالد",
      avatar: "/placeholder.svg?height=40&width=40&text=م",
      role: "startup",
      project: "منصة تعليم إلكتروني",
      lastSeen: "قبل ساعة",
      isOnline: false,
    },
    lastMessage: {
      content: "نعم، يمكننا ترتيب اجتماع لمناقشة التفاصيل",
      timestamp: "2023-11-14T16:45:00Z",
      isRead: true,
      sender: "you",
    },
    unreadCount: 0,
    isFavorite: true,
  },
  {
    id: 4,
    recipient: {
      id: 104,
      name: "فاطمة أحمد",
      avatar: "/placeholder.svg?height=40&width=40&text=ف",
      role: "investor",
      lastSeen: "قبل 3 ساعات",
      isOnline: false,
    },
    lastMessage: {
      content: "لقد اطلعت على المستندات المالية، وأود مناقشة بعض النقاط",
      timestamp: "2023-11-14T09:20:00Z",
      isRead: true,
      sender: "them",
    },
    unreadCount: 0,
    isFavorite: false,
  },
  {
    id: 5,
    recipient: {
      id: 105,
      name: "عمر حسن",
      avatar: "/placeholder.svg?height=40&width=40&text=ع",
      role: "startup",
      project: "مشروع زراعي مستدام",
      lastSeen: "قبل يومين",
      isOnline: false,
    },
    lastMessage: {
      content: "سأرسل لك التفاصيل الإضافية التي طلبتها عن المشروع",
      timestamp: "2023-11-13T11:30:00Z",
      isRead: true,
      sender: "them",
    },
    unreadCount: 0,
    isFavorite: false,
  },
]

// Mock messages for a conversation
const mockMessages = [
  {
    id: 1,
    content: "مرحباً، أنا مهتم بمشروعك 'تطبيق توصيل الطعام'",
    timestamp: "2023-11-14T09:00:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 2,
    content: "أهلاً بك! شكراً لاهتمامك بمشروعنا. يسعدني الإجابة على أي استفسارات لديك.",
    timestamp: "2023-11-14T09:05:00Z",
    sender: "them",
    status: "read",
  },
  {
    id: 3,
    content: "هل يمكنك إخباري المزيد عن نموذج الإيرادات الخاص بكم؟",
    timestamp: "2023-11-14T09:10:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 4,
    content:
      "بالتأكيد! نحن نعتمد على نموذج العمولة، حيث نأخذ نسبة 10% من كل طلب يتم توصيله عبر التطبيق. بالإضافة إلى ذلك، نقدم خدمات إعلانية للمطاعم المشاركة مقابل رسوم شهرية.",
    timestamp: "2023-11-14T09:15:00Z",
    sender: "them",
    status: "read",
  },
  {
    id: 5,
    content: "هذا مثير للاهتمام. ما هي خططكم للتوسع في المستقبل؟",
    timestamp: "2023-11-14T09:20:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 6,
    content:
      "نخطط للتوسع في 3 مدن رئيسية خلال السنة الأولى، ثم الانتقال إلى المدن الثانوية في السنة الثانية. لدينا أيضاً خطط لإضافة خدمات توصيل البقالة والأدوية في المرحلة الثانية من المشروع.",
    timestamp: "2023-11-14T09:25:00Z",
    sender: "them",
    status: "read",
  },
  {
    id: 7,
    content: "هل يمكنني الاطلاع على دراسة السوق التي قمتم بها؟",
    timestamp: "2023-11-14T14:30:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 8,
    content: "بالطبع! سأرسل لك نسخة من دراسة السوق والتحليل التنافسي الذي أجريناه.",
    timestamp: "2023-11-14T14:35:00Z",
    sender: "them",
    status: "read",
  },
  {
    id: 9,
    content: "إليك دراسة السوق والتحليل التنافسي",
    timestamp: "2023-11-14T14:40:00Z",
    sender: "them",
    status: "read",
    attachment: {
      type: "document",
      name: "دراسة_السوق_والتحليل_التنافسي.pdf",
      size: "2.4 MB",
      url: "#",
    },
  },
  {
    id: 10,
    content: "شكراً جزيلاً! سأقوم بمراجعتها وأعود إليك قريباً.",
    timestamp: "2023-11-14T14:45:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 11,
    content: "لقد راجعت الدراسة وأنا معجب بالتحليل الذي قمتم به. هل يمكننا ترتيب اجتماع لمناقشة إمكانية الاستثمار؟",
    timestamp: "2023-11-15T10:00:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 12,
    content: "بالتأكيد! يسعدنا ذلك. هل يناسبك يوم الخميس القادم الساعة 11 صباحاً؟",
    timestamp: "2023-11-15T10:10:00Z",
    sender: "them",
    status: "read",
  },
  {
    id: 13,
    content: "نعم، هذا الموعد مناسب تماماً. سأرسل لك دعوة اجتماع عبر البريد الإلكتروني.",
    timestamp: "2023-11-15T10:15:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 14,
    content: "ممتاز! أتطلع للقائك والتحدث أكثر عن المشروع.",
    timestamp: "2023-11-15T10:20:00Z",
    sender: "them",
    status: "read",
  },
  {
    id: 15,
    content: "شكراً لاهتمامك بمشروعنا، هل لديك أي أسئلة محددة؟",
    timestamp: "2023-11-15T14:30:00Z",
    sender: "them",
    status: "read",
  },
]

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Simulate API call to fetch conversations
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
      setConversations(mockConversations)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    // Set first conversation as active by default if none is selected
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0])
      setMessages(mockMessages) // Load messages for the first conversation
    }
  }, [conversations, activeConversation])

  useEffect(() => {
    // Scroll to bottom of messages when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const newMsg = {
      id: messages.length + 1,
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: "you",
      status: "sent",
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // Simulate reply after 1-3 seconds
    if (Math.random() > 0.3) {
      // 70% chance of getting a reply
      const replyDelay = 1000 + Math.random() * 2000
      setTimeout(() => {
        const reply = {
          id: messages.length + 2,
          content: "شكراً لرسالتك! سأقوم بالرد عليك في أقرب وقت ممكن.",
          timestamp: new Date().toISOString(),
          sender: "them",
          status: "delivered",
        }
        setMessages((prevMessages) => [...prevMessages, reply])
      }, replyDelay)
    }
  }

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation)
    setMessages(mockMessages) // In a real app, you would fetch messages for this conversation

    // Mark conversation as read
    setConversations((prevConversations) =>
      prevConversations.map((conv) => (conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv)),
    )
  }

  const toggleFavorite = (conversationId) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => (conv.id === conversationId ? { ...conv, isFavorite: !conv.isFavorite } : conv)),
    )
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conv.recipient.project && conv.recipient.project.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" })
  }

  const formatConversationTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "الأمس"
    } else if (diffDays < 7) {
      const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
      return days[date.getDay()]
    } else {
      return date.toLocaleDateString("ar-DZ", { day: "numeric", month: "numeric" })
    }
  }

  return (
    <ProtectedRoute allowedRoles={["startup", "sponsor", "admin"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Navbar />
        <main className="flex-1 py-6 md:py-12 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-center text-primary-500 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              المحادثات
            </motion.h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100 h-[calc(80vh-100px)] min-h-[500px]">
              <div className="flex h-full">
                {/* Conversations Sidebar */}
                <div className="w-full md:w-1/3 lg:w-1/4 border-l border-gray-200 flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        type="text"
                        placeholder="البحث عن محادثة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-3 pr-10"
                      />
                    </div>
                  </div>

                  <Tabs defaultValue="all" className="flex-1 flex flex-col">
                    <TabsList className="grid grid-cols-3 px-4 py-2">
                      <TabsTrigger value="all">الكل</TabsTrigger>
                      <TabsTrigger value="unread">غير مقروءة</TabsTrigger>
                      <TabsTrigger value="favorites">المفضلة</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="flex-1 overflow-y-auto">
                      {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        </div>
                      ) : filteredConversations.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {filteredConversations.map((conversation) => (
                            <li
                              key={conversation.id}
                              className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                                activeConversation?.id === conversation.id ? "bg-primary-50" : ""
                              }`}
                              onClick={() => handleSelectConversation(conversation)}
                            >
                              <div className="p-4 relative">
                                <div className="flex items-start">
                                  <div className="relative">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage
                                        src={conversation.recipient.avatar}
                                        alt={conversation.recipient.name}
                                      />
                                      <AvatarFallback>{conversation.recipient.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {conversation.recipient.isOnline && (
                                      <span className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                  </div>
                                  <div className="mr-3 flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                      <h3 className="text-sm font-medium text-gray-900 truncate">
                                        {conversation.recipient.name}
                                      </h3>
                                      <div className="flex items-center">
                                        <span className="text-xs text-gray-500">
                                          {formatConversationTime(conversation.lastMessage.timestamp)}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            toggleFavorite(conversation.id)
                                          }}
                                          className="mr-2 text-gray-400 hover:text-yellow-500 transition-colors"
                                        >
                                          <Star
                                            size={16}
                                            fill={conversation.isFavorite ? "#EAB308" : "none"}
                                            className={conversation.isFavorite ? "text-yellow-500" : ""}
                                          />
                                        </button>
                                      </div>
                                    </div>
                                    {conversation.recipient.project && (
                                      <p className="text-xs text-primary-500 mb-1">{conversation.recipient.project}</p>
                                    )}
                                    <p className="text-sm text-gray-500 truncate">
                                      {conversation.lastMessage.sender === "you" ? "أنت: " : ""}
                                      {conversation.lastMessage.content}
                                    </p>
                                  </div>
                                </div>
                                {conversation.unreadCount > 0 && (
                                  <span className="absolute top-4 left-4 bg-primary-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <div className="bg-gray-100 rounded-full p-3 mb-2">
                            <MessageSquare className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-center">لا توجد محادثات مطابقة</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="unread" className="flex-1 overflow-y-auto">
                      {filteredConversations.filter((c) => c.unreadCount > 0).length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {filteredConversations
                            .filter((c) => c.unreadCount > 0)
                            .map((conversation) => (
                              <li
                                key={conversation.id}
                                className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                                  activeConversation?.id === conversation.id ? "bg-primary-50" : ""
                                }`}
                                onClick={() => handleSelectConversation(conversation)}
                              >
                                <div className="p-4 relative">
                                  {/* Same conversation item structure as above */}
                                  <div className="flex items-start">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage
                                        src={conversation.recipient.avatar}
                                        alt={conversation.recipient.name}
                                      />
                                      <AvatarFallback>{conversation.recipient.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="mr-3 flex-1 min-w-0">
                                      <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                          {conversation.recipient.name}
                                        </h3>
                                        <span className="text-xs text-gray-500">
                                          {formatConversationTime(conversation.lastMessage.timestamp)}
                                        </span>
                                      </div>
                                      {conversation.recipient.project && (
                                        <p className="text-xs text-primary-500 mb-1">
                                          {conversation.recipient.project}
                                        </p>
                                      )}
                                      <p className="text-sm text-gray-500 truncate">
                                        {conversation.lastMessage.content}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="absolute top-4 left-4 bg-primary-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                    {conversation.unreadCount}
                                  </span>
                                </div>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <div className="bg-gray-100 rounded-full p-3 mb-2">
                            <Check className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-center">لا توجد رسائل غير مقروءة</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="favorites" className="flex-1 overflow-y-auto">
                      {filteredConversations.filter((c) => c.isFavorite).length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {filteredConversations
                            .filter((c) => c.isFavorite)
                            .map((conversation) => (
                              <li
                                key={conversation.id}
                                className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                                  activeConversation?.id === conversation.id ? "bg-primary-50" : ""
                                }`}
                                onClick={() => handleSelectConversation(conversation)}
                              >
                                <div className="p-4 relative">
                                  {/* Same conversation item structure as above */}
                                  <div className="flex items-start">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage
                                        src={conversation.recipient.avatar}
                                        alt={conversation.recipient.name}
                                      />
                                      <AvatarFallback>{conversation.recipient.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="mr-3 flex-1 min-w-0">
                                      <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                          {conversation.recipient.name}
                                        </h3>
                                        <div className="flex items-center">
                                          <span className="text-xs text-gray-500">
                                            {formatConversationTime(conversation.lastMessage.timestamp)}
                                          </span>
                                          <Star size={16} fill="#EAB308" className="mr-2 text-yellow-500" />
                                        </div>
                                      </div>
                                      {conversation.recipient.project && (
                                        <p className="text-xs text-primary-500 mb-1">
                                          {conversation.recipient.project}
                                        </p>
                                      )}
                                      <p className="text-sm text-gray-500 truncate">
                                        {conversation.lastMessage.content}
                                      </p>
                                    </div>
                                  </div>
                                  {conversation.unreadCount > 0 && (
                                    <span className="absolute top-4 left-4 bg-primary-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                      {conversation.unreadCount}
                                    </span>
                                  )}
                                </div>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <div className="bg-gray-100 rounded-full p-3 mb-2">
                            <Star className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-center">لا توجد محادثات مفضلة</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Chat Area */}
                <div className="hidden md:flex md:w-2/3 lg:w-3/4 flex-col">
                  {activeConversation ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={activeConversation.recipient.avatar}
                                alt={activeConversation.recipient.name}
                              />
                              <AvatarFallback>{activeConversation.recipient.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {activeConversation.recipient.isOnline && (
                              <span className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            )}
                          </div>
                          <div className="mr-3">
                            <h3 className="text-sm font-medium text-gray-900">{activeConversation.recipient.name}</h3>
                            <p className="text-xs text-gray-500">
                              {activeConversation.recipient.isOnline
                                ? "متصل الآن"
                                : activeConversation.recipient.lastSeen}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                  <Phone className="h-5 w-5 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>اتصال صوتي</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                  <Video className="h-5 w-5 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>اتصال مرئي</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                  <Info className="h-5 w-5 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>معلومات المحادثة</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full">
                                <MoreVertical className="h-5 w-5 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toggleFavorite(activeConversation.id)}>
                                {activeConversation.isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>تصدير المحادثة</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">حذف المحادثة</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === "you" ? "justify-start" : "justify-end"}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  message.sender === "you"
                                    ? "bg-primary-100 text-primary-900"
                                    : "bg-white border border-gray-200"
                                }`}
                              >
                                {message.attachment && (
                                  <div className="mb-2 p-2 bg-gray-100 rounded flex items-center">
                                    <FileText className="h-5 w-5 text-primary-500 ml-2" />
                                    <div>
                                      <p className="text-sm font-medium">{message.attachment.name}</p>
                                      <p className="text-xs text-gray-500">{message.attachment.size}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="mr-auto">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                                <p className="text-sm">{message.content}</p>
                                <div className="mt-1 flex items-center justify-end">
                                  <span className="text-xs text-gray-500">{formatMessageTime(message.timestamp)}</span>
                                  {message.sender === "you" && (
                                    <span className="mr-1">
                                      {message.status === "sent" && <Check className="h-3 w-3 text-gray-400" />}
                                      {message.status === "delivered" && <Check className="h-3 w-3 text-blue-500" />}
                                      {message.status === "read" && (
                                        <div className="flex -space-x-1">
                                          <Check className="h-3 w-3 text-blue-500" />
                                          <Check className="h-3 w-3 text-blue-500" />
                                        </div>
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                          <Button type="button" variant="ghost" size="icon" className="rounded-full">
                            <Paperclip className="h-5 w-5 text-gray-500" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" className="rounded-full">
                            <ImageIcon className="h-5 w-5 text-gray-500" />
                          </Button>
                          <Input
                            type="text"
                            placeholder="اكتب رسالتك هنا..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1"
                          />
                          <Button type="button" variant="ghost" size="icon" className="rounded-full">
                            <Smile className="h-5 w-5 text-gray-500" />
                          </Button>
                          <Button type="submit" className="rounded-full" disabled={!newMessage.trim()}>
                            <Send className="h-5 w-5" />
                          </Button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <div className="bg-gray-100 rounded-full p-6 mb-4">
                        <MessageSquare className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-700 mb-2">ابدأ محادثة جديدة</h3>
                      <p className="text-gray-500 text-center max-w-md mb-6">
                        اختر محادثة من القائمة أو ابدأ محادثة جديدة مع مستثمر أو صاحب مشروع
                      </p>
                      <Button>محادثة جديدة</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
