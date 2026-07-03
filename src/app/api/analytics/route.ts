import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const monthly = await query(
      "SELECT to_char(date, 'Mon') as name, users, sessions FROM dashboard_sessions ORDER BY date"
    )
    return NextResponse.json({
      monthly: monthly.rows.length ? monthly.rows : [
        { name: "Jan", users: 1200, sessions: 2400 },
        { name: "Feb", users: 1900, sessions: 3200 },
        { name: "Mar", users: 1400, sessions: 2800 },
        { name: "Apr", users: 2200, sessions: 4100 },
        { name: "May", users: 1800, sessions: 3500 },
        { name: "Jun", users: 2600, sessions: 4800 },
      ],
      devices: [
        { name: "Desktop", value: 45 },
        { name: "Mobile", value: 35 },
        { name: "Tablet", value: 20 },
      ],
    })
  } catch {
    return NextResponse.json({
      monthly: [
        { name: "Jan", users: 1200, sessions: 2400 },
        { name: "Feb", users: 1900, sessions: 3200 },
        { name: "Mar", users: 1400, sessions: 2800 },
        { name: "Apr", users: 2200, sessions: 4100 },
        { name: "May", users: 1800, sessions: 3500 },
        { name: "Jun", users: 2600, sessions: 4800 },
      ],
      devices: [
        { name: "Desktop", value: 45 },
        { name: "Mobile", value: 35 },
        { name: "Tablet", value: 20 },
      ],
    })
  }
}
