import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getMetrics } from '../api/reports'

export default function DashboardPlaceholder() {
  const [data, setData] = useState(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return
    getMetrics(token).then(setData).catch(() => {})
  }, [token])

  return (
    <div className="card">
      <h2 className="font-semibold mb-2">Live Dashboard</h2>
      {!data ? <p>Metrics loading or placeholder (login as Analyst to view)</p> : (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-medium">Reports by Status</h3>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byStatus}>
                  <XAxis dataKey="status" /><YAxis allowDecimals={false}/><Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <h3 className="font-medium">Reports by Event</h3>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byEvent}>
                  <XAxis dataKey="event_type" /><YAxis allowDecimals={false}/><Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
