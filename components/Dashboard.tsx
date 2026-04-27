"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import News from "./News";
import { useTranslation } from "../lib/useTranslation";

export default function Dashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [error, setError] = useState("");

  const lat = 23.2599; // Bhopal, India
  const lon = 77.4126;

  // 🌤 FETCH WEATHER
  useEffect(() => {
    const fetchWeather = async () => {
      try {
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
          humidity: item.main.humidity,
        }));

        setData(chartData);
        setCurrent(weatherJson.list[0]);
      } catch {
        setError("Failed to load weather data");
      }
    };

    fetchWeather();
  }, []);

  const getIrrigationAdvice = (weather: any) => {
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const rainSoon = data.some((d) => d.temp < 24);

    if (rainSoon) return { status: t("Skip"), color: "text-blue-600", desc: "Rain expected soon" };
    if (temp > 35 && humidity < 40) return { status: t("Urgent"), color: "text-red-600", desc: "High heat & low humidity" };
    if (humidity > 80) return { status: t("Avoid"), color: "text-amber-600", desc: "High humidity risk" };
    return { status: t("Normal"), color: "text-green-600", desc: "Moderate irrigation recommended" };
  };

  const advice = current ? getIrrigationAdvice(current) : null;

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-green-900 tracking-tight">{t("Farm Overview")}</h2>
          <p className="text-gray-600 mt-1">{t("Real-time insights for your fields in Bhopal, MP.")}</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">{error}</div>}

      {/* 🌤 TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Weather Card */}
        <div className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100">
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{t("Current Weather")}</p>
            {current ? (
              <>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{current.main.temp}°C</h3>
                <p className="text-gray-600 font-medium capitalize">{current.weather[0].description}</p>
              </>
            ) : <p className="mt-2 text-gray-400 animate-pulse">Loading...</p>}
          </div>
          <div className="text-green-500 bg-green-50 p-3 rounded-xl">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100">
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{t("Humidity Level")}</p>
            {current ? (
              <>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{current.main.humidity}%</h3>
                <p className="text-gray-600 font-medium">{current.main.humidity > 70 ? t('High Disease Risk') : t('Optimal')}</p>
              </>
            ) : <p className="mt-2 text-gray-400 animate-pulse">Loading...</p>}
          </div>
          <div className="text-blue-500 bg-blue-50 p-3 rounded-xl">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
        </div>

        {/* Irrigation Card */}
        <div className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{t("Irrigation")}</p>
            {advice ? (
              <>
                <h3 className={`text-2xl font-bold mt-1 ${advice.color}`}>{advice.status}</h3>
                <p className="text-gray-600 font-medium text-sm mt-1">{advice.desc}</p>
              </>
            ) : <p className="mt-2 text-gray-400 animate-pulse">Loading...</p>}
          </div>
          <div className="text-blue-600 bg-blue-50 p-3 rounded-xl">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 📈 CHART */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl shadow-sm border border-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">{t("Temperature Forecast (Today)")}</h3>
          </div>

          {!data.length ? (
            <div className="h-[250px] flex items-center justify-center bg-gray-50/50 rounded-xl animate-pulse">
              <p className="text-gray-400">{t("Loading forecast data...")}</p>
            </div>
          ) : (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="temp" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 🛰 SATELLITE */}
        <div className="glass p-6 rounded-2xl shadow-sm border border-white flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t("Farm Satellite View")}</h3>
          <div className="flex-1 min-h-[250px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
            <iframe
              src={`https://maps.google.com/maps?q=${lat},${lon}&t=k&z=15&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>

      </div>

      {/* 📰 NEWS INTEGRATION */}
      <div className="pt-4">
        <News />
      </div>

    </div>
  );
}