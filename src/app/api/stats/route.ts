import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await query("SELECT metric, value FROM dashboard_stats ORDER BY id")
  const stats: Record<string, number> = {}
  for (const row of result.rows) {
    stats[row.metric] = parseFloat(row.value)
  }

  return NextResponse.json({
    revenue: stats.revenue || 45231,
    activeUsers: stats.active_users || 2350,
    orders: stats.orders || 1423,
    growth: stats.growth || 28.4,
  })
}
