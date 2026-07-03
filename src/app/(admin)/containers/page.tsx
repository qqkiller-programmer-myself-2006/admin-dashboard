"use client"

import { useState, useEffect } from "react"
import { Play, Square, RotateCcw, Server, Box, ChevronDown } from "lucide-react"
import { TableSkeleton } from "@/components/skeleton"
import { cn } from "@/lib/utils"

interface Container {
  id: string
  name: string
  image: string
  status: string
  uptime: string
  ports: string
  running: boolean
}

const vpsOptions = ["vps4-contabo", "vps3-ovh", "vps1-free", "vps2-free"]

export default function ContainersPage() {
  const [containers, setContainers] = useState<Container[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchContainers = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/containers")
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setContainers(data.containers || [])
    } catch {
      setError("Failed to load containers (Docker socket may not be available)")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContainers(); const t = setInterval(fetchContainers, 10000); return () => clearInterval(t) }, [])

  const handleAction = async (name: string, action: "start" | "stop" | "restart") => {
    setActionLoading(`${action}-${name}`)
    try {
      await fetch("/api/containers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, name }),
      })
      await fetchContainers()
    } catch {} finally {
      setActionLoading(null)
    }
  }

  if (loading) return <TableSkeleton rows={8} />
  if (error && !containers.length) return <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">{error}</div>

  const running = containers.filter(c => c.running)
  const stopped = containers.filter(c => !c.running)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Containers</h1>
          <p className="text-sm text-slate-500 mt-1">
            {running.length} running, {stopped.length} stopped (auto-refresh 10s)
          </p>
        </div>
        <button onClick={fetchContainers} className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Server className="size-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">vps4-contabo (native docker)</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase w-10"></th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Container</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Image</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase hidden lg:table-cell">Ports</th>
              <th className="w-28 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {containers.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <Box className={cn("size-4", c.running ? "text-emerald-500" : "text-slate-300")} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-slate-900">{c.name}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-slate-500 font-mono">{c.image.split("/").pop()}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full", c.running ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                    <span className={cn("size-1.5 rounded-full", c.running ? "bg-emerald-500" : "bg-slate-400")} />
                    {c.running ? "Up" : "Stopped"}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs text-slate-500 font-mono">{c.ports || "-"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {!c.running && (
                      <button onClick={() => handleAction(c.name, "start")} disabled={actionLoading === `start-${c.name}`} className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded transition-colors disabled:opacity-30" title="Start">
                        <Play className="size-3.5" />
                      </button>
                    )}
                    {c.running && (
                      <button onClick={() => handleAction(c.name, "stop")} disabled={actionLoading === `stop-${c.name}`} className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors disabled:opacity-30" title="Stop">
                        <Square className="size-3.5" />
                      </button>
                    )}
                    <button onClick={() => handleAction(c.name, "restart")} disabled={actionLoading === `restart-${c.name}`} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded transition-colors disabled:opacity-30" title="Restart">
                      <RotateCcw className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!containers.length && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">No containers found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <details className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <summary className="px-6 py-4 flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
          <ChevronDown className="size-4 text-slate-400" />
          Show Container IDs
        </summary>
        <div className="px-6 pb-4">
          <pre className="text-xs text-slate-400 font-mono bg-slate-50 p-3 rounded-lg overflow-x-auto">
            {containers.map(c => `${c.id}  ${c.name}`).join("\n")}
          </pre>
        </div>
      </details>
    </div>
  )
}
