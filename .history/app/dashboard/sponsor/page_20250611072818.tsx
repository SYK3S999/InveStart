"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Package, Search, FileText, Settings, Lock, Filter } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Mock data for material-based dashboard
type MaterialCommitment = {
  id: string;
  project: string;
  equipmentType: string;
  quantity: number;
  condition: string;
  blockchainVerified: boolean;
  wilaya: string;
};
type MaterialTransaction = { id: string; action: string; quantity: number; equipmentType: string; date: string };
type Contract = { id: string; title: string; status: string; blockchainVerified: boolean; wilaya: string };

export default function SponsorDashboard() {
  const [commitments, setCommitments] = useState<MaterialCommitment[]>([]);
  const [transactions, setTransactions] = useState<MaterialTransaction[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Simulate API fetch
    setCommitments([
      {
        id: "1",
        project: "تطبيق توصيل الطعام",
        equipmentType: "خوادم وأجهزة حاسوب",
        quantity: 10,
        condition: "جديد",
        blockchainVerified: true,
        wilaya: "الجزائر",
      },
      {
        id: "2",
        project: "منصة تعليم إلكتروني",
        equipmentType: "أجهزة عرض وشاشات",
        quantity: 15,
        condition: "جديد",
        blockchainVerified: false,
        wilaya: "وهران",
      },
    ]);
    setTransactions([
      { id: "1", action: "تسليم معدات", quantity: 10, equipmentType: "خوادم", date: "2023-06-15" },
      { id: "2", action: "صيانة معدات", quantity: 5, equipmentType: "شاشات", date: "2023-07-01" },
    ]);
    setContracts([
      { id: "1", title: "عقد تأجير معدات - تطبيق توصيل", status: "موقع", blockchainVerified: true, wilaya: "الجزائر" },
      { id: "2", title: "عقد تزويد مواد - منصة تعليمية", status: "قيد المراجعة", blockchainVerified: false, wilaya: "وهران" },
    ]);
  }, []);

  const filteredCommitments = commitments.filter(
    (c) =>
      c.project.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || (statusFilter === "verified" && c.blockchainVerified)),
  );
  const filteredTransactions = transactions.filter((t) =>
    t.action.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const filteredContracts = contracts.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || c.status === statusFilter || (statusFilter === "verified" && c.blockchainVerified)),
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "موقع":
        return "bg-green-100 text-green-800";
      case "قيد المراجعة":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ProtectedRoute allowedRoles={["sponsor"]}>
      <div className="flex min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        {/* Sidebar */}
        <motion.aside
          className="hidden md:block w-64 bg-white shadow-lg fixed h-screen p-4 border-l border-primary-100"
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-primary-600">التنقل</h2>
            <Link href="/sponsor-dashboard" className="flex items-center gap-2 p-2 rounded-lg bg-primary-50 text-primary-600">
              <Package className="h-5 w-5" /> لوحة التحكم
            </Link>
            <Link href="/projects" className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-50">
              <Search className="h-5 w-5" /> المشاريع
            </Link>
            <Link href="/contracts" className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-50">
              <FileText className="h-5 w-5" /> العقود
            </Link>
            <Link href="/settings/sponsor" className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-50">
              <Settings className="h-5 w-5" /> الإعدادات
            </Link>
          </div>
        </motion.aside>

        <div className="flex-1 md:mr-64">
          <Navbar />
          <main className="flex-1 py-12 md:py-16 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary-500 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                لوحة تحكم راعي المواد
              </motion.h1>

              {/* Search and Filter */}
              <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="البحث في التزامات، معاملات، أو عقود..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="sm:w-1/2 rounded-full bg-white shadow-sm border-primary-200 focus:ring-accent-400 font-tajawal"
                />
                <select
                  className="border border-primary-200 rounded-full px-4 py-2 bg-white text-primary-500 font-tajawal focus:ring-accent-400"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">جميع الحالات</option>
                  <option value="موقع">موقع</option>
                  <option value="قيد المراجعة">قيد المراجعة</option>
                  <option value="verified">موثق بالبلوكشين</option>
                </select>
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Material Commitments */}
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-primary-100 hover:shadow-2xl hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                    <Package className="mr-2 h-6 w-6" /> التزامات المواد
                  </h2>
                  {filteredCommitments.length > 0 ? (
                    <ul className="space-y-3 font-tajawal">
                      {filteredCommitments.map((commitment) => (
                        <li
                          key={commitment.id}
                          className="flex justify-between items-center p-2 rounded-lg hover:bg-primary-50"
                        >
                          <div>
                            <span className="font-medium">{commitment.project} ({commitment.wilaya})</span>
                            <p className="text-sm text-gray-500">
                              {commitment.quantity} {commitment.equipmentType} - {commitment.condition}
                            </p>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge
                                  className={commitment.blockchainVerified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                                >
                                  {commitment.blockchainVerified ? <Lock className="h-3 w-3 ml-1" /> : null}
                                  {commitment.blockchainVerified ? "موثق" : "غير موثق"}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                {commitment.blockchainVerified ? "تتبع عبر البلوكشين" : "لم يتم التوثيق بعد"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 font-tajawal">ماكاش التزامات تطابق البحث</p>
                    </div>
                  )}
                  <Button
                    asChild
                    className="mt-4 w-full bg-accent-400 text-white hover:bg-accent-500 rounded-full font-tajawal"
                  >
                    <Link href="/projects">استكشاف المشاريع</Link>
                  </Button>
                </motion.div>

                {/* Material Transactions */}
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-primary-100 hover:shadow-2xl hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                    <Search className="mr-2 h-6 w-6" /> المعاملات
                  </h2>
                  {filteredTransactions.length > 0 ? (
                    <ul className="space-y-3 font-tajawal">
                      {filteredTransactions.map((transaction) => (
                        <li
                          key={transaction.id}
                          className="flex justify-between items-center p-2 rounded-lg hover:bg-primary-50"
                        >
                          <span className="font-medium">{transaction.action}</span>
                          <span className="text-sm text-gray-500">
                            {transaction.quantity} {transaction.equipmentType} -{" "}
                            {new Date(transaction.date).toLocaleDateString("ar-DZ")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 font-tajawal">ماكاش معاملات تطابق البحث</p>
                    </div>
                  )}
                  <Button
                    className="mt-4 w-full bg-accent-400 text-white hover:bg-accent-500 rounded-full font-tajawal"
                  >
                    عرض جميع المعاملات
                  </Button>
                </motion.div>

                {/* Contracts */}
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-primary-100 hover:shadow-2xl hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                    <FileText className="mr-2 h-6 w-6" /> العقود
                  </h2>
                  {filteredContracts.length > 0 ? (
                    <ul className="space-y-3 font-tajawal">
                      {filteredContracts.map((contract) => (
                        <li
                          key={contract.id}
                          className="flex justify-between items-center p-2 rounded-lg hover:bg-primary-50"
                        >
                          <div>
                            <span className="font-medium">{contract.title} ({contract.wilaya})</span>
                            <Badge className={`mr-2 ${getStatusClass(contract.status)}`}>{contract.status}</Badge>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge
                                  className={contract.blockchainVerified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                                >
                                  {contract.blockchainVerified ? <Lock className="h-3 w-3 ml-1" /> : null}
                                  {contract.blockchainVerified ? "موثق" : "غير موثق"}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                {contract.blockchainVerified ? "تتبع عبر البلوكشين" : "لم يتم التوثيق بعد"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 font-tajawal">ماكاش عقود تطابق البحث</p>
                    </div>
                  )}
                  <Button
                    asChild
                    className="mt-4 w-full bg-accent-400 text-white hover:bg-accent-500 rounded-full font-tajawal"
                  >
                    <Link href="/contracts">إدارة العقود</Link>
                  </Button>
                </motion.div>

                {/* Settings */}
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-primary-100 hover:shadow-2xl hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                    <Settings className="mr-2 h-6 w-6" /> الإعدادات
                  </h2>
                  <p className="text-gray-600 mb-4 font-tajawal">حدّث معلومات حسابك وتفضيلات راعي المواد</p>
                  <Button
                    asChild
                    className="w-full bg-accent-400 text-white hover:bg-accent-500 rounded-full font-tajawal"
                  >
                    <Link href="/settings/sponsor">تعديل الإعدادات</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}