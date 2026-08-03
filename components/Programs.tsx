"use client";

import { BookOpen, HeartHandshake, Megaphone, Star } from "lucide-react";

const PROGRAMS = [
  {
    number: "01",
    title: "Kajian Remaja",
    description: "Program pembinaan rutin untuk memperkuat akidah, akhlak, dan semangat belajar Islam.",
    icon: BookOpen,
    accentBg: "from-primary/10 to-transparent",
    iconBg: "bg-primary text-white",
  },
  {
    number: "02",
    title: "Aksi Sosial",
    description: "Kegiatan berbagi, bakti sosial, dan kepedulian terhadap masyarakat sekitar.",
    icon: HeartHandshake,
    accentBg: "from-accent/15 to-transparent",
    iconBg: "bg-accent text-white",
  },
  {
    number: "03",
    title: "Media Dakwah",
    description: "Publikasi konten islami, dokumentasi kegiatan, dan dakwah digital yang kreatif.",
    icon: Megaphone,
    accentBg: "from-secondary/20 to-transparent",
    iconBg: "bg-primary-dark text-white",
  },
];

export default function Programs() {
  return (
    <section id="program" className="relative py-16 lg:py-24 bg-background overflow-hidden border-t border-border/60">
      
      {/* Background Glow Blobs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-4">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            <span>Program Unggulan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text leading-tight tracking-tight">
            Ruang Tumbuh dan Kontribusi Bagi Remaja Masjid
          </h2>

          <p className="text-base sm:text-lg text-text/75 leading-relaxed mt-4 font-normal max-w-2xl">
            Program RIMBA dirancang untuk memperkuat karakter islami, kemampuan organisasi, dan kepedulian sosial.
          </p>

        </div>

        {/* 3 Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PROGRAMS.map((program) => {
            const Icon = program.icon;
            return (
              <div
                key={program.title}
                className="group relative rounded-3xl bg-surface border border-border/80 p-8 shadow-xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Accent Corner Background */}
                <div className={`absolute top-0 right-0 w-36 h-36 bg-linear-to-bl ${program.accentBg} rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />

                <div>
                  {/* Top Bar: Icon & Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${program.iconBg} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-text/20 group-hover:text-primary/40 transition-colors">
                      {program.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-extrabold text-text group-hover:text-primary transition-colors mb-3">
                    {program.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-text/75 leading-relaxed">
                    {program.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
