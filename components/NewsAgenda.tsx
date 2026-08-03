"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Trophy, Newspaper, Info } from "lucide-react";

export interface BeritaItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content?: string;
  image: string;
  status: string;
  author: string;
  createdAt: Date | string;
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date | string;
  formattedDate: string;
  time: string;
  location: string;
  status: string;
  image?: string | null;
  createdAt: Date | string;
}

interface NewsAgendaProps {
  beritaList?: BeritaItem[];
  agendaList?: AgendaItem[];
}

export default function NewsAgenda({ beritaList = [], agendaList = [] }: NewsAgendaProps) {
  // Map berita to unified card structure
  const beritaCards = beritaList.map((item) => ({
    id: `berita-${item.id}`,
    category: item.category || "Berita",
    date: new Date(item.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    title: item.title,
    excerpt: item.excerpt,
    image: item.image || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop",
    href: `/berita/${item.slug}`,
    createdAt: new Date(item.createdAt).getTime(),
  }));

  // Map agenda to unified card structure
  const agendaCards = agendaList.map((item) => ({
    id: `agenda-${item.id}`,
    category: item.category || "Agenda",
    date: item.formattedDate || new Date(item.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    title: item.title,
    excerpt: item.description,
    image: item.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop",
    href: "/agenda",
    createdAt: new Date(item.createdAt).getTime(),
  }));

  // Combine and sort by createdAt descending, take top 3
  const articles = [...beritaCards, ...agendaCards]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  return (
    <section id="berita" className="relative py-16 lg:py-24 bg-background overflow-hidden border-t border-border/60">
      {/* Background Subtle Blobs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-4">
            <Newspaper className="w-3.5 h-3.5 text-accent" />
            <span>Highlight</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text leading-tight tracking-tight">
            Berita & Agenda Terbaru
          </h2>

          <p className="text-base sm:text-lg text-text/75 leading-relaxed mt-4 font-normal max-w-2xl">
            Simak kabar kegiatan terkini, informasi penggalangan, dan jadwal agenda mendatang dari Remaja Islam Masjid Albarkah.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link
              href="/berita"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-text hover:text-primary bg-surface hover:bg-white border border-border hover:border-primary/40 rounded-full shadow-2xs hover:shadow-sm transition-all duration-200 gap-2"
            >
              <Newspaper className="w-4 h-4 text-primary" />
              <span>Lihat Semua Berita</span>
            </Link>

            <Link
              href="/agenda"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-full shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 gap-2"
            >
              <Trophy className="w-4 h-4 text-accent" />
              <span>Lihat Semua Agenda</span>
            </Link>
          </div>
        </div>

        {/* 3 Columns News & Agenda Cards or Empty State */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group relative rounded-3xl bg-surface border border-border/80 overflow-hidden shadow-2xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Overlay Category & Date */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-background">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Overlay Category Pill & Date */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10 text-xs">
                      <span className="px-3 py-1 font-bold text-white bg-primary/95 backdrop-blur-md rounded-full shadow-xs">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 text-white/95 bg-black/40 backdrop-blur-md rounded-full font-medium border border-white/10">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors leading-snug mb-3 line-clamp-2">
                      <Link href={article.href}>
                        {article.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-text/75 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="px-6 sm:px-7 pb-6 pt-2">
                  <Link
                    href={article.href}
                    className="inline-flex items-center text-xs font-bold text-primary group-hover:text-primary-dark gap-1.5 transition-colors"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-surface rounded-3xl border border-border/80 text-center space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-text">Belum ada berita atau agenda</h3>
            <p className="text-xs text-text/70">
              Data publikasi kegiatan belum ditambahkan di database. Kelola data melalui dashboard admin.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
