"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { createBerita } from "@/app/actions/berita";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminBeritaTambahPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Kegiatan",
    excerpt: "",
    content: "",
    image: "",
    author: "Admin RIMBA",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const res = await createBerita(formData);
      if (res.success) {
        router.push("/admin/berita");
      } else {
        setError(res.error || "Gagal membuat berita.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi database.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back Link & Header */}
      <div className="flex items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-border/80 shadow-2xs">
        <div>
          <Link
            href="/admin/berita"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-text/70 hover:text-primary mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Berita</span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-black text-text">Buat Berita Baru</h2>
          <p className="text-xs sm:text-sm text-text/70 mt-0.5">
            Tulis dan publikasikan berita kegiatan atau pengumuman resmi ke website.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-surface border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-text mb-1.5">Judul Berita *</label>
            <input
              type="text"
              required
              placeholder="Masukkan judul berita yang menarik"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-text mb-1.5">Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text cursor-pointer"
              >
                <option value="Kegiatan">Kegiatan</option>
                <option value="Pengumuman">Pengumuman</option>
                <option value="Lomba">Lomba</option>
                <option value="Edukasi">Edukasi</option>
                <option value="Sosial">Sosial</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-text mb-1.5">Penulis</label>
              <input
                type="text"
                placeholder="Nama penulis / divisi"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
              />
            </div>
          </div>

          {/* Image Upload */}
          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            folder="berita"
            label="Gambar Cover Berita"
          />

          <div>
            <label className="block font-bold text-text mb-1.5">Ringkasan / Excerpt *</label>
            <textarea
              rows={3}
              required
              placeholder="Tuliskan ringkasan singkat berita (akan tampil di kartu berita front-end)..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-text mb-1.5">Isi Lengkap Berita *</label>
            <textarea
              rows={10}
              required
              placeholder="Tuliskan konten berita secara lengkap. Pisahkan antar paragraf dengan baris baru..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text resize-y"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Link
              href="/admin/berita"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-text/70 hover:text-text bg-background border border-border rounded-xl transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Publikasikan Berita</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
