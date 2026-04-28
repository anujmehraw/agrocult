"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../lib/useTranslation";

export default function Chatbot() {
  const { t } = useTranslation();
  const [chat, setChat] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState<any[]>([]);
  const [lang, setLang] = useState("en-IN");
  const [appLanguage, setAppLanguage] = useState("English");

  const LANG_MAP: Record<string, string> = {
    "English": "en-IN",
    "Hindi": "hi-IN",
    "Tamil": "ta-IN",
    "Telugu": "te-IN",
    "Kannada": "kn-IN",
    "Marathi": "mr-IN",
    "Gujarati": "gu-IN",
    "Punjabi": "pa-IN",
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage");
    if (savedLang) {
      setAppLanguage(savedLang);
      if (LANG_MAP[savedLang]) {
        setLang(LANG_MAP[savedLang]);
      }
    }
  }, []);

  const recognitionRef = useRef<any>(null);

  // 🔊 LOAD VOICES (IMPORTANT FIX)
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // 🎤 START VOICE INPUT
  const startListening = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;

    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;

      console.log("VOICE:", text);

      setListening(false);
      handleSend(text, true);
    };

    recognition.onerror = (e: any) => {
      console.log("VOICE ERROR:", e);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  };

  // 🔊 SPEAK RESPONSE WITH ACCENT
  const speak = (text: string) => {
    const utter = new SpeechSynthesisUtterance(text);

    const voice =
      voices.find((v) => v.lang === lang) ||
      voices.find((v) => v.lang.includes(lang));

    if (voice) utter.voice = voice;

    utter.lang = lang;
    utter.rate = 1;
    utter.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  // 🤖 SEND MESSAGE (TEXT + VOICE)
  const handleSend = async (msg?: string, isVoice: boolean = false) => {
    const userMsg = msg || input;
    if (!userMsg) return;

    setInput("");

    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const messages = [
        { role: "system", content: `You are a helpful agricultural AI assistant. Act as a personal, friendly agronomist. Adopt a very warm, human, empathetic, and conversational tone. Speak to the user like a trusted friend. Avoid robotic or overly academic language. You MUST respond strictly in ${appLanguage}. If the user speaks in a certain language, reply in that same language.` },
        ...chat.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text })),
        { role: "user", content: userMsg }
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      const data = await res.json();
      setLoading(false);

      const reply = data?.reply || "No response from AI";

      setChat((prev) => [
        ...prev,
        { role: "bot", text: reply },
      ]);

      if (isVoice) speak(reply);

    } catch {
      setLoading(false);
      const fallback = "AI is not available right now";

      setChat((prev) => [
        ...prev,
        { role: "bot", text: fallback },
      ]);

      if (isVoice) speak(fallback);
    }
  };

  return (
    <div className="space-y-4">

      {/* 💬 CHAT */}
      <div className="h-80 overflow-y-auto space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col">
        {chat.length === 0 && (
          <div className="text-center text-slate-400 mt-10 font-medium text-sm">
             {t("Hello! I am your AI Agronomist. How can I help you today?")}
          </div>
        )}
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-green-600 text-white rounded-br-sm" : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-sm"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm rounded-bl-sm flex gap-1.5 items-center">
               <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: "0.15s"}}></span>
               <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: "0.3s"}}></span>
            </div>
          </div>
        )}
      </div>

      {/* ✍️ INPUT + BUTTONS */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("Type your question here...")}
          className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-green-500 rounded-full px-5 py-2.5 outline-none shadow-inner text-sm transition-colors"
        />

        {/* 🎤 MIC */}
        <button
          type="button"
          onClick={startListening}
          className={`flex items-center justify-center w-11 h-11 rounded-full text-white transition-all shadow-sm ${
            listening ? "bg-red-500 animate-pulse" : "bg-green-600 hover:bg-green-700"
          }`}
          title="Voice Input"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
        </button>

        {/* SEND */}
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white w-11 h-11 rounded-full flex items-center justify-center transition shadow-sm"
        >
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </button>
      </form>

    </div>
  );
}