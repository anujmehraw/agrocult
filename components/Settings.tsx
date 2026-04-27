"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "../lib/useTranslation";

const LANGUAGES = [
  { code: "English", name: "English" },
  { code: "Hindi", name: "हिन्दी (Hindi)" },
  { code: "Tamil", name: "தமிழ் (Tamil)" },
  { code: "Telugu", name: "తెలుగు (Telugu)" },
  { code: "Kannada", name: "ಕನ್ನಡ (Kannada)" },
  { code: "Marathi", name: "मराठी (Marathi)" },
  { code: "Gujarati", name: "ગુજરાતી (Gujarati)" },
  { code: "Punjabi", name: "ਪੰਜਾਬੀ (Punjabi)" },
];

export default function Settings() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState("English");
  const [city, setCity] = useState("Bhopal");
  const [farmSize, setFarmSize] = useState("");
  const [primaryCrop, setPrimaryCrop] = useState("");
  const [notifyWeather, setNotifyWeather] = useState(true);
  const [notifyMandi, setNotifyMandi] = useState(true);
  const [notifyAI, setNotifyAI] = useState(false);
  const [profileName, setProfileName] = useState("Farmer");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage");
    if (savedLang) setLanguage(savedLang);

    const savedCity = localStorage.getItem("userCity");
    if (savedCity) setCity(savedCity);

    const savedSize = localStorage.getItem("farmSize");
    if (savedSize) setFarmSize(savedSize);

    const savedCrop = localStorage.getItem("primaryCrop");
    if (savedCrop) setPrimaryCrop(savedCrop);

    const savedNw = localStorage.getItem("notifyWeather");
    if (savedNw !== null) setNotifyWeather(savedNw === "true");

    const savedNm = localStorage.getItem("notifyMandi");
    if (savedNm !== null) setNotifyMandi(savedNm === "true");

    const savedNa = localStorage.getItem("notifyAI");
    if (savedNa !== null) setNotifyAI(savedNa === "true");

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const namePart = savedUser.split("@")[0];
      setProfileName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("appLanguage", language);
    localStorage.setItem("userCity", city);
    localStorage.setItem("farmSize", farmSize);
    localStorage.setItem("primaryCrop", primaryCrop);
    localStorage.setItem("notifyWeather", notifyWeather.toString());
    localStorage.setItem("notifyMandi", notifyMandi.toString());
    localStorage.setItem("notifyAI", notifyAI.toString());

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // Reload the page to ensure all components pick up the new language immediately
    window.location.reload();
  };

  const handleClearData = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your local data? This will sign you out and reset your preferences."
    );
    if (confirmClear) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-green-900 tracking-tight">{t("Settings")}</h2>
          <p className="text-gray-600 mt-1">{t("Manage your platform preferences and language.")}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
        
        {/* Profile Section */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            {t("Profile Information")}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t("Display Name")}</label>
              <input
                type="text"
                value={profileName}
                disabled
                className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">{t("Display name is tied to your account email.")}</p>
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Preferences Section */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
            {t("AI Language Preference")}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t("Preferred Language")}</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-2">
                {t("All AI features (Plant Doctor, Crop Planner, Ask an Expert) will automatically reply in this language.")}
              </p>
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Location Section */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {t("Farm Location")}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t("City / Region")}</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t("Enter your city (e.g. Pune)")}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
              />
              <p className="text-xs text-gray-400 mt-1">{t("Used to fetch local weather and satellite data.")}</p>
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Farm Details Section */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            {t("Farm Details")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t("Farm Size (Acres)")}</label>
              <input
                type="number"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                placeholder="e.g., 5"
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t("Primary Crop")}</label>
              <input
                type="text"
                value={primaryCrop}
                onChange={(e) => setPrimaryCrop(e.target.value)}
                placeholder={t("e.g., Wheat, Cotton")}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Notifications Section */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            {t("Notification Preferences")}
          </h3>
          <div className="space-y-3">
            {[
              { label: t("Weather Alerts"), state: notifyWeather, setState: setNotifyWeather },
              { label: t("Mandi Price Updates"), state: notifyMandi, setState: setNotifyMandi },
              { label: t("AI Health Reminders"), state: notifyAI, setState: setNotifyAI },
            ].map((item, idx) => (
              <label key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 transition">
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={item.state}
                    onChange={() => item.setState(!item.state)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition ${item.state ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${item.state ? 'translate-x-4' : ''}`}></div>
                </div>
              </label>
            ))}
          </div>
        </section>

        <hr className="border-gray-100" />

        <div className="pt-2">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors w-full sm:w-auto"
            >
              {saved ? t("Saved! Reloading...") : t("Save Preferences")}
            </button>
        </div>

        <hr className="border-gray-100" />

        {/* Danger Zone */}
        <section>
          <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            {t("Danger Zone")}
          </h3>
          <button
            onClick={handleClearData}
            className="border-2 border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 px-6 rounded-xl transition-colors w-full sm:w-auto"
          >
            {t("Clear Local Data & Sign Out")}
          </button>
          <p className="text-xs text-gray-400 mt-2">{t("This will erase your saved language and sign you out.")}</p>
        </section>

      </div>
    </div>
  );
}
