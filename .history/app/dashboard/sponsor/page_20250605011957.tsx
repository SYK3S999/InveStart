"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/protected-route";
import {
  Menu,
  X,
  Briefcase,
  MessageSquare,
  FileText,
  Settings,
  Search,
  Truck,
  Lock,
  Filter,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatDate,
  getProjects,
  initializeStorage,
  type Project,
} from "@/lib/storage";


const getOffers = () => {
  // Dummy implementation, replace with real logic as needed
  return [];
};

type Offer = {
  id: number;
  investor: string;
  equipment: string;
  projectId: number;
  status: string;
};

type Contract = { id: number; title: string; status: string; projectId: number };
const useAuth = () => {
  const user = { role: "sponsor", id: "user123", name: "عبد الله" }; // Hardcoded for demo
  return { isAuthenticated: !!user, role: user?.role || null, name: user?.name || "مستثمر" };
};

export default function FournisseurDashboard() {
  const router = useRouter();
  const { isAuthenticated, role, name } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [messages, setMessages] = useState<{ id: number; projectTitle: string; content: string; date: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!isAuthenticated || role !== "sponsor") {
      router.push("/login");
    }
    initializeStorage();
    const fetchedProjects = getProjects();
    const fetchedOffers = getOffers();
    setProjects(fetchedProjects);
    setOffers(fetchedOffers.filter((offer: { investor: string; }) => offer.investor === "مستثمر")); // Filter for current investor
    setContracts(
      fetchedOffers.map((offer: { projectId: number; status: string; }, index: number) => ({
        id: index + 1,
        title: `عقد عرض - ${fetchedProjects.find((p) => p.id === offer.projectId)?.title || "غير معروف"}`,
        status: offer.status === "completed" ? "موقع" : "قيد المراجعة",
        projectId: offer.projectId,
      }))
    );
    setMessages(
      fetchedProjects
        .flatMap((project) =>
          project.messages.map((msg) => ({
            id: msg.id,
            projectTitle: project.title,
            content: msg.content,
            date: msg.date,
          }))
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }, [isAuthenticated, role, router]);

  const filteredOffers = offers.filter((offer) => {
    const project = projects.find((p) => p.id === offer.projectId);
    return (
      project?.title.includes(searchTerm) ||
      project?.wilaya?.includes(searchTerm) ||
      offer.equipment.includes(searchTerm)
    );
  });

  const paginatedOffers = filteredOffers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (!isAuthenticated || role !== "sponsor") {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["sponsor"]}>
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
                      <h2 className="text-xl font-bold text-green-600">لوحة المستثمر</h2>
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
                        { key: "offers", label: "عروضي", icon: Briefcase },
                        { key: "contracts", label: "العقود", icon: FileText },
                        { key: "messages", label: "الرسائل", icon: MessageSquare },
                        { key: "settings", label: "الإعدادات", icon: Settings },
                      ].map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            activeTab === key
                              ? "bg-green-100 text-green-600"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setActiveTab(key as any);
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
                  <h1 className="text-2xl md:text-3xl font-bold text-green-600">مرحبًا، {name}!</h1>
                  <p className="text-gray-600 mt-2">راقب عروضك العينية وتأكد من تسليم العتاد.</p>
                  <div className="mt-4 flex gap-4">
                    <Button
                      asChild
                      className="bg-green-600 text-white rounded-full px-6 py-2 hover:bg-green-700"
                    >
                      <Link href="/projects">تصفح المشاريع</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Link href="/projects/submit-offer">تقديم عرض جديد</Link>
                    </Button>
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
                          <Briefcase className="h-5 w-5" />
                          العروض
                        </h3>
                        <p className="text-gray-600">{offers.length} عرض مقدم</p>
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
                        <p className="text-gray-600">{messages.length} رسالة جديدة</p>
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
                        <h3 className="text-lg font-bold text-green-600 mb-2">العقود</h3>
                        <p className="text-gray-600">{contracts.length} عقد</p>
                        <Button
                          variant="link"
                          className="mt-2 text-green-600"
                          onClick={() => setActiveTab("contracts")}
                        >
                          عرض الكل
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Offers Tab */}
                {activeTab === "offers" && (
                  <motion.div variants={cardVariants} initial="hidden" animate="visible">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-green-600 mb-4 sm:mb-0">عروضي العينية</h2>
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
                        <Button
                          variant="outline"
                          className="rounded-full border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <Filter className="h-5 w-5 mr-2" />
                          تصفية
                        </Button>
                      </div>
                    </div>
                    {paginatedOffers.length > 0 ? (
                      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 overflow-x-auto">
                        <table className="w-full text-right">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="py-3 px-4 text-green-600 font-semibold">المشروع</th>
                              <th className="py-3 px-4 text-green-600 font-semibold">العتاد</th>
                              <th className="py-3 px-4 text-green-600 font-semibold">الولاية</th>
                              <th className="py-3 px-4 text-green-600 font-semibold">الحالة</th>
                              <th className="py-3 px-4 text-green-600 font-semibold">الإجراء</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedOffers.map((offer) => {
                              const project = projects.find((p) => p.id === offer.projectId);
                              return (
                                <motion.tr
                                  key={offer.id}
                                  className="border-b border-gray-100 hover:bg-gray-50"
                                  variants={cardVariants}
                                >
                                  <td className="py-3 px-4">{project?.title || "غير معروف"}</td>
                                  <td className="py-3 px-4">{offer.equipment}</td>
                                  <td className="py-3 px-4">{project?.wilaya || "غير محدد"}</td>
                                  <td className="py-3 px-4">
                                    {offer.status === "completed" ? (
                                      <Badge className="bg-green-100 text-green-600 flex items-center gap-1">
                                        <Truck className="h-4 w-4" />
                                        تم التسليم
                                        <span className="text-xs ml-2">
                                          (عمولة: 5% - 3% صاحب المشروع، 2% مستثمر)
                                        </span>
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
                                      <Link href={`/projects/${offer.projectId}`}>تفاصيل</Link>
                                    </Button>
                                  </td>
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="flex justify-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            السابق
                          </Button>
                          <Button
                            variant="outline"
                            disabled={currentPage * itemsPerPage >= filteredOffers.length}
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            التالي
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-600">ماكاش عروض بعد.</p>
                    )}
                  </motion.div>
                )}

                {/* Contracts Tab */}
                {activeTab === "contracts" && (
                  <motion.div variants={cardVariants} initial="hidden" animate="visible">
                    <h2 className="text-xl font-bold text-green-600 mb-4">العقود</h2>
                    {contracts.length > 0 ? (
                      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
                        <ul className="space-y-4">
                          {contracts.slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                          ).map((contract) => (
                            <motion.li
                              key={contract.id}
                              className="flex justify-between items-center border-b border-gray-200 pb-2"
                              variants={cardVariants}
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-600" />
                                <span>{contract.title}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge
                                  className={
                                    contract.status === "موقع"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-yellow-100 text-yellow-600"
                                  }
                                >
                                  <Lock className="h-4 w-4 mr-1" />
                                  {contract.status} (تخزين سحابي مشفّر)
                                </Badge>
                                <Button
                                  asChild
                                  variant="outline"
                                  className="rounded-full border-green-600 text-green-600 hover:bg-green-50"
                                >
                                  <Link href={`/contracts/${contract.id}`}>عرض</Link>
                                </Button>
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                        <div className="flex justify-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            السابق
                          </Button>
                          <Button
                            variant="outline"
                            disabled={currentPage * itemsPerPage >= contracts.length}
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            التالي
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-600">ماكاش عقود بعد.</p>
                    )}
                  </motion.div>
                )}

                {/* Messages Tab */}
                {activeTab === "messages" && (
                  <motion.div variants={cardVariants} initial="hidden" animate="visible">
                    <h2 className="text-xl font-bold text-green-600 mb-4">الرسائل</h2>
                    {messages.length > 0 ? (
                      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
                        <ul className="space-y-4">
                          {messages.slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                          ).map((message) => (
                            <motion.li
                              key={message.id}
                              className="border-b border-gray-200 pb-2"
                              variants={cardVariants}
                            >
                              <p className="font-bold text-green-600">{message.projectTitle}</p>
                              <p className="text-gray-600 text-sm">{message.content}</p>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-gray-600 text-xs">{formatDate(message.date)}</p>
                                <p className="text-green-600 text-xs flex items-center gap-2">
                                  <Lock className="h-4 w-4" />
                                  مشفّرة
                                </p>
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                        <div className="flex justify-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            السابق
                          </Button>
                          <Button
                            disabled={currentPage * itemsPerPage >= messages.length}
                            variant="outline"
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            التالي
                          </Button>
                        </div >
                      </div>
                    ) : (
                      <p className="text-center text-gray-600">ماكاش رسائل.</p>
                    )}
                  </motion.div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                  <motion.div variants={cardVariants} initial="hidden" animate="visible">
                    <h2 className="text-xl font-bold text-green-600 mb-4">الإعدادات</h2>
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
                      <p className="text-gray-600 mb-4">قم بتحديث معلومات حسابك وتفضيلاتك الاستثمارية.</p>
                      <Button
                        asChild
                        className="bg-green-600 text-white rounded-full px-6 py-2 hover:bg-green-700"
                      >
                        <Link href="/settings/fournisseur">تعديل الإعدادات</Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
        </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
