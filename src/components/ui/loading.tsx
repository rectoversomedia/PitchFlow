// Loading components for better UX

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`${sizeClasses[size]} border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin`}
      />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Memuat...</p>
      </div>
    </div>
  )
}

// Skeleton loader for cards
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
      <div className="h-3 bg-slate-100 rounded w-full mb-2" />
      <div className="h-3 bg-slate-100 rounded w-2/3 mb-4" />
      <div className="flex gap-2">
        <div className="h-6 bg-slate-200 rounded w-16" />
        <div className="h-6 bg-slate-200 rounded w-20" />
      </div>
    </div>
  )
}

// Skeleton loader for table rows
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex gap-4 items-center">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-4 bg-slate-100 rounded w-1/5" />
            <div className="h-4 bg-slate-100 rounded w-1/6" />
            <div className="ml-auto h-6 bg-slate-200 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Skeleton loader for chart/analytics
export function SkeletonChart() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-6" />
      <div className="flex items-end gap-2 h-40">
        {[40, 60, 45, 80, 55, 70, 50].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-200 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-3 bg-slate-100 rounded w-8" />
        ))}
      </div>
    </div>
  )
}

// Skeleton loader for dashboard KPI cards
export function SkeletonKPICard() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 bg-slate-200 rounded w-20" />
        <div className="w-10 h-10 bg-slate-100 rounded-lg" />
      </div>
      <div className="h-8 bg-slate-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-1/3" />
    </div>
  )
}

// Full page skeleton
export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonKPICard />
        <SkeletonKPICard />
        <SkeletonKPICard />
        <SkeletonKPICard />
      </div>

      {/* Chart */}
      <SkeletonChart />

      {/* Table */}
      <SkeletonTable rows={5} />
    </div>
  )
}
