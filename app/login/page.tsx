"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === "admin@agrocult.com" && cleanPassword === "1234") {
      localStorage.setItem("user", cleanEmail);
      window.location.href = "/"; // go to main app
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-100">
      <div className="bg-white p-8 rounded-xl shadow w-80">

        <h1 className="text-xl font-bold text-center text-green-600">
          🌾 Agrocult
        </h1>

        <input
          placeholder="Email"
          className="w-full p-2 border mt-4 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mt-2 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full mt-4 bg-green-600 text-white p-2 rounded"
        >
          Login
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          Demo: admin@agrocult.com / 1234
        </p>
      </div>
    </div>
  );
}