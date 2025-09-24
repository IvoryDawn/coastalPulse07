export default function QuickStats({ reports = [] }) {
  const stats = {
    total: reports.length,
    floods: reports.filter(r => r.event_type === 'Flood').length,
    tsunami: reports.filter(r => r.event_type === 'Tsunami').length,
    waves: reports.filter(r => r.event_type === 'High Waves').length
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">🌊 Quick Stats</h2>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-blue-50 rounded-xl">
          <p className="text-xl font-bold">{stats.total}</p>
          <p className="text-xs">Reports</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-xl">
          <p className="text-xl font-bold">{stats.floods}</p>
          <p className="text-xs">Floods</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-xl">
          <p className="text-xl font-bold">{stats.tsunami}</p>
          <p className="text-xs">Tsunami</p>
        </div>
      </div>
    </div>
  )
}
