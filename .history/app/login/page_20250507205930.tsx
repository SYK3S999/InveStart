"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import { TrendingUp, DollarSign, Percent, ArrowUpRight, ArrowDownRight, Eye, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProtectedRoute from "@/components/ProtectedRoute"

// Mock investments data
const mockInvestments = [
  {
    id: 1,
    projectId: 1,
    projectName: "تطبيق توصيل الطعام",
    projectImage: "/placeholder.svg?height=400&width=600&text=تطبيق_توصيل",
    amount: 500000,
    date: "2023-06-15",
    equity: 10,
    status: "نشط",
    returns: 25000,
    returnsPercentage: 5,
    documents: ["عقد استثمار.pdf", "اتفاقية المساهمين.pdf"],
    category: "تكنولوجيا",
  },
  {
    id: 2,
    projectId: 2,
    projectName: "منصة تعليم إلكتروني",
    projectImage: "/placeholder.svg?height=400&width=600&text=منصة_تعليمية",
    amount: 750000,
    date: "2023-07-20",
    equity: 15,
    status: "نشط",
    returns: 37500,
    returnsPercentage: 5,
    documents: ["عقد استثمار.pdf"],
    category: "تكنولوجيا",
  },
  {
    id: 3,
    projectId: 3,
    projectName: "مشروع زراعي مستدام",
    projectImage: "/placeholder.svg?height=400&width=600&text=مشروع_زراعي",
    amount: 1200000,
    date: "2023-05-10",
    equity: 20,
    status: "مكتمل",
    returns: 240000,
    returnsPercentage: 20,
    documents: ["عقد استثمار.pdf", "اتفاقية التخارج.pdf"],
    category: "زراعة",
  },
  {
    id: 4,
    projectId: 4,
    projectName: "مصنع ملابس محلية",
    projectImage: "/placeholder.svg?height=400&width=600&text=مصنع_ملابس",
    amount: 900000,
    date: "2023-08-05",
    equity: 25,
    status: "نشط",
    returns: -45000,
    returnsPercentage: -5,
    documents: ["عقد استثمار.pdf"],
    category: "صناعة",
  },
]

export default function InvestmentsPage() {
  const { user } = useAuth()
  const [investments, setInvestments] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // In a real app, you would fetch investments from an API
    // For now, we'll use the mock data
    setInvestments(mockInvestments)
  }, [])

  const filteredInvestments = investments.filter(
    (investment) =>
      investment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all" || investment.category === categoryFilter) &&
      (statusFilter === "all" || investment.status === statusFilter),
  )

  const totalInvested = filteredInvestments.reduce((sum, investment) => sum + investment.amount, 0)
  const totalReturns = filteredInvestments.reduce((sum, investment) => sum + investment.returns, 0)
  const averageReturn = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0

  const formatCurrency = (amount) => {
    return amount.toLocaleString("ar-DZ") + " دج"
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-800 border-green-200"
      case "مكتمل":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "متعثر":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

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
              استثماراتي
            </motion.h1>

            {/* Investment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-600">إجمالي الاستثمارات</h3>
                  <DollarSign className="h-5 w-5 text-primary-500" />
                </div>
                <p className="text-2xl font-bold text-primary-500">{formatCurrency(totalInvested)}</p>
                <p className="text-sm text-gray-500 mt-1">{filteredInvestments.length} مشاريع</p>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-600">إجمالي العوائد</h3>
                  <TrendingUp className="h-5 w-5 text-primary-500" />
                </div>
                <p className="text-2xl font-bold text-primary-500">{formatCurrency(totalReturns)}</p>
                <div className="flex items-center text-sm mt-1">
                  {totalReturns >= 0 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
                      <span className="text-green-500">إيجابي</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 text-red-500 ml-1" />
                      <span className="text-red-500">سلبي</span>
                    </>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-primary-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-600">متوسط العائد</h3>
                  <Percent className="h-5 w-5 text-primary-500" />
                </div>
                <p className="text-2xl font-bold text-primary-500">{averageReturn.toFixed(2)}%</p>
                <div className="flex items-center text-sm mt-1">
                  {averageReturn >= 0 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
                      <span className="text-green-500">أعلى من المتوسط</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 text-red-500 ml-1" />
                      <span className="text-red-500">أقل من المتوسط</span>
                    </>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="البحث عن استثمار..."
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
                <option value="خدمات">خدمات</option>
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
              <Button asChild className="md:mr-auto">
                <Link href="/projects">استكشاف المشاريع</Link>
              </Button>
            </div>

            {/* Investments List */}
            {filteredInvestments.length > 0 ? (
              <div className="space-y-6">
                {filteredInvestments.map((investment) => (
                  <motion.div
                    key={investment.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 relative h-auto md:h-full">
                        <Image
                          src={investment.projectImage || "/placeholder.svg?height=400&width=600"}
                          alt={investment.projectName}
                          width={300}
                          height={200}
                          className="object-cover w-full h-48 md:h-full"
                        />
                      </div>
                      <div className="p-6 md:w-3/4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div className="flex items-center gap-2 mb-2 md:mb-0">
                            <h2 className="text-xl font-bold text-primary-500">{investment.projectName}</h2>
                            <span
                              className={`px-3 py-1 rounded-full text-sm border ${getStatusClass(investment.status)}`}
                            >
                              {investment.status}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                              <Link href={`/projects/${investment.projectId}`}>
                                <Eye className="h-4 w-4" />
                                عرض المشروع
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                              <Link href={`/contracts?project=${investment.projectId}`}>
                                <FileText className="h-4 w-4" />
                                العقود
                              </Link>
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">مبلغ الاستثمار</p>
                            <p className="font-bold text-primary-500">{formatCurrency(investment.amount)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">نسبة الملكية</p>
                            <p className="font-medium">{investment.equity}%</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">تاريخ الاستثمار</p>
                            <p>{new Date(investment.date).toLocaleDateString("ar-DZ")}</p>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex items-center gap-4 mb-2 md:mb-0">
                            <div>
                              <p className="text-sm font-medium text-gray-500">العائد</p>
                              <p
                                className={
                                  investment.returns >= 0 ? "font-bold text-green-600" : "font-bold text-red-600"
                                }
                              >
                                {formatCurrency(investment.returns)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">نسبة العائد</p>
                              <div className="flex items-center">
                                {investment.returnsPercentage >= 0 ? (
                                  <>
                                    <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
                                    <span className="font-bold text-green-600">{investment.returnsPercentage}%</span>
                                  </>
                                ) : (
                                  <>
                                    <ArrowDownRight className="h-4 w-4 text-red-500 ml-1" />
                                    <span className="font-bold text-red-600">
                                      {Math.abs(investment.returnsPercentage)}%
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {investment.documents.map((doc, index) => (
                              <div
                                key={index}
                                className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center gap-1"
                              >
                                <FileText className="h-3 w-3" />
                                {doc}
                              </div>
                            ))}
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
                  <TrendingUp className="h-10 w-10 text-primary-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">لا توجد استثمارات</h3>
                <p className="text-gray-500 mb-6">لم يتم العثور على أي استثمارات تطابق معايير البحث</p>
                <Button asChild>
                  <Link href="/projects">استكشاف المشاريع</Link>
                </Button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
