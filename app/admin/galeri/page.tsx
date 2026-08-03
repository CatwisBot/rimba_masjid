"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  RefreshCw,
  Loader2,
  AlertCircle,
  ImageIcon,
  X,
} from "lucide-react";
import { getGaleri, createGaleri, deleteGaleri } from "@/app/actions/galeri";
import ImageUpload from "@/components/admin/ImageUpload";

interface GaleriItem {
  id: string;
  title: string;
  category: string;
  image: string;
  caption: string | null;
  createdAt: Date;
}

const CATEGORIES = ["Kajian", "Lomba", "Sosial", "Kebersamaan", "Kegiatan", "Lainnya"];

export default function AdminGaleriPage() {
  const [photos, setPhotos] = useState<GaleriItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<GaleriItem | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Kegiatan",
    image: "",
    caption: "",
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getGaleri();
      if (res.success && res.data) {
        setPhotos(res.data as GaleriItem[]);
      } else {
        setError("Gagal memuat data galeri dari database.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    const res = await deleteGaleri(id);
    if (!res.success) {
      loadData();
      alert("Gagal menghapus foto.");
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Masukkan URL gambar terlebih dahulu.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await createGaleri(formData);
      if (res.success && res.data) {
        setPhotos((prev) => [res.data as GaleriItem, ...prev]);
        setFormData({ title: "", category: "Kegiatan", image: "", caption: "" });
      } else {
        alert("Gagal menyimpan foto.");
      }
    } catch {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-border/80 shadow-2xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-text">Galeri Dokumentasi</h2>
          <p className="text-xs sm:text-sm text-text/70 mt-0.5">
            Kelola foto dan dokumentasi kegiatan RIMBA.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="p-2.5 rounded-xl border border-border/60 text-text/70 hover:text-primary hover:border-primary/40 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2 Col Layout: Gallery Grid + Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Photo Grid */}
        <div className="lg:col-span-8 bg-surface border border-border/80 rounded-3xl p-6 shadow-2xs">
          <h3 className="text-base font-bold text-text mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span>Foto Tersimpan ({photos.length})</span>
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-text/60">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm font-semibold">Memuat galeri...</span>
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-text/50">
              <span className="text-4xl">🖼️</span>
              <p className="text-sm font-semibold">Belum ada foto. Tambah foto pertama!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative rounded-2xl overflow-hidden aspect-square bg-background border border-border/60 shadow-xs cursor-pointer"
                  onClick={() => setPreview(photo)}
                >
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-white text-[11px] font-bold leading-snug line-clamp-2">
                      {photo.title}
                    </p>
                    <span className="text-white/70 text-[10px] mt-0.5">{photo.category}</span>
                  </div>
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Photo Form */}
        <div className="lg:col-span-4 bg-surface border border-border/80 rounded-3xl p-6 shadow-2xs h-fit">
          <h3 className="text-base font-bold text-text mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <span>Tambah Foto</span>
          </h3>
          <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-text mb-1">Judul Foto *</label>
              <input
                type="text"
                required
                placeholder="Nama / judul foto"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
              />
            </div>
            <div>
              <label className="block font-bold text-text mb-1">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {/* Image Upload */}
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              folder="galeri"
              label="Upload Foto *"
            />

            <div>
              <label className="block font-bold text-text mb-1">Keterangan / Caption</label>
              <textarea
                rows={2}
                placeholder="Deskripsi singkat foto..."
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {isSaving ? "Menyimpan..." : "Simpan ke Galeri"}
            </button>
          </form>
        </div>
      </div>

      {/* Photo Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-2xl w-full rounded-3xl overflow-hidden bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image
                src={preview.image}
                alt={preview.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-5">
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                {preview.category}
              </span>
              <h3 className="text-base font-bold text-text mt-2">{preview.title}</h3>
              {preview.caption && (
                <p className="text-xs text-text/70 mt-1">{preview.caption}</p>
              )}
            </div>
            <button
              onClick={() => setPreview(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
