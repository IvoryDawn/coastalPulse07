import MapPlaceholder from "../components/MapPlaceholder";

export default function MapDemo() {
  
  const mockReports = [
    { id: 1, hazard_type: "tsunami", lat: 9.93, lng: 76.25, is_verified: "True", text: "🌊 Tsunami warning near Kochi", platform: "Twitter", user_name: "IMD_Official", timestamp: new Date(), likes: 500, language: "en" },
    { id: 2, hazard_type: "cyclone", lat: 19.07, lng: 72.87, is_verified: "False", text: "🌪️ Cyclone alert in Mumbai", platform: "YouTube", user_name: "WeatherWatch", timestamp: new Date(), likes: 1200, language: "en" },
    { id: 3, hazard_type: "oil_spill", lat: 16.99, lng: 82.25, is_verified: "True", text: "⛽ Oil spill reported near Kakinada", platform: "Facebook", user_name: "LocalNews", timestamp: new Date(), likes: 300, language: "en" },
    { id: 4, hazard_type: "erosion", lat: 21.14, lng: 79.08, is_verified: "True", text: "🏖️ Coastal erosion reported", platform: "Instagram", user_name: "BeachLover", timestamp: new Date(), likes: 150, language: "en" },
    { id: 5, hazard_type: "high_wave", lat: 13.08, lng: 80.27, is_verified: "True", text: "🌊 High waves near Chennai Marina", platform: "Twitter", user_name: "SurfWatch", timestamp: new Date(), likes: 750, language: "en" }
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🌍 Hazard Hotspot Demo</h1>
      <MapPlaceholder reports={mockReports} showHeatmap={true} showMarkers={true} />
    </div>
  );
}
