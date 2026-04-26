"use client";
import { useState } from "react";

export default function Chatbot() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!msg.trim()) return;

    const userMessage = msg;
    setMsg("");

    // ✅ Add user message
    setChat((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      // ✅ Add bot response
      setChat((prev) => [
        ...prev,
        { role: "bot", text: data.reply },
      ]);

    } catch {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "Error. Try again." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-emerald-100 bg-amber-50 p-5 shadow">
      <h2 className="mb-1 text-xl font-bold text-amber-950">
        💬 Smart Farming Chat
      </h2>
      <p className="mb-4 text-sm text-amber-700">
        Ask questions on crop health, irrigation, and farming practices.
      </p>

      <div className="mb-3 h-72 space-y-3 overflow-y-auto rounded-xl border border-amber-100 bg-white p-3">
        {chat.map((c, i) => (
          <div key={i}>
            <div
              className={`max-w-[85%] rounded-xl p-3 text-sm leading-relaxed shadow-sm ${
                c.role === "user"
                  ? "ml-auto bg-emerald-600 text-right text-white"
                  : "bg-lime-50 text-amber-900"
              }`}
            >
              {c.text}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-sm italic text-amber-700">
            AI is typing...
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-amber-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          placeholder="Ask about crops, irrigation..."
        />
        <button
          onClick={send}
          className="rounded-xl bg-gradient-to-r from-emerald-600 to-lime-600 px-5 py-3 font-semibold text-white shadow transition active:scale-[0.99]"
        >
          Send
        </button>
      </div>

    </div>
  );
}