"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Database, Search, ArrowLeft, Shield, FileText, CheckCircle, RefreshCw, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTransactions } from "@/lib/blockchain"
import ProtectedRoute from "@/components/ProtectedRoute"

// Mock blockchain data
const mockBlocks = [
  {
    id: 1,
    hash: "0x7f9e4c5d3b2a1f8e7d6c5b4a3f2e1d0c9b8a7f6e",
    previousHash: "0x0000000000000000000000000000000000000000",
    timestamp: new Date("2023-08-15T14:30:00Z").getTime(),
    transactions: [
      {
        id: "tx1",
        from: "شركة التطوير",
        to: "المستثمر أ",
        amount: 500000,
        type: "contract",
        contractId: 1,
        timestamp: new Date("2023-08-15T14:30:00Z").getTime(),
      },
    ],
    nonce: 12345,
    difficulty: 4,
  },
  {
    id: 2,
    hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    previousHash: "0x7f9e4c5d3b2a1f8e7d6c5b4a3f2e1d0c9b8a7f6e",
    timestamp: new Date("2023-10-05T16:20:00Z").getTime(),
    transactions: [
      {
        id: "tx2",
        from: "شركة الخدمات المنزلية",
        to: "مجموعة المستثمرين",
        amount: 350000,
        type: "contract",
        contractId: 4,
        timestamp: new Date("2023-10-05T16:20:00Z").getTime(),
      },
    ],
    nonce: 67890,
    difficulty: 4,
  },
  {
    id: 3,
    hash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
    previousHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    timestamp: new Date("2023-12-10T09:45:00Z").getTime(),
    transactions: [
      {
        id: "tx3",
        from: "مستثمر ج",
        to: "شركة التكنولوجيا",
        amount: 750000,
        type: "investment",
        projectId: 2,
        timestamp: new Date("2023-12-10T09:45:00Z").getTime(),
      },
      {
        id: "tx4",
        from: "مستثمر د",
        to: "شركة التكنولوجيا",
        amount: 250000,
        type: "investment",
        projectId: 2,
        timestamp: new Date("2023-12-10T09:50:00Z").getTime(),
      },
    ],
    nonce: 54321,
    difficulty: 5,
  },
]

export default function BlockchainExplorerPage() {
  const [blocks, setBlocks] = useState(mockBlocks)
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("blocks") // blocks, transactions
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get transactions from blockchain lib
    const txs = getTransactions()
    // Combine with mock data
    const allTransactions = [...mockBlocks.flatMap((block) => block.transactions), ...txs]
    setTransactions(allTransactions)
  }, [])

  const handleSearch = () => {
    if (!searchTerm.trim()) return

    setIsLoading(true)

    // Simulate search delay
    setTimeout(() => {
      // Search in blocks
      const foundBlock = blocks.find(
        (block) => block.hash.toLowerCase().includes(searchTerm.toLowerCase()) || block.id.toString() === searchTerm,
      )

      if (foundBlock) {
        setSelectedBlock(foundBlock)
        setActiveTab("blocks")
        setSelectedTransaction(null)
      } else {
        // Search in transactions
        const foundTransaction = transactions.find((tx) => tx.id.toLowerCase().includes(searchTerm.toLowerCase()))

        if (foundTransaction) {
          setSelectedTransaction(foundTransaction)
          setActiveTab("transactions")
          setSelectedBlock(null)
        } else {
          alert("لم يتم العثور على نتائج للبحث")
        }
      }

      setIsLoading(false)
    }, 800)
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("ar-DZ")
  }

  const formatHash = (hash) => {
    if (!hash) return ""
    return hash.length > 20 ? `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}` : hash
  }

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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-500 mb-4">مستكشف البلوكتشين</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                استكشف سلسلة الكتل الخاصة بمنصة INEVESTART وتحقق من المعاملات والعقود المسجلة بشكل آمن ولا يمكن تغييره
              </p>
            </motion.div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="ابحث عن كتلة أو معاملة باستخدام الهاش أو المعرف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isLoading} className="bg-primary-500 hover:bg-primary-600">
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                  بحث
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-primary-200">
              <div className="flex">
                <button
                  className={`px-4 py-3 font-semibold text-sm md:text-base ${
                    activeTab === "blocks"
                      ? "text-primary-500 border-b-2 border-primary-500"
                      : "text-gray-600 hover:text-primary-500"
                  } transition-colors duration-200`}
                  onClick={() => setActiveTab("blocks")}
                >
                  الكتل
                </button>
                <button
                  className={`px-4 py-3 font-semibold text-sm md:text-base ${
                    activeTab === "transactions"
                      ? "text-primary-500 border-b-2 border-primary-500"
                      : "text-gray-600 hover:text-primary-500"
                  } transition-colors duration-200`}
                  onClick={() => setActiveTab("transactions")}
                >
                  المعاملات
                </button>
              </div>
            </div>

            {/* Content */}
            {activeTab === "blocks" && (
              <div>
                {selectedBlock ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-primary-500">تفاصيل الكتلة #{selectedBlock.id}</h2>
                      <Button variant="outline" size="sm" onClick={() => setSelectedBlock(null)}>
                        العودة للقائمة
                      </Button>
                    </div>

                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-primary-500" />
                          معلومات الكتلة
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">رقم الكتلة</p>
                            <p className="font-medium">{selectedBlock.id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">التاريخ</p>
                            <p className="font-medium">{formatDate(selectedBlock.timestamp)}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">هاش الكتلة</p>
                            <p className="font-mono text-sm break-all bg-gray-50 p-2 rounded border border-gray-200">
                              {selectedBlock.hash}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">هاش الكتلة السابقة</p>
                            <p className="font-mono text-sm break-all bg-gray-50 p-2 rounded border border-gray-200">
                              {selectedBlock.previousHash}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Nonce</p>
                            <p className="font-medium">{selectedBlock.nonce}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">الصعوبة</p>
                            <p className="font-medium">{selectedBlock.difficulty}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <h3 className="text-lg font-bold text-primary-500 mb-3">المعاملات في هذه الكتلة</h3>
                    {selectedBlock.transactions.length > 0 ? (
                      <div className="space-y-4">
                        {selectedBlock.transactions.map((tx) => (
                          <Card key={tx.id} className="hover:border-primary-300 transition-colors">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary-500" />
                                  معاملة {tx.type === "contract" ? "عقد" : "استثمار"}
                                </CardTitle>
                                <Badge variant="outline" className="bg-primary-50 text-primary-500">
                                  {formatDate(tx.timestamp)}
                                </Badge>
                              </div>
                              <CardDescription className="font-mono text-xs">{tx.id}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">من</p>
                                  <p className="font-medium">{tx.from}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">إلى</p>
                                  <p className="font-medium">{tx.to}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">القيمة</p>
                                  <p className="font-medium">{tx.amount.toLocaleString()} دج</p>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="border-t border-gray-100 pt-3">
                              <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-sm">تم التأكيد</span>
                                </div>
                                {tx.contractId && (
                                  <Button variant="ghost" size="sm" className="text-primary-500" asChild>
                                    <Link href={`/contracts?id=${tx.contractId}`}>
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      عرض العقد
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600">لا توجد معاملات في هذه الكتلة</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {blocks.map((block) => (
                      <motion.div
                        key={block.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-primary-100 hover:border-primary-300 transition-all cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => setSelectedBlock(block)}
                      >
                        <div className="p-4 md:p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            <div className="flex items-center gap-2 mb-2 md:mb-0">
                              <div className="bg-primary-100 p-2 rounded-full">
                                <Database className="h-5 w-5 text-primary-500" />
                              </div>
                              <div>
                                <h3 className="font-bold text-primary-500">كتلة #{block.id}</h3>
                                <p className="text-sm text-gray-500">{formatDate(block.timestamp)}</p>
                              </div>
                            </div>
                            <Badge className="self-start md:self-auto bg-primary-50 text-primary-500 border-primary-200">
                              {block.transactions.length} معاملات
                            </Badge>
                          </div>

                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-500">هاش الكتلة</p>
                            <p className="font-mono text-sm truncate">{formatHash(block.hash)}</p>
                          </div>

                          <div className="flex justify-end mt-2">
                            <Button variant="ghost" size="sm" className="text-primary-500">
                              عرض التفاصيل
                              <ArrowLeft className="h-4 w-4 mr-1" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "transactions" && (
              <div>
                {selectedTransaction ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-primary-500">تفاصيل المعاملة</h2>
                      <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(null)}>
                        العودة للقائمة
                      </Button>
                    </div>

                    <Card className="mb-6">
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary-500" />
                            معاملة {selectedTransaction.type === "contract" ? "عقد" : "استثمار"}
                          </CardTitle>
                          <Badge className="bg-green-100 text-green-800 border-green-200">تم التأكيد</Badge>
                        </div>
                        <CardDescription className="font-mono">{selectedTransaction.id}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">من</p>
                            <p className="font-medium">{selectedTransaction.from}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">إلى</p>
                            <p className="font-medium">{selectedTransaction.to}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">القيمة</p>
                            <p className="font-medium">{selectedTransaction.amount.toLocaleString()} دج</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">التاريخ</p>
                            <p className="font-medium">{formatDate(selectedTransaction.timestamp)}</p>
                          </div>
                          {selectedTransaction.contractId && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">معرف العقد</p>
                              <p className="font-medium">{selectedTransaction.contractId}</p>
                            </div>
                          )}
                          {selectedTransaction.projectId && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">معرف المشروع</p>
                              <p className="font-medium">{selectedTransaction.projectId}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-gray-100 pt-4 flex justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-500" />
                          <span className="text-green-600">مؤمنة بتقنية البلوكتشين</span>
                        </div>
                        {(selectedTransaction.contractId || selectedTransaction.projectId) && (
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={
                                selectedTransaction.contractId
                                  ? `/contracts?id=${selectedTransaction.contractId}`
                                  : `/projects/${selectedTransaction.projectId}`
                              }
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              {selectedTransaction.contractId ? "عرض العقد" : "عرض المشروع"}
                            </Link>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <motion.div
                        key={tx.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-primary-100 hover:border-primary-300 transition-all cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => setSelectedTransaction(tx)}
                      >
                        <div className="p-4 md:p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            <div className="flex items-center gap-2 mb-2 md:mb-0">
                              <div className="bg-primary-100 p-2 rounded-full">
                                <FileText className="h-5 w-5 text-primary-500" />
                              </div>
                              <div>
                                <h3 className="font-bold text-primary-500">
                                  معاملة {tx.type === "contract" ? "عقد" : "استثمار"}
                                </h3>
                                <p className="text-sm text-gray-500">{formatDate(tx.timestamp)}</p>
                              </div>
                            </div>
                            <Badge className="self-start md:self-auto bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5" />
                              تم التأكيد
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                            <div>
                              <p className="text-xs text-gray-500">من</p>
                              <p className="text-sm font-medium truncate">{tx.from}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">إلى</p>
                              <p className="text-sm font-medium truncate">{tx.to}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">القيمة</p>
                              <p className="text-sm font-medium">{tx.amount.toLocaleString()} دج</p>
                            </div>
                          </div>

                          <div className="flex justify-end mt-2">
                            <Button variant="ghost" size="sm" className="text-primary-500">
                              عرض التفاصيل
                              <ArrowLeft className="h-4 w-4 mr-1" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
