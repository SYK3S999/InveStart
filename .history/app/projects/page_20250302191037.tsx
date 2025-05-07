"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";
import { getProjects, initializeStorage, type Project } from "@/lib/storage";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [fundingTypeFilter, setFundingTypeFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    initializeStorage();
    const allProjects = getProjects();
    setProjects(allProjects);
    setFilteredProjects(allProjects);
  }, []);

  useEffect(() => {
    let result = projects;

    if (searchTerm) {
      result = result.filter((project) => project.title.includes(searchTerm) || project.description.includes(searchTerm));
    }

    if (categoryFilter) {
      result = result.filter((project) => project.category === categoryFilter);
    }

    if (fundingTypeFilter === "نقدي") {
      result = result.filter((project) => project.goal.cash > 0);
    } else if (fundingTypeFilter === "عيني") {
      result = result.filter((project) => project.goal.inKind !== null);
    }

    setFilteredProjects(result);
  }, [searchTerm, categoryFilter, fundingTypeFilter, projects]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setFundingTypeFilter("");
  };

  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" } },
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
          <motion.div
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-500 mb-4">استكشف المشاريع</h1>
            <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">
              تصفح مجموعة متنوعة من المشاريع المبتكرة واكتشف فرص الاستثمار المناسبة لك
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 md:mb-12 border border-primary-100/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <div className="flex-1 relative w-full">
                <input
                  type="text"
                  placeholder="ابحث عن مشروع..."
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500" />
              </div>
              <Button
                variant="outline"
                className="md:w-auto w-full flex items-center gap-2 border-primary-500 text-primary-500 rounded-full px-6 py-3 hover:bg-primary-50 transition-all duration-300"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>الفلاتر</span>
              </Button>
              <Button
                className="md:w-auto w-full bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
                onClick={resetFilters}
              >
                إعادة ضبط
              </Button>
            </div>

            {showFilters && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-primary-200"
                variants={filterVariants}
                initial="hidden"
                animate="visible"
              >
                <div>
                  <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">الفئة</label>
                  <select
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">جميع الفئات</option>
                    <option value="صناعة">صناعة</option>
                    <option value="تكنولوجيا">تكنولوجيا</option>
                    <option value="زراعة">زراعة</option>
                    <option value="خدمات">خدمات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">نوع التمويل</label>
                  <select
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                    value={fundingTypeFilter}
                    onChange={(e) => setFundingTypeFilter(e.target.value)}
                  >
                    <option value="">جميع أنواع التمويل</option>
                    <option value="نقدي">نقدي</option>
                    <option value="عيني">عيني</option>
                  </select>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-12 bg-white rounded-xl shadow-lg border border-primary-100/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
                <Search className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-primary-500 mb-2">لا توجد مشاريع</h3>
              <p className="text-gray-600 text-sm md:text-base mb-4">لا توجد مشاريع تطابق معايير البحث</p>
              <Button
                variant="outline"
                className="border-primary-500 text-primary-500 rounded-full px-6 py-3 hover:bg-primary-50 transition-all duration-300"
                onClick={resetFilters}
              >
                إعادة ضبط الفلاتر
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}