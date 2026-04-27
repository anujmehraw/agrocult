"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [error, setError] = useState("");

  const lat = 23.2599;
  const lon = 77.4126;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 🌤 WEATHER
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=Bhopal&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        );
        const weatherJson = await weatherRes.json();

        if (weatherJson.cod !== "200") {
          setError(weatherJson.message);
          return;
        }

        const chartData = weatherJson.list.slice(0, 8).map((item: any) => ({
          time: item.dt_txt.split(" ")[1].slice(0, 5),
          temp: item.main.temp,
        }));

        setData(chartData);
        setCurrent(weatherJson.list[0]);

        // 📰 NEWS
        const newsRes = await fetch(
          `https://newsapi.org/v2/everything?q=agriculture+india&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
        );
        const newsJson = await newsRes.json();

        if (newsJson.status === "ok") {
          setNews(newsJson.articles.slice(0, 5));
        }
      } catch {
        setError("Failed to load data");
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="space-y-5">

      <h2 className="text-xl font-bold text-green-700">
        🌾 Smart Farming Dashboard
      </h2>

      {error && <p className="text-red-600">{error}</p>}

      {/* 🌤 WEATHER */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* 📈 CHART */}
        <div className="bg-green-50 p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">
            📈 Temperature Forecast
          </h3>

          {!data.length ? (
            <p>Loading chart...</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#16a34a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 📊 WEATHER DETAILS */}
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          {!current ? (
            <p>Loading...</p>
          ) : (
            <>
              <p><b>📍 City:</b> Bhopal</p>
              <p><b>🌡 Temp:</b> {current.main.temp}°C</p>
              <p><b>💧 Humidity:</b> {current.main.humidity}%</p>
              <p><b>🌬 Wind:</b> {current.wind.speed} m/s</p>
              <p><b>🧭 Direction:</b> {current.wind.deg}°</p>
              <p><b>🌥 Condition:</b> {current.weather[0].main}</p>
            </>
          )}
        </div>

      </div>

      {/* 🧠 INSIGHTS */}
      {current && (
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">
            🧠 Farming Insight
          </h3>

          <p className="text-sm">
            {current.main.humidity > 70
              ? "High humidity — risk of crop disease. Avoid overwatering."
              : "Humidity normal — good for crops."}
          </p>

          <p className="text-sm mt-2">
            {current.wind.speed > 5
              ? "Strong winds — avoid spraying pesticides."
              : "Wind conditions are safe."}
          </p>
        </div>
      )}

      {/* 🛰 SATELLITE MAP (NO API KEY) */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">
          🛰 Satellite View
        </h3>

        <iframe
          src={`https://maps.google.com/maps?q=${lat},${lon}&t=k&z=15&output=embed`}
          className="w-full h-[300px] rounded-lg"
        />

        <p className="text-sm text-gray-600 mt-2">
          Satellite map (no API key required)
        </p>
      </div>

      {/* 📰 NEWS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-3">
          📰 Agriculture News
        </h3>

        {!news.length ? (
          <p>Loading news...</p>
        ) : (
          <div className="space-y-3">
            {news.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                className="block border-b pb-2 hover:text-green-600"
              >
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-600">
                  {item.source.name}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}