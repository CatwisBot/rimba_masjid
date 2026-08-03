"use client";

import { useEffect, useState, useCallback } from "react";
import {
  RefreshCw,
  Loader2,
  AlertCircle,
  Trash2,
  MessageSquare,
  Eye,
  X,
} from "lucide-react";
import { getPesan, updatePesanStatus, deletePesan } from "@/app/actions/pesan";
import { StatusPesan } from "@prisma/client";

interface PesanItem {
  id: string;
  senderName: string;
  contact: string;
  category: string;
  message: string;
  status: StatusPesan;
  createdAt: Date;
}

const STATUS_CONFIG = {
  Baru: "text-blue-700 bg-blue-100 border-blue-300",
  Diproses: "text-amber-700 bg-amber-100 border-amber-300",
  Selesai: "text-emerald-700 bg-emerald-100 border-emerald-300",
};

export default function AdminPesanPage() {
  const [messages, setMessages] = useState<PesanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<PesanItem | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getPesan();
      if (res.success && res.data) {
        setMessages(res.data as PesanItem[]);
      } else {
        setError("Gagal memuat data pesan masuk.");
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

  const handleStatusChange = async (id: string, status: StatusPesan) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    const res = await updatePesanStatus(id, status);
    if (!res.success) {
      loadData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pesan ini?")) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    const res = await deletePesan(id);
    if (!res.success) {
      loadData();
      alert("Gagal menghapus pesan.");
    }
  };

  const counts = {
    baru: messages.filter((m) => m.status === "Baru").length,
    diproses: messages.filter((m) => m.status === "Diproses").length,
    selesai: messages.filter((m) => m.status === "Selesai").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-border/80 shadow-2xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-text">Pesan Masuk</h2>
          <p className="text-xs sm:text-sm text-text/70 mt-0.5">
            Kelola pesan dari masyarakat, pertanyaan, dan saran masukan.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="p-2.5 rounded-xl border border-border/60 text-text/70 hover:text-primary hover:border-primary/40 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pesan Baru", value: counts.baru, color: "text-blue-700 bg-blue-50 border-blue-200" },
          { label: "Diproses", value: counts.diproses, color: "text-amber-700 bg-amber-50 border-amber-200" },
          { label: "Selesai", value: counts.selesai, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
        ].map((card) => (
          <div key={card.label} className={`p-4 rounded-2xl border ${card.color} text-center`}>
            <div className="text-2xl font-black">{isLoading ? "..." : card.value}</div>
            <div className="text-xs font-semibold mt-0.5 opacity-80">{card.label}</div>
          </div>
        ))}
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
            <span className="text-sm font-semibold">Memuat pesan masuk...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text/50">
            <MessageSquare className="w-12 h-12 opacity-30" />
            <p className="text-sm font-semibold">Belum ada pesan masuk.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-background border-b border-border/80 text-text/60 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Pengirim</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Pesan</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {messages.map((item) => (
                  <tr key={item.id} className="hover:bg-background/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-text">{item.senderName}</div>
                      <div className="text-text/50 text-[11px]">{item.contact}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 font-bold text-primary bg-primary/10 border border-primary/20 rounded-full text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-text/80 line-clamp-2 leading-snug">{item.message}</p>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value as StatusPesan)
                        }
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-full border cursor-pointer focus:outline-none ${STATUS_CONFIG[item.status]}`}
                      >
                        <option value="Baru">Baru</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-text/70">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setDetail(item)}
                          className="p-2 rounded-xl text-text/70 hover:text-primary hover:bg-primary/10 border border-border/60 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-xl text-text/70 hover:text-red-600 hover:bg-red-50 border border-border/60 transition-colors"
                          title="Hapus Pesan"
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
          {messages.length} total pesan masuk dari database
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-text/70 hover:text-text hover:bg-background"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-5 border-b border-border pb-4">
              <span className="text-xs font-bold text-primary uppercase">Detail Pesan</span>
              <h3 className="text-xl font-extrabold text-text mt-0.5">{detail.senderName}</h3>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { label: "Kontak", value: detail.contact },
                { label: "Kategori", value: detail.category },
                {
                  label: "Tanggal Masuk",
                  value: new Date(detail.createdAt).toLocaleString("id-ID"),
                },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span className="text-text/50 font-semibold">{row.label}</span>
                  <span className="font-bold text-text">{row.value}</span>
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <span className="text-text/50 font-semibold">Isi Pesan</span>
                <div className="p-3 bg-background rounded-xl border border-border/60 text-text/90 leading-relaxed">
                  {detail.message}
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-border">
              <label className="block text-xs font-bold text-text mb-2">Ubah Status</label>
              <div className="flex gap-2">
                {(["Baru", "Diproses", "Selesai"] as StatusPesan[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      handleStatusChange(detail.id, s);
                      setDetail({ ...detail, status: s });
                    }}
                    className={`flex-1 py-2 text-[11px] font-bold rounded-xl border transition-all ${
                      detail.status === s
                        ? STATUS_CONFIG[s] + " ring-2 ring-offset-1 ring-primary/40"
                        : "border-border/60 text-text/70 hover:bg-background"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
