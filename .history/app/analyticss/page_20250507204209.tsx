"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import { BarChart, LineChart, PieChart, Users, DollarSign, ArrowUp, ArrowDown, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProtectedRoute from "@/components/ProtectedRoute"

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalInvestments: 3250000,
    totalProjects: 15,
    activeInvestors: 42,
    conversionRate: 18,
    averageInvestment: 77380,
    projectSuccessRate: 73,
  },
  investmentTrends: [
    { month: "يناير", amount: 150000 },
    { month: "فبراير", amount: 220000 },
    { month: "مارس", amount: 180000 },
    { month: "أبريل", amount: 240000 },
    { month: "مايو", amount: 320000 },
    { month: "يونيو", amount: 280000 },
    { month: "يوليو", amount: 350000 },
    { month: "أغسطس", amount: 420000 },
    { month: "سبتمبر", amount: 380000 },
    { month: "أكتوبر", amount: 450000 },
    { month: "نوفمبر", amount: 520000 },
    { month: "ديسمبر", amount: 0 },
  ],
  projectCategories: [
    { category: "تكنولوجيا", count: 6 },
    { category: "زراعة", count: 3 },
    { category: "صناعة", count: 4 },
    { category: "خدمات", count: 2 },
  ],
  investorActivity: [
    { day: "الأحد", visits: 120, investments: 2 },
    { day: "الإثنين", visits: 150, investments: 3 },
    { day: "الثلاثاء", visits: 180, investments: 5 },
    { day: "الأربعاء", visits: 200, investments: 4 },
    { day: "الخميس", visits: 220, investments: 6 },
    { day: "الجمعة", visits: 160, investments: 3 },
    { day: "السبت", visits: 140, investments: 2 },
  ],
  topProjects: [
    { id: 1, name: "تطبيق توصيل الطعام", raised: 520000, goal: 700000, investors: 12 },
    { id: 2, name: "منصة تعليم إلكتروني", raised: 480000, goal: 500000, investors: 8 },
    { id: 3, name: "مشروع زراعي مستدام", raised: 350000, goal: 600000, investors: 6 },
    { id: 4, name: "مصنع ملابس محلية", raised: 320000, goal: 800000, investors: 5 },
    { id: 5, name: "تطبيق خدمات منزلية", raised: 280000, goal: 400000, investors: 7 },
  ],
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("year")

  useEffect(() => {
    // Simulate API call to fetch analytics data
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay
      setAnalyticsData(mockAnalyticsData)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const formatCurrency = (amount) => {
    return amount.toLocaleString("ar-DZ") + " دج"
  }

  const calculateGrowth = (current, previous) => {
    if (!previous) return 100
    return ((current - previous) / previous) * 100
  }

  // Calculate month-over-month growth
  const currentMonthInvestment = analyticsData?.investmentTrends[10]?.amount || 0
  const previousMonthInvestment = analyticsData?.investmentTrends[9]?.amount || 0
  const investmentGrowth = calculateGrowth(currentMonthInvestment, previousMonthInvestment)

  return (
    <ProtectedRoute allowedRoles={["startup", "sponsor", "admin"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Navbar />
        <main className="flex-1 py-12 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <motion.div
              className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-500">لوحة التحليلات</h1>

              <div className="flex items-center gap-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="اختر الفترة الزمنية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">آخر أسبوع</SelectItem>
                    <SelectItem value="month">آخر شهر</SelectItem>
                    <SelectItem value="quarter">آخر 3 أشهر</SelectItem>
                    <SelectItem value="year">آخر سنة</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  تصفية
                </Button>

                <Button className="flex items-center gap-2">تصدير التقرير</Button>
              </div>
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <>
                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium">إجمالي الاستثمارات</CardTitle>
                        <DollarSign className="h-5 w-5 text-primary-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatCurrency(analyticsData.overview.totalInvestments)}
                        </div>
                        <div className="flex items-center mt-1">
                          <span
                            className={`text-sm ${investmentGrowth >= 0 ? "text-green-500" : "text-red-500"} flex items-center`}
                          >
                            {investmentGrowth >= 0 ? (
                              <ArrowUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ArrowDown className="h-4 w-4 ml-1" />
                            )}
                            {Math.abs(investmentGrowth).toFixed(1)}% عن الشهر السابق
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium">المشاريع النشطة</CardTitle>
                        <BarChart className="h-5 w-5 text-primary-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.overview.totalProjects}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          معدل نجاح {analyticsData.overview.projectSuccessRate}%
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium">المستثمرون النشطون</CardTitle>
                        <Users className="h-5 w-5 text-primary-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.overview.activeInvestors}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          معدل التحويل {analyticsData.overview.conversionRate}%
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <Tabs defaultValue="investments" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="investments">الاستثمارات</TabsTrigger>
                    <TabsTrigger value="projects">المشاريع</TabsTrigger>
                    <TabsTrigger value="investors">المستثمرون</TabsTrigger>
                  </TabsList>

                  <TabsContent value="investments" className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle>اتجاهات الاستثمار</CardTitle>
                          <CardDescription>إجمالي الاستثمارات الشهرية</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            {/* Chart would go here - using a placeholder */}
                            <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <LineChart className="h-12 w-12 text-primary-300 mx-auto mb-2" />
                                <p className="text-gray-500">رسم بياني لاتجاهات الاستثمار</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>متوسط الاستثمار</CardTitle>
                          <CardDescription>حسب فئة المشروع</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            {/* Chart would go here - using a placeholder */}
                            <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <PieChart className="h-12 w-12 text-primary-300 mx-auto mb-2" />
                                <p className="text-gray-500">رسم بياني دائري للاستثمارات</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>أعلى المشاريع تمويلاً</CardTitle>
                        <CardDescription>المشاريع التي جمعت أكبر قدر من التمويل</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-right py-3 px-4 font-medium text-gray-500">المشروع</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-500">المبلغ المجمع</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-500">الهدف</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-500">نسبة الإنجاز</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-500">عدد المستثمرين</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analyticsData.topProjects.map((project) => (
                                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-3 px-4">
                                    <a href={`/projects/${project.id}`} className="text-primary-500 hover:underline">
                                      {project.name}
                                    </a>
                                  </td>
                                  <td className="py-3 px-4 font-medium">{formatCurrency(project.raised)}</td>
                                  <td className="py-3 px-4 text-gray-500">{formatCurrency(project.goal)}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                        <div
                                          className="bg-primary-500 h-2.5 rounded-full"
                                          style={{ width: `${Math.min(100, (project.raised / project.goal) * 100)}%` }}
                                        ></div>
                                      </div>
                                      <span>{Math.round((project.raised / project.goal) * 100)}%</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">{project.investors}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="projects" className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle>توزيع المشاريع</CardTitle>
                          <CardDescription>حسب الفئة</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            {/* Chart would go here - using a placeholder */}
                            <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <PieChart className="h-12 w-12 text-primary-300 mx-auto mb-2" />
                                <p className="text-gray-500">رسم بياني دائري لفئات المشاريع</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>توزيع المشاريع</CardTitle>
                          <CardDescription>حسب الفئة</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-4">
                            {analyticsData.projectCategories.map((category) => (
                              <li key={category.category} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-primary-500 ml-2"></div>
                                  <span>{category.category}</span>
                                </div>
                                <span className="font-medium">{category.count}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="investors" className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <Card>
                        <CardHeader>
                          <CardTitle>نشاط المستثمرين</CardTitle>
                          <CardDescription>الزيارات والاستثمارات اليومية</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            {/* Chart would go here - using a placeholder */}
                            <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <BarChart className="h-12 w-12 text-primary-300 mx-auto mb-2" />
                                <p className="text-gray-500">رسم بياني لنشاط المستثمرين</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>تحليل المستثمرين</CardTitle>
                          <CardDescription>معلومات عن المستثمرين النشطين</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2">متوسط الاستثمار</h3>
                              <p className="text-2xl font-bold">
                                {formatCurrency(analyticsData.overview.averageInvestment)}
                              </p>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2">معدل التحويل</h3>
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div
                                    className="bg-primary-500 h-2.5 rounded-full"
                                    style={{ width: `${analyticsData.overview.conversionRate}%` }}
                                  ></div>
                                </div>
                                <span>{analyticsData.overview.conversionRate}%</span>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2">توزيع المستثمرين حسب الفئة</h3>
                              <div className="h-40">
                                {/* Chart would go here - using a placeholder */}
                                <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                                  <div className="text-center">
                                    <PieChart className="h-8 w-8 text-primary-300 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500">رسم بياني دائري</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
