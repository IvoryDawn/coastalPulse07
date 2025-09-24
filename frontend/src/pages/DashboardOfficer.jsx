import { useEffect, useState, useCallback } from "react";
import MapPlaceholder from "../components/MapPlaceholder";
import TrendingHazards from "../components/TrendingHazards";
import OfficerVerification from "../components/OfficerVerification";
import { listReports, verifyReport } from "../api/reports";
import { API_BASE } from "../api/client";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Shield,
  Zap,
  Cloud,
} from "lucide-react";

export default function DashboardOfficer() {
  const [reports, setReports] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [lightbox, setLightbox] = useState(null); // 👈 added for lightbox
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingValidation: 0,
    activeIncidents: 0,
    verifiedReports: 0,
    urgentReports: 0
  });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    const t = localStorage.getItem("token");
    setUser(u);
    setToken(t);
  }, []);

  const fetchReports = useCallback(() => {
    if (!token) return;
    // Ensure role=officer fetches /reports
    listReports({ role: "officer" }, token)
      .then((data) => {
        const normalized = (data || []).map((r) => ({
          ...r,
          lat: r.latitude ?? r.lat ?? null,
          lng: r.longitude ?? r.lng ?? null,
          is_verified: r.status === "verified" ? "True" : "False",
        }));
        setReports(normalized);
      })
      .catch((e) => console.error("Error loading reports:", e));
  }, [token]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    const totalReports = reports.length;
    const pendingValidation = reports.filter(r => r.is_verified === 'False').length;
    const activeIncidents = reports.filter(r => r.hazard_type !== 'safe' && r.is_verified === 'True').length;
    const verifiedReports = reports.filter(r => r.is_verified === 'True').length;
    const urgentReports = reports.filter(r => r.hazard_type === 'cyclone' || r.hazard_type === 'tsunami').length;

    setStats({
      totalReports,
      pendingValidation,
      activeIncidents,
      verifiedReports,
      urgentReports
    });
  }, [reports]);

  async function setStatus(id, status) {
    if (!token) return;
    try {
      await verifyReport(id, status, token);
    setReports((r) =>
      r.map((x) => 
        String(x.id) === String(id) 
            ? { ...x, is_verified: status === 'verified' ? 'True' : 'False', status } 
          : x
      )
    );
    } catch (e) {
      console.error('Failed to update status', e);
    }
  }

  async function fetchWeather(id, lat, lng) {
    const mockWeather = {
      temp: (28 + Math.random() * 5).toFixed(1),
      condition: ["Clear ☀️", "Cloudy ☁️", "Storm ⛈️", "Windy 🌬️"][Math.floor(Math.random()*4)],
      wind: (5 + Math.random() * 20).toFixed(1)
    };
    setWeatherData(prev => ({ ...prev, [id]: mockWeather }));
  }

  const getSeverityColor = (hazardType) => {
    switch (hazardType) {
      case "cyclone":
      case "tsunami":
        return "text-red-600 bg-red-100";
      case "high_wave":
      case "oil_spill":
        return "text-orange-600 bg-orange-100";
      case "rip_current":
      case "erosion":
        return "text-yellow-600 bg-yellow-100";
      case "safe":
        return "text-green-600 bg-green-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  const getSeverityIcon = (hazardType) => {
    switch (hazardType) {
      case "cyclone":
      case "tsunami":
        return "🚨";
      case "high_wave":
      case "oil_spill":
        return "⚠️";
      case "rip_current":
      case "erosion":
        return "⚡";
      case "safe":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  // Media helpers
  const isImage = (path) => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(path || "");
  const isVideo = (path) => /\.(mp4|webm|ogg|mov|m4v)$/i.test(path || "");
  const makeMediaUrl = (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('/uploads')) return `${API_BASE}${path}`;
    return `${API_BASE}/uploads/${path}`;
  };

  return (
    <div className="space-y-6">
      {/* Officer Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-2xl">
        <h1 className="text-2xl font-bold mb-2">Officer Command Center</h1>
        <p className="text-red-100">Monitor and manage disaster response operations</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Shield },
              { id: 'verification', label: 'Report Verification', icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'verification' ? (
        <OfficerVerification />
      ) : (
        <div className="space-y-6">
          {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalReports}</div>
          <div className="text-sm text-gray-600">Total Reports</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingValidation}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.activeIncidents}</div>
          <div className="text-sm text-gray-600">Active Incidents</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.verifiedReports}</div>
          <div className="text-sm text-gray-600">Verified</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.urgentReports}</div>
          <div className="text-sm text-gray-600">Urgent</div>
        </div>
      </div>

      {/* Map */}
      <MapPlaceholder reports={reports} showHeatmap={true} showMarkers={true} />

      {/* Reports for Review */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Reports for Review
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Hazard</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Media</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <>
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{r.id}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(r.hazard_type)}`}>
                        {getSeverityIcon(r.hazard_type)} {r.hazard_type?.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 max-w-[280px]">
                      <div className="text-xs text-gray-700 line-clamp-3">{r.description || r.text}</div>
                    </td>
                    <td className="p-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs">{r.location_name || (r.lat && r.lng ? `${r.lat}, ${r.lng}` : "-")}</span>
                    </td>
                    <td className="p-3">
                      {r.media_path ? (
                        (() => {
                          const src = makeMediaUrl(r.media_path);
                          if (!src) return null;
                          if (isImage(r.media_path)) {
                            return (
                              <img
                                src={src}
                                alt="attachment"
                                className="w-16 h-16 object-cover rounded cursor-zoom-in"
                                onClick={() => setLightbox({ type: "image", src })}
                              />
                            );
                          }
                          if (isVideo(r.media_path)) {
                            return (
                              <div className="w-24">
                                <video
                                  className="w-24 h-16 rounded cursor-pointer"
                                  muted
                                  onClick={() => setLightbox({ type: "video", src })}
                                >
                                  <source src={src} />
                                </video>
                              </div>
                            );
                          }
                          return <span className="text-xs text-gray-500">Unsupported</span>;
                        })()
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          r.is_verified === "True"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {r.is_verified === "True" ? "✓ Verified" : "⏳ Pending"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button
                          className="btn bg-sky-600 text-white hover:bg-sky-700 text-xs px-2 py-1"
                          onClick={() => fetchWeather(r.id, r.lat, r.lng)}
                        >
                          <Cloud className="w-3 h-3" /> Check Weather
                        </button>
                        <button
                          className="btn bg-green-600 text-white hover:bg-green-700 text-xs px-2 py-1"
                          onClick={() => setStatus(r.id, "verified")}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </button>
                        <button
                          className="btn bg-red-600 text-white hover:bg-red-700 text-xs px-2 py-1"
                          onClick={() => setStatus(r.id, "rejected")}
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {weatherData[r.id] && (
                    <tr className="bg-blue-50">
                      <td colSpan="7" className="p-3 text-sm text-blue-800">
                        🌡 Temp: {weatherData[r.id].temp}°C | {weatherData[r.id].condition} | 💨 Wind: {weatherData[r.id].wind} km/h
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escalation Queue */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6" />
          Escalation Queue
        </h2>
        <div className="space-y-3">
          {reports
            .filter(r => r.hazard_type === "cyclone" || r.hazard_type === "tsunami")
            .slice(0, 5)
            .map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-medium">{r.hazard_type?.replace("_", " ").toUpperCase()}</div>
                    <div className="text-sm text-gray-600">{r.text?.substring(0, 80)}...</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600">URGENT</div>
                  <div className="text-xs text-gray-500">{new Date(r.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Lightbox Component (kept inside the same parent div) */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.type === "video" ? (
              <video
                className="max-w-full max-h-[85vh] rounded"
                controls
                autoPlay
              >
                <source src={lightbox.src} />
              </video>
            ) : (
              <img
                src={lightbox.src}
                alt="Lightbox content"
                className="max-w-full max-h-[85vh] rounded"
              />
            )}
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
}
