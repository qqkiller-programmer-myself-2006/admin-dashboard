"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "Jan", revenue: 2400, visitors: 1400 },
  { name: "Feb", revenue: 1398, visitors: 2210 },
  { name: "Mar", revenue: 9800, visitors: 2290 },
  { name: "Apr", revenue: 3908, visitors: 2000 },
  { name: "May", revenue: 4800, visitors: 2181 },
  { name: "Jun", revenue: 3800, visitors: 2500 },
  { name: "Jul", revenue: 4300, visitors: 2100 },
]

export function RevenueChart() {
  return (
    <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#revenueGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
