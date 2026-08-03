"use client";

import { Calendar, Image as ImageIcon, Users } from "lucide-react";

const FEATURES = [
  {
    id: "01",
    title: "Perlombaan Islami",
    description:
      "Jadwal dan pendaftaran perlombaan islami seperti hafal Al-Quran, adzan, dan dai.",
    icon: Calendar,
  },
  {
    id: "02",
    title: "Galeri Dokumentasi",
    description:
      "Menampilkan dokumentasi kegiatan organisasi secara visual dan menarik.",
    icon: ImageIcon,
  },
  {
    id: "03",
    title: "Kolaborasi Remaja",
    description:
      "Mendorong partisipasi aktif, kepemimpinan, dan kebersamaan antar anggota.",
    icon: Users,
  },
];

export default function Features() {
  return (
    <section className="relative py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Container Box dengan Skema Warna Hijau Masjid & Aksen Emas */}
        <div className="relative rounded-3xl bg-linear-to-br from-primary-dark via-primary to-primary-dark border border-primary-dark/40 text-white shadow-2xl shadow-primary/25 p-8 sm:p-12 lg:p-14 overflow-hidden">
          
          {/* Ornamen Kilau Emas Latar Belakang */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[28px_28px] opacity-10 pointer-events-none" />

          {/* Grid 3 Kolom */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start divide-y md:divide-y-0 md:divide-x divide-white/15">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className={`flex flex-col text-left group transition-all duration-300 ${
                    idx !== 0 ? "pt-6 md:pt-0 md:pl-8 lg:pl-10" : ""
                  }`}
                >
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-accent shadow-sm group-hover:bg-accent group-hover:text-primary-dark transition-all duration-300 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2.5 tracking-tight group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-white/85 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
