import React, { useEffect, useState } from "react";

export default function SocialTrendsPlaceholder() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/social-data")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error:", err));
  }, []);

  if (!data) return <p>Loading trends...</p>;

  return (
    <div className="card">
      <h2 className="font-semibold mb-2">Social Media Trends</h2>
      <ul className="list-disc pl-5 text-sm">
        <li>
          <strong>Trending Keywords:</strong> {data.insights.keywords.join(", ")}
        </li>
        <li>
          <strong>Sentiments:</strong>{" "}
          {data.insights.sentiments.map((s, i) => (
            <span key={i}>
              {s.user}: {s.sentiment}{" "}
            </span>
          ))}
        </li>
      </ul>
    </div>
  );
}
