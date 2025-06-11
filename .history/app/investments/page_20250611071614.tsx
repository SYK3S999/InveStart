"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/authContext";
import { Package, BarChart, Percent, Eye, FileText, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/protected-route";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Mock material commitments data
const mockMaterialCommitments = [
  {
    id: "1",
    projectId: "1",
    projectName: "تطبيق توصيل الطعام",
    projectImage: "/placeholder.svg?height=400&width=600&text=تطبيق_توصيل",
    equipmentType: "خوادم وأجهزة حاسوب",
    quantity: 10,
    date: "2023-06-15",
    usageShare: 20,
    status: "نشط",
    utilizationRate: 85,
    condition: "جديد",
    documents: ["عقد تأجير المعدات.pdf", "اتفاقية الصيانة.pdf"],
    category: "تكنولوجيا",
    wilaya: "الجزائر",
  },
  {
    id: "2",
    projectId: "2",
    projectName: "منصة تعليم إلكتروني",
    projectImage: "/placeholder.svg?height=400&width=600&text=منصة_تعليمية",
    equipmentType: "أجهزة عرض وشاشات تفاعلية",
    quantity: 15,
    date: "2023-07-20",
    usageShare: 25,
    status: "نشط",
    utilizationRate: 90,
    condition: "جديد",
    documents: ["عقد تأجير المعدات.pdf"],
    category: "تكنولوجيا",
    wilaya: "وهران",
  },
  {
    id: "3",
    projectId: "3",
    projectName: "مشروع زراعي مستدام",
    projectImage: "/placeholder.svg?height=400&width=600&text=مشروع_زراعي",
    equipmentType: "جرارات وآلات زراعية",
    quantity: 5,
    date: "2023-05-10",
    usageShare: 30,
    status: "مكتمل",
    utilizationRate: 95,
    condition: "مستعمل",
    documents: ["عقد تأجير المعدات.pdf", "اتفاقية إعادة التسليم.pdf"],
    category: "زراعة",
    wilaya: "قسنطينة",
  },
  {
    id: "4",
    projectId: "4",
    projectName: "مصنع ملابس محلية",
    projectImage: "/placeholder.svg?height=400&width=600&text=مصنع_ملابس",
    equipmentType: "آلات خياطة ومعدات تصنيع",
    quantity: 20,
    date: "2023-08-05",
    usageShare: 15,
    status: "نشط",
    utilizationRate: 70,
    condition: "جديد",
    documents: ["عقد تأجير المعدات.pdf"],
    category: "صناعة",
    wilaya: "باتنة",
  },
];

type MaterialCommitment = {
  id: string;
  projectId: string;
  projectName: string;
  projectImage: string;
  equipmentType: string;
  quantity: number;
  date: string;
  usageShare: number;
  status: string;
  utilizationRate: number;
  condition: string;
  documents: string[];
  category: string;
  wilaya: string;
};

export default function MaterialCommitmentsPage() {
  const { user } = useAuth();
  const [commitments, setCommitments] = useState<MaterialCommitment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [equipmentFilter, setEquipmentFilter] = useState("all");

  useEffect(() => {
    // Simulate fetching from API
    setCommitments(mockMaterialCommitments);
  }, []);

  const filteredCommitments = commitments.filter(
    (commitment) =>
      commitment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all" || commitment.category === categoryFilter) &&
      (statusFilter === "all" || commitment.status === statusFilter) &&
      (equipmentFilter === "all" || commitment.equipmentType.includes(equipmentFilter)),
  );

  const totalEquipment = filteredCommitments.reduce((sum, commitment) => sum + commitment.quantity, 0);
  const activeProjects = filteredCommitments.filter((c) => c.status === "نشط").length;
  const averageUtilization = filteredCommitments.length > 0
    ? filteredCommitments.reduce((sum, c) => sum + c.utilizationRate, 0) / filteredCommitments.length
    : 0;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-800 border-green-200";
      case "مكتمل":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "متعثر":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <ProtectedRoute allowedRoles={["sponsor"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Navbar />
        <main className="flex-1 py-12 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary-500 mb-10 md:mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              التزامات المواد
            </motion.h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-600">إجمالي المعدات</h3>
                  <Package className="h-5 w-5 text-primary-500" />
                </div>
                <p className="text-2xl font-bold text-primary-500">{totalEquipment} وحدة</p>
                <p className="text-sm text-gray-500 mt-1">{filteredCommitments.length} مشاريع</p>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-600">المشاريع النشطة</h3>
                  <BarChart className="h-5 w-5 text-primary-500" />
                </div>
                <p className="text-2xl font-bold text-primary-500">{activeProjects} مشروع</p>
                <p className="text-sm text-gray-500 mt-1">تتم متابعة المواد</p>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-600">متوسط الاستخدام</h3>
                  <Percent className="h-5 w-5 text-primary-500" />
                </div>
                <p className="text-2xl font-bold text-primary-500">{averageUtilization.toFixed(1)}%</p>
                <p className="text-sm text-gray-500 mt-1">كفاءة استخدام المواد</p>
              </motion.div>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="البحث عن التزام..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-1/2"
              />
              <select
                className="border border-primary-200 rounded-lg px-3 py-2 text-primary-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">جميع الفئات</option>
                <option value="تكنولوجيا">تكنولوجيا</option>
                <option value="زراعة">زراعة</option>
                <option value="صناعة">صناعة</option>
              </select>
              <select
                className="border border-primary-200 rounded-lg px-3 py-2 text-primary-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">جميع الحالات</option>
                <option value="نشط">نشط</option>
                <option value="مكتمل">مكتمل</option>
                <option value="متعثر">متعثر</option>
              </select>
              <select
                className="border border-primary-200 rounded-lg px-3 py-2 text-primary-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
              >
                <option value="all">جميع أنواع المعدات</option>
                <option value="خوادم وأجهزة حاسوب">خوادم وأجهزة حاسوب</option>
                <option value="أجهزة عرض وشاشات تفاعلية">أجهزة عرض وشاشات</option>
                <option value="جرارات وآلات زراعية">جرارات وآلات زراعية</option>
                <option value="آلات خياطة ومعدات تصنيع">آلات خياطة وتصنيع</option>
              </select>
              <Button asChild className="md:mr-auto bg-primary-500 text-white hover:bg-primary-600">
                <Link href="/projects">استكشاف المشاريع</Link>
              </Button>
            </div>

            {/* Commitments List */}
            {filteredCommitments.length > 0 ? (
              <div className="space-y-6">
                {filteredCommitments.map((commitment) => (
                  <motion.div
                    key={commitment.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 relative h-auto md:h-full">
                        <Image
                          src={commitment.projectImage || "/placeholder.svg?height=400&width=600"}
                          alt={commitment.projectName}
                          width={300}
                          height={200}
                          className="object-cover w-full h-48 md:h-full"
                        />
                      </div>
                      <div className="p-6 md:w-3/4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div className="flex items-center gap-2 mb-2 md:mb-0">
                            <h2 className="text-xl font-bold text-primary-500">{commitment.projectName}</h2>
                            <span
                              className={`px-3 py-1 rounded-full text-sm border ${getStatusClass(commitment.status)}`}
                            >
                              {commitment.status}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                              <Link href={`/projects/${commitment.projectId}`}>
                                <Eye className="h-4 w-4" />
                                عرض المشروع
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                              <Link href={`/contracts?project=${commitment.projectId}`}>
                                <FileText className="h-4 w-4" />
                                العقود
                              </Link>
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">نوع المعدات</p>
                            <p className="font-bold text-primary-500">{commitment.equipmentType}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">الكمية</p>
                            <p className="font-medium">{commitment.quantity} وحدة</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">تاريخ التسليم</p>
                            <p>{new Date(commitment.date).toLocaleDateString("ar-DZ")}</p>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex items-center gap-4 mb-2 md:mb-0">
                            <div>
                              <p className="text-sm font-medium text-gray-500">نسبة الاستخدام</p>
                              <p className="font-bold text-primary-500">{commitment.usageShare}%</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">معدل الاستخدام</p>
                              <p className="font-bold text-primary-500">{commitment.utilizationRate}%</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">حالة المعدات</p>
                              <p className="font-medium">{commitment.condition}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 items-center">
                            {commitment.documents.map((doc, index) => (
                              <div
                                key={index}
                                className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center gap-1"
                              >
                                <FileText className="h-3 w-3" />
                                {doc}
                              </div>
                            ))}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Lock className="h-4 w-4 text-primary-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>تتبع عبر البلوكشين</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-10 w-10 text-primary-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">ماكاش التزامات</h3>
                <p className="text-gray-500 mb-6">ما لقيناش التزامات تطابق معايير البحث</p>
                <Button asChild className="bg-primary-500 text-white hover:bg-primary-600">
                  <Link href="/projects">استكشاف المشاريع</Link>
                </Button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}