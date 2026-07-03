import { NextResponse } from "next/server"
import { hashPassword, setSession } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const existing = await query("SELECT id FROM dashboard_users WHERE email = $1", [email])
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const result = await query(
      "INSERT INTO dashboard_users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role",
      [name, email, passwordHash]
    )

    const user = result.rows[0]
    await setSession(user)

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
