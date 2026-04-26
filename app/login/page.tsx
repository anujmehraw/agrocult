"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveUser } from "../../lib/authStorage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === "admin@agrocult.com" && cleanPassword === "1234") {
      const saved = saveUser(cleanEmail);
      if (!saved) {
        alert("Browser storage is blocked. Please disable private mode and try again.");
        return;
      }
      router.replace("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl border border-emerald-100 bg-amber-50/95 p-7 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Smart Farming Platform
          </p>
          <h1 className="mt-2 text-3xl font-bold text-amber-950">🌾 Agrocult</h1>
          <p className="mt-1 text-sm text-amber-700">Welcome back, farmer</p>
        </div>

        <input
          placeholder="Email"
          className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-amber-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mt-3 w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-amber-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-lime-600 px-4 py-3 font-semibold text-white shadow-md transition active:scale-[0.99]"
        >
          Login
        </button>

        <p className="mt-4 text-center text-xs text-amber-700">
          Demo: admin@agrocult.com / 1234
        </p>
      </div>
    </div>
  );
}