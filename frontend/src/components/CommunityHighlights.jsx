import { useEffect, useMemo, useRef, useState } from "react";

export default function CommunityHighlights({ reports = [] }) {
  // Build a pool of highlights from reports + mock entries
  const mockPool = useMemo(() => [
    { id: "m1", event_type: "cyclone", location_name: "Mumbai", description: "High winds and heavy rain expected tonight" },
    { id: "m2", event_type: "tsunami", location_name: "Chennai", description: "Advisory issued after offshore seismic activity" },
    { id: "m3", event_type: "high_wave", location_name: "Kochi", description: "Unusually high waves reported near harbor" },
    { id: "m4", event_type: "rip_current", location_name: "Goa", description: "Swimmers cautioned due to strong rip currents" },
    { id: "m5", event_type: "oil_spill", location_name: "Kakinada", description: "Cleanup crews deployed to contain minor spill" },
  ], []);

  const seedFromReports = useMemo(() => (reports || []).slice(0, 5).map(r => ({
    id: `r-${r.id}`,
    event_type: r.event_type || r.hazard_type || "hazard",
    location_name: r.location_name || "Unknown",
    description: r.description || r.text || "No details provided",
  })), [reports]);

  const pool = useMemo(() => {
    const combined = [...seedFromReports, ...mockPool];
    // Deduplicate by (event_type+location+desc) for variety
    const seen = new Set();
    return combined.filter(h => {
      const key = `${h.event_type}|${h.location_name}|${h.description}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [seedFromReports, mockPool]);

  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Loop through highlights every 3 seconds
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % Math.max(pool.length, 1));
    }, 3000);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [pool.length]);

  if (!pool.length) return null;

  const visible = [0,1,2].map(i => pool[(index + i) % pool.length]);

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">🌍 Community Highlights</h2>
      <div className="space-y-2">
        {visible.map((h) => (
          <div key={`${h.id}-${h.event_type}-${h.location_name}`} className="p-2 border rounded-lg bg-gray-50">
            <p className="text-sm"><span className="font-semibold">{h.event_type}</span> reported in <span>{h.location_name}</span></p>
            <p className="text-xs text-gray-600">{h.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
