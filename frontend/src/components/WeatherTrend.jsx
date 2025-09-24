import { useEffect, useState } from "react";

export default function WeatherTrend() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = (lat, lon) => {
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      )
        .then((res) => {
          if (!res.ok) throw new Error("Weather API error");
          return res.json();
        })
        .then((data) => {
          setWeather(data.current_weather);
        })
        .catch((err) => setError(err.message));
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(latitude, longitude);
        },
        () => fetchWeather(28.6, 77.2) // fallback
      );
    } else {
      fetchWeather(28.6, 77.2);
    }
  }, []);

  
  const formatApiTime = (timeStr) => {
    if (!timeStr) return "Unknown time";

    
    let t = String(timeStr).trim().replace(" ", "T"); 
    const tzRegex = /[Zz]|[+\-]\d{2}:\d{2}$/; 

    let iso = t;
    if (!tzRegex.test(t)) {
      
      if (/T\d{2}:\d{2}$/.test(t)) iso = `${t}:00Z`;
      else iso = `${t}Z`;
    }

    const d = new Date(iso);
    if (isNaN(d.getTime())) {
     
      const d2 = new Date(t);
      if (isNaN(d2.getTime())) return "Invalid date";
      return d2.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

  
    return d.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
 

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Current Weather Trends</h2>
      {error && <p className="text-red-500">⚠ {error}</p>}
      {!weather && !error && <p>Loading...</p>}
      {weather && (
        <ul className="text-sm space-y-1">
          <li>🌡 Temperature: {weather.temperature} °C</li>
          <li>💨 Wind Speed: {weather.windspeed} km/h</li>
          <li>🧭 Wind Direction: {weather.winddirection}°</li>
          <li>⏰ Time: {new Date().toLocaleString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true
})}</li>

        </ul>
      )}
    </div>
  );
}
