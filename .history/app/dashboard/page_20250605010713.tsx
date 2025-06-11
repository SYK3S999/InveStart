"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  addUpdate,
  formatDate,
  getProjects,
  initializeStorage,
  type Project,
} from "@/lib/storage";
import { MessageSquare, RefreshCw, Briefcase, Shield, Truck, Lock } from "lucide-react";
import { motion } from "framer-motion";

type Offer = {
  id: number;
  equipment: string;
  date: string;
  projectId: number;
  status: string;
};

// Hardcoded RBAC logic
const useAuth = () => {
  // Simulated user data (replace with your auth logic)
  const user = { role: "startup", id: "user123" }; // Hardcoded for demo, can be "fournisseur" or "admin"
  return { isAuthenticated: !!user, role: user?.role || null };
};

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "messages" | "updates">("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [updateContent, setUpdateContent] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    initializeStorage();
    const allProjects = getProjects();
    const allOffers: Offer[] = [];
    setProjects(allProjects);
    setOffers(allOffers);
    if (allProjects.length > 0) setSelectedProjectId(allProjects[0].id);
  }, [isAuthenticated, router]);
  const handleAddUpdate = () => {
    if (!selectedProjectId || !updateContent.trim()) return;
    const newUpdate = addUpdate(selectedProjectId, updateContent);
    if (newUpdate) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === selectedProjectId ? { ...project, updates: [...project.updates, newUpdate] } : project
        )
      );
      setUpdateContent("");
    }
  };

  const getAllMessages = () =>
    projects
      .flatMap((project) =>
        project.messages.map((msg) => ({
          ...msg,
          projectId: project.id,
          projectTitle: project.title,
        }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getAllUpdates = () =>
    projects
      .flatMap((project) =>
        project.updates.map((update) => ({
          ...update,
          projectId: project.id,
          projectTitle: project.title,
        }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  if (!isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="flex flex-col min-h-screen font-amiri bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar for Navigation */}
            <motion.aside
              className="lg:w-1/4 bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-primary-600 mb-6">لوحة التحكم</h2>
              <nav className="space-y-2">
                {[
                  { key: "overview", label: "نظرة عامة", icon: Briefcase },
                  { key: "projects", label: role === "startup" ? "مشاريعي" : role === "fournisseur" ? "العروض" : "إدارة المشاريع", icon: Briefcase },
                  { key: "messages", label: "الرسائل", icon: MessageSquare },
                  { key: "updates", label: "التحديثات", icon: RefreshCw },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      activeTab === key
                        ? "bg-primary-100 text-primary-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab(key as "overview" | "projects" | "messages" | "updates")}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </button>
                ))}
              </nav>
            </motion.aside>

            {/* Main Content */}
            <div className="lg:w-3/4 space-y-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <motion.div variants={tabVariants} initial="hidden" animate="visible">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary-600 mb-6">نظرة عامة</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Summary Card */}
                    <motion.div
                      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                      variants={cardVariants}
                    >
                      <h3 className="text-lg font-bold text-primary-600 mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {role === "startup" ? "حالة المشاريع" : role === "fournisseur" ? "حالة العروض" : "إحصائيات النظام"}
                      </h3>
                      <p className="text-gray-600">
                        {role === "startup" ? `لديك ${projects.length} مشروع` : role === "fournisseur" ? `لديك ${offers.length} عرض` : `إجمالي المشاريع: ${projects.length}`}
                      </p>
                      <p className="text-gray-600 mt-2 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-500" />
                        مؤمّن عبر البلوكشين
                      </p>
                    </motion.div>
                    {/* Action Card */}
                    <motion.div
                      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                      variants={cardVariants}
                    >
                      <h3 className="text-lg font-bold text-primary-600 mb-2">إجراء سريع</h3>
                      {role === "startup" && (
                        <Button
                          asChild
                          className="w-full bg-primary-600 text-white rounded-full px-6 py-3 hover:bg-primary-700 transition-all duration-300"
                        >
                          <Link href="/projects/submit">قدّم مشروع جديد</Link>
                        </Button>
                      )}
                      {role === "fournisseur" && (
                        <Button
                          asChild
                          className="w-full bg-primary-600 text-white rounded-full px-6 py-3 hover:bg-primary-700 transition-all duration-300"
                        >
                          <Link href="/projects">تصفح المشاريع</Link>
                        </Button>
                      )}
                      {role === "admin" && (
                        <Button
                          asChild
                          className="w-full bg-primary-600 text-white rounded-full px-6 py-3 hover:bg-primary-700 transition-all duration-300"
                        >
                          <Link href="/projects/pending">مراجعة المشاريع المعلقة</Link>
                        </Button>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Projects/Offers Tab */}
              {activeTab === "projects" && (
                <motion.div variants={tabVariants} initial="hidden" animate="visible">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-primary-600 mb-4 sm:mb-0">
                      {role === "startup" ? "مشاريعي" : role === "fournisseur" ? "العروض المقدمة" : "إدارة المشاريع"}
                    </h2>
                    {role === "startup" && (
                      <Button
                        asChild
                        className="bg-primary-600 text-white rounded-full px-6 py-3 hover:bg-primary-700 transition-all duration-300"
                      >
                        <Link href="/projects/submit">قدّم مشروع جديد</Link>
                      </Button>
                    )}
                  </div>
                  {role === "startup" && projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project) => (
                        <motion.div
                          key={project.id}
                          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                          variants={cardVariants}
                        >
                          <div className="relative h-40">
                            <Image
                              src={project.images[0] || "/placeholder.svg?height=400&width=600"}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                              <Lock className="h-4 w-4" />
                              مشروع مؤمّن
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-primary-600 mb-2">{project.title}</h3>
                            <p className="text-gray-600 text-sm">{project.description.substring(0, 100)}...</p>
                            <p className="text-gray-600 text-sm mt-2">العتاد المطلوب: {project.equipmentType || "غير محدد"}</p>
                            <p className="text-gray-600 text-sm mt-2">الولاية: {project.wilaya || "غير محدد"}</p>
                            <Button
                              asChild
                              className="mt-4 w-full bg-primary-600 text-white rounded-full px-6 py-3 hover:bg-primary-700 transition-all duration-300"
                            >
                              <Link href={`/projects/${project.id}`}>عرض التفاصيل</Link>
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : role === "fournisseur" && offers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {offers.map((offer) => {
                        const project = projects.find((p) => p.id === offer.projectId);
                        return (
                          <motion.div
                            key={offer.id}
                            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                            variants={cardVariants}
                          >
                            <h3 className="text-lg font-bold text-primary-600 mb-2">{project?.title || "مشروع غير معروف"}</h3>
                            <p className="text-gray-600 text-sm">العرض: {offer.equipment}</p>
                            <p className="text-gray-600 text-sm mt-2">التاريخ: {formatDate(offer.date)}</p>
                            {offer.status === "completed" && (
                              <p className="text-green-600 text-sm mt-2 flex items-center gap-2">
                                <Truck className="h-4 w-4" />
                                تم التسليم - العمولة: 5% (3% لصاحب المشروع، 2% للمستثمر)
                              </p>
                            )}
                            <Button
                              asChild
                              className="mt-4 w-full bg-primary-600 text-white rounded-full px-6 py-3 hover:bg-primary-700 transition-all duration-300"
                            >
                              <Link href={`/projects/${offer.projectId}`}>عرض التفاصيل</Link>
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : role === "admin" && projects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {projects.map((project) => (
                        <motion.div
                          key={project.id}
                          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                          variants={cardVariants}
                        >
                          <h3 className="text-lg font-bold text-primary-600 mb-2">{project.title}</h3>
                          <p className="text-gray-600 text-sm">الحالة: {project.status || "قيد التحقق"}</p>
                          <p className="text-gray-600 text-sm mt-2">الولاية: {project.wilaya || "غير محدد"}</p>
                          <Button
                            asChild
                            className="mt-4 w-full bg-primary-600 text-white rounded-full px-6 py-3 hover:bg-primary-700 transition-all duration-300"
                          >
                            <Link href={`/projects/pending`}>إدارة المشروع</Link>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 text-sm md:text-base">ماكاش {role === "startup" ? "مشاريع" : role === "fournisseur" ? "عروض" : "مشاريع للإدارة"} بعد.</p>
                  )}
                </motion.div>
              )}

              {/* Messages Tab */}
              {activeTab === "messages" && (
                <motion.div variants={tabVariants} initial="hidden" animate="visible">
                  <h2 className="text-2xl font-bold text-primary-600 mb-6">الرسائل</h2>
                  {getAllMessages().length > 0 ? (
                    <div className="space-y-4">
                      {getAllMessages().map((message) => (
                        <motion.div
                          key={message.id}
                          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                          variants={cardVariants}
                        >
                          <p className="font-bold text-primary-600 mb-2">{message.projectTitle}</p>
                          <p className="text-gray-600 text-sm">{message.content}</p>
                          <p className="text-gray-600 text-xs mt-2">{formatDate(message.date)}</p>
                          <p className="text-gray-600 text-xs mt-1 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-green-500" />
                            رسالة مشفّرة
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 text-sm md:text-base">ماكاش رسائل.</p>
                  )}
                </motion.div>
              )}

              {/* Updates Tab */}
              {activeTab === "updates" && (
                <motion.div variants={tabVariants} initial="hidden" animate="visible">
                  <h2 className="text-2xl font-bold text-primary-600 mb-6">التحديثات</h2>
                  {role === "startup" && projects.length > 0 && (
                    <div className="mb-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <select
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 mb-4"
                        value={selectedProjectId || ""}
                        onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                      >
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                      <textarea
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                        rows={4}
                        placeholder="اكتب تحديث جديد..."
                        value={updateContent}
                        onChange={(e) => setUpdateContent(e.target.value)}
                      />
                      <Button
                        onClick={handleAddUpdate}
                        className="mt-4 w-full bg-primary-600 AscendinglySortedList600 text-white rounded-full px-6 py-3 hover:bg-primary-700 transition-all duration-300"
                        disabled={!updateContent.trim()}
                      >
                        إضافة تحديث
                      </Button>
                    </div>
                  )}
                  {getAllUpdates().length > 0 ? (
                    <div className="space-y-4">
                      {getAllUpdates().map((update) => (
                        <motion.div
                          key={update.id}
                          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                          variants={cardVariants}
                        >
                          <p className="font-bold text-primary-600 mb-2">{update.projectTitle}</p>
                          <p className="text-gray-600 text-sm">{update.content}</p>
                          <p className="text-gray-600 text-xs mt-2">{formatDate(update.date)}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 text-sm md:text-base">ماكاش تحديثات.</p>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}