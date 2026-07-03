import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await query(
    "SELECT id, name, email, role, status, created_at FROM dashboard_users ORDER BY id"
  )
  return NextResponse.json({ users: result.rows })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role !== "Admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { name, email, password, role } = await request.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password required" }, { status: 400 })
    }

    const { hashPassword } = await import("@/lib/auth")
    const passwordHash = await hashPassword(password)

    const result = await query(
      "INSERT INTO dashboard_users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, status, created_at",
      [name, email, passwordHash, role || "Viewer"]
    )

    return NextResponse.json({ user: result.rows[0] }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
