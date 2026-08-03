"use client";

import Link from "next/link";
import {
  Trophy,
  Newspaper,
  Users,
  Calendar,
  FolderCheck,
  BookOpen,
  Sparkles,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface HeroProps {
  stats?: {
    anggotaCount: number;
    agendaCount: number;
    galeriCount: number;
  };
}

const FOCUS_AREAS = [
  {
    title: "Pembinaan",
    icon: BookOpen,
    badgeColor: "bg-primary text-white",
  },
  {
    title: "Dakwah",
    icon: Sparkles,
    badgeColor: "bg-accent text-white",
  },
  {
    title: "Sosial",
    icon: Heart,
    badgeColor: "bg-primary-dark text-white",
  },
];

export default function Hero({ stats }: HeroProps) {
  const dynamicStats = [
    {
      value: stats ? `${stats.anggotaCount}` : "0",
      label: "Anggota Aktif",
      icon: Users,
    },
    {
      value: stats ? `${stats.agendaCount}` : "0",
      label: "Kegiatan Tahunan",
      icon: Calendar,
    },
    {
      value: stats ? `${stats.galeriCount}` : "0",
      label: "Dokumentasi",
      icon: FolderCheck,
    },
  ];

  return (
    <section id="beranda" className="relative overflow-hidden bg-background pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Kolom 1: Informasi Utama & CTA */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text leading-[1.2] tracking-tight">
              Membangun Generasi Remaja Masjid yang{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-dark to-accent">
                Aktif, Berakhlak,
              </span>{" "}
              dan{" "}
              <span className="relative inline-block text-primary underline decoration-accent decoration-wavy decoration-2">
                Berdampak.
              </span>
            </h1>

            {/* Sub-headline Description */}
            <p className="text-base sm:text-lg text-text/80 leading-relaxed max-w-2xl font-normal">
              <strong className="text-primary font-semibold">RIMBA</strong> adalah wadah pembinaan, kolaborasi, dan pengembangan potensi remaja Islam Masjid Albarkah melalui program keislaman, sosial, edukasi, dan dakwah kreatif.
            </p>

            {/* Action Buttons (2 Buttons) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              {/* Primary Button: Daftar Lomba */}
              <Link
                href="/agenda"
                className="group relative inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-white bg-linear-to-r from-primary to-primary-dark rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 gap-2.5 overflow-hidden"
              >
                <Trophy className="w-5 h-5 text-accent" />
                <span>Lihat Agenda</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              {/* Secondary Button: Baca Berita Terbaru */}
              <Link
                href="/berita"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-text hover:text-primary bg-surface hover:bg-white border border-border hover:border-primary/40 rounded-full shadow-xs hover:shadow-md transition-all duration-200 gap-2.5"
              >
                <Newspaper className="w-5 h-5 text-primary" />
                <span>Baca Berita Terbaru</span>
              </Link>
            </div>

            {/* Quick Stats Grid (Real database counts) */}
            <div className="pt-6 border-t border-border/80 grid grid-cols-3 gap-4 sm:gap-6">
              {dynamicStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-primary hidden sm:inline-block" />
                      <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                        {stat.value}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-text mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Kolom 2: Informasi Tambahan & Fokus Utama */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            <div className="relative p-6 sm:p-8 rounded-3xl bg-surface border-2 border-border/80 shadow-xl shadow-primary/5 flex flex-col space-y-6 group">
              
              {/* Badge Organisasi Remaja Masjid */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Organisasi Remaja Masjid</span>
              </div>

              {/* Quote / Sub-title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-text leading-snug">
                &ldquo;Bersama RIMBA, tumbuh dalam iman, ilmu, dan aksi nyata.&rdquo;
              </h2>

              {/* Description Paragraph */}
              <p className="text-sm text-text/75 leading-relaxed">
                Menjadi ruang berkarya bagi generasi muda Islam untuk belajar, melayani, dan memberi manfaat luas bagi masyarakat.
              </p>

              {/* Header Fokus Utama */}
              <div className="pt-4 border-t border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-3">
                  Fokus Utama
                </span>

                {/* 3 Fokus Utama Cards */}
                <div className="grid grid-cols-3 gap-2.5">
                  {FOCUS_AREAS.map((area) => {
                    const Icon = area.icon;
                    return (
                      <div
                        key={area.title}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-background border border-border/80 hover:border-primary/40 hover:bg-white transition-all duration-200 text-center gap-1.5 shadow-2xs"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${area.badgeColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-text">
                          {area.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
