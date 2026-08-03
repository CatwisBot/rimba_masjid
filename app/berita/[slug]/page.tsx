import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { getBeritaBySlug } from "@/app/actions/berita";
import AISummarizerCard from "@/components/AISummarizerCard";

export const revalidate = 60;

interface BeritaDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BeritaDetailPage({ params }: BeritaDetailPageProps) {
  const { slug } = await params;
  const res = await getBeritaBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const article = res.data as {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    readTime?: string;
    createdAt: Date | string;
  };

  return (
    <main className="min-h-screen bg-background py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-text/70 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Semua Berita</span>
        </Link>

        {/* Category & Date */}
        <div className="flex items-center gap-3 text-xs text-text/70 mb-4 flex-wrap">
          <span className="px-3.5 py-1 font-bold text-white bg-primary rounded-full">
            {article.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {new Date(article.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-accent" />
            {article.readTime || "3 min baca"}
          </span>
        </div>

        {/* Headline Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text leading-tight tracking-tight mb-6">
          {article.title}
        </h1>

        {/* Author Info Bar */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border/80 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-text">{article.author}</div>
            <div className="text-[11px] text-text/60">Penulis / Tim Media RIMBA</div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-6 bg-background shadow-md border border-border/60">
          <Image
            src={article.image || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop"}
            alt={article.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* AI Quick Reader / Summarizer Component */}
        <AISummarizerCard title={article.title} content={article.content} />

        {/* Content Paragraphs */}
        <article className="prose max-w-none text-base sm:text-lg text-text/85 leading-relaxed space-y-6">
          {article.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Footer Navigation */}
        <div className="mt-14 pt-8 border-t border-border flex items-center justify-between">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lihat Artikel Berita Lainnya</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
