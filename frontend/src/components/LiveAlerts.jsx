import { AlertTriangle } from 'lucide-react'

export default function LiveAlerts({ reports = [] }) {
  if (!reports.length) return null

  
  const latest = reports.slice(0, 3)

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="text-red-600" size={20} />
        <h2 className="font-semibold text-red-700">⚠️ Live Alerts</h2>
      </div>
      <ul className="text-sm text-red-800 space-y-1">
        {latest.map(r => (
          <li key={r.id}>
            <span className="font-medium">{r.event_type}</span> – {r.description || 'No description'} ({r.location_name || 'Unknown'})
          </li>
        ))}
      </ul>
    </div>
  )
}
