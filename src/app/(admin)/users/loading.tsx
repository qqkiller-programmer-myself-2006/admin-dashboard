import { TableSkeleton } from "@/components/skeleton"

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-40 bg-slate-200 rounded animate-pulse mt-1" />
        </div>
        <div className="h-9 w-24 bg-slate-200 rounded-lg animate-pulse" />
      </div>
      <TableSkeleton rows={6} />
    </div>
  )
}
