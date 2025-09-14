"use client";

import { useState } from "react";
import Image from "next/image";
import { Logo, Intro, ImageCard } from "@/app/homepage";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to get prediction");

      const data = await res.json();
      setPrediction(data.prediction); // adjust if your API response is different
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-white">
      <Logo />
      <Intro />
      <ImageCard />

      {/* ===== Add File Upload Section ===== */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {prediction && (
        <div className="mt-4 p-2 border rounded bg-green-100">
          <strong>Prediction:</strong> {prediction}
        </div>
      )}
    </div>
  );
}
