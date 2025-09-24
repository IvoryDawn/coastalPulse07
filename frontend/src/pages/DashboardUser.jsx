import { useEffect, useState, useCallback } from "react";
import MapPlaceholder from "../components/MapPlaceholder";
import LiveAlerts from "../components/LiveAlerts";
import CommunityHighlights from "../components/CommunityHighlights";
import { Shield, MapPin, Clock, Users, AlertTriangle, Phone } from "lucide-react";
import { listReports } from "../api/reports";

export default function DashboardUser() {
  const [reports, setReports] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [stats, setStats] = useState({
    totalReports: 0,
    activeAlerts: 0,
    nearbyIncidents: 0,
    safetyLevel: "safe",
    personalReports: 0,
    communityPosts: 0,
  });

  
  const fetchUserReports = useCallback(() => {
    if (user?.id && token) {
      listReports(user, token)
        .then((data) => setUserReports(data))
        .catch((err) => console.error("Error fetching reports:", err));
    }
  }, [user, token]);

  useEffect(() => {
    
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const storedToken = localStorage.getItem("token");
    setUser(storedUser);
    setToken(storedToken);

    
    if (storedUser?.id && storedToken) {
      listReports(storedUser, storedToken)
        .then((data) => setUserReports(data))
        .catch((err) => console.error("Error fetching reports:", err));
    }

    
    const mockReports = [
      { id: 1, hazard_type: "tsunami", lat: 9.93, lng: 76.25, is_verified: "True", text: "🌊 Tsunami warning near Kochi", platform: "Twitter", user_name: "IMD_Official", timestamp: new Date(), likes: 500, language: "en" },
      { id: 2, hazard_type: "cyclone", lat: 19.07, lng: 72.87, is_verified: "False", text: "🌪 Cyclone alert in Mumbai", platform: "YouTube", user_name: "WeatherWatch", timestamp: new Date(), likes: 1200, language: "en" },
      { id: 3, hazard_type: "oil_spill", lat: 16.99, lng: 82.25, is_verified: "True", text: "⛽ Oil spill near Kakinada", platform: "Facebook", user_name: "LocalNews", timestamp: new Date(), likes: 300, language: "en" },
      { id: 4, hazard_type: "erosion", lat: 21.14, lng: 79.08, is_verified: "False", text: "🏖️ Coastal erosion reported", platform: "Instagram", user_name: "BeachLover", timestamp: new Date(), likes: 150, language: "en" },
      { id: 5, hazard_type: "high_wave", lat: 13.08, lng: 80.27, is_verified: "True", text: "🌊 High waves near Chennai Marina", platform: "Twitter", user_name: "SurfWatch", timestamp: new Date(), likes: 750, language: "en" }
    ];
    setReports(mockReports);

    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Location denied:", err)
      );
    }
  }, []);

 
  useEffect(() => {
    const activeAlerts = reports.filter(r => r.hazard_type !== "safe" && r.is_verified === "True").length;
    const totalReports = reports.length;
    const nearbyIncidents = userLocation
      ? reports.filter(r => r.lat && r.lng && calculateDistance(userLocation.lat, userLocation.lng, r.lat, r.lng) <= 50).length
      : 0;

    const recentIncidents = reports.filter(r => {
      const days = (new Date() - new Date(r.timestamp)) / (1000 * 60 * 60 * 24);
      return days <= 7 && r.hazard_type !== "safe";
    }).length;

    let safetyLevel = "safe";
    if (recentIncidents > 10) safetyLevel = "danger";
    else if (recentIncidents > 5) safetyLevel = "warning";
    else if (recentIncidents > 0) safetyLevel = "caution";

    setStats({
      totalReports,
      activeAlerts,
      nearbyIncidents,
      safetyLevel,
      personalReports: userReports.length,
      communityPosts: reports.filter(r => r.user_name).length,
    });
  }, [reports, userReports, userLocation]);

  
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  }

  const getSafetyColor = (lvl) => ({
    danger: "text-red-600 bg-red-100",
    warning: "text-yellow-600 bg-yellow-100",
    caution: "text-orange-600 bg-orange-100",
    safe: "text-green-600 bg-green-100"
  }[lvl] || "text-gray-600 bg-gray-100");

  const getSafetyIcon = (lvl) => ({
    danger: "🚨",
    warning: "⚠️",
    caution: "⚡",
    safe: "✅"
  }[lvl] || "ℹ️");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl">
        <h1 className="text-2xl font-bold mb-2">Welcome to Your Safety Dashboard</h1>
        <p className="text-blue-100">Stay informed about hazards in your area and contribute to community safety</p>
      </div>

      {/* Safety Status */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Shield /> Safety Status</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSafetyColor(stats.safetyLevel)}`}>
            {getSafetyIcon(stats.safetyLevel)} {stats.safetyLevel.toUpperCase()}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.activeAlerts}</div>
            <div className="text-sm text-gray-600">Active Alerts</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.nearbyIncidents}</div>
            <div className="text-sm text-gray-600">Nearby Incidents</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.personalReports}</div>
            <div className="text-sm text-gray-600">Your Reports</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.communityPosts}</div>
            <div className="text-sm text-gray-600">Community Posts</div>
          </div>
        </div>
      </div>

      {/* Map */}
      <MapPlaceholder reports={reports} showHeatmap={true} showMarkers={true} />

      {/* Alerts & Community */}
      <LiveAlerts reports={reports} />
      <CommunityHighlights reports={reports} />

      {/* Report History */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Clock /> Your Report History</h2>
        <div className="space-y-3">
          {userReports.length > 0 ? (
            userReports.map((report) => (
              <div key={report.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex gap-3 items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    report.hazard_type === "safe" ? "bg-green-500" :
                    ["cyclone", "tsunami"].includes(report.hazard_type) ? "bg-red-500" : "bg-yellow-500"
                  }`} />
                  <div>
                    <div className="font-medium">{report.hazard_type?.toUpperCase()}</div>
                    <div className="text-sm text-gray-600">{new Date(report.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{report.platform || "App"}</div>
                  <div className="text-xs text-gray-500">{report.is_verified ? "✓ Verified" : "Pending"}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reports submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
