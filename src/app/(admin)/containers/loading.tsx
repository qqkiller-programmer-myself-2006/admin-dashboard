import { TableSkeleton } from "@/components/skeleton"

export default function ContainersLoading() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-32 bg-slate-200 rounded animate-pulse" />
      <TableSkeleton rows={8} />
    </div>
  )
}
