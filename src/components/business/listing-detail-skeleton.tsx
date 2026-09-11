import { Skeleton } from '@/components/ui/skeleton'

export function ListingDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/60 via-white to-amber-50/50 pb-28 md:pb-12">
      {/* Top Header Skeleton */}
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-3 sm:px-4">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-5 w-44 rounded-md" />
          <div className="ml-auto">
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 lg:px-6 space-y-6">
        {/* Cover + Logo + Header info card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
          {/* Cover Skeleton (16:9 aspect ratio) */}
          <div className="relative aspect-[16/9] w-full bg-slate-100">
            <Skeleton className="h-full w-full rounded-none" />
            {/* Desktop title overlay preview */}
            <div className="hidden md:flex absolute bottom-0 left-0 w-full p-6 items-end gap-5 bg-gradient-to-t from-black/60 to-transparent">
              <Skeleton className="h-28 w-28 shrink-0 rounded-2xl border-4 border-white/20 bg-white" />
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-8 w-3/4 bg-white/60" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-full bg-white/50" />
                  <Skeleton className="h-6 w-20 rounded-full bg-white/50" />
                  <Skeleton className="h-6 w-28 rounded-full bg-white/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Profile bar */}
          <div className="p-4 md:hidden space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="p-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50/50">
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
        </div>

        {/* Content Layout Grid (Main + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About / Description Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-xs">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            {/* Services / Products Catalog Skeleton */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-xs">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3.5 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Preview Skeleton */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-xs">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-xs">
              <Skeleton className="h-6 w-44" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-slate-50 text-xs">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Location & Map Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-xs">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-36 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>

            {/* Owner & Contact Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-xs">
              <Skeleton className="h-5 w-28" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            </div>

            {/* Similar Businesses Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-xs">
              <Skeleton className="h-5 w-36" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3.5 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
