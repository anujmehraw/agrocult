"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS
import Dashboard from "../components/Dashboard";
import Crop from "../components/Crop";
import Marketplace from "../components/Marketplace";
import Recommendation from "../components/Recommendation";
import FloatingChat from "../components/FloatingChat";

export default function Home() {
  const [active, setActive] = useState("home");
  const router = useRouter();

  // 🔐 Auth check
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) router.push("/login");
  }, []);

  // 🔓 Logout
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-900">

      {/* 🌾 HEADER */}
      <div className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-700">
          🌾 Agrocult
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* 🚀 NAVIGATION */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">

        {[
          ["home", "🏠 Home"],
          ["recommendation", "🌱 Recommend"],
          ["crop", "📷 Crop Scan"],
          ["marketplace", "🛒 Marketplace"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`p-4 rounded-xl shadow-sm border text-sm font-medium transition
              ${
                active === key
                  ? "bg-green-600 text-white"
                  : "bg-white hover:bg-green-50"
              }`}
          >
            {label}
          </button>
        ))}

      </div>

      {/* 📦 CONTENT */}
      <div className="px-4 pb-20">
        <div className="bg-white rounded-2xl shadow-md p-4">

          {active === "home" && <Dashboard />}
          {active === "recommendation" && <Recommendation />}
          {active === "crop" && <Crop />}
          {active === "marketplace" && <Marketplace />}

        </div>
      </div>

      {/* 💬 FLOATING CHATBOT */}
      <FloatingChat />

    </div>
  );
}