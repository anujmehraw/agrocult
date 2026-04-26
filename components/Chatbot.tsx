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

    // ✅ Add user message ONCE
    setChat((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ FIXED
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      // ✅ Only bot reply added here
      setChat((prev) => [
        ...prev,
        { role: "bot", text: data.reply },
      ]);

    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "Error. Try again." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto">

      <h2 className="font-semibold mb-4 text-green-700">
        💬 Smart Farming Chat
      </h2>

      {/* CHAT */}
      <div className="h-64 overflow-y-auto space-y-3 mb-3">

        {chat.map((c, i) => (
          <div key={i}>
            <div
              className={`p-2 rounded-lg max-w-[80%] ${
                c.role === "user"
                  ? "ml-auto bg-green-100 text-right"
                  : "bg-gray-100"
              }`}
            >
              {c.text}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-sm text-gray-500">AI is typing...</p>
        )}

      </div>

      {/* INPUT */}
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        className="border p-2 w-full rounded"
        placeholder="Ask about crops, irrigation..."
      />

      <button
        onClick={send}
        className="mt-3 bg-green-600 text-white w-full p-2 rounded hover:bg-green-700"
      >
        Send
      </button>

    </div>
  );
}