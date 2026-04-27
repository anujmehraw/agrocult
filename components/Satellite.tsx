"use client";
import { useState } from "react";

export default function Satellite() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const lat = 23.2599;
  const lon = 77.4126;

  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const url = maptilerKey
    ? `https://api.maptiler.com/maps/satellite/static/${lon},${lat},14/600x300.png?key=${maptilerKey}`
    : "";

  return (
    <div className="bg-white p-4 rounded-xl shadow">

      <h3 className="font-semibold mb-2">
        🛰 Satellite View
      </h3>

      {!loaded && !error && maptilerKey && (
        <p>Loading satellite image...</p>
      )}

      {!maptilerKey ? (
        <p className="text-red-600">
          Missing NEXT_PUBLIC_MAPTILER_KEY in .env.local
        </p>
      ) : !error ? (
        <img
          src={url}
          alt="satellite"
          className="rounded-lg w-full"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        <p className="text-red-600">
          Failed to load satellite image
        </p>
      )}

      <p className="text-sm text-gray-600 mt-2">
        Powered by MapTiler satellite imagery
      </p>

    </div>
  );
}