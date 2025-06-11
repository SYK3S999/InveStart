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
import {
  Menu,
  X,
  Briefcase,
  MessageSquare,
  RefreshCw,
  Shield,
  Truck,
  Lock,
  Search,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Offer {
  id: number;
  projectId: number;
  equipment: string;
  status: string;
}

const getOffers = (): Offer[] => {
  return [];
};
const useAuth = () => {
  const user = { role: "startup", id: "user123", name: "محمد" }; // Hardcoded for demo
  return { isAuthenticated: !!user, role: user?.role || null, name: user?.name || "مستخدم" };
};

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, role, name } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "messages" | "updates">("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [updateContent, setUpdateContent] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    initializeStorage();
    const allProjects = getProjects();
    const allOffers = getOffers();
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

  const filteredProjects = projects.filter(
    (project) =>
      project.title.includes(searchTerm) ||
      project.wilaya?.includes(searchTerm) ||
      project.equipmentType?.includes(searchTerm)
  );

  const filteredOffers = offers.filter((offer) => {
    const project = projects.find((p) => p.id === offer.projectId);
    return (
      project?.title.includes(searchTerm) ||
      project?.wilaya?.includes(searchTerm) ||
      offer.equipment.includes(searchTerm)
    );
  });

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-br from-gray-50 to-green-50 text-gray-900">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.aside
                  className="fixed inset-y-0 left-0 w-64 bg-white/80 backdrop-blur-lg shadow-2xl p-6 z-50 lg:static lg:w-1/4 rounded-2xl border border-gray-100"
                  variants={sidebarVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-green-600">لوحة التحكم</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSidebarOpen(false)}
                      className="lg:hidden"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  <nav className="space-y-2">
                    {[
                      { key: "overview", label: "نظرة عامة", icon: Briefcase },
                      {
                        key: "projects",
                        label:
                          role === "startup"
                            ? "مشاريعي"
                            : role === "fournisseur"
                            ? "عروضي"
                            : "إدارة المشاريع",
                        icon: Briefcase,
                      },
                      { key: "messages", label: "الرسائل", icon: MessageSquare },
                      { key: "updates", label: "التحديثات", icon: RefreshCw },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          activeTab === key
                            ? "bg-green-100 text-green-600"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setActiveTab(key as "overview" | "projects" | "messages" | "updates");
                          setIsSidebarOpen(false);
                        }}
                      >
                        <Icon className="h-5 w-5" />
                        {label}
                      </button>
                    ))}
                  </nav>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="lg:w-3/4 space-y-6">
              {/* Mobile Sidebar Toggle */}
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden mb-4"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* Welcome Banner */}
              <motion.div
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <h1 className="text-2xl md:text-3xl font-bold text-green-600">
                  مرحبًا، {name}!
                </h1>
                <p className="text-gray-600 mt-2">
                  {role === "startup"
                    ? "تابع مشاريعك وقدّم طلبات للعتاد التأجيري."
                    : role === "fournisseur"
                    ? "راقب عروضك العينية وتأكد من تسليم العتاد."
                    : "إدارة المشاريع والمستخدمين بسهولة."}
                </p>
                <div className="mt-4 flex gap-4">
                  {role === "startup" && (
                    <Button
                      asChild
                      className="bg-green-600 text-white rounded-full px-6 py-2 hover:bg-green-700"
                    >
                      <Link href="/projects/submit">قدّم مشروع</Link>
                    </Button>
                  )}
                  {role === "fournisseur" && (
                    <Button
                      asChild
                      className="bg-green-600 text-white rounded-full px-6 py-2 hover:bg-green-700"
                    >
                      <Link href="/projects">تصفح المشاريع</Link>
                    </Button>
                  )}
                  {role === "admin" && (
                    <Button
                      asChild
                      className="bg-green-600 text-white rounded-full px-6 py-2 hover:bg-green-700"
                    >
                      <Link href="/projects/pending">مراجعة المشاريع</Link>
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Overview Tab */}
              {activeTab === "overview" && (
                <motion.div variants={cardVariants} initial="hidden" animate="visible">
                  <h2 className="text-xl font-bold text-green-600 mb-4">نظرة عامة</h2>
                  <div className="flex overflow-x-auto gap-4 pb-4">
                    <motion.div
                      className="min-w-[250px] bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100"
                      variants={cardVariants}
                    >
                      <h3 className="text-lg font-bold text-green-600 mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        الإحصائيات
                      </h3>
                      <p className="text-gray-600">
                        {role === "startup"
                          ? `${projects.length} مشروع`
                          : role === "fournisseur"
                          ? `${offers.length} عرض`
                          : `${projects.length} مشروع نشط`}
                      </p>
                      <p className="text-gray-600 mt-2 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-500" />
                        مؤمّن عبر البلوكشين
                      </p>
                    </motion.div>
                    <motion.div
                      className="min-w-[250px] bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100"
                      variants={cardVariants}
                    >
                      <h3 className="text-lg font-bold text-green-600 mb-2">الرسائل</h3>
                      <p className="text-gray-600">{getAllMessages().length} رسالة جديدة</p>
                      <Button
                        variant="link"
                        className="mt-2 text-green-600"
                        onClick={() => setActiveTab("messages")}
                      >
                        عرض الكل
                      </Button>
                    </motion.div>
                    <motion.div
                      className="min-w-[250px] bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100"
                      variants={cardVariants}
                    >
                      <h3 className="text-lg font-bold text-green-600 mb-2">التحديثات</h3>
                      <p className="text-gray-600">{getAllUpdates().length} تحديث</p>
                      <Button
                        variant="link"
                        className="mt-2 text-green-600"
                        onClick={() => setActiveTab("updates")}
                      >
                        عرض الكل
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Projects/Offers Tab */}
              {activeTab === "projects" && (
                <motion.div variants={cardVariants} initial="hidden" animate="visible">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-green-600 mb-4 sm:mb-0">
                      {role === "startup" ? "مشاريعي" : role === "fournisseur" ? "عروضي" : "إدارة المشاريع"}
                    </h2>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Input
                          placeholder="ابحث..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 rounded-full border-gray-200"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      {role === "startup" && (
                        <Button
                          asChild
                          className="bg-green-600 text-white rounded-full px-6 py-2 hover:bg-green-700"
                        >
                          <Link href="/projects/submit">مشروع جديد</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  {(role === "startup" && filteredProjects.length > 0) ||
                  (role === "fournisseur" && filteredOffers.length > 0) ||
                  (role === "admin" && filteredProjects.length > 0) ? (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 overflow-x-auto">
                      <table className="w-full text-right">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 text-green-600 font-semibold">المشروع</th>
                            <th className="py-3 px-4 text-green-600 font-semibold">
                              {role === "fournisseur" ? "العرض" : "العتاد"}
                            </th>
                            <th className="py-3 px-4 text-green-600 font-semibold">الولاية</th>
                            <th className="py-3 px-4 text-green-600 font-semibold">الحالة</th>
                            <th className="py-3 px-4 text-green-600 font-semibold">الإجراء</th>
                          </tr>
                        </thead>
                        <tbody>
                          {role === "startup" &&
                            filteredProjects.map((project) => (
                              <motion.tr
                                key={project.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                                variants={cardVariants}
                              >
                                <td className="py-3 px-4">{project.title}</td>
                                <td className="py-3 px-4">{project.equipmentType || "غير محدد"}</td>
                                <td className="py-3 px-4">{project.wilaya || "غير محدد"}</td>
                                <td className="py-3 px-4">
                                  <Badge
                                    className={
                                      project.status === "تمت المصادقة"
                                        ? "bg-green-100 text-green-600"
                                        : project.status === "قيد التحقق"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-red-100 text-red-600"
                                    }
                                  >
                                    {project.status || "قيد التحقق"}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-full border-green-600 text-green-600 hover:bg-green-50"
                                  >
                                    <Link href={`/projects/${project.id}`}>تفاصيل</Link>
                                  </Button>
                                </td>
                              </motion.tr>
                            ))}
                          {role === "fournisseur" &&
                            filteredOffers.map((offer) => {
                              const project = projects.find((p) => p.id === offer.projectId);
                              return (
                                <motion.tr
                                  key={offer.id}
                                  className="border-b border-gray-100 hover:bg-gray-50"
                                  variants={cardVariants}
                                >
                                  <td className="py-3 px-4">{project?.title || "مشروع غير معروف"}</td>
                                  <td className="py-3 px-4">{offer.equipment}</td>
                                  <td className="py-3 px-4">{project?.wilaya || "غير محدد"}</td>
                                  <td className="py-3 px-4">
                                    {offer.status === "completed" ? (
                                      <Badge className="bg-green-100 text-green-600 flex items-center gap-1">
                                        <Truck className="h-4 w-4" />
                                        تم التسليم
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-yellow-100 text-yellow-600">قيد التنفيذ</Badge>
                                    )}
                                  </td>
                                  <td className="py-3 px-4">
                                    <Button
                                      asChild
                                      variant="outline"
                                      className="rounded-full border-green-600 text-green-600 hover:bg-green-50"
                                    >
                                      <Link href={`/projects/${offer.projectId}`}>
                                        {offer.status === "completed"
                                          ? "عرض العمولة (5%)"
                                          : "تفاصيل"}
                                      </Link>
                                    </Button>
                                  </td>
                                </motion.tr>
                              );
                            })}
                          {role === "admin" &&
                            filteredProjects.map((project) => (
                              <motion.tr
                                key={project.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                                variants={cardVariants}
                              >
                                <td className="py-3 px-4">{project.title}</td>
                                <td className="py-3 px-4">{project.equipmentType || "غير محدد"}</td>
                                <td className="py-3 px-4">{project.wilaya || "غير محدد"}</td>
                                <td className="py-3 px-4">
                                  <Badge
                                    className={
                                      project.status === "تمت المصادقة"
                                        ? "bg-green-100 text-green-600"
                                        : project.status === "قيد التحقق"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-red-100 text-red-600"
                                    }
                                  >
                                    {project.status || "قيد التحقق"}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-full border-green-600 text-green-600 hover:bg-green-50"
                                  >
                                    <Link href="/projects/pending">إدارة</Link>
                                  </Button>
                                </td>
                              </motion.tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">ماكاش {role === "startup" ? "مشاريع" : role === "fournisseur" ? "عروض" : "مشاريع للإدارة"}.</p>
                  )}
                </motion.div>
              )}

              {/* Messages Tab */}
              {activeTab === "messages" && (
                <motion.div variants={cardVariants} initial="hidden" animate="visible">
                  <h2 className="text-xl font-bold text-green-600 mb-4">الرسائل</h2>
                  {getAllMessages().length > 0 ? (
                    <div className="space-y-4">
                      {getAllMessages().map((message) => (
                        <motion.div
                          key={message.id}
                          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100"
                          variants={cardVariants}
                        >
                          <p className="font-bold text-green-600 mb-2">{message.projectTitle}</p>
                          <p className="text-gray-600 text-sm">{message.content}</p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-gray-600 text-xs">{formatDate(message.date)}</p>
                            <p className="text-green-600 text-xs flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              مشفّرة
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">ماكاش رسائل.</p>
                  )}
                </motion.div>
              )}

              {/* Updates Tab */}
              {activeTab === "updates" && (
                <motion.div variants={cardVariants} initial="hidden" animate="visible">
                  <h2 className="text-xl font-bold text-green-600 mb-4">التحديثات</h2>
                  {role === "startup" && projects.length > 0 && (
                    <motion.div
                      className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 mb-6"
                      variants={cardVariants}
                    >
                      <select
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4"
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
                        className="w-full border border-gray-200 rounded-lg px-4 py-3"
                        rows={4}
                        placeholder="اكتب تحديث..."
                        value={updateContent}
                        onChange={(e) => setUpdateContent(e.target.value)}
                      />
                      <Button
                        onClick={handleAddUpdate}
                        className="mt-4 w-full bg-green-600 text-white rounded-full px-6 py-2 hover:bg-green-700"
                        disabled={!updateContent.trim()}
                      >
                        إضافة تحديث
                      </Button>
                    </motion.div>
                  )}
                  {getAllUpdates().length > 0 ? (
                    <div className="space-y-4">
                      {getAllUpdates().map((update) => (
                        <motion.div
                          key={update.id}
                          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100"
                          variants={cardVariants}
                        >
                          <p className="font-bold text-green-600 mb-2">{update.projectTitle}</p>
                          <p className="text-gray-600 text-sm">{update.content}</p>
                          <p className="text-gray-600 text-xs mt-2">{formatDate(update.date)}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">ماكاش تحديثات.</p>
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
