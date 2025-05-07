"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { getProjects, type Project } from "@/lib/storage"
import { Button } from "@/components/ui/button"

export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Get projects from sessionStorage
    const allProjects = getProjects()
    setProjects(allProjects)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === Math.max(0, projects.length - 3) ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.max(0, projects.length - 3) : prevIndex - 1))
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${currentIndex * 33.33}%)` }}
        >
          {projects.map((project) => (
            <div key={project.id} className="w-full md:w-1/3 flex-shrink-0 p-2">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {projects.length > 3 && (
        <>
          <Button
            onClick={prevSlide}
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors z-10"
            aria-label="السابق"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <Button
            onClick={nextSlide}
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors z-10"
            aria-label="التالي"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  )
}

