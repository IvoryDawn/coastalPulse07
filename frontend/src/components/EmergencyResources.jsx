export default function EmergencyResources() {
  const resources = [
    { name: "National Disaster Helpline", contact: "1078" },
    { name: "Coastal Guard", contact: "1554" },
    { name: "Disaster Management Authority", contact: "1800-180-6111" }
  ]

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">📞 Emergency Resources</h2>
      <ul className="text-sm space-y-1">
        {resources.map((r, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{r.name}</span>
            <span className="font-medium">{r.contact}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
