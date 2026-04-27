"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS
import Dashboard from "../components/Dashboard";
import Crop from "../components/Crop";
import Marketplace from "../components/Marketplace";
import Recommendation from "../components/Recommendation";
import FloatingChat from "../components/FloatingChat";
import Settings from "../components/Settings";
import { useTranslation } from "../lib/useTranslation";

export default function Home() {
  const [active, setActive] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  // 🔐 Auth check & Language check
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) {
      router.push("/login");
      return;
    }

    // Check if language is set
    const lang = localStorage.getItem("appLanguage");
    if (!lang) {
      setShowLangModal(true);
    }
  }, []);

  // 🔓 Logout
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navItems = [
    { 
      id: "home", 
      label: "My Farm", 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> 
    },
    { 
      id: "recommendation", 
      label: "Crop Planner", 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg> 
    },
    { 
      id: "disease", 
      label: "Plant Doctor", 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> 
    },
    { 
      id: "marketplace", 
      label: "Mandi Rates", 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg> 
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> 
    },
  ];

  return (
    <div className="min-h-screen flex text-gray-900 bg-[#faf9f6]">
      
      {/* 🟢 SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 glass-dark text-white p-6 sticky top-0 h-screen shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          <h1 className="text-2xl font-extrabold tracking-tight">Agrocult</h1>
        </div>

        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                active === item.id
                  ? "bg-white text-green-900 shadow-md scale-105"
                  : "hover:bg-white/10 text-green-50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500 hover:text-white text-red-100 py-3 rounded-xl transition font-medium border border-red-500/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          {t("Sign Out")}
        </button>
      </aside>

      {/* 📱 MOBILE HEADER */}
      <div className="md:hidden fixed top-0 w-full bg-white z-50 flex justify-between items-center p-4 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          <h1 className="text-xl font-bold text-green-800">Agrocult</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-2xl"
        >
          {isMobileMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* 📱 MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[60px] w-full glass z-40 flex flex-col p-4 shadow-lg border-b">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 font-medium ${
                active === item.id ? "bg-green-600 text-white" : "bg-white/50 text-gray-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button onClick={logout} className="mt-2 text-red-600 font-medium py-2">{t("Logout")}</button>
        </div>
      )}

      {/* 📦 MAIN CONTENT */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0 max-h-screen overflow-y-auto">
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          <div className="glass rounded-3xl shadow-xl p-6 md:p-8 min-h-[80vh] border-white/60">
            {active === "home" && <Dashboard />}
            {active === "recommendation" && <Recommendation />}
            {active === "disease" && <Crop />}
            {active === "marketplace" && <Marketplace />}
            {active === "settings" && <Settings />}
          </div>
        </div>
      </main>

      {/* 💬 FLOATING CHATBOT */}
      <FloatingChat />

      {/* 🌐 INITIAL LANGUAGE SELECTION MODAL */}
      {showLangModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transform animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">{t("Welcome to Agrocult")}</h2>
              <p className="text-gray-500 mt-2">{t("Please select your preferred language for the AI Assistant and Farming Tools.")}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { code: "English", name: "English" },
                { code: "Hindi", name: "हिन्दी" },
                { code: "Tamil", name: "தமிழ்" },
                { code: "Telugu", name: "తెలుగు" },
                { code: "Kannada", name: "ಕನ್ನಡ" },
                { code: "Marathi", name: "मराठी" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    localStorage.setItem("appLanguage", lang.code);
                    setShowLangModal(false);
                  }}
                  className="px-4 py-3 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 hover:text-green-800 font-bold text-gray-700 transition-all text-center"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}