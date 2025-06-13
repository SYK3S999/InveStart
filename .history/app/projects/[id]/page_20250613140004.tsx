"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addMessage,
  formatDate,
  getProject,
  initializeStorage,
  type Project,
  calculateProgress,
} from "@/lib/storage";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquare,
  RefreshCw,
  Send,
  Building,
  Cpu,
  Leaf,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Briefcase,
  Lock,
  Truck,
  Edit,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Extended Project type with offers
interface ExtendedProject extends Project {
  offers?: {
    id: string;
    sponsorId: string;
    equipment: { type: string; quantity: number; condition: string };
    date: string;
    status: "pending" | "accepted" | "rejected";
    transactionHash?: string;
  }[];
}

// Simulated RBAC logic (replace with real auth in production)
const useAuth = () => {
  const user = { role: "startup", id: "user123" }; // Toggle role: "sponsor" or "startup"
  return { isAuthenticated: !!user, role: user?.role || null, userId: user?.id || null };
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, role, userId } = useAuth();
  const [project, setProject] = useState<ExtendedProject | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "documents" | "updates" | "messages">("details");
  const [message, setMessage] = useState("");
  const [equipmentOffer, setEquipmentOffer] = useState({ type: "", quantity: "", condition: "" });
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeStorage();
    if (params.id) {
      const projectId = Number(params.id);
      const projectData = getProject(projectId) as ExtendedProject;
      if (projectData) {
        // Mock offers for demo
        projectData.offers = projectData.offers || [
          {
            id: "offer1",
            sponsorId: "sponsor456",
            equipment: { type: "ماكينة تعبئة", quantity: 2, condition: "جديد" },
            date: new Date().toISOString(),
            status: "pending",
          },
        ];
        setProject(projectData);
      } else {
        router.push("/projects");
      }
    }
    setLoading(false);
  }, [params.id, router]);

  // RBAC: Redirect if not authenticated or invalid role
  useEffect(() => {
    if (!isAuthenticated || !["sponsor", "startup"].includes(role || "")) {
      router.push("/login");
    }
  }, [isAuthenticated, role, router]);

  const handleSendMessage = () => {
    if (!project || !message.trim()) {
      setError("يرجى إدخال رسالة صالحة");
      return;
    }
    const sender = role === "sponsor" ? "راعي المواد" : "صاحب المشروع";
    const newMessage = addMessage(project.id, { sender, content: message });
    if (newMessage) {
      setProject({ ...project, messages: [...project.messages, newMessage] });
      setMessage("");
      setError(null);
    } else {
      setError("فشل إرسال الرسالة");
    }
  };

  const handleSubmitOffer = () => {
    if (role !== "sponsor") {
      setError("فقط المستثمرون يمكنهم تقديم عروض المعدات");
      return;
    }
    if (!project || !equipmentOffer.type.trim() || !equipmentOffer.quantity || !equipmentOffer.condition.trim()) {
      setError("يرجى ملء جميع حقول العرض (نوع المعدات، الكمية، الحالة)");
      return;
    }
    const quantity = parseInt(equipmentOffer.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      setError("يرجى إدخال كمية صالحة (عدد صحيح أكبر من 0)");
      return;
    }
    const offer = {
      id: `offer${Date.now()}`,
      sponsorId: userId || "sponsor456",
      equipment: {
        type: equipmentOffer.type,
        quantity,
        condition: equipmentOffer.condition,
      },
      date: new Date().toISOString(),
      status: "pending" as const,
    };
    // Simulate Blockchain transaction
    const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`;
    console.log("Offer saved:", offer, "Blockchain Tx Hash:", mockTxHash);
    setProject({
      ...project,
      offers: [...(project.offers || []), { ...offer, transactionHash: mockTxHash }],
    });
    setTransactionHash(mockTxHash);
    setOfferSubmitted(true);
    setEquipmentOffer({ type: "", quantity: "", condition: "" });
    setError(null);
  };

  const handleConfirmDelivery = () => {
    if (role !== "sponsor") {
      setError("فقط المستثمرون يمكنهم تأكيد التسليم");
      return;
    }
    if (!project) return;
    // Simulate Blockchain transaction for delivery
    const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`;
    console.log("Delivery confirmed, Blockchain Tx Hash:", mockTxHash);
    setTransactionHash(mockTxHash);
    setDeliveryConfirmed(true);
    alert("تم تأكيد تسليم المعدات! تم تسجيل العملية على البلوكشين.");
  };

  const handleAcceptOffer = (offerId: string) => {
    if (role !== "startup") {
      setError("فقط أصحاب المشاريع يمكنهم قبول العروض");
      return;
    }
    if (!project) return;
    const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`;
    setProject({
      ...project,
      offers: project.offers?.map((offer) =>
        offer.id === offerId ? { ...offer, status: "accepted", transactionHash: mockTxHash } : offer
      ),
      raised: {
        equipment: project.offers?.find((offer) => offer.id === offerId)?.equipment || null,
      },
    });
    console.log("Offer accepted:", offerId, "Blockchain Tx Hash:", mockTxHash);
    alert("تم قبول العرض! تم تسجيل العملية على البلوكشين.");
    setError(null);
  };

  const handleRejectOffer = (offerId: string) => {
    if (role !== "startup") {
      setError("فقط أصحاب المشاريع يمكنهم رفض العروض");
      return;
    }
    if (!project) return;
    const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`;
    setProject({
      ...project,
      offers: project.offers?.map((offer) =>
        offer.id === offerId ? { ...offer, status: "rejected", transactionHash: mockTxHash } : offer
      ),
    });
    console.log("Offer rejected:", offerId, "Blockchain Tx Hash:", mockTxHash);
    alert("تم رفض العرض! تم تسجيل العملية على البلوكشين.");
    setError(null);
  };

  const nextImage = () => {
    if (!project) return;
    setCurrentImageIndex((prevIndex) => (prevIndex === project.images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    if (!project) return;
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? project.images.length - 1 : prevIndex - 1));
  };

  const getCategoryIcon = () => {
    if (!project) return null;
    switch (project.sector) {
      case "الصناعة التحويلية": return <Building className="h-5 w-5" />;
      case "تكنولوجيا المعلومات": return <Cpu className="h-5 w-5" />;
      case "الزراعة العضوية": return <Leaf className="h-5 w-5" />;
      case "خدمات": return <Users className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "تمت المصادقة": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "قيد التحقق": return <Clock className="h-5 w-5 text-amber-500" />;
      case "مرفوض": return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const getOfferStatusClass = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "pending": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream">
        <Navbar />
        <main className="flex-1 py-12 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project || !isAuthenticated || !["sponsor", "startup"].includes(role || "")) {
    return null;
  }

  const progress = calculateProgress(project.raised.equipment, project.goal.equipment);

  return (
    <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
      <Navbar />
      <main className="flex-1 py-12 md:py-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full border-4 border-dashed border-primary-200/30 opacity-50"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full border-2 border-primary-300/20"></div>
          <div className="absolute top-1/3 left-1/3 w-16 h-16 rotate-45 border-2 border-primary-200/30"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-primary-200/30 rounded-lg rotate-12"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
          <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Project Header */}
            <div className="p-6 md:p-8 border-b border-primary-200">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-primary-500">{project.title}</h1>
                <Badge className="flex items-center gap-1 bg-primary-50 text-primary-500 border-primary-200" variant="outline">
                  {getCategoryIcon()}
                  {project.sector}
                </Badge>
                {project.blockchainVerified && (
                  <Badge className="flex items-center gap-1 bg-green-50 text-green-500 border-green-200" variant="outline">
                    <Lock className="h-4 w-4" />
                    موثق بالبلوكشين
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    آخر تحديث: {formatDate(project.updates.length > 0 ? project.updates[project.updates.length - 1].date : new Date().toISOString())}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>الولاية: {project.wilaya || "غير محدد"}</span>
                </div>
              </div>
            </div>

            <div className="md:flex">
              {/* Left Column - Project Details */}
              <div className="md:w-2/3 p-6 md:p-8">
                {/* Image Gallery */}
                <div className="relative h-64 md:h-96 mb-6 bg-primary-50 rounded-lg overflow-hidden shadow-md">
                  {project.images.length > 0 ? (
                    <>
                      <Image
                        src={project.images[currentImageIndex] || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 66vw"
                      />
                      {project.images.length > 1 && (
                        <>
                          <Button
                            onClick={prevImage}
                            variant="outline"
                            size="icon"
                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/80 text-primary-500 border-primary-200 hover:bg-primary-500 hover:text-white transition-all duration-300 z-10"
                            aria-label="الصورة السابقة"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                          <Button
                            onClick={nextImage}
                            variant="outline"
                            size="icon"
                            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/80 text-primary-500 border-primary-200 hover:bg-primary-500 hover:text-white transition-all duration-300 z-10"
                            aria-label="الصورة التالية"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {project.images.map((_, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-primary-500" : "bg-primary-200"}`}
                              ></div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-600">لا توجد صور</p>
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <div className="border-b border-primary-200 mb-6">
                  <nav className="flex overflow-x-auto" role="tablist">
                    {[
                      { key: "details", label: "التفاصيل", icon: null },
                      { key: "documents", label: "الوثائق", icon: FileText },
                      { key: "updates", label: "التحديثات", icon: RefreshCw },
                      { key: "messages", label: "الرسائل", icon: MessageSquare },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 font-semibold text-sm md:text-base ${
                          activeTab === key
                            ? "text-primary-500 border-b-2 border-primary-500"
                            : "text-gray-600 hover:text-primary-500"
                        } transition-colors duration-200`}
                        onClick={() => setActiveTab(key as "details" | "documents" | "updates" | "messages")}
                        role="tab"
                        aria-selected={activeTab === key}
                        aria-controls={`panel-${key}`}
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        {label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <motion.div
                  id={`panel-${activeTab}`}
                  className="mb-6"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  key={activeTab}
                  role="tabpanel"
                >
                  {activeTab === "details" && (
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary-600 mb-3">وصف المشروع</h2>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">{project.description}</p>
                      <div className="mt-4">
                        <h3 className="text-lg font-bold text-primary-600 mb-2">المعدات المطلوبة:</h3>
                        <p className="text-gray-600 text-sm md:text-base">
                          {project.goal.equipment
                            ? `${project.goal.equipment.quantity} وحدة ${project.goal.equipment.type} (${project.goal.equipment.condition})`
                            : "غير محدد"}
                        </p>
                        <p className="text-gray-600 text-sm md:text-base mt-2">
                          تم تزويد: {project.raised.equipment
                            ? `${project.raised.equipment.quantity} وحدة ${project.raised.equipment.type} (${project.raised.equipment.condition})`
                            : "0 وحدة"}
                        </p>
                        <div className="w-full bg-primary-200 rounded-full h-2 mt-2">
                          <div className="bg-primary-400 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-right text-xs text-gray-500 mt-1">{progress}% مكتمل</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "documents" && (
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary-600 mb-3">الوثائق</h2>
                      {project.documents.length > 0 ? (
                        <ul className="space-y-3">
                          {project.documents.map((doc, index) => (
                            <motion.li
                              key={index}
                              className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200 hover:bg-primary-100 transition-colors duration-200"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary-500" />
                                <span className="font-medium text-gray-600">{doc.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(doc.status)}
                                <span
                                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                                    doc.status === "تمت المصادقة"
                                      ? "bg-green-100 text-green-800"
                                      : doc.status === "قيد التحقق"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  <Lock className="h-4 w-4" />
                                  {doc.status} (تخزين سحابي مشفّر)
                                </span>
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-8 bg-primary-50 rounded-lg border border-primary-200">
                          <FileText className="h-10 w-10 text-primary-500 mx-auto mb-2" />
                          <p className="text-gray-600">لا توجد وثائق</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "updates" && (
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary-600 mb-3">تحديثات المشروع</h2>
                      {project.updates.length > 0 ? (
                        <div className="space-y-4">
                          {project.updates.map((update) => (
                            <motion.div
                              key={update.id}
                              className="border-r-2 border-primary-400 pr-4 pb-4 bg-primary-50 rounded-lg"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-primary-500" />
                                <div className="text-sm text-gray-600">{formatDate(update.date)}</div>
                              </div>
                              <p className="text-gray-600 text-sm md:text-base">{update.content}</p>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-primary-50 rounded-lg border border-primary-200">
                          <RefreshCw className="h-10 w-10 text-primary-500 mx-auto mb-2" />
                          <p className="text-gray-600">لا توجد تحديثات</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "messages" && (
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary-600 mb-3">الرسائل</h2>
                      <div className="border border-primary-200 rounded-lg p-4 mb-4 max-h-80 overflow-y-auto bg-primary-50">
                        {project.messages.length > 0 ? (
                          <div className="space-y-4">
                            {project.messages.map((msg) => (
                              <motion.div
                                key={msg.id}
                                className={`p-3 rounded-lg max-w-[80%] ${
                                  msg.sender === (role === "sponsor" ? "راعي المواد" : "صاحب المشروع")
                                    ? "bg-primary-100 mr-auto"
                                    : "bg-white ml-auto border border-primary-200"
                                }`}
                                initial={{ opacity: 0, x: msg.sender === (role === "sponsor" ? "راعي المواد" : "صاحب المشروع") ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="font-bold text-sm text-primary-500 mb-1">{msg.sender}</div>
                                <p className="text-gray-600 text-sm md:text-base">{msg.content}</p>
                                <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(msg.date)}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <MessageSquare className="h-10 w-10 text-primary-500 mx-auto mb-2" />
                            <p className="text-gray-600">لا توجد رسائل</p>
                          </div>
                        )}
                      </div>
                      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="اكتب رسالتك هنا..."
                          className="flex-1 border border-primary-200 rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          aria-label="إدخال رسالة"
                        />
                        <Button
                          onClick={handleSendMessage}
                          className="bg-primary-500 text-white rounded-full px-6 py-2 hover:bg-primary-600 shadow-md transition-all duration-300"
                          aria-label="إرسال الرسالة"
                        >
                          <Send className="h-4 w-4" />
                          إرسال
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Column - Role-Based Content */}
              <div className="md:w-1/3 bg-primary-50 p-6 md:p-8 border-t md:border-t-0 md:border-r border-primary-200">
                {/* Equipment Needs */}
                <div className="mb-6 p-4 bg-white rounded-lg border border-primary-200 shadow-md">
                  <h3 className="font-bold text-primary-600 mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    المعدات المطلوبة:
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    {project.goal.equipment
                      ? `${project.goal.equipment.quantity} وحدة ${project.goal.equipment.type} (${project.goal.equipment.condition})`
                      : "غير محدد"}
                  </p>
                  <p className="text-gray-600 text-sm md:text-base mt-2">
                    تم تزويد: {project.raised.equipment
                      ? `${project.raised.equipment.quantity} وحدة ${project.raised.equipment.type} (${project.raised.equipment.condition})`
                      : "0 وحدة"}
                  </p>
                </div>

                {/* Role-Based Content */}
                {role === "sponsor" && (
                  <>
                    {!offerSubmitted ? (
                      <div className="bg-white p-5 rounded-lg border border-primary-200 shadow-md mb-6">
                        <h3 className="text-lg font-bold text-primary-600 mb-4 text-center">تقديم عرض معدات</h3>
                        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                        <div className="mb-4">
                          <label className="block text-sm md:text-base font-medium text-primary-600 mb-1">نوع المعدات</label>
                          <Input
                            type="text"
                            placeholder="مثال: ماكينة تعبئة"
                            className="w-full border border-primary-200 rounded-lg px-4 py-2 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
                            value={equipmentOffer.type}
                            onChange={(e) => setEquipmentOffer({ ...equipmentOffer, type: e.target.value })}
                            aria-label="نوع المعدات"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm md:text-base font-medium text-primary-600 mb-1">الكمية</label>
                          <Input
                            type="number"
                            placeholder="مثال: 2"
                            className="w-full border border-primary-200 rounded-lg px-4 py-2 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
                            value={equipmentOffer.quantity}
                            onChange={(e) => setEquipmentOffer({ ...equipmentOffer, quantity: e.target.value })}
                            min="1"
                            aria-label="كمية المعدات"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm md:text-base font-medium text-primary-600 mb-1">الحالة</label>
                          <select
                            className="w-full border border-primary-200 rounded-lg px-4 py-2 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
                            value={equipmentOffer.condition}
                            onChange={(e) => setEquipmentOffer({ ...equipmentOffer, condition: e.target.value })}
                            aria-label="حالة المعدات"
                          >
                            <option value="">اختر الحالة</option>
                            <option value="جديد">جديد</option>
                            <option value="مستعمل بحالة جيدة">مستعمل بحالة جيدة</option>
                          </select>
                        </div>
                        <Button
                          className="w-full bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
                          onClick={handleSubmitOffer}
                          disabled={!equipmentOffer.type.trim() || !equipmentOffer.quantity || !equipmentOffer.condition.trim()}
                        >
                          إرسال العرض
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-white p-5 rounded-lg border border-primary-200 shadow-md mb-6">
                        <h3 className="text-lg font-bold text-primary-600 mb-4 text-center">تأكيد تسليم المعدات</h3>
                        <p className="text-gray-600 text-sm md:text-base mb-4">
                          تم تقديم العرض بنجاح! يرجى تأكيد تسليم المعدات إلى صاحب المشروع.
                        </p>
                        {transactionHash && (
                          <p className="text-gray-600 text-sm mb-4 break-all">
                            رمز العملية على البلوكشين: <span className="font-mono text-primary-500">{transactionHash}</span>
                          </p>
                        )}
                        <Button
                          className="w-full bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300 flex items-center gap-2"
                          onClick={handleConfirmDelivery}
                          disabled={deliveryConfirmed}
                        >
                          <Truck className="h-4 w-4" />
                          {deliveryConfirmed ? "تم التسليم" : "تأكيد التسليم"}
                        </Button>
                      </div>
                    )}
                    {/* Display sponsor's own offers */}
                    {project.offers && project.offers.length > 0 && (
                      <div className="bg-white p-5 rounded-lg border border-primary-200 shadow-md mb-6">
                        <h3 className="text-lg font-bold text-primary-600 mb-4 text-center">عروضك</h3>
                        <ul className="space-y-3">
                          {project.offers
                            .filter((offer) => offer.sponsorId === userId)
                            .map((offer) => (
                              <li
                                key={offer.id}
                                className="p-3 bg-primary-50 rounded-lg border border-primary-200"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-600 text-sm">
                                    {offer.equipment.quantity} وحدة {offer.equipment.type} ({offer.equipment.condition})
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${getOfferStatusClass(offer.status)}`}>
                                    {offer.status === "accepted" ? "مقبول" : offer.status === "rejected" ? "مرفوض" : "قيد الانتظار"}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-xs mb-2">التاريخ: {formatDate(offer.date)}</p>
                                {offer.transactionHash && (
                                  <p className="text-gray-600 text-xs mb-2 break-all">
                                    رمز العملية: <span className="font-mono text-primary-500">{offer.transactionHash}</span>
                                  </p>
                                )}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {role === "startup" && (
                  <>
                    <div className="bg-white p-5 rounded-lg border border-primary-200 shadow-md mb-6">
                      <h3 className="text-lg font-bold text-primary-600 mb-4 text-center">إدارة العروض</h3>
                      {project.offers && project.offers.length > 0 ? (
                        <ul className="space-y-3">
                          {project.offers.map((offer) => (
                            <li
                              key={offer.id}
                              className="p-3 bg-primary-50 rounded-lg border border-primary-200"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 text-sm">
                                  {offer.equipment.quantity} وحدة {offer.equipment.type} ({offer.equipment.condition})
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs ${getOfferStatusClass(offer.status)}`}>
                                  {offer.status === "accepted" ? "مقبول" : offer.status === "rejected" ? "مرفوض" : "قيد الانتظار"}
                                </span>
                              </div>
                              <p className="text-gray-600 text-xs mb-2">التاريخ: {formatDate(offer.date)}</p>
                              {offer.transactionHash && (
                                <p className="text-gray-600 text-xs mb-2 break-all">
                                  رمز العملية: <span className="font-mono text-primary-500">{offer.transactionHash}</span>
                                </p>
                              )}
                              {offer.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handleAcceptOffer(offer.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                    قبول
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handleRejectOffer(offer.id)}
                                  >
                                    <X className="h-4 w-4" />
                                    رفض
                                  </Button>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 text-center">لا توجد عروض بعد</p>
                      )}
                    </div>
                    {/* Edit Project Button - Only for Startup */}
                    <Button
                      asChild
                      className="w-full bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300 flex items-center gap-2"
                    >
                      <Link href={`/projects/${project.id}/edit`}>
                        <Edit className="h-4 w-4" />
                        تعديل المشروع
                      </Link>
                    </Button>
                  </>
                )}

                {/* Project Stats */}
                <div className="bg-white p-5 rounded-lg border border-primary-200 shadow-md mt-6">
                  <h3 className="text-lg font-bold text-primary-600 mb-4 text-center">معلومات المشروع</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center pb-2 border-b border-primary-200">
                      <span className="text-gray-600">القطاع:</span>
                      <span className="font-medium text-primary-500 flex items-center gap-1">
                        {getCategoryIcon()}
                        {project.sector}
                      </span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b border-primary-200">
                      <span className="text-gray-600">الولاية:</span>
                      <span className="font-medium text-primary-500">{project.wilaya || "غير محدد"}</span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b border-primary-200">
                      <span className="text-gray-600">عدد الرسائل:</span>
                      <span className="font-medium text-primary-500">{project.messages.length}</span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b border-primary-200">
                      <span className="text-gray-600">عدد التحديثات:</span>
                      <span className="font-medium text-primary-500">{project.updates.length}</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600">عدد الوثائق:</span>
                      <span className="font-medium text-primary-500">{project.documents.length}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}