"use client";
import { useState } from "react";
import Chatbot from "./Chatbot";
import { useTranslation } from "../lib/useTranslation";

export default function FloatingChat() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-8 z-[9999] bg-green-600 hover:bg-green-700 transition-all flex items-center justify-center text-white w-16 h-16 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] text-xl active:scale-95 animate-bounce-subtle"
        title="Ask an Expert"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-28 right-8 z-[9999] w-[90%] sm:w-[380px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-200 overflow-hidden animate-slide-up">

          {/* HEADER */}
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-600 to-green-700 text-white">
            <span className="font-bold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              {t("Ask an Expert")}
            </span>
            <button onClick={() => setOpen(false)} className="hover:text-green-200 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* CHATBOT */}
          <div className="p-2 max-h-[400px] overflow-y-auto">
            <Chatbot />
          </div>

        </div>
      )}
    </>
  );
}