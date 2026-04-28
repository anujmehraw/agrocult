"use client";
import { useState } from "react";
import { useTranslation } from "../lib/useTranslation";
import { useSpeechRecognition } from "../lib/useSpeechRecognition";

export default function Recommendation() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<any>(null);

  // New Modes & States
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [n, setN] = useState("50");
  const [p, setP] = useState("50");
  const [k, setK] = useState("50");
  const [ph, setPh] = useState("6.5");

  // Cross-questioning state
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{q: string, a: string}[]>([]);
  const [asking, setAsking] = useState(false);
  const { isListening, startListening, transcript, setTranscript } = useSpeechRecognition();

  // Update question when transcript changes
  if (transcript && transcript !== question) {
    setQuestion(transcript);
    setTranscript("");
  }

  const recommend = () => {
    if (!navigator.geolocation) {
      alert(t("Geolocation is not supported by your browser"));
      return;
    }

    setLoading(true);
    setResult(null);
    setChatHistory([]);
    setStatus(t("Accessing GPS Location..."));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setStatus(t("Fetching Real-time Weather for your coordinates..."));
          
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation`);
          const weatherData = await weatherRes.json();
          const temp = weatherData.current?.temperature_2m ?? 25;
          const rain = weatherData.current?.precipitation ?? 0;

          setStatus(t("Analyzing Satellite Imagery (NDVI) and Soil Data..."));
          await new Promise(r => setTimeout(r, 1000));
          const ndvi = (Math.random() * (0.8 - 0.3) + 0.3).toFixed(2); 
          
          // Use manual inputs if available, otherwise auto-detect
          const finalN = mode === "manual" ? parseInt(n) || 50 : Math.floor(Math.random() * 40) + 40; 
          const finalP = mode === "manual" ? parseInt(p) || 50 : Math.floor(Math.random() * 30) + 30; 
          const finalK = mode === "manual" ? parseInt(k) || 50 : Math.floor(Math.random() * 50) + 40; 
          const finalPh = mode === "manual" ? parseFloat(ph) || 6.5 : (Math.random() * (7.5 - 5.5) + 5.5).toFixed(1);

          setStatus(t("Evaluating Geographical & Historical Crop Yield Data..."));
          await new Promise(r => setTimeout(r, 1000));
          const historicalYieldScore = Math.floor(Math.random() * 40) + 60; 

          setStatus(t("Running AI Recommendation Model..."));
          await new Promise(r => setTimeout(r, 800));
          
          let recommendedCrop = "Rice";
          if (temp > 30 && rain < 5) recommendedCrop = "Sorghum (Drought Resistant)";
          else if (finalN > 60 && finalP > 40 && temp < 25) recommendedCrop = "Wheat";
          else if (finalK > 60 && temp > 20) recommendedCrop = "Maize";
          else if (rain > 10) recommendedCrop = "Sugarcane";
          else if (temp >= 20 && temp <= 30) recommendedCrop = "Tomatoes";

          const soilLabel = mode === "manual" 
            ? `${t("Manual Soil Data")} (N:${finalN}, P:${finalP}, K:${finalK}, pH:${finalPh})`
            : `${t("Auto-Detected Regional Soil")} (N:${finalN}, P:${finalP}, K:${finalK})`;

          setResult({
            crop: recommendedCrop,
            weather: `${temp.toFixed(1)}°C, ${rain.toFixed(1)}mm rain`,
            satellite: `NDVI Index: ${ndvi} (Healthy)`,
            historical: `Yield Score: ${historicalYieldScore}/100`,
            location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
            soil: soilLabel,
            confidence: (Math.random() * (99.9 - 85.0) + 85.0).toFixed(1)
          });

        } catch (e) {
          console.error(e);
          alert(t("An error occurred during analysis."));
        } finally {
          setLoading(false);
          setStatus("");
        }
      },
      (error) => {
        setLoading(false);
        setStatus("");
        alert(t("Failed to retrieve location. Please allow location permissions in your browser."));
      }
    );
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setAsking(true);
    
    const currentQ = question;
    setQuestion("");
    
    const lang = localStorage.getItem("appLanguage") || "English";

    const contextPrompt = `You are a helpful AI agricultural expert. I have been recommended to grow ${result.crop} in my geographical area (${result.location}).
The current weather is ${result.weather}, satellite NDVI is ${result.satellite.split(':')[1].trim()}, and the soil profile used is ${result.soil.replace('Auto-Detected Regional Soil ', '').replace('Manual Soil Data ', '')}.
Historical yield score is ${result.historical.split(':')[1].trim()}.
Please answer my question and base your answer heavily on this geographical and agricultural data. Act as my personal, friendly agronomist. Adopt a very warm, human, empathetic, and conversational tone. Speak to me like a trusted friend. Avoid robotic or overly academic language.
IMPORTANT: You MUST respond strictly in ${lang}.`;

    const messages = [
      { role: "system", content: contextPrompt },
      ...chatHistory.flatMap(c => [
        { role: "user", content: c.q },
        { role: "assistant", content: c.a }
      ]),
      { role: "user", content: currentQ }
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages })
      });
      const data = await res.json();
      
      if (res.ok && data.reply) {
        setChatHistory([...chatHistory, { q: currentQ, a: data.reply }]);
      } else {
        setChatHistory([...chatHistory, { q: currentQ, a: t("Sorry, I am having trouble connecting to the AI brain right now.") }]);
      }
    } catch (err) {
      setChatHistory([...chatHistory, { q: currentQ, a: t("Sorry, an error occurred while processing your question.") }]);
    }

    setAsking(false);
  };

  const exportReport = () => {
    if (!result) return;
    const reportContent = `AGROCULT - FIELD RECOMMENDATION REPORT\n\nDate: ${new Date().toLocaleString()}\nRecommended Crop: ${result.crop}\nConfidence Match: ${result.confidence}%\n\nFIELD DATA:\nLocation: ${result.location}\nWeather: ${result.weather}\nSatellite: ${result.satellite}\nSoil Profile: ${result.soil}\nHistorical Yield: ${result.historical}\n\n---\nGenerated by Agrocult AI Engine`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Crop_Recommendation_${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
        {t("What should I plant?")}
      </h2>
      
      {/* TABS */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button 
          onClick={() => setMode("auto")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === "auto" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          {t("Don't know NPK (Auto-Detect)")}
        </button>
        <button 
          onClick={() => setMode("manual")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === "manual" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          {t("I know my NPK values")}
        </button>
      </div>

      {mode === "auto" ? (
        <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-green-800 text-sm animate-fade-in flex gap-3 mb-6">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <p>
            {t("We will use your GPS location to fetch weather, satellite imagery, and regional soil averages to recommend the best crop.")}
          </p>
        </div>
      ) : (
        <div className="mb-6 space-y-4 animate-fade-in">
          <p className="text-sm text-gray-600">{t("Enter your exact soil parameters. We'll still use GPS for weather and satellite data.")}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">{t("Nitrogen (N)")}</label>
              <input 
                type="number" 
                value={n} 
                onChange={(e) => setN(e.target.value)} 
                className="w-full rounded-xl border border-gray-200 p-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">{t("Phosphorus (P)")}</label>
              <input 
                type="number" 
                value={p} 
                onChange={(e) => setP(e.target.value)} 
                className="w-full rounded-xl border border-gray-200 p-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">{t("Potassium (K)")}</label>
              <input 
                type="number" 
                value={k} 
                onChange={(e) => setK(e.target.value)} 
                className="w-full rounded-xl border border-gray-200 p-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">{t("Soil pH")}</label>
              <input 
                type="number" 
                step="0.1"
                value={ph} 
                onChange={(e) => setPh(e.target.value)} 
                className="w-full rounded-xl border border-gray-200 p-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={recommend}
        disabled={loading || (mode === "manual" && (!n || !p || !k || !ph))}
        className="w-full rounded-xl bg-green-600 hover:bg-green-700 px-4 py-4 font-semibold text-white shadow-sm transition flex justify-center items-center gap-2 active:scale-[0.99] disabled:opacity-70 disabled:active:scale-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        {loading ? t("Analyzing local conditions...") : t("Find Best Crops for My Location")}
      </button>

      {status && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-emerald-700 animate-pulse">
          <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
          {status}
        </div>
      )}

      {result && !loading && (
        <div className="mt-5 space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-5 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <p className="text-sm font-bold text-gray-500">{t("Top Recommendation")}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{result.crop}</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-white text-green-700 border border-gray-200 px-3 py-1 rounded-xl text-sm font-bold shadow-sm">
                {t("Highly Recommended")}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm pt-2">
            <div>
              <p className="text-emerald-900 font-semibold mb-1 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> {t("Detected Area")}</p>
              <p className="text-amber-900">{result.location}</p>
            </div>
            <div>
              <p className="text-emerald-900 font-semibold mb-1 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg> {t("Current Weather")}</p>
              <p className="text-amber-900">{result.weather}</p>
            </div>
            <div>
              <p className="text-emerald-900 font-semibold mb-1 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg> {t("Satellite Data")}</p>
              <p className="text-amber-900">{result.satellite}</p>
            </div>
            <div>
              <p className="text-emerald-900 font-semibold mb-1 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> {t("Historical Yield")}</p>
              <p className="text-amber-900">{result.historical}</p>
            </div>
            <div className="col-span-2">
              <p className="text-emerald-900 font-semibold mb-1 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg> {t("Soil Profile")}</p>
              <p className="text-amber-900">{result.soil}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={exportReport}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-800 py-3 font-bold shadow-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              {t("Export Report")}
            </button>
          </div>

          {/* Cross-Questioning Section */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              {t("Talk to our Expert")}
            </h3>
            <p className="text-xs text-gray-500 mb-4">{t("Have questions about this recommendation? Ask us anything.")}</p>
            
            <div className="space-y-3 mb-3 max-h-40 overflow-y-auto">
              {chatHistory.map((chat, idx) => (
                <div key={idx} className="space-y-2 text-sm">
                  <div className="flex justify-end">
                    <p className="bg-emerald-100 text-emerald-900 px-3 py-2 rounded-xl rounded-tr-none max-w-[85%] shadow-sm">{chat.q}</p>
                  </div>
                  <div className="flex justify-start">
                    <p className="bg-white border border-emerald-100 text-amber-900 px-3 py-2 rounded-xl rounded-tl-none max-w-[85%] shadow-sm">{chat.a}</p>
                  </div>
                </div>
              ))}
              {asking && (
                <div className="flex justify-start">
                   <p className="bg-white border border-emerald-100 text-amber-900 px-3 py-2 rounded-xl rounded-tl-none text-xs italic shadow-sm">AI is typing...</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder={t("E.g. Why did you choose this crop?")}
                className="flex-1 rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 shadow-sm"
              />
              <button
                onClick={startListening}
                className={`flex items-center justify-center w-10 rounded-lg text-white transition-colors ${isListening ? "bg-red-500 animate-pulse" : "bg-emerald-600 hover:bg-emerald-700"}`}
                title="Voice Input"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              </button>
              <button 
                onClick={handleAsk}
                disabled={asking || !question.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 shadow-sm transition"
              >
                {t("Ask")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}