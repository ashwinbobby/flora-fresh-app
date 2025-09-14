"use client";

import { useState } from "react";
import Image from "next/image";
import { Logo, Intro } from "@/app/homepage";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setPrediction(null); // clear previous prediction
    }
  };

  // Handle Predict button click
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Directly call Flask backend
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to get prediction");

      const data = await res.json();
      setPrediction(data.prediction);
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

      {/* Image Upload Section */}
      <div className="flex flex-col items-center p-6 border border-gray-200 rounded-2xl shadow-lg bg-white w-full max-w-md mx-auto">
        <label className="mb-3 w-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 
                       file:mr-4 file:py-2 file:px-4 
                       file:rounded-full file:border-0 
                       file:text-sm file:font-semibold 
                       file:bg-green-100 file:text-green-700 
                       hover:file:bg-green-200 cursor-pointer"
          />
        </label>

        {preview ? (
          <Image
            src={preview}
            alt="Uploaded preview"
            width={400}
            height={300}
            className="rounded-lg w-full h-auto object-contain border"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
            Upload an image
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>

        {prediction !== null && (
          <div className="mt-4 p-3 border rounded bg-green-100 w-full text-center">
            <strong className="text-black">Prediction:</strong>{" "}
            <span className="text-black">{prediction}</span>
          </div>
        )}
      </div>
    </div>
  );
}
