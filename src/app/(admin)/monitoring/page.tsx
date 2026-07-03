"use client"

import { useState, useEffect } from "react"
import { Server, Cpu, HardDrive, Activity, Wifi } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { ChartSkeleton } from "@/components/skeleton"

const vpsInfo = {
  vps4: { name: "VPS 4 (Contabo)", ip: "161.97.83.198", tailscale: "100.87.42.91", ram: 7.8, disk: 145 },
  vps3: { name: "VPS 3 (OVH)", ip: "51.79.251.202", tailscale: "100.108.106.92", ram: 3.7, disk: 38 },
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B"
  const gb = bytes / (1024 * 1024 * 1024)
  return gb.toFixed(1) + " GB"
}

function VpsCard({ id, data, loading }: { id: string; data: any; loading: boolean }) {
  const info = vpsInfo[id as keyof typeof vpsInfo]
  if (!info) return null
  if (loading) return <ChartSkeleton />

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center gap-3">
        <Server className="size-5 text-emerald-400" />
        <div>
          <h3 className="font-semibold text-sm">{info.name}</h3>
          <p className="text-xs text-slate-400">{info.ip}</p>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">CPU</span>
              <span className="text-xs font-medium">{data?.cpu ?? "?"}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(data?.cpu ?? 0, 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Cores</span>
              <span className="text-xs font-medium">{data?.cores ?? "?"}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(data?.cores ?? 0) * 20}%` }} />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">RAM</span>
            <span className="text-xs font-medium">{formatBytes(data?.ram?.used)} / {info.ram.toFixed(1)} GB</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((data?.ram?.used / (info.ram * 1024 * 1024 * 1024)) * 100, 100)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Disk</span>
            <span className="text-xs font-medium">{formatBytes(data?.disk?.used)} / {info.disk} GB</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((data?.disk?.used / (info.disk * 1024 * 1024 * 1024)) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Wifi className="size-3" />
            <span>Tailscale: {info.tailscale}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MonitoringPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchData = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/monitoring")
      if (!res.ok) throw new Error("Failed to fetch")
      setData(await res.json())
    } catch {
      setError("Failed to load monitoring data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 15000); return () => clearInterval(t) }, [])

  if (error) {
    return <div className="p-4 bg-red-50 rounded-lg text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Monitoring</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time VPS cluster stats (auto-refresh 15s)</p>
        </div>
        <button onClick={fetchData} className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
          Refresh Now
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <VpsCard id="vps4" data={data?.vps4} loading={loading} />
        <VpsCard id="vps3" data={data?.vps3} loading={loading} />
      </div>
    </div>
  )
}
