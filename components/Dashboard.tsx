"use client";
import News from "./News";

export default function Dashboard() {
  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="bg-green-600 text-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold">🌾 Agrocult</h1>
        <p className="text-sm mt-1">
          Smart AI Farming Assistant
        </p>
      </div>

      {/* FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded-xl shadow">
          🌿 Crop Detection  
          <p className="text-sm text-gray-500">
            Upload or capture crop images
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          💬 Chatbot  
          <p className="text-sm text-gray-500">
            Ask farming questions
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          🌦️ Weather  
          <p className="text-sm text-gray-500">
            Smart irrigation suggestions
          </p>
        </div>

      </div>

      {/* NEWS */}
      <News />

    </div>
  );
}