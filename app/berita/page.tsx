"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Newspaper,
  Calendar,
  Clock,
  Search,
  ArrowRight,
  X,
  User,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { getBerita } from "@/app/actions/berita";

export interface BeritaItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  status: string;
  author: string;
  readTime: string | null;
  createdAt: Date | string;
}

const DEFAULT_CATEGORIES = ["Semua", "Kegiatan", "Pengumuman", "Lomba", "Edukasi"];

export default function BeritaPage() {
  const [articles, setArticles] = useState<BeritaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<BeritaItem | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getBerita();
      if (res.success && res.data) {
        setArticles(res.data as BeritaItem[]);
      } else {
        setError("Gagal memuat berita dari database.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const getDisplayDate = (item: BeritaItem) => {
    return new Date(item.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Combine default categories with unique categories from database
  const dynamicCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...articles.map((a) => a.category)])
  );

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "Semua" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles.length > 0 ? articles[0] : null;

  return (
    <main className="min-h-screen bg-background py-10 lg:py-16">
      {/* Background Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-4">
            <Newspaper className="w-4 h-4 text-accent" />
            <span>Berita & Kabar RIMBA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text leading-tight tracking-tight">
            Berita & Artikel Terkini
          </h1>

          <p className="text-base sm:text-lg text-text/75 leading-relaxed mt-4 font-normal max-w-2xl">
            Informasi terbaru mengenai kegiatan keislaman, perlombaan, artikel edukasi, dan pengumuman resmi Remaja Islam Masjid Albarkah.
          </p>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 bg-surface p-4 rounded-3xl border border-border/80 shadow-xs">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {dynamicCategories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-text/70 hover:text-primary hover:bg-background"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text/50" />
            <input
              type="text"
              placeholder="Cari berita atau artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-background border border-border/80 focus:outline-none focus:border-primary text-text"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-text/60">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-sm font-semibold">Memuat berita dari Supabase...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-surface rounded-3xl border border-border/80 p-8 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text">Belum ada berita dipublikasikan</h3>
            <p className="text-xs text-text/70">
              Artikel dan berita kegiatan belum ditambahkan di database. Silakan periksa kembali nanti.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Headline Article (Shown when no active search & category is 'Semua') */}
            {!searchQuery && selectedCategory === "Semua" && featuredArticle && (
              <div className="mb-14">
                <div
                  onClick={() => setActiveArticle(featuredArticle)}
                  className="group relative rounded-3xl bg-surface border border-border/80 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 cursor-pointer"
                >
                  {/* Featured Image */}
                  <div className="lg:col-span-7 relative aspect-16/10 lg:aspect-auto w-full min-h-70 bg-background overflow-hidden">
                    <Image
                      src={featuredArticle.image || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop"}
                      alt={featuredArticle.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent lg:hidden" />
                  </div>

                  {/* Featured Details */}
                  <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 text-xs font-bold text-white bg-primary rounded-full">
                          Berita Utama
                        </span>
                        <span className="text-xs font-semibold text-text/60">
                          {getDisplayDate(featuredArticle)}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black text-text group-hover:text-primary transition-colors leading-tight mb-4">
                        {featuredArticle.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-text/75 leading-relaxed line-clamp-4 mb-6">
                        {featuredArticle.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs text-text/70">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span>{featuredArticle.author}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-primary group-hover:translate-x-1 transition-transform">
                        <span>Baca Artikel</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
                  className="group relative rounded-3xl bg-surface border border-border/80 overflow-hidden shadow-2xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Image Container with Overlay Badge & Date */}
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-background">
                      <Image
                        src={article.image || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop"}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                      {/* Category & Date Badges */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10 text-xs">
                        <span className="px-3 py-1 font-bold text-white bg-primary/95 backdrop-blur-md rounded-full shadow-xs">
                          {article.category}
                        </span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 text-white/95 bg-black/40 backdrop-blur-md rounded-full font-medium border border-white/10">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          <span>{getDisplayDate(article)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 sm:p-7">
                      <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors leading-snug mb-3 line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-text/75 leading-relaxed line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 sm:px-7 pb-6 pt-2 flex items-center justify-between text-xs text-text/60 border-t border-border/40">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      {article.readTime || "3 min baca"}
                    </span>
                    <span className="font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Baca</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-text/70 hover:text-text hover:bg-background transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-6 bg-background">
              <Image
                src={activeArticle.image || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop"}
                alt={activeArticle.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Article Meta */}
            <div className="flex items-center gap-3 text-xs text-text/70 mb-3 flex-wrap">
              <span className="px-3 py-1 font-bold text-white bg-primary rounded-full">
                {activeArticle.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {getDisplayDate(activeArticle)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-accent" />
                {activeArticle.author}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text leading-tight mb-4">
              {activeArticle.title}
            </h2>

            {/* Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-text/80 leading-relaxed border-t border-border pt-4">
              {activeArticle.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
              <Link
                href={`/berita/${activeArticle.slug}`}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Buka di Halaman Penuh</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 text-xs font-bold text-text bg-background hover:bg-border rounded-full transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
