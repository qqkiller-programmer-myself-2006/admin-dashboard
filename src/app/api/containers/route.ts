import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { execSync } from "child_process"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const output = execSync("docker ps --format '{{\"id\":\"{{.ID}}\",\"name\":\"{{.Names}}\",\"image\":\"{{.Image}}\",\"status\":\"{{.Status}}\",\"ports\":\"{{.Ports}}\"}}' --no-trunc 2>/dev/null || echo '[]'", {
      timeout: 5000,
      shell: "/bin/sh",
    }).toString().trim()

    let containers: any[] = []
    const lines = output.split("\n").filter(Boolean)
    for (const line of lines) {
      try {
        const c = JSON.parse(line)
        const statusParts = c.status.split(" ")
        const isRunning = statusParts[0] === "Up"
        const uptimeStr = isRunning ? statusParts.slice(1).join(" ") : c.status
        containers.push({
          id: c.id,
          name: c.name,
          image: c.image,
          status: c.status,
          uptime: uptimeStr,
          ports: c.ports || "-",
          running: isRunning,
        })
      } catch {}
    }
    return NextResponse.json({ containers })
  } catch (e) {
    return NextResponse.json({ containers: [], error: String(e) })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role !== "Admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { action, name } = await request.json()
    if (!["start", "stop", "restart"].includes(action) || !name) {
      return NextResponse.json({ error: "Invalid action or container name" }, { status: 400 })
    }
    execSync(`docker ${action} ${name}`, { timeout: 15000, shell: "/bin/sh" })
    return NextResponse.json({ success: true, action, name })
  } catch {
    return NextResponse.json({ error: "Failed to execute action" }, { status: 500 })
  }
}
