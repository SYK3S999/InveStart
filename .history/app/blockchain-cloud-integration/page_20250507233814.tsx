"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BlockchainInfoPanel from "@/components/blockchain/blockchain-info-panel"
import SmartContractViewer from "@/components/blockchain/smart-contract-viewer"
import CloudStoragePanel from "@/components/cloud/cloud-storage-panel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Cloud, Shield, Lock, Server, Layers, RefreshCw } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function BlockchainCloudIntegrationPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock cloud storage files
  const mockFiles = [
    {
      id: "file1",
      name: "contract-investment-01.pdf",
      type: "document",
      size: 2.4,
      lastModified: new Date().toISOString(),
      syncStatus: "synced",
    },
    {
      id: "file2",
      name: "project-proposal.docx",
      type: "document",
      size: 1.8,
      lastModified: new Date(Date.now() - 86400000).toISOString(),
      syncStatus: "synced",
    },
    {
      id: "file3",
      name: "financial-report-q2.xlsx",
      type: "document",
      size: 3.2,
      lastModified: new Date(Date.now() - 172800000).toISOString(),
      syncStatus: "synced",
    },
    {
      id: "file4",
      name: "project-logo.png",
      type: "image",
      size: 0.8,
      lastModified: new Date(Date.now() - 259200000).toISOString(),
      syncStatus: "synced",
    },
    {
      id: "file5",
      name: "smart-contract-funding.sol",
      type: "contract",
      size: 0.3,
      lastModified: new Date(Date.now() - 345600000).toISOString(),
      syncStatus: "syncing",
    },
  ]

  return (
    <ProtectedRoute allowedRoles={["startup", "sponsor", "admin"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Navbar />
        <main className="flex-1 py-12 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-500 mb-4">
                تكامل البلوكتشين والسحابة
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                استكشف كيفية تكامل تقنيات البلوكتشين والسحابة في منصة INEVESTART لتوفير أمان وشفافية وكفاءة عالية
              </p>
            </motion.div>

            {/* Technology Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card className="h-full border-primary-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-primary-600 flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      تقنية البلوكتشين
                    </CardTitle>
                    <CardDescription>سلسلة كتل لا مركزية لتخزين المعاملات والعقود بشكل آمن</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary-100 p-2 rounded-full mt-1">
                          <Shield className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary-500">أمان وشفافية</h3>
                          <p className="text-gray-600 text-sm">
                            تخزين المعاملات والعقود بشكل آمن ولا يمكن تغييره، مما يضمن الشفافية والثقة بين جميع الأطراف
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-primary-100 p-2 rounded-full mt-1">
                          <Layers className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary-500">العقود الذكية</h3>
                          <p className="text-gray-600 text-sm">
                            تنفيذ تلقائي للعقود والاتفاقيات بين المستثمرين وأصحاب المشاريع دون الحاجة لوسطاء
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-primary-100 p-2 rounded-full mt-1">
                          <Lock className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary-500">لا مركزية</h3>
                          <p className="text-gray-600 text-sm">
                            نظام لا مركزي يضمن استمرارية العمل وعدم وجود نقطة فشل واحدة
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card className="h-full border-primary-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-primary-600 flex items-center gap-2">
                      <Cloud className="h-5 w-5" />
                      البنية السحابية
                    </CardTitle>
                    <CardDescription>بنية تحتية سحابية مرنة وقابلة للتوسع لتخزين ومعالجة البيانات</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary-100 p-2 rounded-full mt-1">
                          <Server className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary-500">قابلية التوسع</h3>
                          <p className="text-gray-600 text-sm">
                            بنية تحتية مرنة تتكيف مع احتياجات المنصة المتزايدة وتضمن أداء عالي حتى في أوقات الذروة
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-primary-100 p-2 rounded-full mt-1">
                          <Cloud className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary-500">تخزين آمن</h3>
                          <p className="text-gray-600 text-sm">
                            تخزين الملفات والبيانات بشكل آمن مع تشفير من طرف إلى طرف ونسخ احتياطية تلقائية
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-primary-100 p-2 rounded-full mt-1">
                          <RefreshCw className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary-500">مزامنة مستمرة</h3>
                          <p className="text-gray-600 text-sm">
                            مزامنة مستمرة بين البلوكتشين والسحابة لضمان اتساق البيانات وتوفرها
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-10">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="blockchain">البلوكتشين</TabsTrigger>
                <TabsTrigger value="cloud">السحابة</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <BlockchainInfoPanel
                        status="verified"
                        networkType="ethereum"
                        blockNumber={12345678}
                        projectId={1}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <Card className="border-primary-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-primary-600">تكامل البلوكتشين والسحابة</CardTitle>
                          <CardDescription>كيف تعمل تقنيات البلوكتشين والسحابة معاً في منصة INEVESTART</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-bold text-primary-500 mb-1">مزامنة البيانات</h3>
                              <p className="text-gray-600 text-sm">
                                تُخزن المعاملات والعقود على البلوكتشين، بينما تُخزن الملفات والبيانات الكبيرة على السحابة
                                مع إشارات مرجعية على البلوكتشين
                              </p>
                            </div>

                            <div>
                              <h3 className="font-bold text-primary-500 mb-1">الأمان والخصوصية</h3>
                              <p className="text-gray-600 text-sm">
                                تشفير البيانات قبل تخزينها على السحابة، مع استخدام تقنيات التحقق من الهوية والتحكم في
                                الوصول
                              </p>
                            </div>

                            <div>
                              <h3 className="font-bold text-primary-500 mb-1">تحسين الأداء</h3>
                              <p className="text-gray-600 text-sm">
                                استخدام السحابة للع��ليات التي تتطلب معالجة سريعة، والبلوكتشين للعمليات التي تتطلب أمان
                                وشفافية
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <CloudStoragePanel files={mockFiles} />
                    </motion.div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="blockchain" className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-primary-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-primary-600">منصات البلوكتشين المستخدمة</CardTitle>
                        <CardDescription>
                          تستخدم منصة INEVESTART عدة منصات بلوكتشين حسب نوع المعاملة والاحتياجات
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-full mt-1">
                              <span className="text-blue-600 font-bold">🔷</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-blue-600 mb-1">Ethereum</h3>
                              <p className="text-gray-600 text-sm">
                                يستخدم لتسجيل العقود الذكية والمعاملات المالية الرئيسية، مما يوفر أمان وشفافية عالية
                              </p>
                              <div className="mt-2">
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-200">
                                  العقود الذكية
                                </span>
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-200 mr-1">
                                  المعاملات المالية
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="bg-amber-100 p-2 rounded-full mt-1">
                              <span className="text-amber-600 font-bold">🔶</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-amber-600 mb-1">Hyperledger Fabric</h3>
                              <p className="text-gray-600 text-sm">
                                يستخدم للشبكات الخاصة والتطبيقات المؤسسية، مما يوفر تحكم أفضل في الوصول وخصوصية أعلى
                                للبيانات
                              </p>
                              <div className="mt-2">
                                <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full border border-amber-200">
                                  شبكات خاصة
                                </span>
                                <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full border border-amber-200 mr-1">
                                  تطبيقات مؤسسية
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="bg-purple-100 p-2 rounded-full mt-1">
                              <span className="text-purple-600 font-bold">🟣</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-purple-600 mb-1">Polygon</h3>
                              <p className="text-gray-600 text-sm">
                                يستخدم للمعاملات عالية التردد والتي تتطلب رسوم منخفضة، مما يوفر قابلية للتوسع وكفاءة
                                أعلى
                              </p>
                              <div className="mt-2">
                                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full border border-purple-200">
                                  معاملات عالية التردد
                                </span>
                                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full border border-purple-200 mr-1">
                                  رسوم منخفضة
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <SmartContractViewer
                      contractName="عقد التمويل الجماعي"
                      contractAddress="0x7f9e4c5d3b2a1f8e7d6c5b4a3f2e1d0c9b8a7f6e"
                      contractType="funding"
                      deploymentDate={new Date().toISOString()}
                      network="ethereum"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Card className="border-primary-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-primary-600">الخصوصية والامتثال للوائح</CardTitle>
                        <CardDescription>
                          كيف تتعامل منصة INEVESTART مع خصوصية البيانات والامتثال للوائح
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold text-primary-500 mb-1">التحكم في الوصول</h3>
                            <p className="text-gray-600 text-sm">
                              نظام متطور للتحكم في الوصول يعتمد على الأدوار (RBAC) يضمن أن المستخدمين يمكنهم الوصول فقط
                              إلى البيانات التي يحتاجونها
                            </p>
                          </div>

                          <div>
                            <h3 className="font-bold text-primary-500 mb-1">تشفير البيانات</h3>
                            <p className="text-gray-600 text-sm">
                              تشفير البيانات الحساسة باستخدام خوارزميات تشفير متقدمة مثل AES-256 وRSA
                            </p>
                          </div>

                          <div>
                            <h3 className="font-bold text-primary-500 mb-1">الامتثال للوائح</h3>
                            <p className="text-gray-600 text-sm">
                              تصميم النظام ليتوافق مع لوائح حماية البيانات المختلفة مثل GDPR وCCPA
                            </p>
                          </div>

                          <div>
                            <h3 className="font-bold text-primary-500 mb-1">البيانات الخاصة على البلوكتشين</h3>
                            <p className="text-gray-600 text-sm">
                              استخدام تقنيات مثل Zero-Knowledge Proofs للتحقق من صحة المعاملات دون الكشف عن البيانات
                              الحساسة
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="cloud" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="border-primary-200 h-full">
                        <CardHeader>
                          <CardTitle className="text-lg text-primary-600">مزودي الخدمات السحابية</CardTitle>
                          <CardDescription>
                            تستخدم منصة INEVESTART عدة مزودي خدمات سحابية لضمان أفضل أداء وموثوقية
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="flex items-start gap-3">
                              <div className="bg-amber-100 p-2 rounded-full mt-1">
                                <span className="text-amber-600 font-bold">☁️</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-amber-600 mb-1">Amazon Web Services (AWS)</h3>
                                <p className="text-gray-600 text-sm">
                                  يستخدم للتخزين السحابي (S3) وقواعد البيانات (RDS) والحوسبة (EC2)
                                </p>
                                <div className="mt-2">
                                  <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full border border-amber-200">
                                    S3
                                  </span>
                                  <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full border border-amber-200 mr-1">
                                    RDS
                                  </span>
                                  <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full border border-amber-200 mr-1">
                                    EC2
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="bg-blue-100 p-2 rounded-full mt-1">
                                <span className="text-blue-600 font-bold">☁️</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-blue-600 mb-1">Microsoft Azure</h3>
                                <p className="text-gray-600 text-sm">
                                  يستخدم للتكامل مع خدمات مايكروسوفت وتطبيقات الذكاء الاصطناعي
                                </p>
                                <div className="mt-2">
                                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-200">
                                    Blob Storage
                                  </span>
                                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-200 mr-1">
                                    Cognitive Services
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="bg-green-100 p-2 rounded-full mt-1">
                                <span className="text-green-600 font-bold">☁️</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-green-600 mb-1">Google Cloud Platform</h3>
                                <p className="text-gray-600 text-sm">
                                  يستخدم لتحليلات البيانات وخدمات الذكاء الاصطناعي المتقدمة
                                </p>
                                <div className="mt-2">
                                  <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-200">
                                    BigQuery
                                  </span>
                                  <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-200 mr-1">
                                    AI Platform
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <CloudStoragePanel files={mockFiles} />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <Card className="border-primary-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-primary-600">قابلية التوسع والأداء</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-bold text-primary-500 mb-1">التوزيع الجغرافي</h3>
                              <p className="text-gray-600 text-sm">
                                توزيع الخدمات على مناطق جغرافية متعددة لتقليل زمن الاستجابة و��حسين تجربة المستخدم
                              </p>
                            </div>

                            <div>
                              <h3 className="font-bold text-primary-500 mb-1">التوسع التلقائي</h3>
                              <p className="text-gray-600 text-sm">
                                نظام توسع تلقائي يزيد الموارد عند الحاجة ويقللها عند انخفاض الطلب لتحسين الكفاءة وتقليل
                                التكاليف
                              </p>
                            </div>

                            <div>
                              <h3 className="font-bold text-primary-500 mb-1">تخزين مؤقت وتحسين الأداء</h3>
                              <p className="text-gray-600 text-sm">
                                استخدام خدمات التخزين المؤقت مثل Redis وCDN لتسريع الوصول إلى البيانات والملفات المتكررة
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
