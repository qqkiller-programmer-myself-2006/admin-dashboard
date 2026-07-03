import { ChartSkeleton } from "@/components/skeleton"

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-7 w-24 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-44 bg-slate-200 rounded animate-pulse mt-1" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><ChartSkeleton /></div>
        <ChartSkeleton />
      </div>
    </div>
  )
}
