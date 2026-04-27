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
  const [profileName, setProfileName] = useState("Farmer");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage");
    if (savedLang) setLanguage(savedLang);

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const namePart = savedUser.split("@")[0];
      setProfileName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("appLanguage", language);
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

            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors w-full sm:w-auto"
            >
              {saved ? t("Saved! Reloading...") : t("Save Preferences")}
            </button>
          </div>
        </section>

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
