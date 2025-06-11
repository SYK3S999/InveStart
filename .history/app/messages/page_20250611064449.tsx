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
  "اتصل بي",
  "واتساب",
  "فايبر",
  "تليجرام",
  "انستغرام",
  "فيسبوك",
  "تويتر",
  "سناب شات",
  "بريدي الإلكتروني",
  "إيميلي",
  "نلتقي خارج",
  "عنواني",
  "قهوة خارج",
  "مكتبي في",
  "راسلني على",
  "حسابي في",
  "زووم",
  "جوجل ميت",
  "سكايب",
  "@",
  "+213",
];

// Mock conversation and message data (aligned with in-kind/rental focus)
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
      content: "هل يمكنك توفير معدات الحوسبة لتطبيقنا؟",
      timestamp: "2025-06-10T14:30:00Z",
      isRead: true,
      sender: "them",
    },
    unreadCount: 0,
    isFavorite: true,
  },
  // Additional mock conversations omitted for brevity
];

type Message = {
  id: number;
  content: string;
  timestamp: string;
  sender: string;
  status: string;
  attachment?: {
    name: string;
    size: string;
    url?: string;
  };
};

const mockMessages: Message[] = [
  {
    id: 1,
    content: "مرحبا! أحتاج إلى بعض المعدات التقنية لمشروعي.",
    timestamp: "2025-06-10T09:00:00Z",
    sender: "you",
    status: "read",
  },
  // Additional mock messages omitted for brevity
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
    // Simulate API call
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

    // Check for restricted phrases
    const lowerMessage = newMessage.toLowerCase();
    const isRestricted = restrictedPhrases.some((phrase) =>
      lowerMessage.includes(phrase.toLowerCase())
    );

    if (isRestricted) {
      toast.error(
        "عذرًا، لا يمكن إرسال هذه الرسالة. يُرجى الالتزام بمناقشة الصفقات داخل المنصة فقط.",
        { duration: 5000 }
      );
      // Log attempt (simulated)
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

    // Simulate typing indicator
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
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-br from-gray-50 to-green-50 text-gray-900">
        <Toaster position="top-right" />
        <Navbar />
        <main className="flex-1 py-6 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-center text-green-600 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              المحادثات
            </motion.h1>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-[calc(80vh-100px)] min-h-[500px]">
              <div className="flex h-full">
                {/* Sidebar */}
                <AnimatePresence>
                  {(isSidebarOpen || window.innerWidth >= 768) && (
                    <motion.aside
                      className={`${
                        window.innerWidth < 768
                          ? "fixed inset-y-0 left-0 w-64 z-50"
                          : "w-full md:w-1/3 lg:w-1/4"
                      } bg-white/80 backdrop-blur-lg border-l border-gray-200 flex flex-col`}
                      variants={sidebarVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-green-600">المحادثات</h2>
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
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                          ) : paginatedConversations.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                              {paginatedConversations.map((conv) => (
                                <motion.li
                                  key={conv.id}
                                  className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                                    activeConversation?.id === conv.id ? "bg-green-50" : ""
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
                                        <h3 className="text-sm font-medium text-gray-900 truncate">{conv.recipient.name}</h3>
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
                                        <p className="text-xs text-green-600 mb-1">{conv.recipient.project} ({conv.recipient.wilaya})</p>
                                      )}
                                      <p className="text-sm text-gray-500 truncate">
                                        {conv.lastMessage.sender === "you" ? "أنت: " : ""}
                                        {conv.lastMessage.content}
                                      </p>
                                      {conv.unreadCount > 0 && (
                                        <Badge className="absolute top-4 left-4 bg-green-600 text-white">{conv.unreadCount}</Badge>
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
                        {/* Unread and Favorites Tabs omitted for brevity, similar structure */}
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
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white/80 backdrop-blur-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={activeConversation.recipient.avatar} alt={activeConversation.recipient.name} />
                            <AvatarFallback>{activeConversation.recipient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{activeConversation.recipient.name}</h3>
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
                                    ? "bg-green-100 text-gray-900"
                                    : "bg-white border border-gray-200"
                                } ${msg.sender === "you" ? "ml-2" : "mr-2"}`}
                              >
                                {msg.attachment && (
                                  <div className="mb-2 p-2 bg-gray-100 rounded flex items-center">
                                    <FileText className="h-5 w-5 text-green-600 ml-2" />
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
                                        <Lock className="h-3 w-3 text-green-500" />
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
                      <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-lg">
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
                            className="bg-green-600 text-white rounded-full hover:bg-green-700"
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
                      <h3 className="text-xl font-medium text-gray-700 mb-2">ابدأ محادثة</h3>
                      <p className="text-gray-500 text-center max-w-md mb-6">
                        اختر محادثة من القائمة أو ابحث عن صاحب مشروع أو مستثمر.
                      </p>
                      <Button asChild className="bg-green-600 text-white rounded-full hover:bg-green-700">
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