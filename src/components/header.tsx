"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, LogOut } from "lucide-react"

export function Header() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.user) setUser(d.user) })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search className="size-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-medium">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700">{user?.name || "Admin"}</p>
            <p className="text-xs text-slate-400">{user?.email || "admin@example.com"}</p>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
