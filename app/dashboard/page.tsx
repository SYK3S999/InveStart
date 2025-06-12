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
  User,
  MapPin,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const user = { role: "startup", id: "user123", name: "محمد", address: "قالمة، الجزائر" }; // Hardcoded for demo
  return { isAuthenticated: !!user, role: user?.role || null, name: user?.name || "مستخدم", address: user?.address };
};

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, role, name, address } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "messages" | "updates">("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [updateContent, setUpdateContent] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>("all");

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
      (project.title.includes(searchTerm) ||
        project.wilaya?.includes(searchTerm) ||
        project.equipmentType?.includes(searchTerm)) &&
      (projectStatusFilter === "all" || project.status === projectStatusFilter)
  );

  const filteredOffers = offers.filter((offer) => {
    const project = projects.find((p) => p.id === offer.projectId);
    return (
      (project?.title.includes(searchTerm) ||
        project?.wilaya?.includes(searchTerm) ||
        offer.equipment.includes(searchTerm)) &&
      (projectStatusFilter === "all" || project?.status === projectStatusFilter)
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
    <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-primary-200">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.aside
                  className="fixed inset-y-0 left-0 w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-2xl p-6 z-50 lg:static lg:w-1/4 rounded-2xl border border-gray-100 dark:border-primary-800"
                  variants={sidebarVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-green-600 dark:text-primary-300">لوحة التحكم</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSidebarOpen(false)}
                      className="lg:hidden text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  {/* Profile Summary */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-green-50 dark:from-primary-900/20 dark:to-gray-800/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-primary-500 dark:text-primary-400" />
                      <div>
                        <p className="text-sm font-bold text-primary-600 dark:text-primary-300">{name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 capitalize">
                          {role === "startup" ? "صاحب المشروع" : role === "fournisseur" ? "راعي المواد" : "مدير"}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {address}
                        </p>
                      </div>
                    </div>
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
                            ? "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300"
                            : "text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800"
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
                className="lg:hidden mb-4 border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-800"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* Welcome Banner */}
              <motion.div
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-primary-800"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <h1 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-300">
                  مرحبًا، {name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
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
                      className="bg-primary-500 dark:bg-primary-600 text-white dark:text-white rounded-full px-6 py-2 hover:bg-primary-600 dark:hover:bg-primary-700"
                    >
                      <Link href="/projects/submit">قدّم مشروع</Link>
                    </Button>
                  )}
                  {role === "fournisseur" && (
                    <Button
                      asChild
                      className="bg-primary-500 dark:bg-primary-600 text-white dark:text-white rounded-full px-6 py-2 hover:bg-primary-600 dark:hover:bg-primary-700"
                    >
                      <Link href="/projects">تصفح المشاريع</Link>
                    </Button>
                  )}
                  {role === "admin" && (
                    <Button
                      asChild
                      className="bg-primary-500 dark:bg-primary-600 text-white dark:text-white rounded-full px-6 py-2 hover:bg-primary-600 dark:hover:bg-primary-700"
                    >
                      <Link href="/projects/pending">مراجعة المشاريع</Link>
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Overview Tab */}
              {activeTab === "overview" && (
                <motion.div variants={cardVariants} initial="hidden" animate="visible">
                  <h2 className="text-xl font-bold text-primary-600 dark:text-primary-300 mb-4">نظرة عامة</h2>
                  <div className="flex overflow-x-auto gap-4 pb-4">
                    <motion.div
                      className="min-w-[250px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-primary-800"
                      variants={cardVariants}
                    >
                      <h3 className="text-lg font-bold text-primary-600 dark:text-primary-300 mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        إحصائيات سريعة
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {role === "startup"
                          ? `${projects.length} مشروع`
                          : role === "fournisseur"
                          ? `${offers.length} عرض`
                          : `${projects.length} مشروع نشط`}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        {role === "startup" || role === "fournisseur"
                          ? `${filteredOffers.filter((o) => o.status === "pending").length} عرض معلق`
                          : `${filteredProjects.filter((p) => p.status === "قيد التحقق").length} مشروع قيد التحقق`}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                        مؤمّن عبر البلوكشين
                      </p>
                    </motion.div>
                    <motion.div
                      className="min-w-[250px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-primary-800"
                      variants={cardVariants}
                    >
                      <h3 className="text-lg font-bold text-primary-600 dark:text-primary-300 mb-2">الرسائل</h3>
                      <p className="text-gray-600 dark:text-gray-300">{getAllMessages().length} رسالة جديدة</p>
                      <Button
                        variant="link"
                        className="mt-2 text-primary-600 dark:text-primary-300"
                        onClick={() => setActiveTab("messages")}
                      >
                        عرض الكل
                      </Button>
                    </motion.div>
                    <motion.div
                      className="min-w-[250px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-primary-800"
                      variants={cardVariants}
                    >
                      <h3 className="text-lg font-bold text-primary-600 dark:text-primary-300 mb-2">التحديثات</h3>
                      <p className="text-gray-600 dark:text-gray-300">{getAllUpdates().length} تحديث</p>
                      <Button
                        variant="link"
                        className="mt-2 text-primary-600 dark:text-primary-300"
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
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-primary-600 dark:text-primary-300 mb-4 sm:mb-0">
                      {role === "startup" ? "مشاريعي" : role === "fournisseur" ? "عروضي" : "إدارة المشاريع"}
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <div className="relative">
                        <Input
                          placeholder="ابحث..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-10 rounded-full border-gray-200 dark:border-primary-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
                        {searchTerm && (
                          <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                            onClick={() => setSearchTerm("")}
                            aria-label="مسح البحث"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <Select value={projectStatusFilter} onValueChange={setProjectStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px] rounded-full border-gray-200 dark:border-primary-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
                          <Filter className="h-5 w-5 mr-2" />
                          <SelectValue placeholder="تصفية حسب الحالة" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-primary-800">
                          <SelectItem value="all" className="text-gray-900 dark:text-gray-200">الكل</SelectItem>
                          <SelectItem value="تمت المصادقة" className="text-gray-900 dark:text-gray-200">تمت المصادقة</SelectItem>
                          <SelectItem value="قيد التحقق" className="text-gray-900 dark:text-gray-200">قيد التحقق</SelectItem>
                          <SelectItem value="مرفوض" className="text-gray-900 dark:text-gray-200">مرفوض</SelectItem>
                        </SelectContent>
                      </Select>
                      {role === "startup" && (
                        <Button
                          asChild
                          className="bg-primary-500 dark:bg-primary-600 text-white dark:text-white rounded-full px-6 py-2 hover:bg-primary-600 dark:hover:bg-primary-700"
                        >
                          <Link href="/projects/submit">مشروع جديد</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  {(role === "startup" && filteredProjects.length > 0) ||
                  (role === "fournisseur" && filteredOffers.length > 0) ||
                  (role === "admin" && filteredProjects.length > 0) ? (
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-primary-800 overflow-x-auto">
                      <table className="w-full text-right">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-primary-800">
                            <th className="py-3 px-4 text-primary-600 dark:text-primary-300 font-semibold">المشروع</th>
                            <th className="py-3 px-4 text-primary-600 dark:text-primary-300 font-semibold">
                              {role === "fournisseur" ? "العرض" : "العتاد"}
                            </th>
                            <th className="py-3 px-4 text-primary-600 dark:text-primary-300 font-semibold">الولاية</th>
                            <th className="py-3 px-4 text-primary-600 dark:text-primary-300 font-semibold">الحالة</th>
                            <th className="py-3 px-4 text-primary-600 dark:text-primary-300 font-semibold">الإجراء</th>
                          </tr>
                        </thead>
                        <tbody>
                          {role === "startup" &&
                            filteredProjects.map((project) => (
                              <motion.tr
                                key={project.id}
                                className="border-b border-gray-100 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-gray-800"
                                variants={cardVariants}
                              >
                                <td className="py-3 px-4">{project.title}</td>
                                <td className="py-3 px-4">{project.equipmentType || "غير محدد"}</td>
                                <td className="py-3 px-4">{project.wilaya || "غير محدد"}</td>
                                <td className="py-3 px-4">
                                  <Badge
                                    className={
                                      project.status === "تمت المصادقة"
                                        ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300"
                                        : project.status === "قيد التحقق"
                                        ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300"
                                        : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300"
                                    }
                                  >
                                    {project.status || "قيد التحقق"}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-full border-primary-600 dark:border-primary-300 text-primary-600 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-800"
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
                                  className="border-b border-gray-100 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-gray-800"
                                  variants={cardVariants}
                                >
                                  <td className="py-3 px-4">{project?.title || "مشروع غير معروف"}</td>
                                  <td className="py-3 px-4">{offer.equipment}</td>
                                  <td className="py-3 px-4">{project?.wilaya || "غير محدد"}</td>
                                  <td className="py-3 px-4">
                                    {offer.status === "completed" ? (
                                      <Badge className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 flex items-center gap-1">
                                        <Truck className="h-4 w-4" />
                                        تم التسليم
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300">قيد التنفيذ</Badge>
                                    )}
                                  </td>
                                  <td className="py-3 px-4">
                                    <Button
                                      asChild
                                      variant="outline"
                                      className="rounded-full border-primary-600 dark:border-primary-300 text-primary-600 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-800"
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
                                className="border-b border-gray-100 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-gray-800"
                                variants={cardVariants}
                              >
                                <td className="py-3 px-4">{project.title}</td>
                                <td className="py-3 px-4">{project.equipmentType || "غير محدد"}</td>
                                <td className="py-3 px-4">{project.wilaya || "غير محدد"}</td>
                                <td className="py-3 px-4">
                                  <Badge
                                    className={
                                      project.status === "تمت المصادقة"
                                        ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300"
                                        : project.status === "قيد التحقق"
                                        ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300"
                                        : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300"
                                    }
                                  >
                                    {project.status || "قيد التحقق"}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-full border-primary-600 dark:border-primary-300 text-primary-600 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-800"
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
                    <p className="text-center text-gray-600 dark:text-gray-300">ماكاش {role === "startup" ? "مشاريع" : role === "fournisseur" ? "عروض" : "مشاريع للإدارة"}.</p>
                  )}
                </motion.div>
              )}

              {/* Messages Tab */}
              {activeTab === "messages" && (
                <motion.div variants={cardVariants} initial="hidden" animate="visible">
                  <h2 className="text-xl font-bold text-primary-600 dark:text-primary-300 mb-4">الرسائل</h2>
                  {getAllMessages().length > 0 ? (
                    <div className="space-y-4">
                      {getAllMessages().map((message) => (
                        <motion.div
                          key={message.id}
                          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-primary-800"
                          variants={cardVariants}
                        >
                          <p className="font-bold text-primary-600 dark:text-primary-300 mb-2">{message.projectTitle}</p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{message.content}</p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-gray-600 dark:text-gray-300 text-xs">{formatDate(message.date)}</p>
                            <p className="text-primary-600 dark:text-primary-300 text-xs flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              مشفّرة
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-300">ماكاش رسائل.</p>
                  )}
                </motion.div>
              )}

              {/* Updates Tab */}
              {activeTab === "updates" && (
                <motion.div variants={cardVariants} initial="hidden" animate="visible">
                  <h2 className="text-xl font-bold text-primary-600 dark:text-primary-300 mb-4">التحديثات</h2>
                  {role === "startup" && projects.length > 0 && (
                    <motion.div
                      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-primary-800 mb-6"
                      variants={cardVariants}
                    >
                      <select
                        className="w-full border border-gray-200 dark:border-primary-700 rounded-lg px-4 py-3 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
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
                        className="w-full border border-gray-200 dark:border-primary-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        rows={4}
                        placeholder="اكتب تحديث..."
                        value={updateContent}
                        onChange={(e) => setUpdateContent(e.target.value)}
                      />
                      <Button
                        onClick={handleAddUpdate}
                        className="mt-4 w-full bg-primary-500 dark:bg-primary-600 text-white dark:text-white rounded-full px-6 py-2 hover:bg-primary-600 dark:hover:bg-primary-700"
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
                          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-primary-800"
                          variants={cardVariants}
                        >
                          <p className="font-bold text-primary-600 dark:text-primary-300 mb-2">{update.projectTitle}</p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{update.content}</p>
                          <p className="text-gray-600 dark:text-gray-300 text-xs mt-2">{formatDate(update.date)}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-300">ماكاش تحديثات.</p>
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