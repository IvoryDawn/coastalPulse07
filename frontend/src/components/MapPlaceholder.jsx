import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// 🔹 Heatmap layer component
function HeatmapLayer({ reports }) {
  const map = useMap();

  useEffect(() => {
    if (!reports || reports.length === 0) return;

    let heatmapLayer;

    map.whenReady(() => {
      const heatmapData = reports
        .filter((r) => r.lat && r.lng)
        .map((r) => {
          let intensity = 1;
          switch (r.hazard_type) {
            case "cyclone":
            case "tsunami":
              intensity = 3;
              break;
            case "high_wave":
            case "oil_spill":
              intensity = 2;
              break;
            case "rip_current":
            case "erosion":
              intensity = 1.5;
              break;
            default:
              intensity = 1;
          }
          if (r.is_verified === "True") intensity *= 1.5;
          return [parseFloat(r.lat), parseFloat(r.lng), intensity];
        });

      if (heatmapData.length > 0 && map.getSize().x > 0 && map.getSize().y > 0) {
        heatmapLayer = L.heatLayer(heatmapData, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
          max: 3,
          gradient: {
            0.2: "blue",
            0.4: "cyan",
            0.6: "lime",
            0.8: "yellow",
            1.0: "red",
          },
        }).addTo(map);
      }
    });

    return () => {
      if (heatmapLayer) map.removeLayer(heatmapLayer);
    };
  }, [map, reports]);

  return null;
}

// 🔹 Hazard-specific emoji icons
function getMarkerIcon(hazardType, isVerified) {
  const icons = {
    cyclone: "🌪️",
    tsunami: "🌊",
    high_wave: "🌊",
    oil_spill: "⛽",
    rip_current: "🏄",
    erosion: "⛰️",
    safe: "✅",
    default: "⚠️",
  };

  const emoji = icons[hazardType] || icons.default;

  return L.divIcon({
    className: "custom-emoji-icon",
    html: `<div style="
      font-size: 28px;
      line-height: 28px;
      text-align: center;
      ${isVerified === "True" ? "filter: drop-shadow(0 0 4px lime);" : ""}
    ">${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

// 🔹 Main Map Component
export default function MapPlaceholder({
  reports = [],
  showHeatmap = true,
  showMarkers = true,
}) {
  const validReports = reports.filter(
    (r) =>
      r.lat &&
      r.lng &&
      !isNaN(parseFloat(r.lat)) &&
      !isNaN(parseFloat(r.lng))
  );

  const center =
    validReports.length > 0
      ? [
          validReports.reduce((sum, r) => sum + parseFloat(r.lat), 0) /
            validReports.length,
          validReports.reduce((sum, r) => sum + parseFloat(r.lng), 0) /
            validReports.length,
        ]
      : [20.5937, 78.9629]; // India center

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">🌍 Interactive Hazard Map</h2>
        <div className="flex gap-2 text-sm">
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
            High Risk
          </span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
            Medium Risk
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
            Safe
          </span>
        </div>
      </div>

      <div className="h-[calc(100%-60px)] rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={center}
          zoom={validReports.length > 0 ? 6 : 5}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {showHeatmap && <HeatmapLayer reports={validReports} />}

          {showMarkers &&
            validReports.map((r) => (
              <Marker
                key={r.id}
                position={[parseFloat(r.lat), parseFloat(r.lng)]}
                icon={getMarkerIcon(r.hazard_type, r.is_verified)}
              >
                <Popup className="custom-popup">
                  <div className="space-y-2 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          r.hazard_type === "cyclone" ||
                          r.hazard_type === "tsunami"
                            ? "bg-red-100 text-red-800"
                            : r.hazard_type === "high_wave" ||
                              r.hazard_type === "oil_spill"
                            ? "bg-orange-100 text-orange-800"
                            : r.hazard_type === "safe"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {r.hazard_type?.replace("_", " ").toUpperCase() ||
                          "UNKNOWN"}
                      </span>
                      {r.is_verified === "True" && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          ✓ VERIFIED
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-medium">
                      {r.text?.substring(0, 100)}...
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      <div>
                        <strong>Platform:</strong> {r.platform}
                      </div>
                      <div>
                        <strong>User:</strong> {r.user_name}
                      </div>
                      <div>
                        <strong>Time:</strong>{" "}
                        {new Date(r.timestamp).toLocaleString()}
                      </div>
                      <div>
                        <strong>Likes:</strong> {r.likes || 0}
                      </div>
                      <div>
                        <strong>Language:</strong>{" "}
                        {r.language?.toUpperCase()}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        📍 {r.lat}, {r.lng}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      <div className="mt-3 text-xs text-gray-600">
        <div className="flex flex-wrap gap-4">
          <span>🌪️ Cyclone</span>
          <span>🌊 Tsunami / High Waves</span>
          <span>⛽ Oil Spill</span>
          <span>🏄 Rip Current</span>
          <span>⛰️ Erosion</span>
          <span>✅ Safe</span>
        </div>
      </div>
    </div>
  );
}
