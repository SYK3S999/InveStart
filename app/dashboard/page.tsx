"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  addUpdate,
  formatCurrency,
  formatDate,
  getProjects,
  getPledges,
  initializeStorage,
  type Project,
  type Pledge,
} from "@/lib/storage";
import { calculateProgress } from "@/lib/utils";
import { MessageSquare, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"projects" | "messages" | "updates">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [updateContent, setUpdateContent] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    initializeStorage();
    const allProjects = getProjects();
    const allPledges = getPledges();
    setProjects(allProjects);
    setPledges(allPledges);
    if (allProjects.length > 0) setSelectedProjectId(allProjects[0].id);
  }, []);

  const handleAddUpdate = () => {
    if (!selectedProjectId || !updateContent.trim()) return;
    const newUpdate = addUpdate(selectedProjectId, updateContent);
    if (newUpdate) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === selectedProjectId ? { ...project, updates: [...project.updates, newUpdate] } : project
        )
      );
      setUpdateContent("");
    }
  };

  const getAllMessages = () =>
    projects
      .flatMap((project) =>
        project.messages.map((msg) => ({
          ...msg,
          projectId: project.id,
          projectTitle: project.title,
        }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getAllUpdates = () =>
    projects
      .flatMap((project) =>
        project.updates.map((update) => ({
          ...update,
          projectId: project.id,
          projectTitle: project.title,
        }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
      <Navbar />
      <main className="flex-1 py-12 md:py-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full border-4 border-dashed border-primary-200/30 opacity-50"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full border-2 border-primary-300/20"></div>
          <div className="absolute top-1/3 left-1/3 w-16 h-16 rotate-45 border-2 border-primary-200/30"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-primary-200/30 rounded-lg rotate-12"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary-500 mb-10 md:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            لوحة التحكم
          </motion.h1>

          {/* Tabs */}
          <div className="flex items-center justify-center border-b border-primary-200 mb-8 md:mb-12 overflow-x-auto">
            {[
              { key: "projects", label: "مشاريعي", icon: null },
              { key: "messages", label: "الرسائل", icon: MessageSquare },
              { key: "updates", label: "التحديثات", icon: RefreshCw },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 font-semibold text-sm md:text-base ${
                  activeTab === key
                    ? "text-primary-500 border-b-2 border-primary-500"
                    : "text-gray-600 hover:text-primary-500"
                } transition-colors duration-200`}
                onClick={() => setActiveTab(key as "projects" | "messages" | "updates")}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </button>
            ))}
          </div>

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <motion.div variants={tabVariants} initial="hidden" animate="visible">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-primary-500 mb-4 sm:mb-0">المشاريع المقدمة</h2>
                <Button
                  asChild
                  className="bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
                >
                  <Link href="/submit">قدّم مشروع جديد</Link>
                </Button>
              </div>
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {projects.map((project) => {
                    const progress = calculateProgress(project.raised.cash, project.goal.cash);

                    return (
                      <motion.div
                        key={project.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100/50"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative h-40">
                          <Image
                            src={project.images[0] || "/placeholder.svg?height=400&width=600"}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4 md:p-6">
                          <h3 className="text-lg md:text-xl font-bold text-primary-500 mb-2">{project.title}</h3>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>{formatCurrency(project.raised.cash)}</span>
                              <span>{formatCurrency(project.goal.cash)}</span>
                            </div>
                            <div className="w-full bg-primary-200 rounded-full h-2">
                              <div className="bg-primary-400 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm md:text-base">{project.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-600 text-sm md:text-base">لا يوجد مشاريع مقدمة حتى الآن.</p>
              )}
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <motion.div variants={tabVariants} initial="hidden" animate="visible">
              <h2 className="text-xl md:text-2xl font-bold text-primary-500 mb-6 md:mb-8">الرسائل</h2>
              {getAllMessages().length > 0 ? (
                <div className="space-y-4">
                  {getAllMessages().map((message) => (
                    <motion.div
                      key={message.id}
                      className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-primary-100/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="font-bold text-primary-500 mb-1">{message.projectTitle}</p>
                      <p className="text-gray-600 text-sm md:text-base">{message.content}</p>
                      <p className="text-gray-600 text-xs md:text-sm mt-2">{formatDate(message.date)}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 text-sm md:text-base">لا يوجد رسائل.</p>
              )}
            </motion.div>
          )}

          {/* Updates Tab */}
          {activeTab === "updates" && (
            <motion.div variants={tabVariants} initial="hidden" animate="visible">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-primary-500 mb-4 sm:mb-0">التحديثات</h2>
                {projects.length > 0 && (
                  <select
                    className="border border-primary-200 rounded-lg px-3 py-2 text-primary-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
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
                <div className="mb-6 md:mb-8">
                  <textarea
                    className="w-full border border-primary-200 rounded-lg px-4 py-3 text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                    rows={4}
                    placeholder="اكتب تحديثًا..."
                    value={updateContent}
                    onChange={(e) => setUpdateContent(e.target.value)}
                  />
                  <Button
                    onClick={handleAddUpdate}
                    className="mt-3 bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
                  >
                    إضافة تحديث
                  </Button>
                </div>
              )}
              {getAllUpdates().length > 0 ? (
                <div className="space-y-4">
                  {getAllUpdates().map((update) => (
                    <motion.div
                      key={update.id}
                      className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-primary-100/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="font-bold text-primary-500 mb-1">{update.projectTitle}</p>
                      <p className="text-gray-600 text-sm md:text-base">{update.content}</p>
                      <p className="text-gray-600 text-xs md:text-sm mt-2">{formatDate(update.date)}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 text-sm md:text-base">لا يوجد تحديثات.</p>
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}