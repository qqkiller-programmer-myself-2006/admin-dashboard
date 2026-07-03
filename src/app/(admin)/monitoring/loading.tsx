import { ChartSkeleton } from "@/components/skeleton"

export default function MonitoringLoading() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-40 bg-slate-200 rounded animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton /><ChartSkeleton />
      </div>
    </div>
  )
}
