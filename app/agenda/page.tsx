"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  MapPin,
  UserCheck,
  X,
  CheckCircle2,
  AlertCircle,
  Share2,
  Info,
  Check,
  ArrowRight,
} from "lucide-react";
import { getAgenda } from "@/app/actions/agenda";
import { createPendaftaran } from "@/app/actions/pendaftaran";

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
  deadline?: string | null;
  requirements?: string | null;
  createdAt: Date | string;
}

export default function AgendaPage() {
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  // Modal Detail Agenda ("Informasi Lebih Lanjut")
  const [detailAgenda, setDetailAgenda] = useState<AgendaItem | null>(null);

  // Modal Registration state
  const [registeringAgenda, setRegisteringAgenda] = useState<AgendaItem | null>(null);
  const [regForm, setRegForm] = useState({ name: "", contact: "", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Toast copied link state
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAgenda();
      if (res.success && res.data) {
        setAgendas(res.data as AgendaItem[]);
      } else {
        setError("Gagal memuat data agenda dari database.");
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

  // Auto-select date of first agenda in the active month when agendas are loaded
  useEffect(() => {
    if (agendas.length > 0) {
      const match = agendas.find((evt) => {
        const itemDate = new Date(evt.date);
        return (
          itemDate.getFullYear() === currentMonthDate.getFullYear() &&
          itemDate.getMonth() === currentMonthDate.getMonth()
        );
      });
      if (match) {
        setSelectedDay(new Date(match.date).getDate());
      }
    }
  }, [agendas, currentMonthDate]);

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dayNames = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];

  const currentMonthName = monthNames[currentMonthDate.getMonth()];
  const currentYear = currentMonthDate.getFullYear();

  // Helper to generate days grid for currentMonthDate
  const getDaysGrid = () => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    
    // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const firstDayIndex = new Date(year, month, 1).getDay();
    const startingDay = (firstDayIndex + 6) % 7;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const grid = [];

    // Previous month filler days
    for (let i = startingDay - 1; i >= 0; i--) {
      grid.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isPrev: true,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push({
        day: d,
        isCurrentMonth: true,
        isPrev: false,
      });
    }

    // Next month filler days to complete grid rows
    const totalSlots = grid.length;
    const remainingSlots = (7 - (totalSlots % 7)) % 7;
    for (let n = 1; n <= remainingSlots; n++) {
      grid.push({
        day: n,
        isCurrentMonth: false,
        isNext: true,
      });
    }

    return grid;
  };

  const daysGrid = getDaysGrid();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
    setSelectedDay(1);
  };

  const formattedSelectedDate = `${selectedDay.toString().padStart(2, "0")} ${currentMonthName} ${currentYear}`;

  // Filter agendas for selected day
  const selectedEvents = agendas.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getFullYear() === currentYear &&
      itemDate.getMonth() === currentMonthDate.getMonth() &&
      itemDate.getDate() === selectedDay
    );
  });

  const getBadgeColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("lomba")) return "bg-emerald-100 text-emerald-800 border border-emerald-300";
    if (cat.includes("kajian")) return "bg-primary/10 text-primary border border-primary/20";
    if (cat.includes("sosial")) return "bg-amber-100 text-amber-800 border border-amber-300";
    return "bg-blue-100 text-blue-800 border border-blue-300";
  };

  const handleOpenRegistration = (item: AgendaItem) => {
    setRegisteringAgenda(item);
    setRegForm({ name: "", contact: "", notes: "" });
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const handleShareAgenda = (item: AgendaItem) => {
    const shareText = `*${item.title}*\n📅 ${item.formattedDate} (${item.time})\n📍 ${item.location}\n\nInfo selengkapnya & pendaftaran di website RIMBA Masjid Al-Barkah!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } else {
      alert("Tautan agenda disalin:\n" + shareText);
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringAgenda) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await createPendaftaran({
        name: regForm.name,
        contact: regForm.contact,
        agendaTitle: registeringAgenda.title,
        agendaId: registeringAgenda.id,
        notes: regForm.notes,
      });

      if (res.success) {
        setSubmitSuccess(true);
        setRegForm({ name: "", contact: "", notes: "" });
      } else {
        setSubmitError(res.error || "Gagal mendaftar agenda.");
      }
    } catch {
      setSubmitError("Terjadi kesalahan koneksi saat pendaftaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background py-10 lg:py-16">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-4">
            <CalendarIcon className="w-4 h-4 text-accent" />
            <span>Agenda & Kegiatan</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text leading-tight tracking-tight">
            Agenda & Kegiatan RIMBA
          </h1>

          <p className="text-base sm:text-lg text-text/75 leading-relaxed mt-4 font-normal max-w-2xl">
            Lihat jadwal kajian, kegiatan sosial, serta pendaftaran acara islami remaja masjid. Klik agenda di bawah untuk informasi lebih lanjut dan pendaftaran.
          </p>
        </div>

        {copied && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl shadow-2xl animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-white" />
            <span>Informasi agenda berhasil disalin ke clipboard!</span>
          </div>
        )}

        {error && (
          <div className="mb-8 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Top Row: Calendar & Selected Date Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          
          {/* Left Column: Interactive Calendar Box */}
          <div className="lg:col-span-5 bg-surface border border-border/80 rounded-3xl p-6 shadow-xs flex flex-col">
            
            {/* Calendar Header Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-background text-text/70 transition-colors"
                aria-label="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-bold text-base text-text">
                {currentMonthName} {currentYear}
              </span>

              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-background text-text/70 transition-colors"
                aria-label="Bulan Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-3">
              {dayNames.map((day, idx) => (
                <span
                  key={day}
                  className={`text-xs font-extrabold tracking-wider ${
                    idx >= 5 ? "text-red-500" : "text-text/70"
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {daysGrid.map((item, index) => {
                const isSelected = item.isCurrentMonth && item.day === selectedDay;
                const isWeekend = (index % 7) === 5 || (index % 7) === 6;

                // Check if there are agendas on this date
                const hasEvent = item.isCurrentMonth && agendas.some((evt) => {
                  const itemDate = new Date(evt.date);
                  return (
                    itemDate.getFullYear() === currentYear &&
                    itemDate.getMonth() === currentMonthDate.getMonth() &&
                    itemDate.getDate() === item.day
                  );
                });

                return (
                  <button
                    key={index}
                    disabled={!item.isCurrentMonth}
                    onClick={() => item.isCurrentMonth && setSelectedDay(item.day)}
                    className={`relative h-10 text-sm font-semibold rounded-lg flex items-center justify-center transition-all ${
                      !item.isCurrentMonth
                        ? "text-text/20 cursor-default"
                        : isSelected
                        ? "bg-primary text-white shadow-md font-bold scale-105"
                        : isWeekend
                        ? "text-red-500 hover:bg-red-50"
                        : "text-text hover:bg-background"
                    }`}
                  >
                    {item.day}
                    {hasEvent && !isSelected && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Selected Date Agenda Detail Box */}
          <div className="lg:col-span-7 bg-surface border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-start min-h-70">
            
            {/* Header: Date String */}
            <div className="flex items-center gap-2 text-primary font-bold text-base mb-6 border-b border-border/60 pb-3">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <span>{formattedSelectedDate}</span>
            </div>

            {/* Content Area */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12 gap-3 text-text/60">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-xs font-semibold">Memuat agenda...</span>
              </div>
            ) : selectedEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-5 rounded-2xl bg-background border border-border/60 flex flex-col space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${getBadgeColor(evt.category)}`}>
                        {evt.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-text">{evt.title}</h4>
                    <p className="text-xs sm:text-sm text-text/75 leading-relaxed line-clamp-2">{evt.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-text/70 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{evt.location}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => setDetailAgenda(evt)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Informasi Lebih Lanjut</span>
                      </button>
                      <button
                        onClick={() => handleOpenRegistration(evt)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-xs transition-all"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-accent" />
                        <span>Daftar Sekarang</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full p-6 rounded-2xl bg-background/80 border border-border/60 text-text/60 text-sm font-medium flex items-center justify-start gap-2">
                <span>Tidak ada agenda pada tanggal ini.</span>
              </div>
            )}

          </div>

        </div>

        {/* Bottom Section: Daftar Agenda & Kegiatan */}
        <div className="bg-surface border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xl font-bold text-text">
              <CalendarIcon className="w-6 h-6 text-primary" />
              <h2>Daftar Agenda & Kegiatan</h2>
            </div>
            <span className="text-xs font-semibold text-text/60 bg-background px-3 py-1 rounded-full border border-border/60">
              Total {agendas.length} Agenda
            </span>
          </div>

          {/* List of Agenda Items */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-text/60">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm font-semibold">Memuat data dari Supabase...</span>
            </div>
          ) : agendas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-background/60 rounded-2xl border border-border/60 p-8">
              <span className="text-4xl">📅</span>
              <h3 className="text-base font-bold text-text">Belum Ada Agenda yang Dipublikasikan</h3>
              <p className="text-xs text-text/70 max-w-md">
                Agenda kegiatan belum ditambahkan di database. Silakan periksa kembali nanti atau hubungi pengurus RIMBA.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {agendas.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl bg-background/60 border border-border/80 p-6 transition-all hover:border-primary/40 hover:bg-white hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1 cursor-pointer" onClick={() => setDetailAgenda(item)}>
                    {/* Top Row: Date on Left, Badge on Right */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-text/60 font-semibold">{item.formattedDate}</span>
                      <span className={`px-3 py-0.5 font-bold rounded-full ${getBadgeColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-text group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-text/75 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Time & Location */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-text/70 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="shrink-0 flex flex-wrap md:flex-col lg:flex-row items-center gap-2 pt-2 md:pt-0">
                    <button
                      onClick={() => setDetailAgenda(item)}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all"
                    >
                      <Info className="w-4 h-4" />
                      <span>Informasi Lebih Lanjut</span>
                    </button>

                    <button
                      onClick={() => handleOpenRegistration(item)}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-xl shadow-md transition-all"
                    >
                      <UserCheck className="w-4 h-4 text-accent" />
                      <span>Daftar Sekarang</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Detail Agenda Modal ("Informasi Lebih Lanjut") */}
      {detailAgenda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setDetailAgenda(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-text/70 hover:text-text hover:bg-background transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            {detailAgenda.image && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-6 bg-background">
                <Image
                  src={detailAgenda.image}
                  alt={detailAgenda.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* Category & Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3.5 py-1 text-xs font-bold rounded-full ${getBadgeColor(detailAgenda.category)}`}>
                {detailAgenda.category}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text leading-tight mb-4">
              {detailAgenda.title}
            </h2>

            {/* Date, Time, Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-background border border-border/80 mb-6 text-xs">
              <div className="flex items-center gap-2 text-text/80 font-semibold">
                <CalendarIcon className="w-4 h-4 text-primary shrink-0" />
                <span>{detailAgenda.formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-text/80 font-semibold">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>{detailAgenda.time}</span>
              </div>
              <div className="flex items-center gap-2 text-text/80 font-semibold sm:col-span-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{detailAgenda.location}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-text/60 uppercase tracking-wider">Deskripsi Agenda</h4>
              <p className="text-sm sm:text-base text-text/85 leading-relaxed whitespace-pre-line">
                {detailAgenda.description}
              </p>
            </div>

            {/* Informasi Pendaftaran Box */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3 mb-8">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Info className="w-4 h-4 text-accent" />
                <span>Informasi Pendaftaran</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-primary/10">
                  <span className="text-text/60 font-medium">Batas Pendaftaran:</span>
                  <span className="font-bold text-text">
                    {detailAgenda.deadline || "1 Hari Sebelum Acara"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-text/60 font-medium">Syarat & Ketentuan:</span>
                  <p className="font-medium text-text/80 leading-relaxed whitespace-pre-line">
                    {detailAgenda.requirements || "1. Terbuka untuk pemuda/pemudi Muslim\n2. Berpakaian sopan & menutup aurat\n3. Hadir tepat waktu di lokasi kegiatan"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleShareAgenda(detailAgenda)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-text bg-background hover:bg-border rounded-xl border border-border transition-colors"
              >
                <Share2 className="w-4 h-4 text-accent" />
                <span>Bagikan Agenda</span>
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  onClick={() => setDetailAgenda(null)}
                  className="px-4 py-2.5 text-xs font-bold text-text/70 hover:text-text transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    const target = detailAgenda;
                    setDetailAgenda(null);
                    handleOpenRegistration(target);
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md transition-all"
                >
                  <UserCheck className="w-4 h-4 text-accent" />
                  <span>Daftar Sekarang</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Registration Modal */}
      {registeringAgenda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setRegisteringAgenda(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-text/70 hover:text-text hover:bg-background"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 border-b border-border pb-4">
              <span className="text-xs font-bold text-primary uppercase">Formulir Pendaftaran</span>
              <h3 className="text-xl font-extrabold text-text mt-0.5">{registeringAgenda.title}</h3>
              <p className="text-xs text-text/70 mt-1">
                Jadwal: {registeringAgenda.formattedDate} ({registeringAgenda.time})
              </p>
            </div>

            {submitSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-text">Pendaftaran Berhasil!</h4>
                <p className="text-xs text-text/75 leading-relaxed max-w-xs mx-auto">
                  Terima kasih telah mendaftar. Data Anda telah dikirimkan ke panitia pengurus RIMBA.
                </p>
                <button
                  onClick={() => setRegisteringAgenda(null)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md transition-all"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitRegistration} className="space-y-4 text-xs">
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-text mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text mb-1">Kontak / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890"
                    value={regForm.contact}
                    onChange={(e) => setRegForm({ ...regForm, contact: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text mb-1">Catatan Tambahan (Opsional)</label>
                  <textarea
                    rows={3}
                    placeholder="Asal utusan masjid, kelompok, atau catatan khusus..."
                    value={regForm.notes}
                    onChange={(e) => setRegForm({ ...regForm, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-5 font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Kirim Pendaftaran</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </main>
  );
}
