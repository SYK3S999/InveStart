"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  addMessage,
  formatDate,
  getProject,
  initializeStorage,
  type Project,
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Hardcoded RBAC logic for Fournisseur role
const useAuth = () => {
  // Simulated user data (replace with your auth logic)
  const user = { role: "fournisseur", id: "user123" }; // Hardcoded for demo
  return { isAuthenticated: !!user, role: user?.role || null };
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "documents" | "updates" | "messages">("details");
  const [message, setMessage] = useState("");
  const [equipmentOffer, setEquipmentOffer] = useState("");
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStorage();
    if (params.id) {
      const projectId = Number(params.id);
      const projectData = getProject(projectId);
      if (projectData) {
        setProject(projectData);
      } else {
        router.push("/projects");
      }
    }
    setLoading(false);
  }, [params.id, router]);

  // RBAC: Redirect if not Fournisseur
  useEffect(() => {
    if (!isAuthenticated || role !== "fournisseur") {
      router.push("/login");
    }
  }, [isAuthenticated, role, router]);

  const handleSendMessage = () => {
    if (!project || !message.trim()) return;
    const newMessage = addMessage(project.id, { sender: "مستثمر", content: message });
    if (newMessage) {
      setProject({ ...project, messages: [...project.messages, newMessage] });
      setMessage("");
    }
  };

  const handleSubmitOffer = () => {
    if (!project || !equipmentOffer.trim()) return;
    const offer = {
      projectId: project.id,
      investor: "مستثمر",
      equipment: equipmentOffer,
      date: new Date().toISOString(),
    };
    console.log("Offer saved:", offer);
    setOfferSubmitted(true);
    setEquipmentOffer("");
  };
  const handleConfirmPayment = () => {
    setPaymentConfirmed(true);
    alert(
      "تم تأكيد الدفع! العمولة: 5% (3% لصاحب المشروع، 2% للمستثمر). العقد مسجل على البلوكشين."
    );
  };

  const handleConfirmDelivery = () => {
    setDeliveryConfirmed(true);
    alert("تم تأكيد تسليم العتاد!");
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
      case "صناعة": return <Building className="h-5 w-5" />;
      case "تكنولوجيا": return <Cpu className="h-5 w-5" />;
      case "زراعة": return <Leaf className="h-5 w-5" />;
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

  if (!project || !isAuthenticated || role !== "fournisseur") {
    return null; // Render nothing while redirecting
  }

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
                <Badge className="flex items-center gap-1 bg-green-50 text-green-500 border-green-200" variant="outline">
                  <Lock className="h-4 w-4" />
                  مؤمّن عبر البلوكشين
                </Badge>
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
                      <p className="text-gray-600">ماكاش صور</p>
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <div className="border-b border-primary-200 mb-6">
                  <div className="flex overflow-x-auto">
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
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <motion.div
                  className="mb-6"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  key={activeTab}
                >
                  {activeTab === "details" && (
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary-500 mb-3">وصف المشروع</h2>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">{project.description}</p>
                      <div className="mt-4">
                        <h3 className="text-lg font-bold text-primary-500 mb-2">العتاد المطلوب:</h3>
                        <p className="text-gray-600 text-sm md:text-base">{project.equipmentType || "غير محدد"}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "documents" && (
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary-500 mb-3">الوثائق</h2>
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
                          <p className="text-gray-600">ماكاش وثائق</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "updates" && (
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary-500 mb-3">تحديثات المشروع</h2>
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
                          <p className="text-gray-600">ماكاش تحديثات</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "messages" && (
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary-500 mb-3">الرسائل</h2>
                      <div className="border border-primary-200 rounded-lg p-4 mb-4 max-h-80 overflow-y-auto bg-primary-50">
                        {project.messages.length > 0 ? (
                          <div className="space-y-4">
                            {project.messages.map((msg) => (
                              <motion.div
                                key={msg.id}
                                className={`p-3 rounded-lg max-w-[80%] ${
                                  msg.sender === "مستثمر" ? "bg-primary-100 mr-auto" : "bg-white ml-auto border border-primary-200"
                                }`}
                                initial={{ opacity: 0, x: msg.sender === "مستثمر" ? -20 : 20 }}
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
                            <p className="text-gray-600">ماكاش رسائل</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="اكتب رسالتك هنا..."
                          className="flex-1 border border-primary-200 rounded-lg px-4 py-3 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <Button
                          onClick={handleSendMessage}
                          className="bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300 flex items-center gap-2"
                        >
                          <Send className="h-4 w-4" />
                          إرسال
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Column - Offer Form */}
              <div className="md:w-1/3 bg-primary-50 p-6 md:p-8 border-t md:border-t-0 md:border-r border-primary-200">
                {/* Equipment Needs */}
                <div className="mb-6 p-4 bg-white rounded-lg border border-primary-200 shadow-md">
                  <h3 className="font-bold text-primary-500 mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    العتاد المطلوب:
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">{project.equipmentType || "غير محدد"}</p>
                </div>

                {/* Offer Form */}
                {!offerSubmitted ? (
                  <div className="bg-white p-5 rounded-lg border border-primary-200 shadow-md mb-6">
                    <h3 className="text-lg font-bold text-primary-500 mb-4 text-center">تقديم عرض عيني</h3>
                    <div className="mb-4">
                      <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">وصف العتاد أو التأجير</label>
                      <textarea
                        className="w-full border border-primary-200 rounded-lg px-4 py-3 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                        rows={4}
                        placeholder="صف العتاد أو المعدات التأجيرية التي تقدمها (مثال: آلات، مواد، معدات)"
                        value={equipmentOffer}
                        onChange={(e) => setEquipmentOffer(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
                      onClick={handleSubmitOffer}
                      disabled={!equipmentOffer.trim()}
                    >
                      إرسال العرض
                    </Button>
                  </div>
                ) : !paymentConfirmed ? (
                  <div className="bg-white p-5 rounded-lg border border-primary-200 shadow-md mb-6">
                    <h3 className="text-lg font-bold text-primary-500 mb-4 text-center">تأكيد رسوم الاتفاقية</h3>
                    <p className="text-gray-600 text-sm md:text-base mb-4">
                      يرجى دفع رسوم الاتفاقية لإتمام العرض. سيتم تسجيل العقد على البلوكشين.
                    </p>
                    <Button
                      className="w-full bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
                      onClick={handleConfirmPayment}
                    >
                      تأكيد الدفع
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white p-5 rounded-lg border border-primary-200 shadow-md mb-6">
                    <h3 className="text-lg font-bold text-primary-500 mb-4 text-center">تأكيد تسليم العتاد</h3>
                    <p className="text-gray-600 text-sm md:text-base mb-4">
                      العرض مقبول! العمولة: 5% (3% لصاحب المشروع، 2% للمستثمر). يرجى تأكيد تسليم العتاد.
                    </p>
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

                {/* Project Stats */}
                <div className="bg-white p-5 rounded-lg border border-primary-200 shadow-md">
                  <h3 className="text-lg font-bold text-primary-500 mb-4 text-center">معلومات المشروع</h3>
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