"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProtectedRoute from "@/components/protected-route";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Send,
  Search,
  Star,
  MoreVertical,
  Paperclip,
  ImageIcon,
  Smile,
  MessageSquare,
  Check,
  Download,
  FileText,
  Menu,
  X,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

// Restricted phrases to prevent off-platform deals
const restrictedPhrases = [
  "رقم هاتفي",
  "رقم الهاتف",
  "رقم جوالي",
  "اتصل بي",
  "اتصل عليّ",
  "أرسل لي رقمك",
  "أرسل لي رقم هاتفك",
  "أعطني رقمك",
  "راسلني على واتساب",
  "راسلني على تلغرام",
  "راسلني على تيليجرام",
  "راسلني على فايبر",
  "راسلني على سكايب",
  "راسلني على زووم",
  "راسلني على انستغرام",
  "راسلني على إنستغرام",
  "راسلني على فيسبوك",
  "راسلني على سناب شات",
  "راسلني على تويتر",
  "راسلني على X",
  "حسابي على فيسبوك",
  "حسابي على انستغرام",
  "حسابي على تويتر",
  "حسابي على سناب",
  "حسابي على تيك توك",
  "حسابي في تيليجرام",
  "حسابي في واتساب",
  "بريدي الإلكتروني",
  "هذا بريدي",
  "أرسل لي بريدك",
  "إيميلي هو",
  "أعطني بريدك الإلكتروني",
  "نلتقي خارج المنصة",
  "نلتقي في مكان آخر",
  "دعنا نتقابل خارج المنصة",
  "دعنا نتحادث بالخارج",
  "تعال نلتقي في كافيه",
  "دعونا نشرب قهوة",
  "تعال إلى مكتبي",
  "مكتبي في...",
  "نخرج لنتكلم",
  "نتقابل وجها لوجه",
  "تواصل معي خارج الموقع",
  "خارج المنصة",
  "على تطبيق آخر",
  "استخدم تطبيق آخر",
  "هاتفي هو",
  "تحدث معي في انستغرام",
  "سكايب",
  "زووم",
  "جوجل ميت"
];

// Mock conversations data (original, with in-kind/rental tweaks)
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
      wilaya: "الجزائر",
      equipmentType: "معدات تقنية",
    },
    lastMessage: {
      content: "شكراً لاهتمامك بمشروعنا، هل يمكنك توفير معدات الحوسبة؟",
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
      role: "sponsor",
      lastSeen: "قبل 5 دقائق",
      isOnline: false,
    },
    lastMessage: {
      content: "أود معرفة المزيد عن حاجيات العتاد للسنة القادمة",
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
      wilaya: "وهران",
      equipmentType: "أجهزة عرض",
    },
    lastMessage: {
      content: "نعم، يمكننا ترتيب مناقشة حول توفير أجهزة العرض",
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
      role: "sponsor",
      lastSeen: "قبل 3 ساعات",
      isOnline: false,
    },
    lastMessage: {
      content: "اطلعت على مواصفات العتاد، وأود مناقشة التفاصيل",
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
      wilaya: "قسنطينة",
      equipmentType: "آلات زراعية",
    },
    lastMessage: {
      content: "سأرسل لك تفاصيل حاجيات الآلات الزراعية",
      timestamp: "2023-11-13T11:30:00Z",
      isRead: true,
      sender: "them",
    },
    unreadCount: 0,
    isFavorite: false,
  },
];

// Mock messages data (original, with in-kind/rental tweaks)
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
    content: "أهلاً بك! شكراً لاهتمامك. يسعدني مناقشة توفير معدات تقنية.",
    timestamp: "2023-11-14T09:05:00Z",
    sender: "them",
    status: "read",
  },
  {
    id: 3,
    content: "هل يمكنك إخباري المزيد عن نوع المعدات المطلوبة؟",
    timestamp: "2023-11-14T09:10:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 4,
    content:
      "نحتاج إلى خوادم وأجهزة حاسوب عالية الأداء لتشغيل التطبيق، بالإضافة إلى معدات شبكات.",
    timestamp: "2023-11-14T09:15:00Z",
    sender: "them",
    status: "read",
  },
  {
    id: 5,
    content: "مثير للاهتمام. ما هي خططكم لاستخدام هذه المعدات؟",
    timestamp: "2023-11-14T09:20:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 6,
    content:
      "سنستخدم الخوادم لمعالجة الطلبات، والأجهزة لتطوير التطبيق. نخطط لتوسيع الخدمة في 3 ولايات خلال السنة الأولى.",
    timestamp: "2023-11-14T09:25:00Z",
    sender: "them",
    status: "read",
  },
  {
    id: 7,
    content: "هل يمكنني الاطلاع على مواصفات المعدات المطلوبة؟",
    timestamp: "2023-11-14T14:30:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 8,
    content: "بالطبع! سأرسل لك وثيقة تحتوي على المواصفات.",
    timestamp: "2023-11-14T14:35:00Z",
    sender: "them",
    status: "read",
  },
  {
    id: 9,
    content: "إليك وثيقة مواصفات المعدات",
    timestamp: "2023-11-14T14:40:00Z",
    sender: "them",
    status: "read",
    attachment: {
      type: "document",
      name: "مواصفات_المعدات.pdf",
      size: "2.4 MB",
      url: "#",
    },
  },
  {
    id: 10,
    content: "شكراً! سأراجعها وأعود إليك قريباً.",
    timestamp: "2023-11-14T14:45:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 11,
    content: "راجعت الوثيقة وأنا مهتم. هل يمكننا مناقشة اتفاقية التأجير؟",
    timestamp: "2023-11-15T10:00:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 12,
    content: "بالتأكيد! يناسبك الخميس القادم الساعة 11 صباحاً؟",
    timestamp: "2023-11-15T10:10:00Z",
    sender: "them",
    status: "read",
  },
  {
    id: 13,
    content: "نعم، مناسب. سأرسل تأكيد الاجتماع عبر المنصة.",
    timestamp: "2023-11-15T10:15:00Z",
    sender: "you",
    status: "read",
  },
  {
    id: 14,
    content: "ممتاز! أتطلع لمناقشة تفاصيل التأجير.",
    timestamp: "2023-11-15T10:20:00Z",
    sender: "them",
    status: "read",
  },
  {
    id: 15,
    content: "شكراً لاهتمامك، هل لديك أسئلة إضافية حول المعدات؟",
    timestamp: "2023-11-15T14:30:00Z",
    sender: "them",
    status: "read",
  },
];

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<typeof mockConversations>([]);
  const [activeConversation, setActiveConversation] = useState<typeof mockConversations[number] | null>(null);
  const [messages, setMessages] = useState<typeof mockMessages>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const itemsPerPage = 5;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user || !["startup", "sponsor"].includes(user.role)) {
      router.push("/login");
    }
    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 1000);
  }, [user, router]);

  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
      setMessages(mockMessages);
    }
  }, [conversations, activeConversation]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const lowerMessage = newMessage.toLowerCase();
    const isRestricted = restrictedPhrases.some((phrase) =>
      lowerMessage.includes(phrase.toLowerCase())
    );

    if (isRestricted) {
      toast.error(
        "عذرًا، لا يمكن إرسال هذه الرسالة. يُرجى الالتزام بمناقشة الصفقات داخل المنصة فقط.",
        { duration: 5000 }
      );
      console.log(`Restricted message attempt: ${newMessage}`);
      return;
    }

    const newMsg = {
      id: messages.length + 1,
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: "you",
      status: "sent",
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (Math.random() > 0.3) {
        const reply = {
          id: messages.length + 2,
          content: "شكرًا على رسالتك! سأرد قريبًا.",
          timestamp: new Date().toISOString(),
          sender: "them",
          status: "delivered",
        };
        setMessages((prev) => [...prev, reply]);
      }
    }, 1000 + Math.random() * 2000);
  };

  const handleSelectConversation = (conversation: typeof mockConversations[number]) => {
    setActiveConversation(conversation);
    setMessages(mockMessages);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
    setIsSidebarOpen(false);
  };

  const toggleFavorite = (conversationId: number) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, isFavorite: !conv.isFavorite } : conv
      )
    );
    toast.success("تم تحديث المفضلة!");
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conv.recipient.project &&
        conv.recipient.project.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (conv.recipient.wilaya &&
        conv.recipient.wilaya.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredMessages = messages.filter((msg) =>
    msg.content.toLowerCase().includes(messageSearch.toLowerCase())
  );

  const paginatedConversations = filteredConversations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" });
  };

  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "الأمس";
    } else if (diffDays < 7) {
      const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
      return days[date.getDay()];
    }
    return date.toLocaleDateString("ar-DZ", { day: "numeric", month: "numeric" });
  };

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <ProtectedRoute allowedRoles={["startup", "sponsor"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Toaster position="top-right" />
        <Navbar />
        <main className="flex-1 py-6 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
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
                {/* Sidebar */}
                <AnimatePresence>
                  {(isSidebarOpen || window.innerWidth >= 768) && (
                    <motion.aside
                      className={`${
                        window.innerWidth < 768
                          ? "fixed inset-y-0 left-0 w-64 z-50"
                          : "w-full md:w-1/3 lg:w-1/4"
                      } bg-white border-l border-gray-200 flex flex-col`}
                      variants={sidebarVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-primary-500">المحادثات</h2>
                        {window.innerWidth < 768 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <X className="h-6 w-6" />
                          </Button>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <Input
                            placeholder="ابحث في المحادثات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-3 pr-10 rounded-full"
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
                          ) : paginatedConversations.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                              {paginatedConversations.map((conv) => (
                                <motion.li
                                  key={conv.id}
                                  className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                                    activeConversation?.id === conv.id ? "bg-primary-50" : ""
                                  }`}
                                  onClick={() => handleSelectConversation(conv)}
                                  variants={messageVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  <div className="p-4 relative flex items-start gap-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src={conv.recipient.avatar} alt={conv.recipient.name} />
                                      <AvatarFallback>{conv.recipient.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-medium text-primary-900 truncate">{conv.recipient.name}</h3>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-gray-500">{formatConversationTime(conv.lastMessage.timestamp)}</span>
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(conv.id);
                                                  }}
                                                  className="text-gray-400 hover:text-yellow-500"
                                                >
                                                  <Star
                                                    size={16}
                                                    fill={conv.isFavorite ? "#EAB308" : "none"}
                                                    className={conv.isFavorite ? "text-yellow-500" : ""}
                                                  />
                                                </button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>{conv.isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </div>
                                      </div>
                                      {conv.recipient.project && (
                                        <p className="text-xs text-primary-500 mb-1">{conv.recipient.project} ({conv.recipient.wilaya})</p>
                                      )}
                                      <p className="text-sm text-gray-500 truncate">
                                        {conv.lastMessage.sender === "you" ? "أنت: " : ""}
                                        {conv.lastMessage.content}
                                      </p>
                                      {conv.unreadCount > 0 && (
                                        <Badge className="absolute top-4 left-4 bg-primary-500 text-white">{conv.unreadCount}</Badge>
                                      )}
                                    </div>
                                  </div>
                                </motion.li>
                              ))}
                            </ul>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full p-4">
                              <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-gray-500">ماكاش محادثات مطابقة</p>
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="unread" className="flex-1 overflow-y-auto">
                          {filteredConversations.filter((c) => c.unreadCount > 0).length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                              {filteredConversations
                                .filter((c) => c.unreadCount > 0)
                                .map((conv) => (
                                  <motion.li
                                    key={conv.id}
                                    className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                                      activeConversation?.id === conv.id ? "bg-primary-50" : ""
                                    }`}
                                    onClick={() => handleSelectConversation(conv)}
                                    variants={messageVariants}
                                    initial="hidden"
                                    animate="visible"
                                  >
                                    <div className="p-4 relative flex items-start gap-3">
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage src={conv.recipient.avatar} alt={conv.recipient.name} />
                                        <AvatarFallback>{conv.recipient.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                          <h3 className="text-sm font-medium text-primary-900 truncate">{conv.recipient.name}</h3>
                                          <span className="text-xs text-gray-500">{formatConversationTime(conv.lastMessage.timestamp)}</span>
                                        </div>
                                        {conv.recipient.project && (
                                          <p className="text-xs text-primary-500 mb-1">{conv.recipient.project}</p>
                                        )}
                                        <p className="text-sm text-gray-500 truncate">{conv.lastMessage.content}</p>
                                        <Badge className="absolute top-4 left-4 bg-primary-500 text-white">{conv.unreadCount}</Badge>
                                      </div>
                                    </div>
                                  </motion.li>
                                ))}
                            </ul>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full p-4">
                              <Check className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-gray-500">ماكاش رسائل غير مقروءة</p>
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="favorites" className="flex-1 overflow-y-auto">
                          {filteredConversations.filter((c) => c.isFavorite).length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                              {filteredConversations
                                .filter((c) => c.isFavorite)
                                .map((conv) => (
                                  <motion.li
                                    key={conv.id}
                                    className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                                      activeConversation?.id === conv.id ? "bg-primary-50" : ""
                                    }`}
                                    onClick={() => handleSelectConversation(conv)}
                                    variants={messageVariants}
                                    initial="hidden"
                                    animate="visible"
                                  >
                                    <div className="p-4 relative flex items-start gap-3">
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage src={conv.recipient.avatar} alt={conv.recipient.name} />
                                        <AvatarFallback>{conv.recipient.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                          <h3 className="text-sm font-medium text-primary-900 truncate">{conv.recipient.name}</h3>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">{formatConversationTime(conv.lastMessage.timestamp)}</span>
                                            <Star size={16} fill="#EAB308" className="text-yellow-500" />
                                          </div>
                                        </div>
                                        {conv.recipient.project && (
                                          <p className="text-xs text-primary-500 mb-1">{conv.recipient.project}</p>
                                        )}
                                        <p className="text-sm text-gray-500 truncate">{conv.lastMessage.content}</p>
                                        {conv.unreadCount > 0 && (
                                          <Badge className="absolute top-4 left-4 bg-primary-500 text-white">{conv.unreadCount}</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </motion.li>
                                ))}
                            </ul>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full p-4">
                              <Star className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-gray-500">ماكاش محادثات مفضلة</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                      <div className="p-4 flex justify-center gap-2">
                        <Button
                          variant="outline"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          السابق
                        </Button>
                        <Button
                          variant="outline"
                          disabled={currentPage * itemsPerPage >= filteredConversations.length}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          التالي
                        </Button>
                      </div>
                    </motion.aside>
                  )}
                </AnimatePresence>

                {/* Chat Area */}
                <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden mb-4"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  {activeConversation ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={activeConversation.recipient.avatar} alt={activeConversation.recipient.name} />
                            <AvatarFallback>{activeConversation.recipient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-sm font-medium text-primary-900">{activeConversation.recipient.name}</h3>
                            <p className="text-xs text-gray-500">
                              {activeConversation.recipient.isOnline
                                ? "متصل دلوقتي"
                                : activeConversation.recipient.lastSeen}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Input
                              placeholder="ابحث في الرسائل..."
                              value={messageSearch}
                              onChange={(e) => setMessageSearch(e.target.value)}
                              className="pl-3 pr-10 rounded-full w-40"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          </div>
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
                          {filteredMessages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              className={`flex ${msg.sender === "you" ? "justify-start" : "justify-end"}`}
                              variants={messageVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <div
                                className={`relative max-w-[70%] rounded-lg p-3 ${
                                  msg.sender === "you"
                                    ? "bg-primary-100 text-primary-900"
                                    : "bg-white border border-gray-200"
                                } ${msg.sender === "you" ? "ml-2" : "mr-2"}`}
                              >
                                {msg.attachment && (
                                  <div className="mb-2 p-2 bg-gray-100 rounded flex items-center">
                                    <FileText className="h-5 w-5 text-primary-500 ml-2" />
                                    <div>
                                      <p className="text-sm font-medium">{msg.attachment.name}</p>
                                      <p className="text-xs text-gray-500">{msg.attachment.size}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="mr-auto">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                                <p className="text-sm">{msg.content}</p>
                                <div className="mt-1 flex items-center justify-end gap-2">
                                  <span className="text-xs text-gray-500">{formatMessageTime(msg.timestamp)}</span>
                                  {msg.sender === "you" && (
                                    <span className="flex items-center">
                                      {msg.status === "sent" && <Check className="h-3 w-3 text-gray-400" />}
                                      {msg.status === "delivered" && <Check className="h-3 w-3 text-blue-500" />}
                                      {msg.status === "read" && (
                                        <div className="flex -space-x-1">
                                          <Check className="h-3 w-3 text-blue-500" />
                                          <Check className="h-3 w-3 text-blue-500" />
                                        </div>
                                      )}
                                    </span>
                                  )}
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Lock className="h-3 w-3 text-primary-500" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>مشفّرة عبر البلوكشين</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {isTyping && (
                            <motion.div
                              className="flex justify-end"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-[70%]">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button type="button" variant="ghost" size="icon" className="rounded-full">
                                  <Paperclip className="h-5 w-5 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>إرفاق ملف</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Input
                            placeholder="اكتب رسالة..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 rounded-full"
                          />
                          <Button
                            type="submit"
                            className="bg-primary-500 text-white rounded-full hover:bg-primary-600"
                            disabled={!newMessage.trim()}
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-xl font-medium text-primary-900 mb-2">ابدأ محادثة</h3>
                      <p className="text-gray-500 text-center max-w-md mb-6">
                        اختر محادثة من القائمة أو ابحث عن صاحب مشروع أو مستثمر.
                      </p>
                      <Button asChild className="bg-primary-500 text-white rounded-full hover:bg-primary-600">
                        <Link href="/projects">تصفح المشاريع</Link>
                      </Button>
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
  );
}