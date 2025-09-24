export default function TrendingHazards({ reports = [] }) {
  if (!reports.length) return null

  
  const counts = reports.reduce((acc, r) => {
    acc[r.event_type] = (acc[r.event_type] || 0) + 1
    return acc
  }, {})


  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">🔥 Trending Hazards</h2>
      <ul className="text-sm space-y-1">
        {sorted.map(([type, count]) => (
          <li key={type} className="flex justify-between">
            <span>{type}</span>
            <span className="font-medium">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
