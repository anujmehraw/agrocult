"use client";
import { useState } from "react";

export default function Recommendation() {
  const [n, setN] = useState("");
  const [p, setP] = useState("");
  const [k, setK] = useState("");
  const [result, setResult] = useState("");

  const recommend = () => {
    const N = Number(n), P = Number(p), K = Number(k);

    if (N > 50 && P > 40) setResult("🌾 Wheat");
    else if (K > 60) setResult("🌽 Maize");
    else setResult("🌱 Rice");
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-emerald-100 bg-amber-50 p-6 shadow">
      <h2 className="text-xl font-bold text-amber-950">🌱 Crop Recommendation</h2>
      <p className="mt-1 text-sm text-amber-700">
        Enter soil nutrients to get a suitable crop suggestion for your field.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input
          placeholder="Nitrogen (N)"
          onChange={(e) => setN(e.target.value)}
          className="rounded-xl border border-amber-200 bg-white px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
        <input
          placeholder="Phosphorus (P)"
          onChange={(e) => setP(e.target.value)}
          className="rounded-xl border border-amber-200 bg-white px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
        <input
          placeholder="Potassium (K)"
          onChange={(e) => setK(e.target.value)}
          className="rounded-xl border border-amber-200 bg-white px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <button
        onClick={recommend}
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-lime-600 px-4 py-3 font-semibold text-white shadow transition active:scale-[0.99]"
      >
        Recommend Crop
      </button>

      {result && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-lime-50 p-3">
          <p className="text-sm text-amber-700">Best match for your soil profile:</p>
          <p className="text-lg font-bold text-emerald-700">{result}</p>
        </div>
      )}
    </div>
  );
}