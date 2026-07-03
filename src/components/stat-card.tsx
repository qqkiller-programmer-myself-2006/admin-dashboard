"use client"

import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change: string
  positive: boolean
  icon: React.ReactNode
}

export function StatCard({ title, value, change, positive, icon }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="flex items-center gap-1 mt-1">
        <span
          className={cn(
            "text-sm font-medium",
            positive ? "text-emerald-600" : "text-red-500"
          )}
        >
          {change}
        </span>
        <span className="text-sm text-slate-400">vs last month</span>
      </div>
    </div>
  )
}
