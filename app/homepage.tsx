"use client";
import { useState } from "react";
import Image from "next/image";

export function Logo() {
  return (
    <div className="flex justify-center mb-6">
      <Image
        src="/logo.png"
        width={160}
        height={160}
        alt="logo of product"
        className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40"
      />
    </div>
  );
}

export function Intro() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-green-700 mb-3">
        Flora-Fresh
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-600">
        Check plant health instantly with AI-powered detection.
      </p>
    </div>
  );
}

interface ImageCardProps {
  file: File | null;
  setFile: (file: File | null) => void;
  preview: string | null;
  setPreview: (url: string | null) => void;
}

export function ImageCard({ file, setFile, preview, setPreview }: ImageCardProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  return (
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
    </div>
  );
}
