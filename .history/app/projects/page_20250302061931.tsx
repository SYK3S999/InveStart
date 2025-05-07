"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { getProjects, initializeStorage, type Project } from "@/lib/storage"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [fundingTypeFilter, setFundingTypeFilter] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Initialize sessionStorage with default data
    initializeStorage()

    // Get projects from sessionStorage
    const allProjects = getProjects()
    setProjects(allProjects)
    setFilteredProjects(allProjects)
  }, [])

  useEffect(() => {
    let result = projects

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (project) => project.title.includes(searchTerm) || project.description.includes(searchTerm),
      )
    }

    // Apply category filter
    if (categoryFilter) {
      result = result.filter((project) => project.category === categoryFilter)
    }

    // Apply funding type filter
    if (fundingTypeFilter === "نقدي") {
      result = result.filter((project) => project.goal.cash > 0)
    } else if (fundingTypeFilter === "عيني") {
      result = result.filter((project) => project.goal.inKind !== null)
    }

    setFilteredProjects(result)
  }, [searchTerm, categoryFilter, fundingTypeFilter, projects])

  const resetFilters = () => {
    setSearchTerm("")
    setCategoryFilter("")
    setFundingTypeFilter("")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-8 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">استكشف المشاريع</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              تصفح مجموعة متنوعة من المشاريع المبتكرة واكتشف فرص الاستثمار المناسبة لك
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              {/* Search */}
              <div className="flex-1 relative w-full">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث عن مشروع..."
                  className="w-full pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                className="md:w-auto w-full flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>الفلاتر</span>
              </Button>

              <Button variant="default" className="md:w-auto w-full" onClick={resetFilters}>
                إعادة ضبط
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">الفئة</label>
                  <select
                    className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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

                {/* Funding Type Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">نوع التمويل</label>
                  <select
                    className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={fundingTypeFilter}
                    onChange={(e) => setFundingTypeFilter(e.target.value)}
                  >
                    <option value="">جميع أنواع التمويل</option>
                    <option value="نقدي">نقدي</option>
                    <option value="عيني">عيني</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">لا توجد مشاريع</h3>
              <p className="text-muted-foreground">لا توجد مشاريع تطابق معايير البحث</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                إعادة ضبط الفلاتر
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

