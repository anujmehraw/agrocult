"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../lib/useTranslation";
import { useSpeechRecognition } from "../lib/useSpeechRecognition";

export default function GlobalSearch() {
  const { t, language } = useTranslation();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const { isListening, startListening, transcript, setTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && transcript !== query) {
      setQuery(transcript);
      setTranscript("");
    }
  }, [transcript]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsOpen(true);
    setLoading(true);
    setAnswer("");

    const prompt = `You are an AI Search Engine for a farming application called Agrocult.
Answer the following farming-related query briefly, accurately, and expertly.
IMPORTANT: You MUST respond strictly in ${language}.
Query: ${query}`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "system", content: prompt }]
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAnswer(data.reply);
      } else {
        setAnswer(t("Sorry, an error occurred while searching."));
      }
    } catch (err) {
      setAnswer(t("Failed to connect to the AI search engine."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-lg mx-auto">
      <form onSubmit={handleSearch} className="relative flex items-center w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (answer || loading) setIsOpen(true); }}
          className="w-full bg-slate-100 border border-transparent focus:border-green-500 focus:bg-white text-gray-900 text-sm rounded-full pl-10 pr-12 py-2.5 outline-none transition-all shadow-inner"
          placeholder={t("Search anything about farming (AI)...")}
        />
        <button
          type="button"
          onClick={startListening}
          className={`absolute inset-y-0 right-2 flex items-center justify-center p-1.5 my-1 rounded-full transition-colors ${isListening ? "bg-red-100 text-red-600 animate-pulse" : "text-gray-500 hover:text-green-600 hover:bg-green-50"}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
        </button>
      </form>

      {/* DROPDOWN RESULTS */}
      {isOpen && (query || loading || answer) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-[100] max-h-96 overflow-y-auto animate-slide-up">
          <div className="p-4">
            {loading ? (
              <div className="flex items-center gap-3 text-green-600 text-sm font-medium animate-pulse">
                <span className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
                {t("Searching AI Knowledge Base...")}
              </div>
            ) : answer ? (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  {t("AI Answer")}
                </p>
                <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {answer}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">
                {t("Press Enter to search...")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
