import { useEffect, useState } from "react";
import MapPlaceholder from "../components/MapPlaceholder";
import AnalystVerification from "../components/AnalystVerification";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    AreaChart,
    Area,
    ResponsiveContainer,
} from "recharts";
import {
    TrendingUp,
    Download,
    BarChart3,
    Map,
    Brain,
    Target,
    Filter,
    RefreshCw
} from "lucide-react";

export default function DashboardAnalyst() {
    const [reports, setReports] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [verificationData, setVerificationData] = useState([]);
    const [sentimentData, setSentimentData] = useState([]);
    const [keywordData, setKeywordData] = useState([]);
    const [performanceMetrics, setPerformanceMetrics] = useState({});
    const [predictionData, setPredictionData] = useState([]);
    const [activeTab, setActiveTab] = useState('analytics');

    useEffect(() => {
       
        const mockReports = [
            { id: 1, hazard_type: "tsunami", lat: 9.93, lng: 76.25, is_verified: "True", text: "🌊 Tsunami warning near Kochi", platform: "Twitter", user_name: "IMD_Official", timestamp: new Date(), likes: 500, language: "en" },
            { id: 2, hazard_type: "cyclone", lat: 19.07, lng: 72.87, is_verified: "False", text: "🌪 Cyclone alert in Mumbai", platform: "YouTube", user_name: "WeatherWatch", timestamp: new Date(), likes: 1200, language: "en" },
            { id: 3, hazard_type: "oil_spill", lat: 16.99, lng: 82.25, is_verified: "True", text: "⛽ Oil spill near Kakinada", platform: "Facebook", user_name: "LocalNews", timestamp: new Date(), likes: 300, language: "en" },
            { id: 4, hazard_type: "erosion", lat: 21.14, lng: 79.08, is_verified: "True", text: "🏖️ Coastal erosion reported", platform: "Instagram", user_name: "BeachLover", timestamp: new Date(), likes: 150, language: "en" },
            { id: 5, hazard_type: "high_wave", lat: 13.08, lng: 80.27, is_verified: "True", text: "🌊 High waves near Chennai Marina", platform: "Twitter", user_name: "SurfWatch", timestamp: new Date(), likes: 750, language: "en" }
        ];
        setReports(mockReports);

        
        setTrendData([
            { month: "Jan", count: 12 },
            { month: "Feb", count: 18 },
            { month: "Mar", count: 25 },
            { month: "Apr", count: 20 },
            { month: "May", count: 30 },
            { month: "Jun", count: 28 },
        ]);

        
        setLocationData([
            { location: "Chennai", count: 15 },
            { location: "Mumbai", count: 10 },
            { location: "Kochi", count: 8 },
            { location: "Odisha", count: 12 },
            { location: "Goa", count: 6 },
            { location: "Visakhapatnam", count: 9 },
        ]);

        
        setVerificationData([
            { status: "Verified", count: 20 },
            { status: "Pending", count: 10 },
            { status: "Rejected", count: 5 },
        ]);

       
        setSentimentData([
            { sentiment: "Positive", count: 40 },
            { sentiment: "Neutral", count: 25 },
            { sentiment: "Negative", count: 15 },
        ]);

        
        setKeywordData([
            { word: "Cyclone", count: 120 },
            { word: "Tsunami", count: 80 },
            { word: "Flood", count: 95 },
            { word: "Erosion", count: 60 },
            { word: "OilSpill", count: 45 },
        ]);

        
        setPerformanceMetrics({
            totalReports: 50,
            verifiedReports: 30,
            avgVerificationTime: 2.5,
            reportVolume: 50,
            responseTime: 1.2,
            verificationRate: 60,
        });

        
        setPredictionData([
            { month: "Current", reports: 28 },
            { month: "Next Month", reports: 31 },
            { month: "2 Months", reports: 34 },
            { month: "3 Months", reports: 33 },
        ]);
    }, []);

    const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa", "#a855f7", "#ef4444"];

    const exportData = () => {
        const csvContent =
            "data:text/csv;charset=utf-8," +
            "ID,Platform,Text,Latitude,Longitude,Timestamp,Hazard Type,User,Verified\n" +
            reports
                .map(
                    (r) =>
                        `${r.id},${r.platform},${r.text},${r.lat},${r.lng},${r.timestamp},${r.hazard_type},${r.user_name},${r.is_verified}`
                )
                .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "disaster_reports.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Analyst Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Analytics Command Center</h1>
                        <p className="text-purple-100">
                            Advanced data analysis and predictive insights for disaster management
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={exportData}
                            className="btn bg-white text-purple-600 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                        <button className="btn bg-purple-500 text-white hover:bg-purple-700 flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
                            { id: 'verification', label: 'Report Verification', icon: Target }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                    activeTab === tab.id
                                        ? 'border-purple-500 text-purple-600'
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
                <AnalystVerification />
            ) : (
                <div className="space-y-6">

            {/* Key Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{performanceMetrics.totalReports}</div>
                    <div className="text-sm text-gray-600">Total Reports</div>
                </div>
                <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{performanceMetrics.verificationRate}%</div>
                    <div className="text-sm text-gray-600">Verification Rate</div>
                </div>
                <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{performanceMetrics.avgVerificationTime}h</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
                <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{performanceMetrics.reportVolume}</div>
                    <div className="text-sm text-gray-600">Daily Volume</div>
                </div>
            </div>

            {/* Main Analytics Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Interactive Map */}
                <div className="lg:col-span-1">
                    <MapPlaceholder reports={reports} showHeatmap={true} showMarkers={true} />
                </div>

                {/* Social Media Trends */}
                <div className="lg:col-span-1">
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6" />
                            Social Media Trends
                        </h2>
                        {/* Trending Keywords */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-3">Top Trending Keywords</h3>
                            <div className="space-y-2">
                                {keywordData.map((keyword, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="font-medium">#{keyword.word}</span>
                                        <span className="text-sm text-gray-600">{keyword.count} mentions</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sentiment Distribution */}
                        <div>
                            <h3 className="font-medium mb-3">Sentiment Analysis</h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={sentimentData} dataKey="count" nameKey="sentiment" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label>
                                            {sentimentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Historical Analysis */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Reports Over Time */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6" />
                        Reports Over Time
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="count" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Hazard Locations */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Map className="w-6 h-6" />
                        Top Hazard Locations
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={locationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="location" angle={-45} textAnchor="end" height={80} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Predictive Analytics */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Brain className="w-6 h-6" />
                    Predictive Analytics & Forecasting
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-medium mb-3">Report Volume Forecast</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={predictionData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="reports" stroke="#8b5cf6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium mb-3">Pattern Recognition Alerts</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                <div className="font-medium text-yellow-800">Rising Trend Detected</div>
                                <div className="text-sm text-yellow-700">Cyclone reports increasing by 15% weekly</div>
                            </div>
                            <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                                <div className="font-medium text-red-800">Hotspot Alert</div>
                                <div className="text-sm text-red-700">Chennai coast showing high activity</div>
                            </div>
                            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                                <div className="font-medium text-blue-800">Seasonal Pattern</div>
                                <div className="text-sm text-blue-700">Monsoon season correlation detected</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                </div>
            )}
        </div>
    );
}
