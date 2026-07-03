import { StatCardSkeleton, ChartSkeleton } from "@/components/skeleton"

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-7 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-slate-200 rounded animate-pulse mt-1" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  )
}
