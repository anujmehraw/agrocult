"use client";
import { useState } from "react";
export default function Crop() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const upload = async () => {
    if (!file) return alert("Upload or capture image");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/predict", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto">

      <h2 className="text-xl font-semibold mb-4 text-green-700">
        🌿 Crop Detection
      </h2>

      {/* CAMERA + FILE */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="w-full border p-2 rounded-lg"
        onChange={(e) => handleFile(e.target.files?.[0] as File)}
      />

      {/* PREVIEW */}
      {preview && (
        <img
          src={preview}
          className="mt-4 rounded-lg shadow"
        />
      )}

      <button
        onClick={upload}
        className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        {loading ? "Analyzing..." : "Analyze Crop"}
      </button>

      {/* RESULT */}
      {data && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg space-y-2">

          <p>
            <b>Prediction:</b>{" "}
            {data.disease === "Unknown"
              ? "Plant detected (AI confidence low)"
              : data.disease}
          </p>

          <p>
            <b>Confidence:</b>{" "}
            {(data.confidence * 100).toFixed(1)}%
          </p>

          <p>
            <b>Risk:</b>{" "}
            <span className="text-green-700">{data.risk}</span>
          </p>

          <p>
            <b>Advice:</b> {data.irrigation}
          </p>
        </div>
      )}
    </div>
  );
}