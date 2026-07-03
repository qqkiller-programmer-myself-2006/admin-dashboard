import { Skeleton } from "@/components/skeleton"

export default function SettingsLoading() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="h-7 w-24 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-44 bg-slate-200 rounded animate-pulse mt-1" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-5" />
            <div>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-3 w-44 mt-1" />
            </div>
          </div>
          {Array.from({ length: 2 }).map((_, j) => (
            <div key={j} className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="size-5 rounded-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
