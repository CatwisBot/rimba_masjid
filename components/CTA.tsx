"use client";

import Link from "next/link";
import { ArrowRight, Image as ImageIcon, UserRound, MessageCircle } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA Container Card */}
        <div className="relative rounded-3xl bg-linear-to-br from-primary-dark via-primary to-primary-dark text-white p-8 sm:p-12 lg:p-16 shadow-2xl shadow-primary/20 overflow-hidden border border-white/10">
          
          {/* Background Decorative Patterns & Glow Blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[24px_24px] opacity-10 pointer-events-none" />

          {/* Content Wrapper */}
          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide">
              <UserRound className="w-4 h-4 text-white" />
              <span>Bergabung Bersama Kami</span>
            </div>

            {/* Headline & Subheadline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Wujudkan Remaja Masjid yang{" "}
              <span className="text-accent underline decoration-accent/50 decoration-wavy decoration-2">
                Aktif, Kreatif,
              </span>{" "}
              dan Berakhlak
            </h2>

            {/* Description Paragraph */}
            <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl font-normal">
              Ikuti program, kegiatan, dan pembinaan bersama RIMBA untuk membangun generasi muda Islam yang bermanfaat.
            </p>

            {/* 2 CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
              
              {/* Button 1: Hubungi Kami */}
              <a
                href="https://wa.me/6281513983136"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-7 py-3.5 text-base font-bold text-primary bg-white hover:bg-accent hover:text-primary-dark rounded-full shadow-lg transition-all duration-200 gap-2.5 w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5 text-primary group-hover:text-primary-dark transition-colors" />
                <span>Hubungi Kami</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </a>

              {/* Button 2: Lihat Galeri */}
              <Link
                href="/galeri"
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white hover:text-accent bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md rounded-full transition-all duration-200 gap-2.5 w-full sm:w-auto"
              >
                <ImageIcon className="w-5 h-5 text-accent" />
                <span>Lihat Galeri</span>
              </Link>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}