"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Users,
  Megaphone,
  Coins,
  Utensils,
  CalendarCheck,
  Package,
  Camera,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { getAnggota } from "@/app/actions/anggota";

interface AnggotaItem {
  id: string;
  name: string;
  role: string;
  category: string;
  avatar: string;
  order: number;
}

const DIVISIONS = [
  {
    code: "HUMAS",
    name: "Hubungan Masyarakat",
    description: "Jembatan komunikasi antara organisasi dengan jamaah masjid, tokoh masyarakat, dan mitra eksternal.",
    icon: Megaphone,
  },
  {
    code: "Dana",
    name: "Penggalangan Dana",
    description: "Pengelola penggalangan dana, donasi kegiatan, sponsor, serta usaha kemandirian finansial organisasi.",
    icon: Coins,
  },
  {
    code: "Konsumsi",
    name: "Divisi Konsumsi",
    description: "Penanggung jawab perencanaan, penyediaan, dan penyaluran logistik makanan pada setiap kegiatan.",
    icon: Utensils,
  },
  {
    code: "Acara",
    name: "Manajemen Acara",
    description: "Perancang konsep, penyusun rundown, dan koordinator pengisi acara kajian maupun perlombaan.",
    icon: CalendarCheck,
  },
  {
    code: "Perlengkapan",
    name: "Divisi Perlengkapan",
    description: "Penyedia sarana prasarana, tata panggung, sound system, serta perawatan aset operasional acara.",
    icon: Package,
  },
  {
    code: "PDD",
    name: "Publikasi & Dokumentasi",
    description: "Tim kreatif pembuat desain visual, konten media sosial, video dakwah, serta dokumentasi kegiatan.",
    icon: Camera,
  },
];

const defaultAvatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";

export default function StrukturPage() {
  const [members, setMembers] = useState<AnggotaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      setIsLoading(true);
      try {
        const res = await getAnggota();
        if (res.success && res.data) {
          setMembers(res.data as AnggotaItem[]);
        }
      } catch (err) {
        console.error("Error loading structure members:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMembers();
  }, []);

  // Group members by category
  const categories = Array.from(new Set(members.map((m) => m.category)));

  return (
    <main className="min-h-screen bg-background py-10 lg:py-16">
      {/* Background Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-4">
            <Users className="w-4 h-4 text-accent" />
            <span>Struktur Organisasi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text leading-tight tracking-tight">
            Struktur Kepengurusan RIMBA
          </h1>

          <p className="text-base sm:text-lg text-text/80 leading-relaxed mt-4 font-normal max-w-2xl">
            Bagan kepengurusan Remaja Islam Masjid Albarkah yang menggerakkan pelayanan, pembinaan, dan program sosial kemasyarakatan.
          </p>
        </div>

        {/* Member List from Supabase DB */}
        <div className="mb-16 space-y-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-text/60 bg-surface rounded-3xl border border-border">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm font-semibold">Memuat struktur kepengurusan dari Supabase...</span>
            </div>
          ) : members.length > 0 ? (
            categories.map((category) => {
              const catMembers = members
                .filter((m) => m.category === category)
                .sort((a, b) => a.order - b.order);

              return (
                <div key={category} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20">
                        {category}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-text">
                        {category === "BPH"
                          ? "Badan Pengurus Harian"
                          : category === "Pengurus Inti"
                          ? "Pengurus Inti RIMBA"
                          : `Tim ${category}`}
                      </h2>
                    </div>
                    <span className="text-xs text-text/60 font-semibold hidden sm:inline-block">
                      {catMembers.length} Personel
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {catMembers.map((member) => (
                      <div
                        key={member.id}
                        className="group relative p-6 rounded-3xl bg-surface border border-border/80 shadow-2xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col items-center text-center space-y-3"
                      >
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 relative shadow-sm group-hover:scale-105 transition-transform bg-background">
                          <Image
                            src={member.avatar || defaultAvatar}
                            alt={member.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-xs font-bold text-accent uppercase tracking-wider mt-0.5">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : null}
        </div>

        {/* Level 3: Divisi-Divisi Operasional */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b border-border/80 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/20">
                Divisi Kerja
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-text mt-3">
                Divisi-Divisi Operasional
              </h2>
            </div>
            <span className="text-xs text-text/60 font-semibold hidden sm:inline-block">
              HUMAS, Dana, Konsumsi, Acara, Perlengkapan & PDD
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {DIVISIONS.map((div) => {
              const Icon = div.icon;
              return (
                <div
                  key={div.code}
                  className="group relative rounded-3xl bg-surface border border-border/80 overflow-hidden shadow-2xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between p-7"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 text-xs font-extrabold text-white bg-primary rounded-full shadow-xs">
                        {div.code}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-text group-hover:text-primary transition-colors mb-2.5">
                      {div.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-text/75 leading-relaxed font-normal">
                      {div.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-linear-to-r from-primary to-primary-dark text-white p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
          <Sparkles className="w-8 h-8 text-accent animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Tertarik Mengabdi & Berkarya Bersama RIMBA?
          </h2>
          <p className="text-xs sm:text-sm text-white/85 max-w-xl leading-relaxed">
            Pendaftaran pengurus dan relawan divisi terbuka bagi remaja masjid yang ingin mengasah pengalaman dan berkontribusi nyata.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/6281513983136"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3 text-sm font-bold text-primary bg-white hover:bg-accent hover:text-primary-dark rounded-full shadow-md transition-all gap-2"
            >
              <span>Hubungi Pengurus</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
