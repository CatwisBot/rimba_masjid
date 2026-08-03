"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { createAgenda } from "@/app/actions/agenda";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminAgendaTambahPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Kajian Islami",
    description: "",
    formattedDate: "",
    time: "08.00 WIB",
    location: "Masjid Al-Barkah",
    image: "",
    deadline: "",
    requirements: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const res = await createAgenda(formData);
      if (res.success) {
        router.push("/admin/agenda");
      } else {
        setError(res.error || "Gagal membuat agenda.");
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
            href="/admin/agenda"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-text/70 hover:text-primary mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Agenda</span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-black text-text">Tambah Agenda Baru</h2>
          <p className="text-xs sm:text-sm text-text/70 mt-0.5">
            Buat jadwal kajian, lomba islami, atau kegiatan rutin remaja masjid.
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
            <label className="block font-bold text-text mb-1.5">Judul Agenda *</label>
            <input
              type="text"
              required
              placeholder="Masukkan judul agenda"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
            />
          </div>

          <div>
            <label className="block font-bold text-text mb-1.5">Kategori *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Kajian Islami, Lomba Tahfidz, Bakti Sosial"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-text mb-1.5">Tanggal Pelaksanaan *</label>
              <input
                type="text"
                required
                placeholder="Sabtu, 15 Agustus 2026"
                value={formData.formattedDate}
                onChange={(e) => setFormData({ ...formData, formattedDate: e.target.value })}
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
              />
            </div>

            <div>
              <label className="block font-bold text-text mb-1.5">Waktu Pelaksanaan</label>
              <input
                type="text"
                placeholder="08.00 - 12.00 WIB"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-text mb-1.5">Lokasi Pelaksanaan</label>
            <input
              type="text"
              placeholder="Masjid Al-Barkah / Ruang Utama"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
            />
          </div>

          {/* Registration Info Box */}
          <div className="p-4 bg-background border border-border/80 rounded-2xl space-y-4">
            <span className="font-bold text-primary text-xs uppercase tracking-wider block">
              Informasi Pendaftaran Agenda
            </span>
            <div>
              <label className="block font-semibold text-text mb-1.5">Batas Pendaftaran</label>
              <input
                type="text"
                placeholder="Contoh: 14 Agustus 2026, 23.59 WIB"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-surface border border-border focus:outline-none focus:border-primary text-text"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1.5">
                Syarat & Ketentuan Pendaftaran
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: 1. Beragama Islam&#10;2. Usia 13-25 tahun&#10;3. Membawa Al-Qur'an"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-surface border border-border focus:outline-none focus:border-primary text-text resize-none"
              />
            </div>
          </div>

          {/* Image Upload */}
          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            folder="agenda"
            label="Gambar Cover Agenda"
          />

          <div>
            <label className="block font-bold text-text mb-1.5">Deskripsi Lengkap *</label>
            <textarea
              rows={5}
              required
              placeholder="Tuliskan deskripsi lengkap agenda kegiatan..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text resize-y"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Link
              href="/admin/agenda"
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
              <span>Simpan & Publikasikan Agenda</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
