"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Newspaper,
  Calendar,
  Wallet,
  Users,
  Image as ImageIcon,
  Settings,
  ArrowRight,
  Clock,
  RefreshCw,
} from "lucide-react";
import { getBerita } from "@/app/actions/berita";
import { getAgenda } from "@/app/actions/agenda";
import { getAnggota } from "@/app/actions/anggota";
import { getKeuangan } from "@/app/actions/keuangan";

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  user: string;
  timeAgo: string;
}

interface AgendaItem {
  id: string;
  title: string;
  formattedDate: string;
  category: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    berita: 0,
    agenda: 0,
    saldo: 0,
    anggota: 0,
  });
  const [upcomingAgendas, setUpcomingAgendas] = useState<AgendaItem[]>([]);
  const [activities] = useState<ActivityItem[]>([
    {
      id: "1",
      action: "created",
      description: "Membuat artikel berita 'Perlombaan Rimba 2026'",
      user: "Humas RIMBA",
      timeAgo: "1 jam yang lalu",
    },
    {
      id: "2",
      action: "diubah menjadi DITOLAK",
      description: "Mengubah status pendaftaran Doni Prasetyo",
      user: "Admin BPH",
      timeAgo: "1 hari yang lalu",
    },
    {
      id: "3",
      action: "created",
      description: "Menambahkan agenda baru 'Lomba Tahfidz Al-Qur'an'",
      user: "Admin BPH",
      timeAgo: "2 hari yang lalu",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [beritaRes, agendaRes, anggotaRes, keuanganRes] = await Promise.all([
        getBerita(),
        getAgenda(),
        getAnggota(),
        getKeuangan(),
      ]);

      const beritaCount = beritaRes.success && beritaRes.data ? beritaRes.data.length : 3;
      const agendaItems = agendaRes.success && agendaRes.data ? agendaRes.data : [];
      const anggotaCount = anggotaRes.success && anggotaRes.data ? anggotaRes.data.length : 3;
      const saldo = keuanganRes.success && "data" in keuanganRes && keuanganRes.data
        ? (keuanganRes.data as { saldoKas: number }).saldoKas
        : 29125000;

      setStats({ berita: beritaCount, agenda: agendaItems.length, saldo, anggota: anggotaCount });
      setUpcomingAgendas(
        agendaItems.slice(0, 3).map((a: AgendaItem) => ({
          id: a.id,
          title: a.title,
          formattedDate: a.formattedDate,
          category: a.category,
        }))
      );
    } catch (err) {
      console.error("Dashboard load error:", err);
      setStats({ berita: 3, agenda: 2, saldo: 29125000, anggota: 3 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const statCards = [
    {
      title: "Total Berita",
      value: isLoading ? "..." : stats.berita.toString(),
      subtext: "Artikel yang sudah dibuat",
      icon: Newspaper,
    },
    {
      title: "Total Agenda",
      value: isLoading ? "..." : stats.agenda.toString(),
      subtext: "Kegiatan terjadwal",
      icon: Calendar,
    },
    {
      title: "Saldo Kas",
      value: isLoading ? "..." : `Rp ${stats.saldo.toLocaleString("id-ID")}`,
      subtext: "Dana tersedia saat ini",
      icon: Wallet,
    },
    {
      title: "Anggota Aktif",
      value: isLoading ? "..." : stats.anggota.toString(),
      subtext: "Anggota organisasi yang tercatat",
      icon: Users,
    },
  ];

  const quickActions = [
    { name: "Kelola Berita", href: "/admin/berita", icon: Newspaper, color: "bg-blue-500 text-white" },
    { name: "Kelola Agenda", href: "/admin/agenda", icon: Calendar, color: "bg-emerald-600 text-white" },
    { name: "Kelola Galeri", href: "/admin/galeri", icon: ImageIcon, color: "bg-purple-600 text-white" },
    { name: "Laporan Keuangan", href: "/admin/keuangan", icon: Wallet, color: "bg-amber-600 text-white" },
    { name: "Pengaturan Situs", href: "/admin/pengaturan", icon: Settings, color: "bg-slate-700 text-white" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="rounded-3xl bg-linear-to-r from-primary-dark via-primary to-primary-dark text-white p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-extrabold uppercase tracking-widest text-accent mb-2 block">
            Dashboard Utama
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Selamat datang, Admin BPH
          </h2>
          <p className="text-xs sm:text-sm text-white/85 mt-2 leading-relaxed">
            Kelola data berita, jadwal agenda, registrasi pendaftar, laporan kas keuangan, dan dokumentasi kegiatan organisasi RIMBA dalam satu panel terpadu.
          </p>
        </div>
        <button
          onClick={loadData}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          title="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="p-6 rounded-3xl bg-surface border border-border/80 shadow-2xs flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 rounded-full border border-emerald-200">
                    ↗ Aktif
                  </span>
                </div>
                <span className="text-xs font-semibold text-text/60">{stat.title}</span>
                <h3 className="text-2xl font-black text-text mt-1">{stat.value}</h3>
                <p className="text-xs text-text/75 mt-1">{stat.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <h3 className="text-lg font-bold text-text mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.name}
                href={act.href}
                className="p-4 rounded-2xl bg-background border border-border/60 hover:border-primary/40 hover:bg-white transition-all flex flex-col items-center text-center group shadow-xs"
              >
                <div className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-text group-hover:text-primary transition-colors">
                  {act.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Agenda Mendatang */}
        <div className="lg:col-span-6 bg-surface border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/60">
            <h3 className="text-lg font-bold text-text flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Agenda Mendatang</span>
            </h3>
            <Link href="/admin/agenda" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-background border border-border/40 animate-pulse" />
              ))}
            </div>
          ) : upcomingAgendas.length > 0 ? (
            <div className="space-y-4">
              {upcomingAgendas.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-background border border-border/60">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold text-primary bg-primary/10 rounded-full border border-primary/20">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-sm text-text mt-1">{item.title}</h4>
                  <p className="text-xs text-text/60 mt-0.5">{item.formattedDate}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-text/60 text-xs">Tidak ada agenda mendatang</div>
          )}
        </div>

        {/* Aktivitas Terbaru */}
        <div className="lg:col-span-6 bg-surface border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/60">
            <h3 className="text-lg font-bold text-text flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              <span>Aktivitas Terbaru</span>
            </h3>
          </div>

          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="p-4 rounded-2xl bg-background border border-border/60 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-text">{act.user}</span>
                    <span className="text-text/40">•</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {act.action}
                    </span>
                  </div>
                  <p className="text-text/80 leading-snug">{act.description}</p>
                </div>
                <span className="text-[11px] text-text/50 shrink-0">{act.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
