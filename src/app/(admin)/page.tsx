"use client"

import { useState, useEffect } from "react"
import { DollarSign, Users, ShoppingCart, TrendingUp, Server, Cpu, HardDrive, Activity } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { RevenueChart } from "@/components/revenue-chart"
import { VisitorsChart } from "@/components/visitors-chart"
import { StatCardSkeleton, ChartSkeleton } from "@/components/skeleton"

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [vps, setVps] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, netdataRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/netdata"),
        ])
        if (statsRes.ok) setStats(await statsRes.json())
        if (netdataRes.ok) setVps(await netdataRes.json())
      } catch (e) {
        console.error("Failed to fetch dashboard data", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-slate-200 rounded animate-pulse mt-1" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton /><ChartSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your cluster metrics</p>
      </div>

      {vps && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="VPS Host" value={vps.host} change={`${vps.cpu.cores} cores`} positive icon={<Server className="size-5" />} />
          <StatCard title="CPU Usage" value={`${vps.cpu.usage?.toFixed(1) || 0}%`} change="Real-time" positive={vps.cpu.usage < 80} icon={<Cpu className="size-5" />} />
          <StatCard title="Memory" value={`${((vps.memory?.used || 0) / 1024 / 1024 / 1024).toFixed(1)}GB`} change={`of ${((vps.memory?.total || 0) / 1024 / 1024 / 1024).toFixed(1)}GB`} positive icon={<Activity className="size-5" />} />
          <StatCard title="Disk" value={`${((vps.disk?.used || 0) / 1024 / 1024 / 1024).toFixed(1)}GB`} change={`of ${((vps.disk?.total || 0) / 1024 / 1024 / 1024).toFixed(1)}GB`} positive icon={<HardDrive className="size-5" />} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={`$${(stats?.revenue || 45231).toLocaleString()}`} change="+20.1%" positive icon={<DollarSign className="size-5" />} />
        <StatCard title="Active Users" value={(stats?.activeUsers || 2350).toLocaleString()} change="+12.5%" positive icon={<Users className="size-5" />} />
        <StatCard title="Orders" value={(stats?.orders || 1423).toLocaleString()} change="+8.2%" positive icon={<ShoppingCart className="size-5" />} />
        <StatCard title="Growth" value={`+${stats?.growth || 28.4}%`} change="+3.1%" positive icon={<TrendingUp className="size-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <VisitorsChart />
      </div>
    </div>
  )
}
