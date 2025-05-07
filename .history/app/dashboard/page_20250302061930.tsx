"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  addUpdate,
  formatCurrency,
  formatDate,
  getProjects,
  getPledges,
  initializeStorage,
  type Project,
  type Pledge,
} from "@/lib/storage"
import { calculateProgress } from "@/lib/utils"
import { MessageSquare, RefreshCw } from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"projects" | "messages" | "updates">("projects")
  const [projects, setProjects] = useState<Project[]>([])
  const [pledges, setPledges] = useState<Pledge[]>([])
  const [updateContent, setUpdateContent] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  useEffect(() => {
    // Initialize sessionStorage with default data
    initializeStorage()

    // Get projects and pledges from sessionStorage
    const allProjects = getProjects()
    const allPledges = getPledges()

    setProjects(allProjects)
    setPledges(allPledges)

    // Set first project as selected if available
    if (allProjects.length > 0) {
      setSelectedProjectId(allProjects[0].id)
    }
  }, [])

  const handleAddUpdate = () => {
    if (!selectedProjectId || !updateContent.trim()) return

    const newUpdate = addUpdate(selectedProjectId, updateContent)

    if (newUpdate) {
      // Update local state
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === selectedProjectId ? { ...project, updates: [...project.updates, newUpdate] } : project,
        ),
      )
      setUpdateContent("")
    }
  }

  // Get all messages across all projects
  const getAllMessages = () => {
    return projects
      .flatMap((project) =>
        project.messages.map((msg) => ({
          ...msg,
          projectId: project.id,
          projectTitle: project.title,
        })),
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Get all updates across all projects
  const getAllUpdates = () => {
    return projects
      .flatMap((project) =>
        project.updates.map((update) => ({
          ...update,
          projectId: project.id,
          projectTitle: project.title,
        })),
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">لوحة التحكم</h1>

          {/* Tabs */}
          <div className="flex border-b mb-6 overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium ${activeTab === "projects" ? "border-b-2 border-blue" : "text-gray-500"}`}
              onClick={() => setActiveTab("projects")}
            >
              مشاريعي
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === "messages" ? "border-b-2 border-blue" : "text-gray-500"}`}
              onClick={() => setActiveTab("messages")}
            >
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                الرسائل
              </div>
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === "updates" ? "border-b-2 border-blue" : "text-gray-500"}`}
              onClick={() => setActiveTab("updates")}
            >
              <div className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                التحديثات
              </div>
            </button>
          </div>

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">المشاريع المقدمة</h2>
                <Button asChild>
                  <Link href="/submit">قدّم مشروع جديد</Link>
                </Button>
              </div>

              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => {
                    const progress = calculateProgress(project.raised.cash, project.goal.cash)

                    return (
                      <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-40">
                          <Image
                            src={project.images[0] || "/placeholder.svg?height=400&width=600"}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-2">{project.title}</h3>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{formatCurrency(project.raised.cash)}</span>
                              <span>{formatCurrency(project.goal.cash)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                          </div>

                          <p className="text-gray-700 text-sm">{project.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p>لا يوجد مشاريع مقدمة حتى الآن.</p>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-6">الرسائل</h2>

              {getAllMessages().length > 0 ? (
                <div className="space-y-4">
                  {getAllMessages().map((message) => (
                    <div key={message.id} className="bg-white rounded-lg shadow-md p-4">
                      <p className="font-bold">{message.projectTitle}</p>
                      <p className="text-gray-700">{message.content}</p>
                      <p className="text-gray-500 text-sm">{formatDate(message.date)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>لا يوجد رسائل.</p>
              )}
            </div>
          )}

          {/* Updates Tab */}
          {activeTab === "updates" && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">التحديثات</h2>

                {projects.length > 0 && (
                  <select
                    className="border rounded px-2 py-1"
                    value={selectedProjectId || ""}
                    onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedProjectId && (
                <div className="mb-6">
                  <textarea
                    className="w-full border rounded py-2 px-3 mb-2"
                    rows={4}
                    placeholder="اكتب تحديثًا..."
                    value={updateContent}
                    onChange={(e) => setUpdateContent(e.target.value)}
                  />
                  <Button onClick={handleAddUpdate}>إضافة تحديث</Button>
                </div>
              )}

              {getAllUpdates().length > 0 ? (
                <div className="space-y-4">
                  {getAllUpdates().map((update) => (
                    <div key={update.id} className="bg-white rounded-lg shadow-md p-4">
                      <p className="font-bold">{update.projectTitle}</p>
                      <p className="text-gray-700">{update.content}</p>
                      <p className="text-gray-500 text-sm">{formatDate(update.date)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>لا يوجد تحديثات.</p>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

