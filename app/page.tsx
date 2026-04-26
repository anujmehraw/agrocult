"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Dashboard from "../components/Dashboard";
import Crop from "../components/Crop";
import Chatbot from "../components/Chatbot";
import Gallery from "../components/Gallery";

export default function Home() {
  const [active, setActive] = useState("dashboard");
  const [user, setUser] = useState("");
  const router = useRouter();

  // 🔐 Auth check
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) {
      router.push("/login");
    } else {
      setUser(u);
    }
  }, []);

  // 🔓 Logout
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">

      {/* NAVBAR */}
      <div className="sticky top-0 z-50 flex justify-between items-center bg-white shadow-md px-6 py-4">

        {/* LOGO */}
        <h1 className="text-xl font-bold text-green-600">🌾 Agrocult</h1>

        {/* NAV LINKS */}
        <div className="flex gap-6 font-medium text-gray-700">

          <button
            onClick={() => setActive("dashboard")}
            className={`hover:text-green-600 ${
              active === "dashboard" && "text-green-600 font-semibold"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActive("crop")}
            className={`hover:text-green-600 ${
              active === "crop" && "text-green-600 font-semibold"
            }`}
          >
            Crop Detection
          </button>

          <button
            onClick={() => setActive("chat")}
            className={`hover:text-green-600 ${
              active === "chat" && "text-green-600 font-semibold"
            }`}
          >
            Chatbot
          </button>

          <button
            onClick={() => setActive("gallery")}
            className={`hover:text-green-600 ${
              active === "gallery" && "text-green-600 font-semibold"
            }`}
          >
            Gallery
          </button>

        </div>

        {/* USER + LOGOUT */}
        <div className="flex items-center gap-3">
          <span className="text-sm bg-green-100 px-3 py-1 rounded">
            👤 {user}
          </span>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 max-w-5xl mx-auto">

        {active === "dashboard" && <Dashboard />}
        {active === "crop" && <Crop />}
        {active === "chat" && <Chatbot />}
        {active === "gallery" && <Gallery />}

      </div>
    </div>
  );
}