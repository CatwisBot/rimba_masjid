"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Calendar,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

export interface GaleriItem {
  id: string;
  title: string;
  category: string;
  image: string;
  caption: string | null;
  createdAt: Date | string;
}

const DEFAULT_CATEGORIES = ["Semua", "Kajian", "Lomba", "Sosial", "Kebersamaan"];

interface GaleriClientProps {
  initialPhotos: GaleriItem[];
}

export default function GaleriClient({ initialPhotos }: GaleriClientProps) {
  const [photos] = useState<GaleriItem[]>(initialPhotos);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const dynamicCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...photos.map((p) => p.category)])
  );

  const filteredPhotos = photos.filter(
    (item) => selectedCategory === "Semua" || item.category === selectedCategory
  );

  const handlePrevImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex(
      (prev) => (prev! - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  };

  const handleNextImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! + 1) % filteredPhotos.length);
  };

  const activePhoto =
    activeImageIndex !== null && filteredPhotos[activeImageIndex]
      ? filteredPhotos[activeImageIndex]
      : null;

  return (
    <main className="min-h-screen bg-background py-10 lg:py-16">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-4">
            <ImageIcon className="w-4 h-4 text-accent" />
            <span>Dokumentasi & Kenangan</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text leading-tight tracking-tight">
            Galeri Kegiatan RIMBA
          </h1>

          <p className="text-base sm:text-lg text-text/75 leading-relaxed mt-4 font-normal max-w-2xl">
            Kumpulan momen kebersamaan, dokumentasi kegiatan keislaman, perlombaan, dan aksi sosial Remaja Islam Masjid Albarkah.
          </p>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {dynamicCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-surface border border-border/80 text-text/70 hover:text-primary hover:bg-background"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-surface rounded-3xl border border-border/80 p-8 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text">Belum ada foto dipublikasikan</h3>
            <p className="text-xs text-text/70">
              Dokumentasi kegiatan belum ditambahkan di database. Silakan periksa kembali nanti.
            </p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-16 text-text/60">
            Tidak ada foto untuk kategori &quot;{selectedCategory}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setActiveImageIndex(index)}
                className="group relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden bg-surface border border-border/70 shadow-2xs hover:shadow-xl cursor-pointer transition-all duration-300"
              >
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-108 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary text-white w-max mb-2">
                    {photo.category}
                  </span>
                  <h4 className="text-sm font-bold leading-snug line-clamp-2">
                    {photo.title}
                  </h4>
                  {photo.caption && (
                    <p className="text-xs text-white/80 line-clamp-1 mt-1">
                      {photo.caption}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-white/70 border-t border-white/20 pt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-accent" />
                      {new Date(photo.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={handlePrevImage}
            className="absolute left-4 sm:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextImage}
            className="absolute right-4 sm:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
            <div className="relative w-full aspect-16/10 max-h-[70vh] rounded-2xl overflow-hidden mb-4">
              <Image
                src={activePhoto.image}
                alt={activePhoto.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <div className="text-center text-white max-w-xl">
              <div className="inline-block px-3 py-1 text-xs font-bold bg-primary rounded-full mb-2">
                {activePhoto.category}
              </div>
              <h3 className="text-lg font-bold">{activePhoto.title}</h3>
              {activePhoto.caption && (
                <p className="text-xs text-white/80 mt-1">{activePhoto.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
