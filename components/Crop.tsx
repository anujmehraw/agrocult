"use client";
import { useRef, useState } from "react";

export default function Crop() {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const analyze = async () => {
    if (!file) return alert("Please select image");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log(data);

      const suggestion =
        data?.result?.disease?.suggestions?.[0];

      setResult({
        disease: suggestion?.name || "Healthy",
        confidence: suggestion?.probability || 0,
        treatment:
          suggestion?.details?.treatment?.chemical?.[0] ||
          "No treatment info available",
      });

    } catch {
      alert("Error analyzing image");
    }

    setLoading(false);
  };

  const reset = () => {
    setFile(null);
    setPreview("");
    setResult(null);
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-amber-50 p-5 shadow-md">

      <h2 className="mb-4 text-lg font-semibold text-emerald-700">
        🌿 Crop Disease Detection
      </h2>

      {/* HIDDEN INPUTS */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) =>
          e.target.files && handleImage(e.target.files[0])
        }
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          e.target.files && handleImage(e.target.files[0])
        }
      />

      {/* BUTTONS */}
      {!preview && (
        <div className="flex gap-3">
          <button
            onClick={() => cameraRef.current?.click()}
            className="flex-1 rounded-lg bg-gradient-to-r from-emerald-600 to-lime-600 py-3 text-white"
          >
            Camera
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 rounded-lg border border-amber-200 bg-white py-3 text-amber-900"
          >
            Upload Photo
          </button>
        </div>
      )}

      {/* PREVIEW */}
      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="preview"
            className="rounded-lg border border-amber-100"
          />

          <div className="flex gap-2 mt-3">
            <button
              onClick={analyze}
              className="flex-1 rounded-lg bg-emerald-700 py-2 text-white"
            >
              {loading ? "Analyzing..." : "Use Photo"}
            </button>

            <button
              onClick={reset}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg"
            >
              Retake
            </button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-lime-50 p-4 text-amber-900">

          <p><b>🦠 Disease:</b> {result.disease}</p>

          <p>
            <b>📊 Confidence:</b>{" "}
            {(result.confidence * 100).toFixed(1)}%
          </p>

          <p className="mt-2">
            <b>💊 Treatment:</b> {result.treatment}
          </p>

        </div>
      )}

    </div>
  );
}