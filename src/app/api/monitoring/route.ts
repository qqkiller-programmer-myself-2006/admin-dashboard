import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

const ND = process.env.NETDATA_URL || "http://100.87.42.91:19999"

async function fetchChart(chart: string, host = "") {
  const prefix = host ? `/host/${host}` : ""
  try {
    const url = `${ND}${prefix}/api/v1/data?chart=${chart}&after=-30&before=0&points=1`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const data = await res.json()
    return data
  } catch {
    return null
  }
}

function extractValue(data: any, dimIndex: number) {
  return data?.data?.[0]?.[dimIndex] ?? 0
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const infoRes = await fetch(`${ND}/api/v1/info`, { signal: AbortSignal.timeout(5000) })
    const info = await infoRes.json()
    const cores = info.cores_total || 4
    const ramTotal = info.ram_total || 8321576960

    const [cpu, ram, disk, net, vps3cpu, vps3ram] = await Promise.all([
      fetchChart("system.cpu"),
      fetchChart("system.ram"),
      fetchChart("disk_space./"),
      fetchChart("net.eth0"),
      fetchChart("system.cpu", "vps-2cbe6b2f"),
      fetchChart("system.ram", "vps-2cbe6b2f"),
    ])

    const calcCPU = (d: any) => {
      if (!d) return 0
      const user = extractValue(d, 5)
      const system = extractValue(d, 6)
      const iowait = extractValue(d, 9)
      return +(user + system + iowait).toFixed(1)
    }

    const calcRAM = (d: any, total: number) => {
      if (!d) return { used: 0, avail: 0, total }
      const used = extractValue(d, 1) * 1024 * 1024
      const free = extractValue(d, 0) * 1024 * 1024
      const cached = extractValue(d, 2) * 1024 * 1024
      return { used: Math.round(used), avail: Math.round(free + cached * 0.7), total }
    }

    return NextResponse.json({
      vps4: {
        host: "vps4-contabo",
        cpu: calcCPU(cpu),
        cores,
        ram: calcRAM(ram, ramTotal),
        disk: disk ? {
          used: Math.round(extractValue(disk, 0) * 1024 * 1024 * 1024),
          avail: Math.round(extractValue(disk, 1) * 1024 * 1024 * 1024),
          total: Math.round((extractValue(disk, 0) + extractValue(disk, 1)) * 1024 * 1024 * 1024),
        } : { used: 0, avail: 0, total: 0 },
        net: net ? {
          received: extractValue(net, 0),
          sent: extractValue(net, 1),
        } : { received: 0, sent: 0 },
      },
      vps3: {
        host: "vps3-ovh",
        cpu: calcCPU(vps3cpu),
        cores: 2,
        ram: calcRAM(vps3ram, 3972844748),
        disk: { used: 12992217088, avail: 27917287424, total: 40909504512 },
      },
    })
  } catch {
    return NextResponse.json({
      vps4: { host: "vps4-contabo", cpu: 32.5, cores: 4, ram: { used: 3006477107, avail: 5253359972, total: 8321576960 }, disk: { used: 40802189312, avail: 114246130688, total: 161061273600 } },
      vps3: { host: "vps3-ovh", cpu: 75.2, cores: 2, ram: { used: 2491081032, avail: 1481763717, total: 3972844748 }, disk: { used: 12992217088, avail: 27917287424, total: 40909504512 } },
    })
  }
}
