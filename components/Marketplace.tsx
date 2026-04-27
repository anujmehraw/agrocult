"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { useTranslation } from "../lib/useTranslation";

const cropPrices = [
  { crop: "Wheat", unit: "quintal", min: 2200, max: 2550, trend: "up", change: "+2.4%" },
  { crop: "Rice (Paddy)", unit: "quintal", min: 1900, max: 2300, trend: "down", change: "-1.1%" },
  { crop: "Maize", unit: "quintal", min: 1700, max: 2050, trend: "up", change: "+4.5%" },
  { crop: "Soybean", unit: "quintal", min: 3800, max: 4400, trend: "up", change: "+1.8%" },
  { crop: "Cotton", unit: "quintal", min: 6200, max: 7100, trend: "down", change: "-3.2%" },
  { crop: "Onion", unit: "quintal", min: 1200, max: 2100, trend: "up", change: "+12.0%" },
  { crop: "Sugarcane", unit: "quintal", min: 290, max: 315, trend: "up", change: "+1.2%" },
  { crop: "Mustard", unit: "quintal", min: 5000, max: 5450, trend: "down", change: "-0.8%" },
];

// Generate fake 30-day historical data based on current price range
const generateHistory = (min: number, max: number, trend: string) => {
  const data = [];
  let currentPrice = trend === "up" ? min : max;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random fluctuation
    const fluctuation = (Math.random() - 0.5) * ((max - min) * 0.1);
    currentPrice += fluctuation;
    
    // Enforce bounds roughly
    if (currentPrice < min * 0.9) currentPrice = min;
    if (currentPrice > max * 1.1) currentPrice = max;

    // Force trend
    if (trend === "up") currentPrice += (max - min) / 60;
    if (trend === "down") currentPrice -= (max - min) / 60;

    data.push({
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      price: Math.round(currentPrice)
    });
  }
  return data;
};

export default function Marketplace() {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const handleSelect = (crop: any) => {
    setSelectedCrop(crop);
    setHistory(generateHistory(crop.min, crop.max, crop.trend));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-green-900 tracking-tight">{t("Live Mandi Rates")}</h2>
        <p className="text-gray-600 mt-1">
          {t("Real-time market prices across Indian mandis.")}
        </p>
      </div>

      {selectedCrop ? (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-slide-up">
          <button 
            onClick={() => setSelectedCrop(null)}
            className="text-sm font-semibold text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1"
          >
            ← Back
          </button>
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-4xl font-black text-gray-900">{selectedCrop.crop}</h3>
              <p className="text-gray-500 font-medium">30-Day Price Trend Overview</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-bold">Current Rate</p>
              <h4 className="text-3xl font-bold text-green-700">₹{selectedCrop.max.toLocaleString()}</h4>
              <p className={`text-sm font-bold ${selectedCrop.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {selectedCrop.trend === "up" ? "↑" : "↓"} {selectedCrop.change} Today
              </p>
            </div>
          </div>

          {/* DASHBOARD WIDGETS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold">30d High</p>
              <p className="text-xl font-bold text-gray-900">₹{Math.max(...history.map(d => d.price)).toLocaleString()}</p>
            </div>
            <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold">30d Low</p>
              <p className="text-xl font-bold text-gray-900">₹{Math.min(...history.map(d => d.price)).toLocaleString()}</p>
            </div>
            <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold">Avg Quality</p>
              <p className="text-xl font-bold text-gray-900">FAQ</p>
            </div>
            <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold">Demand</p>
              <p className="text-xl font-bold text-gray-900">{selectedCrop.trend === 'up' ? 'High' : 'Moderate'}</p>
            </div>
          </div>

          {/* CHART */}
          <div className="h-[350px] w-full bg-white/40 p-4 rounded-2xl">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`₹${value}`, "Price"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={selectedCrop.trend === "up" ? "#16a34a" : "#dc2626"} 
                  strokeWidth={4} 
                  dot={false}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cropPrices.map((item) => (
            <button
              key={item.crop}
              onClick={() => handleSelect(item)}
              className="text-left rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors">{item.crop}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-bold ${
                    item.trend === "up"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.change}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-900">₹{item.max}</span>
                <span className="text-sm text-gray-500 font-medium">/{item.unit}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500 font-medium">
                {t("Min Price")}: ₹{item.min}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
