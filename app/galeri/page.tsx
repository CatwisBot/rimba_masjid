"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Calendar,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { getGaleri } from "@/app/actions/galeri";

export interface GaleriItem {
  id: string;
  title: string;
  category: string;
  image: string;
  caption: string | null;
  createdAt: Date | string;
}

const DEFAULT_CATEGORIES = ["Semua", "Kajian", "Lomba", "Sosial", "Kebersamaan"];

export default function GaleriPage() {
  const [photos, setPhotos] = useState<GaleriItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getGaleri();
      if (res.success && res.data) {
        setPhotos(res.data as GaleriItem[]);
      } else {
        setError("Gagal memuat galeri foto dari database.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  // Combine default categories with unique categories from DB
  const dynamicCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...photos.map((p) => p.category)])
  );

  const filteredGallery = selectedCategory === "Semua"
    ? photos
    : photos.filter((item) => item.category === selectedCategory);

  const handlePrevImage = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex(
        activeImageIndex === 0 ? filteredGallery.length - 1 : activeImageIndex - 1
      );
    }
  };

  const handleNextImage = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex(
        activeImageIndex === filteredGallery.length - 1 ? 0 : activeImageIndex + 1
      );
    }
  };

  const activeItem = activeImageIndex !== null ? filteredGallery[activeImageIndex] : null;

  return (
    <main className="min-h-screen bg-background py-10 lg:py-16">
      {/* Background Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-4">
            <ImageIcon className="w-4 h-4 text-accent" />
            <span>Galeri</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text leading-tight tracking-tight">
            Dokumentasi Kegiatan
          </h1>

          <p className="text-base sm:text-lg text-text/75 leading-relaxed mt-4 font-normal max-w-2xl">
            Kumpulan momen indah, dokumentasi kegiatan keislaman, aksi sosial, dan kebersamaan remaja masjid RIMBA Masjid Albarkah.
          </p>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {dynamicCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-surface text-text/80 hover:text-primary hover:bg-white border border-border"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid / Loading / Empty */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-text/60">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-sm font-semibold">Memuat galeri dari Supabase...</span>
          </div>
        ) : filteredGallery.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-surface rounded-3xl border border-border/80 p-8 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text">Belum ada foto dipublikasikan</h3>
            <p className="text-xs text-text/70">
              Dokumentasi foto kegiatan belum ditambahkan di database. Silakan periksa kembali nanti.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredGallery.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setActiveImageIndex(index)}
                className="group relative rounded-3xl bg-surface border border-border/80 overflow-hidden shadow-2xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Photo Image Container */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-background">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transform group-hover:scale-108 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Top Badge Category */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 text-xs font-bold text-white bg-primary/90 backdrop-blur-md rounded-full shadow-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Center Hover Zoom Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Bottom Overlay Title & Date */}
                  <div className="absolute bottom-3 left-4 right-4 z-10 text-white">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/80 font-medium mb-1">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="text-base font-bold leading-snug line-clamp-1 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Caption Footer */}
                {item.caption && (
                  <div className="p-4 bg-surface text-xs text-text/75 leading-relaxed">
                    <p className="line-clamp-2">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Preview Modal */}
      {activeItem && activeImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          {/* Close Button */}
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors z-30"
            aria-label="Tutup Preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev Button */}
          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors z-30 hidden sm:flex"
            aria-label="Foto Sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation Next Button */}
          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors z-30 hidden sm:flex"
            aria-label="Foto Berikutnya"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Main Content Box */}
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center">
            <div className="relative w-full aspect-video max-h-[65vh] rounded-2xl overflow-hidden bg-black mb-4">
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <div className="w-full text-center text-white px-4 space-y-1.5">
              <div className="flex items-center justify-center gap-2 text-xs text-white/70">
                <span className="px-3 py-0.5 font-bold text-white bg-primary rounded-full">
                  {activeItem.category}
                </span>
                <span>•</span>
                <span>
                  {new Date(activeItem.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{activeItem.title}</h3>
              {activeItem.caption && (
                <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
                  {activeItem.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
