"use client";

import { useState } from "react";
import { Settings, ShieldCheck, Save, CheckCircle2 } from "lucide-react";

export default function AdminPengaturanPage() {
  const [siteName, setSiteName] = useState("Remaja Islam Masjid Albarkah");
  const [siteShortName, setSiteShortName] = useState("RIMBA");
  const [contactPhone, setContactPhone] = useState("+62 812-3456-7890");
  const [contactEmail, setContactEmail] = useState("info@rimbamasjid.or.id");
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-2xs">
        <h2 className="text-xl sm:text-2xl font-black text-text">Pengaturan Sistem</h2>
        <p className="text-xs sm:text-sm text-text/70 mt-0.5">
          Konfigurasi identitas organisasi, kontak sekretariat, dan manajemen hak akses admin.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pengaturan berhasil disimpan!</span>
        </div>
      )}

      {/* Form Settings Card */}
      <div className="bg-surface border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
          
          <div className="border-b border-border pb-4">
            <h3 className="text-base font-bold text-text flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              <span>Identitas Situs & Organisasi</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-text mb-1">Nama Organisasi *</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
              />
            </div>

            <div>
              <label className="block font-bold text-text mb-1">Singkatan / Akronim *</label>
              <input
                type="text"
                value={siteShortName}
                onChange={(e) => setSiteShortName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-text mb-1">No. WhatsApp / Telepon *</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
              />
            </div>

            <div>
              <label className="block font-bold text-text mb-1">Email Resmi Sekretariat *</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
              />
            </div>
          </div>

          {/* Account Roles Reference */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-base font-bold text-text flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Hak Akses Peran (Roles)</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-background border border-border">
                <span className="font-extrabold text-primary block text-xs">BPH</span>
                <span className="text-[11px] text-text/60">Super Admin (Akses Penuh Seluruh Fitur)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-background border border-border">
                <span className="font-extrabold text-primary block text-xs">HUMAS</span>
                <span className="text-[11px] text-text/60">Pengelola Berita, Agenda, & Galeri</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-background border border-border">
                <span className="font-extrabold text-primary block text-xs">BENDAHARA</span>
                <span className="text-[11px] text-text/60">Pengelola Pembukuan & Laporan Kas</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="py-3 px-6 font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md transition-all text-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-accent" />
              <span>Simpan Perubahan</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
