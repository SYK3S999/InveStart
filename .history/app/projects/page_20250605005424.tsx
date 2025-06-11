"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";
import { getProjects, initializeStorage, type Project } from "@/lib/storage";
import { Search, Filter, ChevronDown, ChevronUp, Link, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Hardcoded RBAC logic for Fournisseur role
const useAuth = () => {
  // Simulated user data (replace with your auth logic)
  const user = { role: "fournisseur", id: "user123" }; // Hardcoded for demo
  return { isAuthenticated: !!user, role: user?.role || null };
};

export default function ProjectsPage() {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [wilayaFilter, setWilayaFilter] = useState<string>("");
  const [sectorFilter, setSectorFilter] = useState<string>("");
  const [equipmentFilter, setEquipmentFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const projectsPerPage = 6;

  // RBAC: Redirect if not Fournisseur
  useEffect(() => {
    if (!isAuthenticated || role !== "fournisseur") {
      router.push("/login");
    }
  }, [isAuthenticated, role, router]);

  useEffect(() => {
    initializeStorage();
    const allProjects = getProjects();
    setProjects(allProjects);
    setFilteredProjects(allProjects);
  }, []);

  useEffect(() => {
    let result = [...projects];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (project) =>
          project.title.includes(searchTerm) ||
          project.description.includes(searchTerm)
      );
    }

    // Apply Wilaya filter
    if (wilayaFilter) {
      result = result.filter((project) => project.wilaya === wilayaFilter);
    }

    // Apply sector filter
    if (sectorFilter) {
      result = result.filter((project) => project.sector === sectorFilter);
    }

    // Apply equipment type filter
    if (equipmentFilter) {
      result = result.filter((project) => project.equipmentType === equipmentFilter);
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => (b.updates[0]?.date || "").localeCompare(a.updates[0]?.date || ""));
        break;
      case "oldest":
        result.sort((a, b) => (a.updates[0]?.date || "").localeCompare(b.updates[0]?.date || ""));
        break;
      default:
        break;
    }

    setFilteredProjects(result);
  }, [searchTerm, wilayaFilter, sectorFilter, equipmentFilter, sortOption, projects]);

  const resetFilters = () => {
    setSearchTerm("");
    setWilayaFilter("");
    setSectorFilter("");
    setEquipmentFilter("");
    setSortOption("newest");
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" } },
  };

  const featuredProject = filteredProjects.length > 0 ? filteredProjects[0] : null;

  // Simulated Wilayas (Algerian provinces)
  const wilayas = [
    "",
    "الجزائر",
    "وهران",
    "قسنطينة",
    "عنابة",
    "باتنة",
    "سطيف",
    "سيدي بلعباس",
    "تلمسان",
  ];

  // Simulated sectors and equipment types
  const sectors = ["", "صناعة", "تكنولوجيا", "زراعة", "خدمات"];
  const equipmentTypes = ["", "عتاد", "مواد", "معدات تأجيرية"];

  if (!isAuthenticated || role !== "fournisseur") {
    return null; // Render nothing while redirecting
  }

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
              تصفح مشاريع مبتكرة وابحث عن فرص لتقديم دعم عيني أو تأجيري في الجزائر
            </p>
          </motion.div>

          {/* Featured Project Banner with Blockchain Indicator */}
          {featuredProject && (
            <motion.div
              className="bg-primary-50 rounded-xl shadow-lg p-6 md:p-8 mb-8 md:mb-12 border border-primary-100/50 flex flex-col md:flex-row items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full md:w-1/2 h-48 md:h-64">
                <Image
                  src={featuredProject.images[0] || "/placeholder.svg?height=400&width=600"}
                  alt={featuredProject.title}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  مؤمّن عبر البلوكشين
                </div>
              </div>
              <div className="w-full md:w-1/2 text-center md:text-right">
                <h2 className="text-xl md:text-2xl font-bold text-primary-500 mb-2">{featuredProject.title}</h2>
                <p className="text-gray-600 text-sm md:text-base mb-4">{featuredProject.description.substring(0, 100)}...</p>
                <Button
                  asChild
                  className="bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
                >
                  <Link href={`/projects/${featuredProject.id}`}>تقديم عرض عيني</Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Sector Quick Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {sectors.map((sector) => (
              <Button
                key={sector}
                variant={sectorFilter === sector ? "default" : "outline"}
                className={`rounded-full px-4 py-2 text-sm md:text-base ${
                  sectorFilter === sector
                    ? "bg-primary-500 text-white hover:bg-primary-600"
                    : "border-primary-500 text-primary-500 hover:bg-primary-50"
                } transition-all duration-300`}
                onClick={() => setSectorFilter(sector)}
              >
                {sector || "الكل"}
              </Button>
            ))}
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 md:mb-12 border border-primary-100/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
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
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-primary-200"
                variants={filterVariants}
                initial="hidden"
                animate="visible"
              >
                <div>
                  <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">الولاية</label>
                  <select
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                    value={wilayaFilter}
                    onChange={(e) => setWilayaFilter(e.target.value)}
                  >
                    {wilayas.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>{wilaya || "جميع الولايات"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">القطاع</label>
                  <select
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                  >
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>{sector || "جميع القطاعات"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">نوع العتاد</label>
                  <select
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                    value={equipmentFilter}
                    onChange={(e) => setEquipmentFilter(e.target.value)}
                  >
                    {equipmentTypes.map((type) => (
                      <option key={type} value={type}>{type || "جميع الأنواع"}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Project Count */}
          <motion.div
            className="flex justify-between items-center mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-gray-600 text-sm md:text-base">
              تم العثور على <span className="font-bold text-primary-500">{filteredProjects.length}</span> مشروع
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-primary-500 text-primary-500 rounded-full px-4 py-2 hover:bg-primary-50 transition-all duration-300"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                السابق
              </Button>
              <Button
                variant="outline"
                className="border-primary-500 text-primary-500 rounded-full px-4 py-2 hover:bg-primary-50 transition-all duration-300"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                التالي
              </Button>
            </div>
          </motion.div>

          {/* Projects Grid */}
          {paginatedProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {paginatedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <ProjectCard project={project} />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Lock className="h-4 w-4" />
                      مشروع مؤمّن
                    </div>
                    <Button
                      asChild
                      className="mt-4 w-full bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
                    >
                      <Link href={`/projects/${project.id}`}>تقديم عرض عيني</Link>
                    </Button>
                  </div>
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
              <p className="text-gray-600 text-sm md:text-base mb-4">ماكاش مشاريع تطابق معايير البحث</p>
              <Button
                variant="outline"
                className="border-primary-500 text-primary-500 rounded-full px-6 py-3 hover:bg-primary-50 transition-all duration-300"
                onClick={resetFilters}
              >
                إعادة ضبط الفلاتر
              </Button>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="flex justify-center items-center gap-2 mt-8 md:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  className={`rounded-full px-4 py-2 ${
                    currentPage === page
                      ? "bg-primary-500 text-white hover:bg-primary-600"
                      : "border-primary-500 text-primary-500 hover:bg-primary-50"
                  } transition-all duration-300`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}