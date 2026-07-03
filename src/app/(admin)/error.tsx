"use client"

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <div className="size-16 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-xl font-bold text-slate-900">Dashboard Error</h2>
      <p className="text-sm text-slate-500">{error.message || "Failed to load dashboard data"}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
      >
        Retry
      </button>
    </div>
  )
}
