"use client";
import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [chat, setChat] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState<any[]>([]);
  const [lang, setLang] = useState("en-IN");

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
      handleSend(text);
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
  const handleSend = async (msg?: string) => {
    const userMsg = msg || input;
    if (!userMsg) return;

    setInput("");

    setChat((prev) => [...prev, { role: "user", text: userMsg }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      const reply = data?.reply || "No response from AI";

      setChat((prev) => [
        ...prev,
        { role: "bot", text: reply },
      ]);

      speak(reply);

    } catch {
      const fallback = "AI is not available right now";

      setChat((prev) => [
        ...prev,
        { role: "bot", text: fallback },
      ]);

      speak(fallback);
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
          placeholder="Ask something..."
          className="flex-1 border p-2 rounded"
        />

        {/* 🎤 MIC */}
        <button
          onClick={startListening}
          className={`px-3 rounded text-white ${
            listening ? "bg-red-500" : "bg-green-600"
          }`}
        >
          🎤
        </button>

        {/* SEND */}
        <button
          onClick={() => handleSend()}
          className="bg-green-700 text-white px-3 rounded"
        >
          Send
        </button>
      </div>

      {/* 🌍 LANGUAGE SELECT */}
      <div className="text-sm">
        <label className="mr-2">Voice Language:</label>

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="en-IN">🇮🇳 English (India)</option>
          <option value="hi-IN">🇮🇳 Hindi</option>
          <option value="ta-IN">🇮🇳 Tamil</option>
          <option value="te-IN">🇮🇳 Telugu</option>
          <option value="mr-IN">🇮🇳 Marathi</option>
          <option value="bn-IN">🇮🇳 Bengali</option>
          <option value="gu-IN">🇮🇳 Gujarati</option>
          <option value="kn-IN">🇮🇳 Kannada</option>
          <option value="ml-IN">🇮🇳 Malayalam</option>
          <option value="pa-IN">🇮🇳 Punjabi</option>
        </select>
      </div>

    </div>
  );
}