import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listReports } from '../api/reports'
import WeatherTrend from '../components/WeatherTrend'
import MapPlaceholder from '../components/MapPlaceholder'
import LiveAlerts from '../components/LiveAlerts'
import QuickStats from '../components/QuickStats'
import TrendingHazards from '../components/TrendingHazards'
import CommunityHighlights from '../components/CommunityHighlights'
import EmergencyResources from '../components/EmergencyResources'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function Home() {
  const [reports, setReports] = useState([])

  useEffect(() => {
    listReports({ limit: 20 }).then((data) => {
      console.log('Reports loaded:', data)
      setReports(data)
    }).catch((error) => {
      console.error('Error loading reports:', error)
      // Add mock data if API fails
      const mockReports = [
        { id: 1, hazard_type: "tsunami", lat: 9.93, lng: 76.25, is_verified: "True", text: "🌊 Tsunami warning near Kochi", platform: "Twitter", user_name: "IMD_Official", timestamp: new Date(), likes: 500, language: "en" },
        { id: 2, hazard_type: "cyclone", lat: 19.07, lng: 72.87, is_verified: "False", text: "🌪️ Cyclone alert in Mumbai", platform: "YouTube", user_name: "WeatherWatch", timestamp: new Date(), likes: 1200, language: "en" },
        { id: 3, hazard_type: "high_wave", lat: 13.08, lng: 80.27, is_verified: "True", text: "🌊 High waves near Chennai Marina", platform: "Twitter", user_name: "SurfWatch", timestamp: new Date(), likes: 750, language: "en" }
      ]
      setReports(mockReports)
    })
  }, [])

  
  const mockTimeline = [
    { time: "10:45 pm", event: "Flood warning issued for Chennai" },
    { time: "09:30 pm", event: "Tsunami alert downgraded in Andaman" },
    { time: "08:00 pm", event: "High tides reported in Mumbai" },
  ]

  const tips = [
    "Stay away from beaches during high tide alerts.",
    "Keep an emergency kit ready with water, flashlight, and radio.",
    "Know your nearest evacuation route.",
  ]

  const mockTrendData = [
    { day: "Mon", reports: 5 },
    { day: "Tue", reports: 9 },
    { day: "Wed", reports: 2 },
    { day: "Thu", reports: 6 },
    { day: "Fri", reports: 3 },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Platform Overview */}
            <div className="space-y-6">
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Disaster Risk Reduction Initiative
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Integrated Platform for Ocean Hazard Reporting
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Empowering coastal communities across India to report ocean hazards in real-time. 
                Help INCOIS protect lives through crowdsourced reporting and social media analytics.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
  to="/report"
  className="inline-flex items-center gap-2 
             text-white px-6 py-3 rounded-lg font-medium 
             transition-colors
             bg-[linear-gradient(to_right,#062647,#0A5276,#1B8D98)]
             hover:bg-[linear-gradient(to_right,#0A3044,#0D638A,#22A1B2)]"
>
  <span>⚠️</span>
  Report Ocean Hazard
</Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <span>📍</span>
                  View Live Dashboard
                </Link>
        </div>

              <div className="flex gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black-600">24/7</div>
                  <div className="text-sm text-gray-600">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black-600">7,500km</div>
                  <div className="text-sm text-gray-600">Coastline</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black-600">Live</div>
                  <div className="text-sm text-gray-600">Alerts</div>
                </div>
              </div>
            </div>

            {/* Right Column - Key Features */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Instant Reporting</h3>
                    <p className="text-gray-600">
                      Submit geotagged reports with photos and videos directly from your mobile device.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Driven</h3>
                    <p className="text-gray-600">
                      Connect with coastal communities and disaster management officials in real-time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🌊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">AI-Powered Analysis</h3>
                    <p className="text-gray-600">
                      Advanced NLP processes social media feeds to detect emerging hazard patterns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Hazard Dashboard Section */}
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Live Hazard Dashboard</h2>
          <p className="text-gray-600">Real-time ocean hazard reports across Indian coastline</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - Active Hazards */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Active Hazards</h3>
      <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">〰️</span>
                  <div>
                    <div className="font-medium text-gray-800">Tsunami</div>
                    <div className="text-sm text-gray-600">Active reports</div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-medium text-gray-800">Storm Surge</div>
                    <div className="text-sm text-gray-600">Active reports</div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                  5
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📈</span>
                  <div>
                    <div className="font-medium text-gray-800">High Waves</div>
                    <div className="text-sm text-gray-600">Active reports</div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  12
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔺</span>
                  <div>
                    <div className="font-medium text-gray-800">Coastal Current</div>
                    <div className="text-sm text-gray-600">Active reports</div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold text-sm">
                  6
                </div>
              </div>
            </div>
            
            {/* <button
            

  className="w-full mt-6 text-white py-3 rounded-lg font-medium 
             transition-colors
             bg-[linear-gradient(to_right,#062647,#0A5276,#1B8D98)]
             hover:bg-[linear-gradient(to_right,#0A3044,#0D638A,#22A1B2)]" to="/"
>
  ▲ Quick Report
</button> */}

             <Link
  to="/report"
  className="inline-flex items-center justify-center w-full mt-6 text-white py-3 rounded-lg font-medium 
             transition-colors
             bg-[linear-gradient(to_right,#062647,#0A5276,#1B8D98)]
             hover:bg-[linear-gradient(to_right,#0A3044,#0D638A,#22A1B2)]"
>
  ▲ Quick Report
</Link>

          </div>

          {/* Middle - Interactive Map */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="h-80 rounded-lg overflow-hidden">
              <MapPlaceholder reports={reports} showHeatmap={true} showMarkers={true} />
            </div>
          </div>

          {/* Right - Recent Reports */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Recent Reports</h3>
              <div className="flex gap-2">
                <button className="text-green-600 hover:text-green-700">✔ Filters</button>
                <button className="text-gray-600 hover:text-gray-700">⛶ Full Screen</button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">High Waves</span>
                  <div>
                    <div className="font-medium text-gray-800">Chennai Coast</div>
                    <div className="text-sm text-gray-600">2 min ago</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Storm Surge</span>
                  <div>
                    <div className="font-medium text-gray-800">Mumbai Harbor</div>
                    <div className="text-sm text-gray-600">5 min ago</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Coastal Current</span>
                  <div>
                    <div className="font-medium text-gray-800">Kochi Backwaters</div>
                    <div className="text-sm text-gray-600">12 min ago</div>
                  </div>
                </div>
        </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">High Waves</span>
                  <div>
                    <div className="font-medium text-gray-800">Visakhapatnam Port</div>
                    <div className="text-sm text-gray-600">18 min ago</div>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              View All Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
