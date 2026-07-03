"use client"

import { useState, useEffect } from "react"
import { Bell, Shield, Palette, Key, Save } from "lucide-react"
import { Skeleton } from "@/components/skeleton"

const defaultSections = [
  {
    id: "notifications", icon: Bell, title: "Notifications", description: "Configure email and push notifications",
    fields: [
      { label: "Email alerts", type: "toggle", key: "email_alerts", default: true },
      { label: "Push notifications", type: "toggle", key: "push_notifications", default: false },
      { label: "Weekly report", type: "toggle", key: "weekly_report", default: true },
    ],
  },
  {
    id: "security", icon: Shield, title: "Security", description: "Manage security preferences",
    fields: [
      { label: "Two-factor authentication", type: "toggle", key: "2fa", default: false },
      { label: "Session timeout (minutes)", type: "input", key: "session_timeout", default: "30" },
    ],
  },
  {
    id: "appearance", icon: Palette, title: "Appearance", description: "Customize the interface",
    fields: [
      { label: "Dark mode", type: "toggle", key: "dark_mode", default: false },
      { label: "Compact mode", type: "toggle", key: "compact_mode", default: false },
    ],
  },
  {
    id: "api", icon: Key, title: "API Keys", description: "Manage API access tokens",
    fields: [
      { label: "API Key", type: "text", key: "api_key", default: "sk-xxxxxxxxxxxxxxxx" },
    ],
  },
]

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string | boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("dashboard_settings")
    if (stored) {
      setValues(JSON.parse(stored))
    } else {
      const defs: Record<string, string | boolean> = {}
      defaultSections.forEach((s) => s.fields.forEach((f) => { defs[f.key] = f.default }))
      setValues(defs)
    }
    setLoading(false)
  }, [])

  const setVal = (key: string, val: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  const save = () => {
    localStorage.setItem("dashboard_settings", JSON.stringify(values))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="h-7 w-24 bg-slate-200 rounded animate-pulse" />
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <Skeleton className="h-5 w-28" />
            {[1,2].map(j => <div key={j} className="flex justify-between"><Skeleton className="h-4 w-32" /><Skeleton className="size-5 rounded-full" /></div>)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your preferences</p>
        </div>
      </div>

      {defaultSections.map((section) => {
        const Icon = section.icon
        return (
          <div key={section.id} className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
              <Icon className="size-5 text-emerald-500" />
              <div>
                <h3 className="font-semibold text-slate-900">{section.title}</h3>
                <p className="text-xs text-slate-500">{section.description}</p>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              {section.fields.map((field) => {
                const val = values[field.key] ?? field.default
                if (field.type === "toggle") {
                  return (
                    <div key={field.key} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{field.label}</span>
                      <button
                        onClick={() => setVal(field.key, !val)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${val ? "bg-emerald-500" : "bg-slate-300"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 size-4 bg-white rounded-full shadow transition-transform ${val ? "translate-x-5" : ""}`} />
                      </button>
                    </div>
                  )
                }
                return (
                  <div key={field.key}>
                    <label className="block text-sm text-slate-700 mb-1">{field.label}</label>
                    <input
                      type="text" value={val as string} onChange={(e) => setVal(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="flex justify-end gap-3 pb-8">
        <button
          onClick={save}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Save className="size-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
