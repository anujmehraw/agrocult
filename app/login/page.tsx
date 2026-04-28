"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveUser } from "../../lib/authStorage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    setIsLoading(true);

    setTimeout(() => {
      if (cleanEmail === "admin@agrocult.com" && cleanPassword === "1234") {
        const saved = saveUser(cleanEmail);
        if (!saved) {
          alert("Browser storage is blocked. Please disable private mode and try again.");
          setIsLoading(false);
          return;
        }
        router.replace("/");
      } else {
        alert("Invalid credentials. Try: admin@agrocult.com / 1234");
        setIsLoading(false);
      }
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/farm_background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-green-950/40 to-black/70" />

      {/* Floating grain texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        {/* Top badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Smart Farming Platform
          </span>
        </div>

        {/* Glassmorphism card */}
        <div
          className="rounded-3xl border border-white/20 p-10 shadow-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.10)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Logo & heading */}
          <div className="text-center mb-10">
            <div className="text-6xl mb-3">🌾</div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Agrocult
            </h1>
            <p className="mt-2 text-green-200 text-base font-medium">
              Welcome back, farmer 🙏
            </p>
            <p className="mt-1 text-white/40 text-sm">
              Your AI-powered farm assistant
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-green-200 mb-2 ml-1">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="admin@agrocult.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white placeholder-white/40 text-base outline-none transition-all duration-200 focus:border-emerald-400 focus:bg-white/20 focus:ring-2 focus:ring-emerald-400/30"
                style={{ backdropFilter: "blur(8px)" }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-200 mb-2 ml-1">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white placeholder-white/40 text-base outline-none transition-all duration-200 focus:border-emerald-400 focus:bg-white/20 focus:ring-2 focus:ring-emerald-400/30"
                style={{ backdropFilter: "blur(8px)" }}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            id="login-submit"
            onClick={handleLogin}
            disabled={isLoading}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-900/40 transition-all duration-200 hover:from-emerald-400 hover:to-lime-400 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login to Your Farm
              </>
            )}
          </button>

          {/* Demo hint */}
          <div className="mt-6 text-center">
            <p className="text-white/40 text-xs font-medium">
              Demo credentials
            </p>
            <p className="text-white/60 text-sm font-mono mt-1">
              admin@agrocult.com &nbsp;/&nbsp; 1234
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-white/30 text-xs mt-6 font-medium tracking-wide">
          🌱 Empowering Indian farmers with AI · Agrocult 2026
        </p>
      </div>
    </div>
  );
}