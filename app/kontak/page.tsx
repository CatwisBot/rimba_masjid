"use client";

import { useState } from "react";
import {
  PhoneCall,
  Send,
  CheckCircle2,
  Instagram,
  Youtube,
  MessageCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { CONTACT_INFO, FORM_CATEGORIES } from "@/data/contactData";
import { createPesan } from "@/app/actions/pesan";

export default function KontakPage() {
  const [formData, setFormData] = useState({
    category: "Pertanyaan",
    contact: "",
    name: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await createPesan({
        senderName: formData.name,
        contact: formData.contact,
        category: formData.category,
        message: formData.message,
      });

      if (res.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(res.error || "Gagal mengirim pesan.");
      }
    } catch {
      setSubmitError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background py-10 lg:py-16">
      {/* Background Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-4">
            <PhoneCall className="w-4 h-4 text-accent" />
            <span>Kontak</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text leading-tight tracking-tight">
            Hubungi RIMBA
          </h1>

          <p className="text-base sm:text-lg text-text/75 leading-relaxed mt-4 font-normal max-w-2xl">
            Punya pertanyaan seputar pendaftaran agenda, kerjasama kegiatan, donasi, atau ingin bersilaturahmi? Kami siap menyambut Anda.
          </p>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-16">
          {/* Left Column: Integrated Unified Contact Card */}
        <div className="lg:col-span-5 bg-surface border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-6 divide-y divide-border/60">
              {CONTACT_INFO.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className={`flex items-start gap-4 ${idx !== 0 ? "pt-5" : ""}`}>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 border ${item.badgeColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent block mb-0.5">
                        {item.title}
                      </span>
                      <h3 className="text-base font-bold text-text mb-1">{item.name}</h3>
                      <p className="text-xs text-text/75 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Media Sosial Badges Footer */}
            <div className="pt-6 border-t border-border/60">
              <span className="text-xs font-extrabold uppercase tracking-wider text-text/60 block mb-3">
                Media Sosial Kami
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text/80 hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text/80 hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/6281513983136"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text/80 hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label="Pesan WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Balanced Contact Form */}
          <div className="lg:col-span-7 bg-surface border border-border/80 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col justify-between">
            <div className="mb-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                Kirim Pesan
              </span>
              <h2 className="text-2xl font-black text-text mt-1">
                Formulir Kontak RIMBA
              </h2>
            </div>

            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-text">Pesan Terkirim!</h3>
                <p className="text-sm text-text/80 leading-relaxed max-w-md">
                  Terima kasih! Pesan Anda telah kami terima di sistem Supabase. Pengurus Humas RIMBA akan segera menindaklanjuti pesan Anda.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ category: "Pertanyaan", contact: "", name: "", message: "" });
                  }}
                  className="mt-4 px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-full transition-colors"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Row 1: Kategori & Kontak (opsional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
                      Kategori *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl bg-background border border-border/80 focus:outline-none focus:border-primary text-text cursor-pointer"
                    >
                      {FORM_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
                      Kontak (opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="No. WhatsApp atau email"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl bg-background border border-border/80 focus:outline-none focus:border-primary text-text"
                    />
                  </div>
                </div>

                {/* Row 2: Nama (opsional) */}
                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">
                    Nama (opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl bg-background border border-border/80 focus:outline-none focus:border-primary text-text"
                  />
                </div>

                {/* Row 3: Pesan */}
                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">
                    Pesan *
                  </label>
                  <textarea
                    rows={4}
                    required
                    minLength={5}
                    placeholder="Tulis pesan Anda untuk pengurus..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl bg-background border border-border/80 focus:outline-none focus:border-primary text-text resize-none"
                  />
                </div>

                {/* Row 4: Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 text-sm font-bold text-white bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 text-accent" />
                    )}
                    <span>{isSubmitting ? "Mengirim..." : "Kirim Pesan"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
