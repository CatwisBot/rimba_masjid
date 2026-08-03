"use client";

import { Info, Users } from "lucide-react";

import {
  ABOUT_PILLARS,
  CORE_VALUES,
  INTI_LIST,
  BPH_LIST,
  DIVISIONS
} from "@/data/aboutData";

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-background py-10 lg:py-16">
      
      {/* Background Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-4">
            <Info className="w-4 h-4 text-accent" />
            <span>Tentang RIMBA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text leading-tight tracking-tight">
            Remaja Islam Masjid Albarkah
          </h1>

          <p className="text-base sm:text-lg text-text/80 leading-relaxed mt-5 font-normal max-w-3xl">
            <strong className="text-primary font-bold">RIMBA</strong> adalah wadah pembinaan dan kolaborasi remaja masjid untuk tumbuh dalam iman, ilmu, dan aksi nyata. Kami membangun kultur organisasi yang sehat dan kegiatan sosial yang bermanfaat bagi masyarakat.
          </p>

        </div>

        {/* Visi, Misi, Tujuan 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {ABOUT_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative p-8 rounded-3xl bg-surface border border-border/80 shadow-2xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${pillar.badgeColor} mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h2 className="text-2xl font-black text-text group-hover:text-primary transition-colors mb-3">
                    {pillar.title}
                  </h2>

                  <p className="text-sm sm:text-base text-text/75 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nilai Utama Section: Berakhlak, Berkarya, Berdampak */}
        <div className="mb-16 pt-10 border-t border-border/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/20">
              Nilai Utama
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text mt-3">
              Berakhlak, Berkarya & Berdampak
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {CORE_VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="p-8 rounded-3xl bg-surface border border-border/80 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-text mb-2.5">{val.title}</h3>
                    <p className="text-xs sm:text-sm text-text/75 leading-relaxed font-normal">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Struktur Organisasi RIMBA */}
        <div className="mb-16 pt-10 border-t border-border/80">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-3">
              <Users className="w-4 h-4 text-accent" />
              <span>Struktur Organisasi</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-text">
              Struktur Kepengurusan RIMBA
            </h2>
            <p className="text-sm text-text/75 mt-2">
              Bagan kepengurusan yang menggerakkan pelayanan, pembinaan, dan program sosial kemasyarakatan.
            </p>
          </div>

          {/* 1. Kepengurusan Inti */}
          <div className="mb-12">
            <h3 className="text-lg font-black text-primary uppercase tracking-wider mb-6 border-b border-border/60 pb-2">
              Kepengurusan Inti
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {INTI_LIST.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.role}
                    className="p-6 rounded-3xl bg-surface border border-border/80 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent block mb-1">
                      {item.title}
                    </span>
                    <h4 className="text-lg font-bold text-text mb-1.5">{item.role}</h4>
                    <p className="text-xs text-text/75 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Badan Pengurus Harian (BPH) */}
          <div className="mb-12">
            <h3 className="text-lg font-black text-primary uppercase tracking-wider mb-6 border-b border-border/60 pb-2">
              Badan Pengurus Harian (BPH)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {BPH_LIST.map((bph) => {
                const Icon = bph.icon;
                return (
                  <div
                    key={bph.role}
                    className="p-6 rounded-3xl bg-surface border border-border/80 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent-dark border border-accent/30 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
                      {bph.title}
                    </span>
                    <h4 className="text-lg font-bold text-text mb-1.5">{bph.role}</h4>
                    <p className="text-xs text-text/75 leading-relaxed">{bph.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Divisi-Divisi Operasional */}
          <div>
            <h3 className="text-lg font-black text-primary uppercase tracking-wider mb-6 border-b border-border/60 pb-2">
              Divisi Operasional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DIVISIONS.map((div) => {
                const Icon = div.icon;
                return (
                  <div
                    key={div.code}
                    className="p-6 rounded-3xl bg-surface border border-border/80 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="px-3 py-1 text-xs font-extrabold text-white bg-primary rounded-full">
                          {div.code}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-text mb-2">{div.name}</h4>
                      <p className="text-xs sm:text-sm text-text/75 leading-relaxed">{div.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
