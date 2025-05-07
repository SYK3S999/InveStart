"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  addMessage,
  formatCurrency,
  formatDate,
  getProject,
  initializeStorage,
  savePledge,
  type Project,
} from "@/lib/storage"
import { calculateProgress } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquare,
  RefreshCw,
  Send,
  Building,
  Cpu,
  Leaf,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Briefcase,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<"details" | "documents" | "updates" | "messages">("details")
  const [message, setMessage] = useState("")
  const [cashPledge, setCashPledge] = useState<number>(0)
  const [inKindPledge, setInKindPledge] = useState<string>("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize sessionStorage with default data
    initializeStorage()

    if (params.id) {
      const projectId = Number(params.id)
      const projectData = getProject(projectId)

      if (projectData) {
        setProject(projectData)
      } else {
        // Project not found, redirect to projects page
        router.push("/projects")
      }
    }

    setLoading(false)
  }, [params.id, router])

  const handleSendMessage = () => {
    if (!project || !message.trim()) return

    const newMessage = addMessage(project.id, {
      sender: "مستثمر",
      content: message,
    })

    if (newMessage) {
      // Update local state
      setProject({
        ...project,
        messages: [...project.messages, newMessage],
      })
      setMessage("")
    }
  }

  const handlePledge = () => {
    if (!project) return

    // Create pledge object
    const pledge = {
      projectId: project.id,
      investor: "مستثمر",
      cash: cashPledge,
      inKind: inKindPledge || null,
      date: new Date().toISOString(),
    }

    // Save pledge
    savePledge(pledge)

    // Update local state
    setProject({
      ...project,
      raised: {
        cash: project.raised.cash + cashPledge,
        inKind: inKindPledge ? inKindPledge : project.raised.inKind,
      },
    })

    // Reset form
    setCashPledge(0)
    setInKindPledge("")

    // Show success message
    alert("تم تسجيل تعهدك بنجاح!")
  }

  const nextImage = () => {
    if (!project) return
    setCurrentImageIndex((prevIndex) => (prevIndex === project.images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    if (!project) return
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? project.images.length - 1 : prevIndex - 1))
  }

  const getCategoryIcon = () => {
    if (!project) return null

    switch (project.category) {
      case "صناعة":
        return <Building className="h-5 w-5" />
      case "تكنولوجيا":
        return <Cpu className="h-5 w-5" />
      case "زراعة":
        return <Leaf className="h-5 w-5" />
      case "خدمات":
        return <Users className="h-5 w-5" />
      default:
        return <Building className="h-5 w-5" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "تمت المصادقة":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "قيد التحقق":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "مرفوض":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 py-8 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 py-8 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">المشروع غير موجود</h1>
            <Button asChild>
              <a href="/projects">العودة إلى المشاريع</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const progress = calculateProgress(project.raised.cash, project.goal.cash)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-8 bg-muted">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Project Header */}
            <div className="p-6 border-b">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{project.title}</h1>
                <Badge className="flex items-center gap-1 bg-primary-100 text-primary-800" variant="outline">
                  {getCategoryIcon()}
                  {project.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  آخر تحديث:{" "}
                  {formatDate(
                    project.updates.length > 0
                      ? project.updates[project.updates.length - 1].date
                      : new Date().toISOString(),
                  )}
                </span>
              </div>
            </div>

            <div className="md:flex">
              {/* Left Column - Project Details */}
              <div className="md:w-2/3 p-6">
                {/* Image Gallery */}
                <div className="relative h-64 md:h-96 mb-6 bg-muted rounded-lg overflow-hidden">
                  {project.images.length > 0 ? (
                    <>
                      <Image
                        src={project.images[currentImageIndex] || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-contain"
                      />

                      {project.images.length > 1 && (
                        <>
                          <Button
                            onClick={prevImage}
                            variant="outline"
                            size="icon"
                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors z-10"
                            aria-label="الصورة السابقة"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>

                          <Button
                            onClick={nextImage}
                            variant="outline"
                            size="icon"
                            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors z-10"
                            aria-label="الصورة التالية"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>

                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {project.images.map((_, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-primary" : "bg-gray-300"}`}
                              ></div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">لا توجد صور</p>
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <div className="border-b mb-6">
                  <div className="flex overflow-x-auto">
                    <button
                      className={`px-4 py-2 font-medium ${activeTab === "details" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                      onClick={() => setActiveTab("details")}
                    >
                      التفاصيل
                    </button>
                    <button
                      className={`px-4 py-2 font-medium ${activeTab === "documents" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                      onClick={() => setActiveTab("documents")}
                    >
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        الوثائق
                      </div>
                    </button>
                    <button
                      className={`px-4 py-2 font-medium ${activeTab === "updates" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                      onClick={() => setActiveTab("updates")}
                    >
                      <div className="flex items-center gap-1">
                        <RefreshCw className="h-4 w-4" />
                        التحديثات
                      </div>
                    </button>
                    <button
                      className={`px-4 py-2 font-medium ${activeTab === "messages" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                      onClick={() => setActiveTab("messages")}
                    >
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        الرسائل
                      </div>
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="mb-6">
                  {activeTab === "details" && (
                    <div className="animate-fade-in">
                      <h2 className="text-xl font-bold mb-3">وصف المشروع</h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{project.description}</p>
                    </div>
                  )}

                  {activeTab === "documents" && (
                    <div className="animate-fade-in">
                      <h2 className="text-xl font-bold mb-3">الوثائق</h2>
                      {project.documents.length > 0 ? (
                        <ul className="space-y-3">
                          {project.documents.map((doc, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <span className="font-medium">{doc.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(doc.status)}
                                <span
                                  className={`px-3 py-1 rounded-full text-sm ${
                                    doc.status === "تمت المصادقة"
                                      ? "bg-green-100 text-green-800"
                                      : doc.status === "قيد التحقق"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {doc.status}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-8 bg-muted/50 rounded-lg">
                          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">لا توجد وثائق</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "updates" && (
                    <div className="animate-fade-in">
                      <h2 className="text-xl font-bold mb-3">تحديثات المشروع</h2>
                      {project.updates.length > 0 ? (
                        <div className="space-y-4">
                          {project.updates.map((update) => (
                            <div key={update.id} className="border-r-2 border-primary pr-4 pb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="text-sm text-muted-foreground">{formatDate(update.date)}</div>
                              </div>
                              <p className="text-foreground">{update.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-muted/50 rounded-lg">
                          <RefreshCw className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">لا توجد تحديثات</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "messages" && (
                    <div className="animate-fade-in">
                      <h2 className="text-xl font-bold mb-3">الرسائل</h2>
                      <div className="border rounded-lg p-4 mb-4 max-h-80 overflow-y-auto bg-muted/30">
                        {project.messages.length > 0 ? (
                          <div className="space-y-4">
                            {project.messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`p-3 rounded-lg max-w-[80%] ${
                                  msg.sender === "مستثمر" ? "bg-primary/10 mr-auto" : "bg-secondary/10 ml-auto"
                                }`}
                              >
                                <div className="font-bold text-sm mb-1">{msg.sender}</div>
                                <p>{msg.content}</p>
                                <div className="text-xs text-muted-foreground mt-1 text-left flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(msg.date)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">لا توجد رسائل</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="اكتب رسالتك هنا..."
                          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <Button
                          onClick={handleSendMessage}
                          className="bg-primary hover:bg-primary-600 transition-colors"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          إرسال
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Funding Info */}
              <div className="md:w-1/3 bg-muted/30 p-6 border-t md:border-t-0 md:border-r">
                {/* Funding Progress */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-lg">{formatCurrency(project.raised.cash)}</span>
                    <span className="text-muted-foreground">من {formatCurrency(project.goal.cash)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{project.messages.length} مشارك</span>
                    <span className="text-sm font-medium text-primary">{progress}% مكتمل</span>
                  </div>
                </div>

                {/* In-Kind Funding */}
                {project.goal.inKind && (
                  <div className="mb-6 p-4 bg-muted rounded-lg border border-border/60">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      التمويل العيني المطلوب:
                    </h3>
                    <p className="text-foreground">{project.goal.inKind}</p>
                    {project.raised.inKind && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-green-700">
                        <span className="font-bold">تم توفير:</span> {project.raised.inKind}
                      </div>
                    )}
                  </div>
                )}

                {/* Pledge Form */}
                <div className="bg-white p-5 rounded-lg border border-border/60 mb-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 text-center">تعهد بالتمويل</h3>

                  {/* Cash Pledge */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-foreground">مبلغ نقدي (دج)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={cashPledge || ""}
                      onChange={(e) => setCashPledge(Number(e.target.value))}
                    />
                  </div>

                  {/* In-Kind Pledge */}
                  {project.goal.inKind && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1 text-foreground">أصول عينية</label>
                      <select
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={inKindPledge}
                        onChange={(e) => setInKindPledge(e.target.value)}
                      >
                        <option value="">اختر نوع الأصول</option>
                        <option value="آلات">آلات</option>
                        <option value="معدات">معدات</option>
                        <option value="أرض">أرض</option>
                        <option value="مبنى">مبنى</option>
                        <option value="أخرى">أخرى</option>
                      </select>
                    </div>
                  )}

                  <Button
                    className="w-full bg-primary hover:bg-primary-600 transition-colors"
                    onClick={handlePledge}
                    disabled={!cashPledge && !inKindPledge}
                  >
                    تعهد الآن
                  </Button>
                </div>

                {/* Project Stats */}
                <div className="bg-white p-5 rounded-lg border border-border/60 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 text-center">معلومات المشروع</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">الفئة:</span>
                      <span className="font-medium flex items-center gap-1">
                        {getCategoryIcon()}
                        {project.category}
                      </span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">عدد الرسائل:</span>
                      <span className="font-medium">{project.messages.length}</span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">عدد التحديثات:</span>
                      <span className="font-medium">{project.updates.length}</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-muted-foreground">عدد الوثائق:</span>
                      <span className="font-medium">{project.documents.length}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

