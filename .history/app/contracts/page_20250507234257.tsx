"use client"

import { useState, useEffect, SetStateAction } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Database,
  Shield,
  LinkIcon,
  Cloud,
  CloudOff,
  Lock,
} from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import { recordTransaction } from "@/lib/blockchain"
import { uploadDocument } from "@/lib/cloud"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock contract data with blockchain and cloud integration
const mockContracts = [
  {
    id: 1,
    title: "عقد استثمار - مشروع تطبيق توصيل",
    projectId: 1,
    projectName: "تطبيق توصيل الطعام",
    date: "2023-08-15",
    status: "موقع",
    parties: ["شركة التطوير", "المستثمر أ"],
    amount: "500,000 دج",
    type: "استثمار",
    blockchainVerified: true,
    blockchainTxId: "0x7f9e4c5d3b2a1f8e7d6c5b4a3f2e1d0c9b8a7f6e",
    cloudStorageId: "doc-7f9e4c5d3b2a",
    cloudSyncStatus: "synced",
    lastModified: "2023-08-15T14:30:00Z",
  },
  {
    id: 2,
    title: "عقد تمويل - منصة تعليم إلكتروني",
    projectId: 2,
    projectName: "منصة تعليم إلكتروني",
    date: "2023-09-20",
    status: "قيد المراجعة",
    parties: ["شركة التعليم", "المستثمر ب"],
    amount: "750,000 دج",
    type: "تمويل",
    blockchainVerified: false,
    blockchainTxId: null,
    cloudStorageId: "doc-8a7b6c5d4e3f",
    cloudSyncStatus: "syncing",
    lastModified: "2023-09-20T10:15:00Z",
  },
  {
    id: 3,
    title: "عقد شراكة - مشروع زراعي",
    projectId: 3,
    projectName: "مشروع زراعي مستدام",
    date: "2023-07-10",
    status: "مرفوض",
    parties: ["مزارع الأمل", "شركة الاستثمار الزراعي"],
    amount: "1,200,000 دج",
    type: "شراكة",
    blockchainVerified: false,
    blockchainTxId: null,
    cloudStorageId: "doc-9c8d7e6f5a4b",
    cloudSyncStatus: "failed",
    lastModified: "2023-07-10T09:45:00Z",
  },
  {
    id: 4,
    title: "عقد استثمار - تطبيق خدمات منزلية",
    projectId: 4,
    projectName: "تطبيق خدمات منزلية",
    date: "2023-10-05",
    status: "موقع",
    parties: ["شركة الخدمات المنزلية", "مجموعة المستثمرين"],
    amount: "350,000 دج",
    type: "استثمار",
    blockchainVerified: true,
    blockchainTxId: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    cloudStorageId: "doc-1a2b3c4d5e6f",
    cloudSyncStatus: "synced",
    lastModified: "2023-10-05T16:20:00Z",
  },
]

type Contract = {
  id: number
  title: string
  projectId: number
  projectName: string
  date: string
  status: string
  parties: string[]
  amount: string
  type: string
  blockchainVerified: boolean
  blockchainTxId: string | null
  cloudStorageId: string
  cloudSyncStatus: string
  lastModified: string
}

export default function ContractsPage() {
  const { user } = useAuth()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showBlockchainModal, setShowBlockchainModal] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch contracts from an API
    // For now, we'll use the mock data
    setContracts(mockContracts)
  }, [])

  const filteredContracts = contracts.filter(
    (contract) =>
      (contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.projectName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || contract.status === statusFilter),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "موقع":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "قيد المراجعة":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "مرفوض":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "موقع":
        return "bg-green-100 text-green-800 border-green-200"
      case "قيد المراجعة":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "مرفوض":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCloudStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
        return <Cloud className="h-5 w-5 text-green-500" />
      case "syncing":
        return <Cloud className="h-5 w-5 text-amber-500" />
      case "failed":
        return <CloudOff className="h-5 w-5 text-red-500" />
      default:
        return <Cloud className="h-5 w-5 text-gray-400" />
    }
  }

  const getCloudStatusText = (status: string) => {
    switch (status) {
      case "synced":
        return "متزامن مع السحابة"
      case "syncing":
        return "جاري المزامنة"
      case "failed":
        return "فشل المزامنة"
      default:
        return "غير متزامن"
    }
  }

  const handleVerifyOnBlockchain = (contract: { id: any; title?: string; projectId?: number; projectName?: string; date?: string; status?: string; parties: any; amount: any; type?: string; blockchainVerified?: boolean; blockchainTxId?: string | null; cloudStorageId?: string; cloudSyncStatus?: string; lastModified?: string }) => {
    // Simulate blockchain verification
    const updatedContracts = contracts.map((c) => {
      if (c.id === contract.id) {
        const txId = "0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        recordTransaction(
          contract.parties[0],
          contract.parties[1],
          Number.parseFloat(contract.amount.replace(/[^0-9.-]+/g, "")),
        )
        return {
          ...c,
          blockchainVerified: true,
          blockchainTxId: txId,
        }
      }
      return c
    })

    setContracts(updatedContracts)
    alert("تم التحقق من العقد على البلوكتشين بنجاح!")
  }

  const handleSyncToCloud = (contract: { id: any; title?: string; projectId?: number; projectName?: string; date?: string; status?: string; parties?: string[]; amount?: string; type?: string; blockchainVerified?: boolean; blockchainTxId?: string | null; cloudStorageId?: string; cloudSyncStatus?: string; lastModified?: string }) => {
    // Simulate cloud upload
    const updatedContracts = contracts.map((c) => {
      if (c.id === contract.id) {
        uploadDocument(`contract-${contract.id}.pdf`, JSON.stringify(contract), user?.id || "anonymous")
        return {
          ...c,
          cloudSyncStatus: "synced",
          lastModified: new Date().toISOString(),
        }
      }
      return c
    })

    setContracts(updatedContracts)
    alert("تم مزامنة العقد مع السحابة بنجاح!")
  }

  const viewBlockchainDetails = (contract: SetStateAction<Contract | null>) => {
    setSelectedContract(contract)
    setShowBlockchainModal(true)
  }

  return (
    <ProtectedRoute allowedRoles={["startup", "sponsor", "admin"]}>
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
              إدارة العقود
            </motion.h1>

            {/* Blockchain & Cloud Info Banner */}
            <motion.div
              className="mb-8 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-500/10 p-2 rounded-full">
                    <Database className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-600">تقنية البلوكتشين</h3>
                    <p className="text-sm text-primary-600/80">جميع العقود موثقة ومؤمنة بتقنية البلوكتشين</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary-500/10 p-2 rounded-full">
                    <Cloud className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-600">التخزين السحابي</h3>
                    <p className="text-sm text-primary-600/80">نسخ احتياطية آمنة ومشفرة على السحابة</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-primary-300 text-primary-600 hover:bg-primary-100"
                  onClick={() => window.open("/blockchain-explorer", "_blank")}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  استكشاف البلوكتشين
                </Button>
              </div>
            </motion.div>

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="البحث عن عقد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-1/2"
              />
              <select
                className="border border-primary-200 rounded-lg px-3 py-2 text-primary-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">جميع الحالات</option>
                <option value="موقع">موقع</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
                <option value="مرفوض">مرفوض</option>
              </select>
              {user?.role === "admin" && <Button className="md:mr-auto">إنشاء عقد جديد</Button>}
            </div>

            {/* Contracts List */}
            {filteredContracts.length > 0 ? (
              <div className="space-y-6">
                {filteredContracts.map((contract) => (
                  <motion.div
                    key={contract.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                          <FileText className="h-6 w-6 text-primary-500" />
                          <h2 className="text-xl font-bold text-primary-500">{contract.title}</h2>
                          <span
                            className={`px-3 py-1 rounded-full text-sm border ${getStatusClass(
                              contract.status,
                            )} flex items-center gap-1`}
                          >
                            {getStatusIcon(contract.status)}
                            {contract.status}
                          </span>

                          {/* Blockchain Verification Badge */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant={contract.blockchainVerified ? "default" : "outline"}
                                  className={`flex items-center gap-1 cursor-pointer ${
                                    contract.blockchainVerified
                                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                  onClick={() => viewBlockchainDetails(contract)}
                                >
                                  {contract.blockchainVerified ? (
                                    <>
                                      <Shield className="h-3.5 w-3.5" />
                                      موثق بالبلوكتشين
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="h-3.5 w-3.5" />
                                      غير موثق
                                    </>
                                  )}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                {contract.blockchainVerified
                                  ? "تم التحقق من هذا العقد على البلوكتشين"
                                  : "هذا العقد لم يتم توثيقه على البلوكتشين بعد"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            عرض
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            تحميل
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                        <div>
                          <p className="text-sm font-medium text-gray-500">المشروع</p>
                          <p className="font-medium">
                            <Link href={`/projects/${contract.projectId}`} className="text-primary-500 hover:underline">
                              {contract.projectName}
                            </Link>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">الأطراف</p>
                          <p>{contract.parties.join(" و ")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">القيمة</p>
                          <p className="font-medium">{contract.amount}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">النوع</p>
                          <p>{contract.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">التاريخ</p>
                          <p>{new Date(contract.date).toLocaleDateString("ar-DZ")}</p>
                        </div>

                        {/* Cloud Storage Status */}
                        <div>
                          <p className="text-sm font-medium text-gray-500">حالة التخزين السحابي</p>
                          <div className="flex items-center gap-1">
                            {getCloudStatusIcon(contract.cloudSyncStatus)}
                            <span>{getCloudStatusText(contract.cloudSyncStatus)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Blockchain and Cloud Actions */}
                      <div className="mt-4 pt-4 border-t border-primary-100 flex flex-wrap gap-2">
                        {!contract.blockchainVerified && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 border-primary-300 text-primary-600"
                            onClick={() => handleVerifyOnBlockchain(contract)}
                          >
                            <Shield className="h-4 w-4" />
                            توثيق على البلوكتشين
                          </Button>
                        )}

                        {contract.cloudSyncStatus !== "synced" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 border-primary-300 text-primary-600"
                            onClick={() => handleSyncToCloud(contract)}
                          >
                            <Cloud className="h-4 w-4" />
                            مزامنة مع السحابة
                          </Button>
                        )}

                        {contract.blockchainVerified && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 border-green-300 text-green-600"
                            onClick={() => viewBlockchainDetails(contract)}
                          >
                            <Database className="h-4 w-4" />
                            عرض تفاصيل البلوكتشين
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">لا توجد عقود</h3>
                <p className="text-gray-500 mb-6">لم يتم العثور على أي عقود تطابق معايير البحث</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                >
                  عرض جميع العقود
                </Button>
              </div>
            )}
          </div>
        </main>

        {/* Blockchain Details Modal */}
        {showBlockchainModal && selectedContract && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-primary-500">تفاصيل البلوكتشين</h2>
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowBlockchainModal(false)}>
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-primary-50 rounded-lg p-4 mb-6 border border-primary-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <h3 className="font-bold text-primary-600">
                      حالة التوثيق: {selectedContract.blockchainVerified ? "موثق" : "غير موثق"}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedContract.blockchainVerified
                      ? "تم التحقق من هذا العقد وتسجيله على البلوكتشين بشكل آمن ولا يمكن تغييره."
                      : "هذا العقد لم يتم توثيقه على البلوكتشين بعد."}
                  </p>
                </div>

                {selectedContract.blockchainVerified && (
                  <>
                    <div className="mb-4">
                      <h3 className="font-bold text-primary-500 mb-2">معرف المعاملة (Transaction ID)</h3>
                      <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm break-all border border-gray-200">
                        {selectedContract.blockchainTxId}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-bold text-primary-500 mb-2">تفاصيل المعاملة</h3>
                      <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">من</p>
                            <p className="font-medium">{selectedContract.parties[0]}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">إلى</p>
                            <p className="font-medium">{selectedContract.parties[1]}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">القيمة</p>
                            <p className="font-medium">{selectedContract.amount}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">تاريخ التوثيق</p>
                            <p className="font-medium">
                              {new Date(selectedContract.lastModified).toLocaleString("ar-DZ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-bold text-primary-500 mb-2">بصمة العقد (Hash)</h3>
                      <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm break-all border border-gray-200">
                        {`0x${Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-green-600 mb-6">
                      <Lock className="h-5 w-5" />
                      <span className="font-medium">هذا العقد مشفر ومحمي على البلوكتشين</span>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2">
                  {!selectedContract.blockchainVerified && (
                    <Button
                      className="bg-primary-500 hover:bg-primary-600"
                      onClick={() => {
                        handleVerifyOnBlockchain(selectedContract)
                        setShowBlockchainModal(false)
                      }}
                    >
                      توثيق العقد الآن
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setShowBlockchainModal(false)}>
                    إغلاق
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
