"use client";

import { useEffect, useState, useCallback } from "react";
import {
  RefreshCw,
  Loader2,
  AlertCircle,
  Search,
  Eye,
  X,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { getPendaftaran, updatePendaftaranStatus } from "@/app/actions/pendaftaran";
import { StatusPendaftaran } from "@prisma/client";

interface PendaftaranItem {
  id: string;
  name: string;
  contact: string;
  agendaTitle: string;
  status: StatusPendaftaran;
  notes: string | null;
  createdAt: Date;
}

const STATUS_CONFIG = {
  MENUNGGU: {
    label: "Menunggu",
    icon: Clock,
    className: "text-amber-700 bg-amber-100 border-amber-300",
  },
  DIKONFIRMASI: {
    label: "Dikonfirmasi",
    icon: CheckCircle2,
    className: "text-emerald-700 bg-emerald-100 border-emerald-300",
  },
  DITOLAK: {
    label: "Ditolak",
    icon: XCircle,
    className: "text-red-700 bg-red-100 border-red-300",
  },
};

export default function AdminPendaftaranPage() {
  const [records, setRecords] = useState<PendaftaranItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusPendaftaran | "ALL">("ALL");
  const [detail, setDetail] = useState<PendaftaranItem | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getPendaftaran();
      if (res.success && res.data) {
        setRecords(res.data as PendaftaranItem[]);
      } else {
        setError("Gagal memuat data pendaftaran.");
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

  const handleStatusChange = async (id: string, status: StatusPendaftaran) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const res = await updatePendaftaranStatus(id, status);
    if (!res.success) {
      loadData();
      alert("Gagal memperbarui status.");
    }
  };

  const filtered = records.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.agendaTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.contact.includes(search);
    const matchStatus = filterStatus === "ALL" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: records.length,
    menunggu: records.filter((r) => r.status === "MENUNGGU").length,
    dikonfirmasi: records.filter((r) => r.status === "DIKONFIRMASI").length,
    ditolak: records.filter((r) => r.status === "DITOLAK").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-border/80 shadow-2xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-text">Pendaftaran Kegiatan</h2>
          <p className="text-xs sm:text-sm text-text/70 mt-0.5">
            Kelola dan pantau status pendaftaran peserta kegiatan.
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: counts.all, color: "text-text bg-background border-border/60" },
          { label: "Menunggu", value: counts.menunggu, color: "text-amber-700 bg-amber-50 border-amber-200" },
          { label: "Dikonfirmasi", value: counts.dikonfirmasi, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { label: "Ditolak", value: counts.ditolak, color: "text-red-700 bg-red-50 border-red-200" },
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

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
          <input
            type="text"
            placeholder="Cari nama, agenda, atau kontak..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-surface border border-border focus:outline-none focus:border-primary text-text"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as StatusPendaftaran | "ALL")}
          className="px-4 py-2.5 text-xs rounded-2xl bg-surface border border-border focus:outline-none focus:border-primary text-text"
        >
          <option value="ALL">Semua Status</option>
          <option value="MENUNGGU">Menunggu</option>
          <option value="DIKONFIRMASI">Dikonfirmasi</option>
          <option value="DITOLAK">Ditolak</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border/80 rounded-3xl overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-text/60">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-sm font-semibold">Memuat data dari Supabase...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text/50">
            <span className="text-4xl">📋</span>
            <p className="text-sm font-semibold">Tidak ada data pendaftaran ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-background border-b border-border/80 text-text/60 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Pendaftar</th>
                  <th className="py-4 px-6">Agenda</th>
                  <th className="py-4 px-6">Kontak</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Tanggal Daftar</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((item) => {
                  const cfg = STATUS_CONFIG[item.status];
                  return (
                    <tr key={item.id} className="hover:bg-background/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-text">{item.name}</td>
                      <td className="py-4 px-6 text-text/80 max-w-xs">
                        <span className="line-clamp-2">{item.agendaTitle}</span>
                      </td>
                      <td className="py-4 px-6 text-text/70">{item.contact}</td>
                      <td className="py-4 px-6">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value as StatusPendaftaran)
                          }
                          className={`px-3 py-1.5 text-[11px] font-bold rounded-full border cursor-pointer focus:outline-none ${cfg.className}`}
                        >
                          <option value="MENUNGGU">Menunggu</option>
                          <option value="DIKONFIRMASI">Dikonfirmasi</option>
                          <option value="DITOLAK">Ditolak</option>
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
                        <button
                          onClick={() => setDetail(item)}
                          className="p-2 rounded-xl text-text/70 hover:text-primary hover:bg-primary/10 border border-border/60 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 bg-background border-t border-border/60 text-xs font-semibold text-text/70">
          Menampilkan {filtered.length} dari {records.length} total pendaftar
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
              <span className="text-xs font-bold text-primary uppercase">Detail Pendaftar</span>
              <h3 className="text-xl font-extrabold text-text mt-0.5">{detail.name}</h3>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { label: "ID Pendaftaran", value: detail.id },
                { label: "Agenda / Kegiatan", value: detail.agendaTitle },
                { label: "Nomor Kontak", value: detail.contact },
                {
                  label: "Tanggal Daftar",
                  value: new Date(detail.createdAt).toLocaleString("id-ID"),
                },
                { label: "Catatan", value: detail.notes || "-" },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span className="text-text/50 font-semibold">{row.label}</span>
                  <span className="font-bold text-text">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-border">
              <label className="block text-xs font-bold text-text mb-2">Ubah Status</label>
              <div className="flex gap-2">
                {(["MENUNGGU", "DIKONFIRMASI", "DITOLAK"] as StatusPendaftaran[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      handleStatusChange(detail.id, s);
                      setDetail({ ...detail, status: s });
                    }}
                    className={`flex-1 py-2 text-[11px] font-bold rounded-xl border transition-all ${
                      detail.status === s
                        ? STATUS_CONFIG[s].className + " ring-2 ring-offset-1 ring-primary/40"
                        : "border-border/60 text-text/70 hover:bg-background"
                    }`}
                  >
                    {STATUS_CONFIG[s].label}
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
