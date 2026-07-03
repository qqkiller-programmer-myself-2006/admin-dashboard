"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Server } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login"
      const body = isSignup ? { name, email, password } : { email, password }
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong")
        return
      }
      router.push("/")
      router.refresh()
    } catch {
      setError("Connection error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-xl bg-emerald-500 text-white mb-4">
            <Server className="size-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isSignup ? "Create your account" : "Sign in to your account"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="Your name" required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="admin@example.com" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required minLength={6}
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
          </button>
          <p className="text-center text-sm text-slate-500">
            {isSignup ? "Already have an account?" : "Don\u2019t have an account?"}{" "}
            <button
              type="button" onClick={() => { setIsSignup(!isSignup); setError("") }}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </form>
        <p className="text-center text-xs text-slate-400 mt-6">VPS Cluster Management v2.0</p>
      </div>
    </div>
  )
}
