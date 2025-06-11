"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, Search, FileText, Settings } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";

// Mock data for material-based dashboard
type MaterialCommitment = { id: string; project: string; equipmentType: string; quantity: string; condition: string; blockchainVerified: boolean };
type MaterialTransaction = { id: string; type: string; quantity: string; equipmentType: string; date: string };
type Contract = { id: string; title: string; status: string; blockchainVerified: boolean };

export default function SponsorDashboard() {
  const [commitments, setCommitments] = useState<MaterialCommitment[]>([]);
  const [transactions, setTransactions] = useState<MaterialTransaction[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    // Simulate API fetch
    setCommitments([
      { id: "1", project: "مشروع تطبيق توصيل", equipmentType: "خوادم وأجهزة حاسوب", quantity: "10 وحدات", condition: "جديد", blockchainVerified: true },
      { id: "2", project: "منصة تعليم إلكتروني", equipmentType: "أجهزة عرض وشاشات", quantity: "15 وحدة", condition: "جديد", blockchainVerified: false },
    ]);
    setTransactions([
      { id: "1", type: "تسليم معدات", quantity: "10 وحدات", equipmentType: "خوادم", date: "2023-06-15" },
      { id: "2", type: "صيانة معدات", quantity: "5 وحدات", equipmentType: "شاشات", date: "2023-07-01" },
    ]);
    setContracts([
      { id: "1", title: "عقد تأجير معدات - مشروع تطبيق توصيل", status: "موقع", blockchainVerified: true },
      { id: "2", title: "عقد تزويد مواد - منصة تعليمية", status: "قيد المراجعة", blockchainVerified: false },
    ]);
  }, []);

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
              لوحة تحكم راعي المواد
            </motion.h1>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                  <Package className="mr-2" /> التزامات المواد
                </h2>
                <ul className="space-y-2">
                  {commitments.map((commitment) => (
                    <li key={commitment.id} className="flex justify-between items-center">
                      <span>{commitment.project}</span>
                      <span className="text-sm text-gray-500">
                        {commitment.quantity} {commitment.equipmentType} - {commitment.condition}
                        {commitment.blockchainVerified ? " (موثق)" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-4 w-full">
                  <Link href="/projects">استكشاف المشاريع</Link>
                </Button>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                  <Search className="mr-2" /> المعاملات
                </h2>
                <ul className="space-y-2">
                  {transactions.map((transaction) => (
                    <li key={transaction.id} className="flex justify-between items-center">
                      <span>{transaction.type}</span>
                      <span className="text-sm text-gray-500">
                        {transaction.quantity} {transaction.equipmentType} - {transaction.date}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-4 w-full">عرض جميع المعاملات</Button>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                  <FileText className="mr-2" /> العقود
                </h2>
                <ul className="space-y-2">
                  {contracts.map((contract) => (
                    <li key={contract.id} className="flex justify-between items-center">
                      <span>{contract.title}</span>
                      <span className="text-sm text-gray-500">
                        {contract.status}{contract.blockchainVerified ? " (موثق)" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-4 w-full">
                  <Link href="/contracts">إدارة العقود</Link>
                </Button>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h2 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                  <Settings className="mr-2" /> الإعدادات
                </h2>
                <p className="text-gray-600 mb-4">قم بتحديث معلومات حسابك وتفضيلاتك</p>
                <Button asChild className="w-full">
                  <Link href="/settings/sponsor">تعديل الإعدادات</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}