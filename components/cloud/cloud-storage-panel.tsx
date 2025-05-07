"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Cloud, CloudOff, RefreshCw, Lock, Shield, Download, Eye, FileText, File, Image, Database } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CloudStoragePanelProps {
  files?: {
    id: string
    name: string
    type: "document" | "image" | "contract" | "data"
    size: number
    lastModified: string
    syncStatus: "synced" | "syncing" | "failed" | "pending"
  }[]
  storageUsed?: number
  storageLimit?: number
  provider?: "aws" | "azure" | "gcp" | "custom"
  encryptionEnabled?: boolean
  backupEnabled?: boolean
  lastSyncTime?: string
}

export default function CloudStoragePanel({
  files = [],
  storageUsed = 128,
  storageLimit = 1024,
  provider = "aws",
  encryptionEnabled = true,
  backupEnabled = true,
  lastSyncTime = new Date().toISOString(),
}: CloudStoragePanelProps) {
  const [syncingAll, setSyncingAll] = useState(false)

  const getProviderInfo = () => {
    switch (provider) {
      case "aws":
        return {
          name: "Amazon S3",
          icon: "☁️",
          color: "text-amber-600",
        }
      case "azure":
        return {
          name: "Azure Blob Storage",
          icon: "☁️",
          color: "text-blue-600",
        }
      case "gcp":
        return {
          name: "Google Cloud Storage",
          icon: "☁️",
          color: "text-green-600",
        }
      case "custom":
        return {
          name: "تخزين سحابي خاص",
          icon: "☁️",
          color: "text-primary-600",
        }
      default:
        return {
          name: "Amazon S3",
          icon: "☁️",
          color: "text-amber-600",
        }
    }
  }

  const providerInfo = getProviderInfo()

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "image":
        return <Image className="h-5 w-5 text-green-500" />
      case "contract":
        return <File className="h-5 w-5 text-amber-500" />
      case "data":
        return <Database className="h-5 w-5 text-purple-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
        return <Cloud className="h-4 w-4 text-green-500" />
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-amber-500 animate-spin" />
      case "failed":
        return <CloudOff className="h-4 w-4 text-red-500" />
      case "pending":
        return <Cloud className="h-4 w-4 text-gray-400" />
      default:
        return <Cloud className="h-4 w-4 text-gray-400" />
    }
  }

  const formatSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(0)} KB`
    } else if (sizeInMB >= 1000) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`
    } else {
      return `${sizeInMB.toFixed(1)} MB`
    }
  }

  const handleSyncAll = () => {
    setSyncingAll(true)
    // Simulate sync process
    setTimeout(() => {
      setSyncingAll(false)
    }, 3000)
  }

  const storagePercentage = (storageUsed / storageLimit) * 100

  return (
    <Card className="border-primary-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-primary-600 flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            التخزين السحابي
          </CardTitle>
          <Badge variant="outline" className={`bg-primary-50 border-primary-200 ${providerInfo.color}`}>
            <span className="flex items-center gap-1">
              <span>{providerInfo.icon}</span>
              {providerInfo.name}
            </span>
          </Badge>
        </div>
        <CardDescription>
          {encryptionEnabled ? "تخزين آمن ومشفر للبيانات والملفات" : "تخزين سحابي للبيانات والملفات"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="text-gray-600">المساحة المستخدمة</span>
            <span className="font-medium">
              {formatSize(storageUsed)} من {formatSize(storageLimit)}
            </span>
          </div>
          <Progress value={storagePercentage} className="h-2" />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">آخر مزامنة:</span>
            <span className="font-medium">{new Date(lastSyncTime).toLocaleString("ar-DZ")}</span>
          </div>

          <div className="flex items-center gap-1 sm:mr-auto">
            <span className="text-gray-600">عدد الملفات:</span>
            <span className="font-medium">{files.length}</span>
          </div>
        </div>

        {files.length > 0 ? (
          <div className="border rounded-md border-gray-200 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                      الملف
                    </th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                      الحجم
                    </th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                      الحالة
                    </th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <span className="font-medium truncate max-w-[120px]">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{formatSize(file.size)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-1">
                          {getSyncStatusIcon(file.syncStatus)}
                          <span
                            className={
                              file.syncStatus === "synced"
                                ? "text-green-600"
                                : file.syncStatus === "syncing"
                                  ? "text-amber-600"
                                  : file.syncStatus === "failed"
                                    ? "text-red-600"
                                    : "text-gray-600"
                            }
                          >
                            {file.syncStatus === "synced"
                              ? "متزامن"
                              : file.syncStatus === "syncing"
                                ? "جاري المزامنة"
                                : file.syncStatus === "failed"
                                  ? "فشل المزامنة"
                                  : "في الانتظار"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <Cloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">لا توجد ملفات مخزنة حالياً</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <div className="flex items-center gap-2 text-green-600 text-sm">
            {encryptionEnabled && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    <span>تشفير من طرف إلى طرف</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>جميع البيانات مشفرة قبل تخزينها على السحابة</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex items-center gap-2 text-primary-600 text-sm">
            {backupEnabled && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>نسخ احتياطي تلقائي</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>يتم عمل نسخ احتياطية تلقائية كل 24 ساعة</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleSyncAll}
          disabled={syncingAll}
        >
          {syncingAll ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              جاري المزامنة...
            </>
          ) : (
            <>
              <Cloud className="h-4 w-4" />
              مزامنة الكل
            </>
          )}
        </Button>

        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          إدارة الملفات
        </Button>
      </CardFooter>
    </Card>
  )
}
