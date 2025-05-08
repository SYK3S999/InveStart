'use client'

import { Skeleton } from "@/components/ui/skelton"

export default function FournisseurDashboardLoading() {
  return (
    <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
      {/* Navbar placeholder */}
      <div className="h-16 md:h-20 border-b border-primary-100/20 bg-white/80 backdrop-blur-md"></div>

      <main className="flex-1 py-12 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          {/* Title skeleton */}
          <div className="flex justify-center mb-10 md:mb-12">
            <Skeleton className="h-10 w-3/4 md:w-1/2 rounded-lg" />
          </div>

          {/* Dashboard cards skeleton */}
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 border border-primary-100">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer placeholder */}
      <div className="h-64 md:h-80 bg-gradient-to-t from-primary-50/50 via-white to-cream-50 border-t border-primary-100/20"></div>
    </div>
  )
}
