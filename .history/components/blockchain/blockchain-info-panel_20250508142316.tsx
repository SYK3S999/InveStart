'use client'

import { Shield, Database, Lock, CheckCircle, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

interface BlockchainInfoPanelProps {
  transactionId?: string
  contractId?: string
  projectId?: number
  status: "verified" | "pending" | "failed"
  timestamp?: string
  blockNumber?: number
  networkType: "ethereum" | "hyperledger" | "polygon"
}

export default function BlockchainInfoPanel({
  transactionId = "0x7f9e4c5d3b2a1f8e7d6c5b4a3f2e1d0c9b8a7f6e",
  contractId,
  projectId,
  status = "verified",
  timestamp = new Date().toISOString(),
  blockNumber = 12345678,
  networkType = "ethereum",
}: BlockchainInfoPanelProps) {
  const getNetworkInfo = () => {
    switch (networkType) {
      case "ethereum":
        return {
          name: "Ethereum",
          icon: "🔷",
          explorerUrl: "https://etherscan.io",
          color: "text-blue-600",
        }
      case "hyperledger":
        return {
          name: "Hyperledger Fabric",
          icon: "🔶",
          explorerUrl: "#",
          color: "text-amber-600",
        }
      case "polygon":
        return {
          name: "Polygon",
          icon: "🟣",
          explorerUrl: "https://polygonscan.com",
          color: "text-purple-600",
        }
      default:
        return {
          name: "Ethereum",
          icon: "🔷",
          explorerUrl: "https://etherscan.io",
          color: "text-blue-600",
        }
    }
  }

  const network = getNetworkInfo()

  const getStatusInfo = () => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          label: "تم التحقق",
          description: "تم التحقق من هذه المعاملة وتسجيلها بنجاح على البلوكتشين",
          badgeClass: "bg-green-100 text-green-800 border-green-200",
        }
      case "pending":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          label: "قيد التحقق",
          description: "هذه المعاملة قيد التحقق حالياً على البلوكتشين",
          badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
        }
      case "failed":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          label: "فشل التحقق",
          description: "فشل التحقق من هذه المعاملة على البلوكتشين",
          badgeClass: "bg-red-100 text-red-800 border-red-200",
        }
      default:
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          label: "تم التحقق",
          description: "تم التحقق من هذه المعاملة وتسجيلها بنجاح على البلوكتشين",
          badgeClass: "bg-green-100 text-green-800 border-green-200",
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <Card className="border-primary-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-primary-600 flex items-center gap-2">
            <Database className="h-5 w-5" />
            معلومات البلوكتشين
          </CardTitle>
          <Badge variant="outline" className={statusInfo.badgeClass}>
            <span className="flex items-center gap-1">
              {statusInfo.icon}
              {statusInfo.label}
            </span>
          </Badge>
        </div>
        <CardDescription>{statusInfo.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">شبكة البلوكتشين</h4>
          <p className={`font-medium flex items-center gap-1 ${network.color}`}>
            <span>{network.icon}</span>
            {network.name}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">معرف المعاملة</h4>
          <div className="bg-gray-50 p-2 rounded border border-gray-200 font-mono text-xs break-all">
            {transactionId}
          </div>
        </div>

        {blockNumber && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">رقم الكتلة</h4>
            <p className="font-medium">{blockNumber}</p>
          </div>
        )}

        {timestamp && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">تاريخ التسجيل</h4>
            <p className="font-medium">{new Date(timestamp).toLocaleString("ar-DZ")}</p>
          </div>
        )}

        <div className="pt-2">
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Shield className="h-4 w-4" />
            <span>مؤمن بتقنية التشفير المتقدمة</span>
          </div>
          <div className="flex items-center gap-2 text-primary-600 text-sm mt-1">
            <Lock className="h-4 w-4" />
            <span>لا يمكن تعديل البيانات بعد تسجيلها</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4 flex flex-wrap gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" asChild>
                <Link href="/blockchain-explorer" target="_blank">
                  عرض في مستكشف البلوكتشين
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>استعرض تفاصيل المعاملة في مستكشف البلوكتشين</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {contractId && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/contracts?id=${contractId}`}>عرض العقد المرتبط</Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>عرض العقد الذكي المرتبط بهذه المعاملة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {projectId && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/projects/${projectId}`}>عرض المشروع</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
