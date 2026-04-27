"use client";
import { useState } from "react";
import Chatbot from "./Chatbot";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 💬 FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-green-600 text-white w-14 h-14 rounded-full shadow-lg text-xl"
      >
        💬
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-20 right-5 w-[90%] sm:w-[350px] bg-white rounded-xl shadow-xl border">

          {/* HEADER */}
          <div className="flex justify-between items-center p-2 bg-green-600 text-white rounded-t-xl">
            <span>Smart Chat</span>
            <button onClick={() => setOpen(false)}>✖</button>
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