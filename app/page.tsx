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
import Fertilizer from "../components/Fertilizer";
import Community from "../components/Community";
import GlobalSearch from "../components/GlobalSearch";
import { useTranslation } from "../lib/useTranslation";

const LANGUAGES = [
  { code: "English", name: "English" },
  { code: "Hindi", name: "हिन्दी" },
  { code: "Tamil", name: "தமிழ்" },
  { code: "Telugu", name: "తెలుగు" },
  { code: "Kannada", name: "ಕನ್ನಡ" },
  { code: "Marathi", name: "मराठी" },
];

export default function Home() {
  const [active, setActive] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");
  
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
    } else {
      setCurrentLang(lang);
    }
  }, []);

  // 🔓 Logout
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const changeLanguage = (code: string) => {
    localStorage.setItem("appLanguage", code);
    setCurrentLang(code);
    setIsLangMenuOpen(false);
    window.location.reload(); // Quickest way to force full app re-render with new language
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
      id: "fertilizer", 
      label: "Fertilizer Optimizer", 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg> 
    },
    { 
      id: "community", 
      label: "Kisan Sabha", 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: "#f2ece0", color: "#1c1208" }}>

      {/* 🌾 Farm background image — fixed, soft opacity */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/farm_background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.10,
        }}
      />
      
      {/* 🌾 TOP NAVIGATION BAR — Deep Forest Green */}
      <header className="sticky top-0 z-[80] w-full px-4 md:px-8 py-3 flex items-center justify-between" style={{ backgroundColor: "#2d5a2e", borderBottom: "2px solid #1e3d20" }}>
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActive("home")}>
          <svg className="w-8 h-8" style={{ color: "#c8961e" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          <h1 className="text-2xl font-extrabold tracking-tight hidden sm:block" style={{ color: "#f5f0e8", fontFamily: "Georgia, serif" }}>🌾 Agrocult</h1>
        </div>

        {/* Global Search (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <GlobalSearch />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-5 relative">
          
          {/* Language Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg transition"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#f5f0e8" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              <span className="hidden sm:block">{LANGUAGES.find(l => l.code === currentLang)?.name || currentLang}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            
            {isLangMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 rounded-xl shadow-lg py-2 z-[90] animate-fade-in" style={{ backgroundColor: "#faf6ef", border: "1px solid #c8b89a" }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="w-full text-left px-4 py-2 text-sm font-medium transition"
                    style={{ color: "#2d5a2e" }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger Menu Icon */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-lg transition" style={{ color: "#f5f0e8" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </header>

      {/* MOBILE SEARCH BAR */}
      <div className="md:hidden p-4 z-[70] relative" style={{ backgroundColor: "#3d6b3f", borderBottom: "1px solid #2d5a2e" }}>
         <GlobalSearch />
      </div>

      {/* 📱 SLIDE-OUT MENU DRAWER */}
      <div className={`fixed inset-0 z-[100] transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60" onClick={() => setIsMenuOpen(false)}></div>
        
        {/* Menu Panel — earthy dark green */}
        <div className="absolute right-0 top-0 bottom-0 w-72 shadow-2xl flex flex-col" style={{ backgroundColor: "#2d5a2e", borderLeft: "2px solid #1e3d20" }}>
          <div className="flex justify-between items-center p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
            <h2 className="text-xl font-extrabold" style={{ color: "#f5f0e8", fontFamily: "Georgia, serif" }}>🌿 {t("Menu")}</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full transition" style={{ color: "#c8b89a" }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <nav className="flex flex-col flex-1 p-4 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setIsMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-semibold text-sm mb-1"
                style={active === item.id
                  ? { backgroundColor: "rgba(200,150,30,0.25)", color: "#c8961e" }
                  : { color: "#c8d8c8" }
                }
              >
                <span>{item.icon}</span>
                {t(item.label)}
              </button>
            ))}
          </nav>
          
          <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition font-bold text-sm" style={{ backgroundColor: "rgba(200,80,60,0.25)", color: "#ffb3a0" }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              {t("Sign Out")}
            </button>
          </div>
        </div>
      </div>

      {/* 📦 MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="p-6 md:p-8 min-h-[80vh] rounded-xl" style={{ backgroundColor: "#faf6ef", border: "1px solid #c8b89a", boxShadow: "0 2px 12px rgba(107,66,38,0.10)" }}>
            {active === "home" && <Dashboard />}
            {active === "recommendation" && <Recommendation />}
            {active === "disease" && <Crop />}
            {active === "marketplace" && <Marketplace />}
            {active === "fertilizer" && <Fertilizer />}
            {active === "community" && <Community />}
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
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    localStorage.setItem("appLanguage", lang.code);
                    setShowLangModal(false);
                    setCurrentLang(lang.code);
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