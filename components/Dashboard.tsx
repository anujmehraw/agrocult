"use client";
import { useEffect, useState } from "react";
import Satellite from "./Satellite";

<Satellite />
import YieldChart from "./YieldChart";

<YieldChart />
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

  useEffect(() => {
    const fetchData = async () => {
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

        // 📰 NEWS (India farming focused)
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

    fetchData();
  }, []);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-amber-950">
        🌾 Today in Your Farm
      </h2>

      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {/* WEATHER */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-lime-50 p-4 shadow-sm">
          <h3 className="mb-3 font-semibold text-amber-900">📈 Field Temperature (Next Hours)</h3>

          {!data.length ? (
            <p>Loading...</p>
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

        <div className="space-y-2 rounded-2xl border border-amber-100 bg-amber-50 p-4 shadow-sm">
          {!current ? (
            <p className="text-amber-700">Loading...</p>
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

      {current && (
        <div className="rounded-2xl border border-emerald-200 bg-lime-50 p-4 shadow-sm">
          <h3 className="mb-2 font-semibold text-amber-900">🧠 Farming Insight</h3>
          <p className="text-sm text-amber-800">
            {current.main.humidity > 70
              ? "High humidity — risk of crop disease."
              : "Humidity is normal."}
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-emerald-100 bg-amber-50 p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-amber-950">
          📰 Krishi News
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
                rel="noreferrer"
                className="block rounded-xl border border-amber-100 bg-white p-3 transition hover:border-emerald-300 hover:bg-lime-50"
              >
                <p className="font-medium text-amber-950">{item.title}</p>
                <p className="text-sm text-amber-700">
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