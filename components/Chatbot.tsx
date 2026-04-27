"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../lib/useTranslation";

export default function Chatbot() {
  const { t } = useTranslation();
  const [chat, setChat] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
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

    try {
      const messages = [
        { role: "system", content: `You are a helpful agricultural AI assistant. You MUST respond strictly in ${appLanguage}. If the user speaks in a certain language, reply in that same language.` },
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

      const reply = data?.reply || "No response from AI";

      setChat((prev) => [
        ...prev,
        { role: "bot", text: reply },
      ]);

      if (isVoice) speak(reply);

    } catch {
      const fallback = "AI is not available right now";

      setChat((prev) => [
        ...prev,
        { role: "bot", text: fallback },
      ]);

      if (isVoice) speak(fallback);
    }
  };

  return (
    <div className="space-y-3">

      {/* 💬 CHAT */}
      <div className="h-64 overflow-y-auto space-y-2 border p-2 rounded">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg text-sm ${
              msg.role === "user"
                ? "bg-green-100 text-right"
                : "bg-gray-100"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* ✍️ INPUT + BUTTONS */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("Ask something...")}
          className="flex-1 border p-2 rounded"
        />

        {/* 🎤 MIC */}
        <button
          onClick={startListening}
          className={`flex items-center justify-center w-10 rounded text-white ${
            listening ? "bg-red-500" : "bg-green-600 hover:bg-green-700"
          }`}
          title="Voice Input"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
        </button>

        {/* SEND */}
        <button
          onClick={() => handleSend()}
          className="bg-green-700 hover:bg-green-800 text-white px-4 rounded font-medium transition"
        >
          {t("Send")}
        </button>
      </div>

    </div>
  );
}