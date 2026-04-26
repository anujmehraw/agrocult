"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS
import Dashboard from "../components/Dashboard";
import Crop from "../components/Crop";
import Chatbot from "../components/Chatbot";
import Gallery from "../components/Gallery";
import Recommendation from "../components/Recommendation";
import { clearUser, getUser } from "../lib/authStorage";

export default function Home() {
  const [active, setActive] = useState("home");
  const router = useRouter();

  useEffect(() => {
    const u = getUser();
    if (!u) router.replace("/login");
  }, []);

  const logout = () => {
    clearUser();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen text-amber-950">
      <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="mb-4 p-1 sm:p-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Khet Control Panel
              </p>
              <h1 className="text-2xl font-bold text-amber-950 sm:text-3xl">
                🌾 Agrocult
              </h1>
            </div>

          <button
            onClick={logout}
            className="rounded-xl border border-red-100 bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-red-600 active:scale-[0.99]"
          >
            Logout
          </button>
        </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {[
            ["home", "Home"],
            ["recommendation", "Recommend"],
            ["crop", "Crop Scan"],
            ["chat", "Chat"],
            ["gallery", "Gallery"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`px-3 py-2 text-sm font-medium transition ${
                active === key
                  ? "text-emerald-700 underline underline-offset-4"
                  : "text-amber-900 hover:text-emerald-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <main className="p-1 sm:p-2">
          {active === "home" && <Dashboard />}
          {active === "recommendation" && <Recommendation />}
          {active === "crop" && <Crop />}
          {active === "chat" && <Chatbot />}
          {active === "gallery" && <Gallery />}
        </main>
      </div>
    </div>
  );
}