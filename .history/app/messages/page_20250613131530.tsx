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
import * as fuzzball from "fuzzball";
import {
  Send,
  Search,
  Star,
  MoreVertical,
  Paperclip,
  MessageSquare,
  Check,
  Download,
  FileText,
  Menu,
  X,
  Lock,
  Package,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

// Restricted phrases categorized
const restrictedPhrases = {
  phone: [
    "رقم هاتفي",
    "رقم الهاتف",
    "رقم جوالي",
    "اتصل بي",
    "اتصل عليّ",
    "أرسل لي رقمك",
    "أرسل لي رقم هاتفك",
    "أعطني رقمك",
    "هاتفي هو",
    "mon numéro",
    "numéro de téléphone",
    "contacte-moi",
    "appelle-moi",
    "écris-moi",
    "je t’envoie mon numéro",
    "je t’appelle",
    "on s’appelle",
    "prends mon contact",
    "échangeons nos numéros",
  ],
  socialMedia: [
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
    "تحدث معي في انستغرام",
    "سكايب",
    "زووم",
    "جوجل ميت",
    "ajoute-moi sur WhatsApp",
    "ajoute-moi sur Telegram",
    "ajoute-moi sur Viber",
    "ajoute-moi sur Skype",
    "ajoute-moi sur Instagram",
    "ajoute-moi sur Facebook",
    "ajoute-moi sur Twitter",
    "ajoute-moi sur Snap",
    "ajoute-moi sur TikTok",
    "discutons sur Insta",
    "discutons sur Facebook",
    "écris-moi sur Snap",
    "ajoute-moi sur Messenger",
    "Zoom",
    "Google Meet",
    "Skype",
    "Meet",
    "Whatsapp",
    "Telegram",
    "Messenger",
    "TikTok",
    "je suis sur Insta",
    "mon compte Insta",
  ],
  email: [
    "بريدي الإلكتروني",
    "هذا بريدي",
    "أرسل لي بريدك",
    "إيميلي هو",
    "أعطني بريدك الإلكتروني",
    "voici mon email",
    "mon mail est",
    "écris-moi par mail",
    "adresse email perso",
  ],
  externalMeeting: [
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
    "rendez-vous ailleurs",
    "on se voit en dehors",
    "on se rencontre dehors",
    "rencontrons-nous à l’extérieur",
    "on prend un café",
    "viens à mon bureau",
    "je suis dispo pour un café",
    "on peut discuter ailleurs",
    "envoyons nos coordonnées",
    "contact hors site",
    "en dehors de la plateforme",
    "on continue ailleurs",
  ],
};

// Regular expressions for additional patterns
const patterns = {
  phone: /(?:\+213|0)\d{9}|(?:\+33|0)\d{9}/,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  url: /(?:https?:\/\/)?(?:www\.)?(?:facebook|instagram|twitter|snapchat|tiktok|telegram|whatsapp|skype|zoom|meet)\.[a-z]{2,}(?:\/[^\s]*)?/i,
};

// Normalize Arabic text
const normalizeArabic = (text: string) =>
  text
    .replace(/[إأآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .normalize("NFC");

// Mock conversations with deal and equipment data
const mockConversations = [
  {
    id: "1",
    recipient: {
      id: "101",
      name: "أحمد محمد",
      avatar: "/placeholder.svg?height=40&width=40&text=أ",
      role: "startup",
      project: "تطبيق توصية",
      lastSeen: "متصل الآن",
      isOnline: true,
      wilaya: "الجزاءر",
      equipmentType: "معدات تقنية",
    },
    lastMessage: {
      content: "شكراً لاهتمامكم بمشروعنا، هل يمكنكم توفير معدات الحوسبة؟",
      timestamp: "2023-11-05T14:30:00Z",
      isRead: true,
      sender: "all",
    },
    unreadCount: 0,
    isFavorite: false,
    deal: {
      amountDZD: 0,
      equipment: [],
      investorFeePaid: false,
      startupFeePaid: false,
      leasingFeePaid: false,
    },
  },
  {
    id: "2",
    recipient: {
      id: "102",
      name: "سارة علي",
      avatar: "/placeholder.svg?height=40&width=40&text=س",
      role: "sponsor",
      lastSeen: "قبل 5 ساعات",
      isOnline: false,
    },
    lastMessage: {
      content: "أود معرفة المزيد عن حاجيات العتاد للسنة القادمة",
      timestamp: "2023-11-05T10:00:00Z",
      isRead: false,
      sender: "all",
    },
    unreadCount: 2,
    isFavorite: false,
    deal: {
      amountDZD: 500000,
      equipment: [
        { name: "أجهزة شبكات", quantity: 3, valueDZD: 150000 },
      ],
      investorFeePaid: false,
      startupFeePaid: false,
      leasingFeePaid: false,
    },
  },
  {
    id: "3",
    recipient: {
      id: "103",
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
      content: "نعم، يمكننا ترتيب مناقصة حول تقديم أجهزة العرض",
      timestamp: "2023-11-04T16:45:00Z",
      isRead: true,
      sender: "me",
    },
    unreadCount: 0,
    isFavorite: true,
    deal: {
      amountDZD: 750000,
      equipment: [
        { name: "أجهزة عرض", quantity: 4, valueDZD: 187500 },
      ],
      investorFeePaid: false,
      startupFeePaid: false,
      leasingFeePaid: false,
    },
  },
  {
    id: "4",
    recipient: {
      id: "104",
      name: "فاطمة أحمد",
      avatar: "/placeholder.svg?height=40",
      role: "sponsor",
      lastSeen: "قبل 3 ساعات",
      isOnline: false,
    },
    lastMessage: {
      content: "اطلعت على مواصفات العتاد، أود مناقشة التفاصيل",
      timestamp: "2023-11-04T09:20:00Z",
      isRead: true,
      sender: "all",
    },
    unreadCount: 0,
    isFavorite: false,
    deal: {
      amountDZD: 600000,
      equipment: [
        { name: "معدات تصوير", quantity: 2, valueDZD: 300000 },
      ],
      investorFeePaid: false,
      startupFeePaid: false,
      leasingFeePaid: false,
    },
  },
  {
    id: "5",
    recipient: {
      id: "105",
      name: "عمر حسن بن",
      avatar: "/placeholder.svg?height=40&width=40&text=ع",
      role: "startup",
      project: "مشروع زراعي مستدام",
      lastSeen: "قبل يومين",
      isOnline: false,
      wilaya: "قسنطينة",
      equipmentType: "آلات زراعية",
    },
    lastMessage: {
      content: "سأرسل تفاصيل حاجيات الآلات الزراعية",
      timestamp: "2023-11-03T11:30:00Z",
      isRead: true,
      sender: "all",
    },
    unreadCount: 0,
    isFavorite: false,
    deal: {
      amountDZD: 1200000,
      equipment: [
        { name: "آلات زراعية", quantity: 1, valueDZD: 1200000 },
      ],
      investorFeePaid: false,
      startupFeePaid: false,
      leasingFeePaid: false,
    },
  },
];

// Mock messages data
const mockMessages = [
  {
    id: "1",
    content: "مرحباً، أنا مهتم بمشروعك 'تطبيق توصية'",
    timestamp: "2023-11-04T09:00:00Z",
    sender: "me",
    status: "read",
  },
  {
    id: "2",
    content: "أهلاً بك! شكراً لاهتمامك. يسعدني مناقشة توفير معدات تقنية.",
    timestamp: "2023-11-04T09:05:00Z",
    sender: "all",
    status: "read",
  },
  {
    id: "3",
    content: "هل يمكنك إخباري المزيد عن نوع المعدات المطلوبة؟",
    timestamp: "2023-11-04T09:10:00Z",
    sender: "me",
    status: "read",
  },
  {
    id: "4",
    content:
      "نحتاج إلى خوادم وأجهزة حاسوب عالية الأداء لتشغيل التطبيق، بالإضافة إلى معدات شبكات.",
    timestamp: "2023-11-04T09:15:00Z",
    sender: "all",
    status: "read",
  },
  {
    id: "5",
    content: "مثير للاهتمام. ما هي خططكم لاستخدام هذه المعدات؟",
    timestamp: "2023-11-04T09:20:00Z",
    sender: "me",
    status: "read",
  },
  {
    id: "6",
    content:
      "سنستخدم الخوادم لمعالجة الطلبات، والأجهزة لتطوير التطبيق. نخطط لتوسيع الخدمة في 3 ولايات خلال السنة الأولى.",
    timestamp: "2023-11-04T09:25:00Z",
    sender: "all",
    status: "read",
  },
  {
    id: "7",
    content: "هل يمكنني الاطلاع على مواصفات المعدات المطلوبة؟",
    timestamp: "2023-11-04T14:30:00Z",
    sender: "me",
    status: "read",
  },
  {
    id: "8",
    content: "بالطبع! سأرسل لك وثيقة تحتوي على المواصفات.",
    timestamp: "2023-11-04T14:35:00Z",
    sender: "all",
    status: "read",
  },
  {
    id: "9",
    content: "إليك وثيقة مواصفات المعدات",
    timestamp: "2023-11-04T14:40:00Z",
    sender: "all",
    status: "read",
    attachment: {
      type: "document",
      name: "مواصفات_المعدات.pdf",
      size: "2.4 MB",
      url: "#",
    },
  },
  {
    id: "10",
    content: "شكراً! سأراجعها وأعود إليك قريباً.",
    timestamp: "2023-11-04T14:45:00Z",
    sender: "me",
    status: "read",
  },
  {
    id: "11",
    content: "راجعت الوثيقة وأنا مهتم. هل يمكننا مناقشة اتفاقية التأجير؟",
    timestamp: "2023-11-05T10:00:00Z",
    sender: "me",
    status: "read",
  },
  {
    id: "12",
    content: "بالتأكيد! يناسبك الخميس القادم الساعة 11 صباحاً؟",
    timestamp: "2023-11-05T10:10:00Z",
    sender: "all",
    status: "read",
  },
  {
    id: "13",
    content: "نعم، مناسب. سأرسل تأكيد الاجتماع عبر المنصة.",
    timestamp: "2023-11-05T10:15:00Z",
    sender: "me",
    status: "read",
  },
  {
    id: "14",
    content: "ممتاز! أتطلع لمناقشة تفاصيل التأجير.",
    timestamp: "2023-11-05T10:20:00Z",
    sender: "all",
    status: "read",
  },
  {
    id: "15",
    content: "شكراً لاهتمامك، هل لديك أسئلة إضافية حول المعدات؟",
    timestamp: "2023-11-05T14:30:00Z",
    sender: "all",
    status: "read",
  },
];

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<typeof mockConversations>([]);
  const [activeConversation, setActiveConversation] = useState<
    typeof mockConversations[number] | null
  >(null);
  const [messages, setMessages] = useState<typeof mockMessages>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFeeType, setSelectedFeeType] = useState<"investorFeePaid" | "startupFeePaid" | "leasingFeePaid" | null>(null);
  const itemsPerPage = 5;

  const openPaymentModal = (feeType: "investorFeePaid" | "startupFeePaid" | "leasingFeePaid") => {
    setSelectedFeeType(feeType);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setSelectedFeeType(null);
    setShowPaymentModal(false);
  };
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user === null) return; // Wait for user to load
    if (!user || !["startup", "sponsor"].includes(user.role)) {
      router.push("/login");
    } else {
      setTimeout(() => {
        setConversations(mockConversations);
        setIsLoading(false);
      }, 1000);
    }
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

  const checkRestrictedMessage = (message: string) => {
    const normalizedMessage = normalizeArabic(message.toLowerCase());
    let reason = "";
    let maxScore = 0;

    if (patterns.phone.test(message)) {
      return { isRestricted: true, reason: "تم حظر الرسالة بسبب ذكر رقم هاتف" };
    }
    if (patterns.email.test(message)) {
      return { isRestricted: true, reason: "تم حظر الرسالة بسبب ذكر بريد إلكتروني" };
    }
    if (patterns.url.test(message)) {
      return { isRestricted: true, reason: "تم حظر الرسالة بسبب ذكر رابط خارجي" };
    }

    for (const category in restrictedPhrases) {
      for (const phrase of restrictedPhrases[category as keyof typeof restrictedPhrases]) {
        const normalizedPhrase = normalizeArabic(phrase.toLowerCase());
        const score = fuzzball.partial_ratio(normalizedMessage, normalizedPhrase);
        if (score > 80 && score > maxScore) {
          maxScore = score;
          reason = `تم حظر الرسالة بسبب ذكر عبارة مشابهة لـ "${phrase}"`;
        }
      }
    }

    const socialMediaKeywords = restrictedPhrases.socialMedia.map((p) =>
      normalizeArabic(p.toLowerCase())
    );
    if (
      normalizedMessage.includes("راسلني") &&
      socialMediaKeywords.some((keyword) => normalizedMessage.includes(keyword))
    ) {
      return { isRestricted: true, reason: "تم حظر الرسالة بسبب طلب التواصل عبر وسائل خارجية" };
    }

    return { isRestricted: maxScore > 80, reason };
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { isRestricted, reason } = checkRestrictedMessage(newMessage);
    if (isRestricted) {
      toast.error(reason || "عذرًا، لا يمكن إرسال هذه الرسالة. يُرجى مناقشة الصفقات داخل المنصة.", {
        duration: 5000,
      });
      console.log(`Restricted message attempt: ${newMessage}, Reason: ${reason}`);
      return;
    }

    const newMsg = {
      id: (messages.length + 1).toString(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: "me",
      status: "sent",
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (Math.random() > 0.3) {
        const reply = {
          id: (messages.length + 2).toString(),
          content: "شكرًا على رسالتك! سأرد قريبًا.",
          timestamp: new Date().toISOString(),
          sender: "all",
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
        conv.id === conversation.id
          ? {
              ...conv,
              unreadCount: 0,
            }
          : conv
      )
    );
    setIsSidebarOpen(false);
  };

  const toggleFavorite = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              isFavorite: !conv.isFavorite,
            }
          : conv
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

  const calculateFees = (dealAmount: number) => ({
    investorFee: dealAmount * 0.02,
    startupFee: dealAmount * 0.03,
    leasingFee: dealAmount * 0.01,
  });

  const handlePayFee = (
    conversationId: string,
    feeType: "investorFeePaid" | "startupFeePaid" | "leasingFeePaid"
  ) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              deal: {
                ...conv.deal!,
                [feeType]: true,
              },
            }
          : conv
      )
    );
    toast.success(
      `تم دفع رسوم ${
        feeType === "leasingFeePaid"
          ? "تأكيد التمويل التأجيري"
          : feeType === "investorFeePaid"
          ? "رسوم المستثمر"
          : "رسوم صاحب المشروع"
      } بنجاح!`
    );
  };

  const formatDZD = (amount: number) => `${amount.toLocaleString("ar-DZ")} د.ج`;

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const Sidebar = ({
    isSidebarOpen,
    setIsSidebarOpen,
  }: {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
  }) => {
    const [windowWidth, setWindowWidth] = useState<number | null>(null);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }
    }, []);

    const isMobile = windowWidth !== null && windowWidth < 768;

    return (
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            className={`${
              isMobile ? "fixed inset-y-0 left-0 w-64 z-50" : "w-full md:w-1/3 lg:w-1/4"
            } bg-gray-800 border-l border-gray-700 flex flex-col h-full`}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-blue-400">المحادثات</h2>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-400 hover:text-blue-400"
                >
                  <X className="h-6 w-6" />
                </Button>
              )}
            </div>
            <div className="p-4">
              <div className="relative">
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="ابحث في المحادثات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-10 rounded-full bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500"
                />
              </div>
            </div>
            <Tabs defaultValue="all" className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-3 px-4 py-2 bg-gray-900">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
                >
                  الكل
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
                >
                  غير مقروءة
                </TabsTrigger>
                <TabsTrigger
                  value="favorites"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
                >
                  المفضلة
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  </div>
                ) : paginatedConversations.length > 0 ? (
                  <ul className="divide-y divide-gray-700">
                    {paginatedConversations.map((conv) => (
                      <motion.li
                        key={conv.id}
                        className={`hover:bg-gray-700 cursor-pointer transition-colors duration-150 ${
                          activeConversation?.id === conv.id ? "bg-blue-900" : ""
                        }`}
                        onClick={() => handleSelectConversation(conv)}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="p-4 relative flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conv.recipient.avatar} alt={conv.recipient.name} />
                            <AvatarFallback className="bg-gray-700 text-gray-100">
                              {conv.recipient.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-medium text-gray-100 truncate">
                                {conv.recipient.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">
                                  {formatConversationTime(conv.lastMessage.timestamp)}
                                </span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleFavorite(conv.id);
                                        }}
                                        className="text-gray-400 hover:text-yellow-400"
                                      >
                                        <Star
                                          size={16}
                                          fill={conv.isFavorite ? "#FBBF24" : "none"}
                                          className={conv.isFavorite ? "text-yellow-400" : ""}
                                        />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                      <p>
                                        {conv.isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            {conv.recipient.project && (
                              <p className="text-xs text-blue-500 mb-1">
                                {conv.recipient.project} ({conv.recipient.wilaya})
                              </p>
                            )}
                            <p className="text-sm text-gray-400 truncate">
                              {conv.lastMessage.sender === "me" ? "أنت: " : ""}
                              {conv.lastMessage.content}
                            </p>
                            {(conv.unreadCount ?? 0) > 0 && (
                              <Badge className="absolute top-4 left-4 bg-blue-500 text-white">
                                {conv.unreadCount ?? 0}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-400">ماكاش محادثات مطابقة</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="unread" className="flex-1 overflow-y-auto">
                {filteredConversations.filter((c) => (c.unreadCount ?? 0) > 0).length > 0 ? (
                  <ul className="divide-y divide-gray-700">
                    {filteredConversations
                      .filter((c) => (c.unreadCount ?? 0) > 0)
                      .map((conv) => (
                        <motion.li
                          key={conv.id}
                          className={`hover:bg-gray-700 cursor-pointer transition-colors duration-150 ${
                            activeConversation?.id === conv.id ? "bg-blue-900" : ""
                          }`}
                          onClick={() => handleSelectConversation(conv)}
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <div className="p-4 relative flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={conv.recipient.avatar} alt={conv.recipient.name} />
                              <AvatarFallback className="bg-gray-700 text-gray-100">
                                {conv.recipient.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-100 truncate">
                                  {conv.recipient.name}
                                </h3>
                                <span className="text-xs text-gray-400">
                                  {formatConversationTime(conv.lastMessage.timestamp)}
                                </span>
                              </div>
                              {conv.recipient.project && (
                                <p className="text-xs text-blue-500 mb-1">{conv.recipient.project}</p>
                              )}
                              <p className="text-sm text-gray-400 truncate">
                                {conv.lastMessage.content}
                              </p>
                              <Badge className="absolute top-5 left-4 bg-blue-500 text-white">
                                {conv.unreadCount}
                              </Badge>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <Check className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-400">ماكاش رسائل غير مقروءة</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="favorites" className="flex-1 overflow-y-auto">
                {filteredConversations.filter((c) => c.isFavorite).length > 0 ? (
                  <ul className="divide-y divide-gray-700">
                    {filteredConversations
                      .filter((c) => c.isFavorite)
                      .map((conv) => (
                        <motion.li
                          key={conv.id}
                          className={`hover:bg-gray-700 cursor-pointer transition-colors duration-150 ${
                            activeConversation?.id === conv.id ? "bg-blue-900" : ""
                          }`}
                          onClick={() => handleSelectConversation(conv)}
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <div className="p-4 relative flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={conv.recipient.avatar} alt={conv.recipient.name} />
                              <AvatarFallback className="bg-gray-700 text-gray-100">
                                {conv.recipient.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-100 truncate">
                                  {conv.recipient.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">
                                    {formatConversationTime(conv.lastMessage.timestamp)}
                                  </span>
                                  <Star size={16} fill="#FFD700" className="text-yellow-400" />
                                </div>
                              </div>
                              {conv.recipient.project && (
                                <p className="text-xs text-blue-500 mb-1">{conv.recipient.project}</p>
                              )}
                              <p className="text-sm text-gray-400 truncate">
                                {conv.lastMessage.content}
                              </p>
                              {(conv.unreadCount ?? 0) > 0 && (
                                <Badge className="absolute top-4 left-4 bg-blue-500 text-white">
                                  {conv.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.li>
                      ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <Star className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-400">ماكاش محادثات مفضلة</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            <div className="p-4 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"
              >
                السابق
              </Button>
              <Button
                variant="outline"
                disabled={currentPage * itemsPerPage >= filteredConversations.length}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"
              >
                التالي
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    );
  };

  if (user === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["startup", "sponsor"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
        <Toaster position="top-right" toastOptions={{ style: { background: "#1F2937", color: "#E5E7EB" } }} />
        <Navbar />
        <main className="flex-1 py-6 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-center text-blue-400 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              المحادثات
            </motion.h1>
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 min-h-[500px]">
              <div className="flex h-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden mb-4 bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  {activeConversation ? (
                    <>
                      <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={activeConversation.recipient.avatar}
                              alt={activeConversation.recipient.name}
                            />
                            <AvatarFallback className="bg-gray-700 text-gray-100">
                              {activeConversation.recipient.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-sm font-medium text-gray-100">
                              {activeConversation.recipient.name}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {activeConversation.recipient.isOnline
                                ? "متصل الآن"
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
                              className="pl-3 pr-10 rounded-full w-40 bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500"
                            />
                            <Search
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-blue-400 rounded-full"
                              >
                                <MoreVertical className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-gray-800 text-gray-100 border-gray-700"
                            >
                              <DropdownMenuItem onClick={() => toggleFavorite(activeConversation.id)}>
                                {activeConversation.isFavorite
                                  ? "إزالة من المفضلة"
                                  : "إضافة إلى المفضلة"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>تصدير المحادثة</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400">
                                حذف المحادثة
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                        <div className="p-4 bg-gray-900 border-b border-gray-700">
                        <h3 className="text-lg font-semibold text-blue-400 mb-2">تفاصيل الصفقة</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">
                          قيمة الصفقة: {formatDZD(activeConversation.deal?.amountDZD ?? 0)}
                          </p>
                          <div>
                          <p className="text-sm font-medium text-gray-100 flex items-center gap-2">
                            <Package className="h-5 w-5" /> العتاد المقدم:
                          </p>
                          <ul className="list-disc pr-5 mt-1">
                            {activeConversation.deal?.equipment.map((item, index) => (
                            <li key={index} className="text-sm text-gray-400">
                              {item.name} (الكمية: {item.quantity}، القيمة: {formatDZD(item.valueDZD)})
                            </li>
                            ))}
                          </ul>
                          </div>
                          <div className="flex gap-2">
                          {user?.role === "sponsor" &&
                            activeConversation.deal &&
                            !activeConversation.deal.investorFeePaid && (
                            <Button
                              onClick={() => openPaymentModal("investorFeePaid")}
                              className="bg-blue-500 text-white hover:bg-blue-600"
                            >
                              دفع رسوم المستثمر (
                              {formatDZD(
                              calculateFees(activeConversation.deal.amountDZD).investorFee
                              )}
                              )
                            </Button>
                            )}
                          {user?.role === "startup" &&
                            activeConversation.deal &&
                            !activeConversation.deal.startupFeePaid && (
                            <Button
                              onClick={() => openPaymentModal("startupFeePaid")}
                              className="bg-blue-500 text-white hover:bg-blue-600"
                            >
                              دفع رسوم صاحب المشروع (
                              {formatDZD(
                              calculateFees(activeConversation.deal.amountDZD).startupFee
                              )}
                              )
                            </Button>
                            )}
                          {user?.role === "startup" &&
                            activeConversation.deal &&
                            !activeConversation.deal.leasingFeePaid && (
                            <Button
                              onClick={() => openPaymentModal("leasingFeePaid")}
                              className="bg-green-500 text-white hover:bg-green-600"
                            >
                              دفع رسوم التمويل التأجيري (
                              {formatDZD(
                              calculateFees(activeConversation.deal.amountDZD).leasingFee
                              )}
                              )
                            </Button>
                            )}
                          </div>
                          {(activeConversation.deal?.investorFeePaid ||
                          activeConversation.deal?.startupFeePaid ||
                          activeConversation.deal?.leasingFeePaid) && (
                          <p className="text-sm text-green-400">
                            {activeConversation.deal?.investorFeePaid && "تم دفع رسوم المستثمر | "}
                            {activeConversation.deal?.startupFeePaid &&
                            "تم دفع رسوم صاحب المشروع | "}
                            {activeConversation.deal?.leasingFeePaid &&
                            "تم دفع رسوم التمويل التأجيري"}
                          </p>
                          )}
                        </div>
                        </div>
                        {showPaymentModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                          <h3 className="text-xl font-semibold mb-4">اختر طريقة الدفع</h3>
                          <div className="space-y-4">
                            <button
                            onClick={() => {
                              handlePayFee(activeConversation.id, selectedFeeType!);
                              closePaymentModal();
                            }}
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            >
                            EDAHABIA
                            </button>
                            <button
                            onClick={() => {
                              handlePayFee(activeConversation.id, selectedFeeType!);
                              closePaymentModal();
                            }}
                            className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                            >
                            PayPal
                            </button>
                            <button
                            onClick={closePaymentModal}
                            className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100"
                            >
                            إلغاء
                            </button>
                          </div>
                          </div>
                        </div>
                        )}
                      <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
                        <div className="space-y-2">
                          {filteredMessages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              className={`flex ${msg.sender === "me" ? "justify-start" : "justify-end"}`}
                              variants={messageVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <div
                                className={`relative max-w-[70%] rounded-lg p-3 ${
                                  msg.sender === "me"
                                    ? "bg-blue-600 text-gray-100"
                                    : "bg-gray-800 border border-gray-600"
                                } ${msg.sender === "me" ? "ml-2" : "mr-2"}`}
                              >
                                {msg.attachment && (
                                  <div className="mb-2 p-2 bg-gray-700 rounded flex items-center">
                                    <div>
                                      <FileText className="h-5 w-5 text-blue-400 ml-2" />
                                      <div>
                                        <p className="text-sm font-medium text-gray-100">
                                          {msg.attachment.name}
                                        </p>
                                        <p className="text-xs text-gray-400">{msg.attachment.size}</p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="ml-auto mr-2 text-gray-400 hover:bg-gray-600"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                <p className="text-sm text-gray-300">{msg.content}</p>
                                <div className="mt-1 flex items-center justify-end gap-2">
                                  <span className="text-xs text-gray-400">
                                    {formatMessageTime(msg.timestamp)}
                                  </span>
                                  {msg.sender === "me" && (
                                    <span className="flex items-center">
                                      {msg.status === "sent" && <Check className="h-3 w-3 text-gray-400" />}
                                      {msg.status === "delivered" && (
                                        <Check className="h-3 w-4 text-blue-400" />
                                      )}
                                      {msg.status === "read" && (
                                        <div className="flex -space-x-1">
                                          <Check className="h-3 w-3 text-blue-400" />
                                          <Check className="h-3 w-3 text-blue-400" />
                                        </div>
                                      )}
                                    </span>
                                  )}
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Lock className="h-3 w-3 text-blue-400" />
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
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
                              <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 max-w-[70%]">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
                      <div className="p-4 border-t border-gray-700 bg-gray-800">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-400 hover:bg-gray-600 rounded-full"
                                >
                                  <Paperclip className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-800 text-gray-100 border-gray-700">
                                <p>إرفاق ملف</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Input
                            placeholder="اكتب رسالتك..."
                            className="flex-1 rounded-full bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                          />
                          <Button
                            type="submit"
                            className="bg-blue-500 text-white rounded-full hover:bg-blue-600"
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
                      <h3 className="text-xl font-medium text-gray-100 mb-2">ابدأ محادثة</h3>
                      <p className="text-gray-400 text-center max-w-md mb-6">
                        اختر محادثة من القائمة أو ابحث عن صاحب مشروع أو مستثمر.
                      </p>
                      <Button
                        asChild
                        className="bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      >
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