"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { getBerita, deleteBerita } from "@/app/actions/berita";
import AIGeneratorModal, { MediaItemData } from "@/components/admin/AIGeneratorModal";

interface BeritaItem {
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
  createdAt: Date;
}

export default function AdminBeritaPage() {
  const [articles, setArticles] = useState<BeritaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State modal generator AI
  const [selectedArticleForAI, setSelectedArticleForAI] = useState<MediaItemData | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleOpenAIModal = (item: BeritaItem) => {
    setSelectedArticleForAI({
      title: item.title,
      description: item.excerpt || item.content.slice(0, 200),
      category: item.category,
      contentType: "berita",
      slug: item.slug,
    });
    setIsAIModalOpen(true);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getBerita();
      if (res.success && res.data) {
        setArticles(res.data as BeritaItem[]);
      } else {
        setError("Gagal memuat data berita dari database.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;
    setArticles((prev) => prev.filter((a) => a.id !== id));
    const res = await deleteBerita(id);
    if (!res.success) {
      loadData();
      alert("Gagal menghapus berita.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-border/80 shadow-2xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-text">Daftar Berita</h2>
          <p className="text-xs sm:text-sm text-text/70 mt-0.5">
            Kelola artikel, pengumuman, dan publikasi kegiatan organisasi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-border/60 text-text/70 hover:text-primary hover:border-primary/40 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/berita/tambah"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-2xl shadow-md transition-all gap-2"
          >
            <Plus className="w-4 h-4 text-accent" />
            <span>+ Buat Berita Baru</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-surface border border-border/80 rounded-3xl overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-text/60">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-sm font-semibold">Memuat data dari Supabase...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text/50">
            <span className="text-4xl">📰</span>
            <p className="text-sm font-semibold">Belum ada berita. Buat berita pertama!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-background border-b border-border/80 text-text/60 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Gambar</th>
                  <th className="py-4 px-6">Judul Berita & Slug</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {articles.map((item) => (
                  <tr key={item.id} className="hover:bg-background/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-14 h-10 rounded-xl overflow-hidden bg-background border border-border/40 relative shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text/30 text-lg">
                            📷
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-bold text-text text-sm leading-snug line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-text/50 font-mono mt-0.5 truncate">
                        /berita/{item.slug}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 font-bold text-white bg-primary rounded-full text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-full text-[11px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text/75 font-semibold">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenAIModal(item)}
                          className="px-2.5 py-1.5 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all font-extrabold flex items-center gap-1 shrink-0"
                          title="Generasi Teks WA Broadcast & Caption AI"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[11px]">Teks AI</span>
                        </button>
                        <Link
                          href={`/berita/${item.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl text-text/70 hover:text-primary hover:bg-primary/10 border border-border/60 transition-colors"
                          title="Lihat Berita"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/berita/edit/${item.id}`}
                          className="p-2 rounded-xl text-text/70 hover:text-blue-600 hover:bg-blue-50 border border-border/60 transition-colors"
                          title="Edit Berita"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-xl text-text/70 hover:text-red-600 hover:bg-red-50 border border-border/60 transition-colors"
                          title="Hapus Berita"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 bg-background border-t border-border/60 text-xs font-semibold text-text/70">
          Menampilkan {articles.length} total berita dari database
        </div>
      </div>

      {/* Modal Generator AI Media */}
      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        item={selectedArticleForAI}
      />
    </div>
  );
}
