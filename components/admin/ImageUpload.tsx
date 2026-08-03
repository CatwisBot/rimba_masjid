"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "general",
  label = "Gambar",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Upload gagal.");
      } else {
        onChange(data.url);
      }
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="block font-bold text-text text-xs">{label}</label>

      {/* Drop Zone / Trigger */}
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
          isDragging
            ? "border-primary bg-primary/5"
            : value
            ? "border-border/60 bg-background"
            : "border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5"
        } ${isUploading ? "pointer-events-none" : ""}`}
      >
        {value ? (
          /* Preview */
          <div className="relative aspect-video w-full">
            <Image
              src={value}
              alt="Preview gambar"
              fill
              className="object-cover"
              unoptimized
            />
            {/* Overlay buttons */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-text font-bold text-xs rounded-xl shadow-md hover:bg-primary hover:text-white transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Ganti
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-red-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Hapus
              </button>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-text/50">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-xs font-semibold text-primary">Mengupload gambar...</span>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-text">
                    <span className="text-primary">Klik untuk upload</span> atau drag & drop
                  </p>
                  <p className="text-[11px] mt-0.5">JPG, PNG, WEBP — Maks. 5MB</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Upload progress overlay */}
        {isUploading && value && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
              <span className="text-white text-xs font-bold">Mengupload...</span>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
