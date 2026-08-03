"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
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

interface AgendaClientProps {
  initialAgendas: AgendaItem[];
}

export default function AgendaClient({ initialAgendas }: AgendaClientProps) {
  const [agendas] = useState<AgendaItem[]>(initialAgendas);

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

        {/* Main Grid: Left Calendar View, Right Selected Day Events */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Calendar Card */}
          <div className="lg:col-span-7 bg-surface rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm">
            
            {/* Month Header Navigation */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
              <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight flex items-center gap-2">
                <span>{currentMonthName}</span>
                <span className="text-primary">{currentYear}</span>
              </h2>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl border border-border/80 hover:bg-background hover:border-primary text-text/80 hover:text-primary transition-all duration-200"
                  aria-label="Bulan Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl border border-border/80 hover:bg-background hover:border-primary text-text/80 hover:text-primary transition-all duration-200"
                  aria-label="Bulan Selanjutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Day Names Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-3">
              {dayNames.map((d, i) => (
                <div
                  key={d}
                  className={`text-xs font-bold py-1.5 ${
                    i === 4 ? "text-primary font-black" : "text-text/60"
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {daysGrid.map((item, index) => {
                if (!item.isCurrentMonth) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square flex items-center justify-center text-xs font-medium text-text/25 rounded-2xl cursor-not-allowed select-none"
                    >
                      {item.day}
                    </div>
                  );
                }

                const dayNumber = item.day;
                const isSelected = selectedDay === dayNumber;

                const eventsOnThisDay = agendas.filter((evt) => {
                  const evtDate = new Date(evt.date);
                  return (
                    evtDate.getFullYear() === currentYear &&
                    evtDate.getMonth() === currentMonthDate.getMonth() &&
                    evtDate.getDate() === dayNumber
                  );
                });

                const hasEvents = eventsOnThisDay.length > 0;
                const primaryEventCategory = hasEvents ? eventsOnThisDay[0].category : "";

                let dotColor = "bg-primary";
                if (primaryEventCategory.toLowerCase().includes("lomba")) dotColor = "bg-emerald-500";
                if (primaryEventCategory.toLowerCase().includes("sosial")) dotColor = "bg-amber-500";

                return (
                  <button
                    key={`day-${dayNumber}`}
                    onClick={() => setSelectedDay(dayNumber)}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all duration-200 ${
                      isSelected
                        ? "bg-primary text-white shadow-md shadow-primary/30 scale-105"
                        : hasEvents
                        ? "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                        : "hover:bg-background text-text/80 border border-transparent"
                    }`}
                  >
                    <span>{dayNumber}</span>
                    {hasEvents && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full absolute bottom-2 ${
                          isSelected ? "bg-accent" : dotColor
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Footer Legend */}
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-text/60 flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>Kajian / Rutin</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Perlombaan</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Sosial</span>
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Selected Date Agenda Details */}
          <div className="lg:col-span-5 bg-surface rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[460px]">
            
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
                <div>
                  <span className="text-[11px] font-bold text-text/50 uppercase tracking-wider block mb-1">
                    Agenda Tanggal
                  </span>
                  <h3 className="text-lg font-extrabold text-text flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span>{formattedSelectedDate}</span>
                  </h3>
                </div>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                  {selectedEvents.length} Acara
                </span>
              </div>

              {selectedEvents.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-text/40">
                    <Info className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-text/70">Tidak Ada Agenda Acara</p>
                  <p className="text-xs text-text/50 max-w-xs">
                    Tidak terdapat jadwal kegiatan pada tanggal {formattedSelectedDate}. Silakan pilih tanggal berpenanda warna di kalender.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="group p-5 rounded-2xl bg-background border border-border/80 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className={`px-2.5 py-0.5 text-[11px] font-extrabold rounded-full ${getBadgeColor(evt.category)}`}>
                          {evt.category}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-text/60">
                          <Clock className="w-3 h-3 text-accent" />
                          <span>{evt.time}</span>
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-text group-hover:text-primary transition-colors leading-snug mb-2">
                        {evt.title}
                      </h4>

                      <p className="text-xs text-text/75 line-clamp-2 leading-relaxed mb-4">
                        {evt.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                        <span className="flex items-center gap-1 text-text/60 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span className="truncate max-w-[150px]">{evt.location}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDetailAgenda(evt)}
                            className="px-3 py-1.5 text-xs font-bold text-text/80 hover:text-primary bg-surface hover:bg-primary/10 border border-border rounded-xl transition-all"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => handleOpenRegistration(evt)}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-xs transition-all flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Daftar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Tip Card */}
            <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                💡
              </div>
              <p className="text-xs text-text/75 leading-relaxed">
                Ingin mendaftar perlombaan atau kegiatan RIMBA? Klik tombol <strong className="text-primary font-bold">Daftar</strong> pada agenda yang dipilih.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL 1: Detail Info Agenda */}
      {detailAgenda && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setDetailAgenda(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-background text-text/60 hover:text-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {detailAgenda.image && (
              <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden mb-6 bg-background">
                <Image
                  src={detailAgenda.image}
                  alt={detailAgenda.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 text-xs font-extrabold rounded-full ${getBadgeColor(detailAgenda.category)}`}>
                {detailAgenda.category}
              </span>
              <span className="text-xs font-semibold text-text/60">
                {detailAgenda.formattedDate}
              </span>
            </div>

            <h3 className="text-2xl font-black text-text leading-tight mb-4">
              {detailAgenda.title}
            </h3>

            <div className="space-y-2 text-xs text-text/80 mb-6 bg-background p-4 rounded-2xl border border-border/60">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>Waktu: <strong className="text-text font-bold">{detailAgenda.time}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span>Lokasi: <strong className="text-text font-bold">{detailAgenda.location}</strong></span>
              </div>
              {detailAgenda.deadline && (
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Batas Pendaftaran: <strong className="font-bold">{detailAgenda.deadline}</strong></span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-text/50 uppercase tracking-wider mb-2">Deskripsi Agenda</h4>
              <p className="text-xs sm:text-sm text-text/80 leading-relaxed whitespace-pre-line">
                {detailAgenda.description}
              </p>
            </div>

            {detailAgenda.requirements && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-text/50 uppercase tracking-wider mb-2">Ketentuan / Persyaratan</h4>
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-text/85 leading-relaxed whitespace-pre-line">
                  {detailAgenda.requirements}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-border/60">
              <button
                onClick={() => handleShareAgenda(detailAgenda)}
                className="flex-1 py-3 px-4 rounded-2xl border border-border hover:bg-background text-xs font-bold text-text flex items-center justify-center gap-2 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-primary" />
                    <span>Bagikan Info</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  const target = detailAgenda;
                  setDetailAgenda(null);
                  handleOpenRegistration(target);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-primary hover:bg-primary-dark text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Daftar Sekarang</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Form Pendaftaran Agenda */}
      {registeringAgenda && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            
            <button
              onClick={() => setRegisteringAgenda(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-background text-text/60 hover:text-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="py-8 text-center flex flex-col items-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-text">Pendaftaran Berhasil!</h3>
                <p className="text-xs text-text/70 max-w-xs leading-relaxed">
                  Jazakallah Khair <strong className="text-text">{regForm.name}</strong>, pendaftaran Anda untuk kegiatan <strong className="text-primary">{registeringAgenda.title}</strong> telah tersimpan di sistem RIMBA.
                </p>
                <p className="text-xs text-primary font-bold">
                  Panitia akan menghubungi Anda melalui kontak WhatsApp yang dicantumkan.
                </p>
                <button
                  onClick={() => setRegisteringAgenda(null)}
                  className="mt-4 px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-full shadow-md hover:bg-primary-dark transition-all"
                >
                  Tutup Halaman
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-1">
                    Form Pendaftaran Acara
                  </span>
                  <h3 className="text-xl font-black text-text leading-tight">
                    {registeringAgenda.title}
                  </h3>
                  <p className="text-xs text-text/60 mt-1">
                    {registeringAgenda.formattedDate} • {registeringAgenda.time}
                  </p>
                </div>

                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitRegistration} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
                      Nama Lengkap Pendaftar <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Farhan"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border/80 focus:outline-none focus:border-primary text-text"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
                      No. WhatsApp / Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 081513983136"
                      value={regForm.contact}
                      onChange={(e) => setRegForm({ ...regForm, contact: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border/80 focus:outline-none focus:border-primary text-text"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
                      Catatan / Asal Pengurus (Opsional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Anggota Divisi Humas / Jamaah Umum"
                      value={regForm.notes}
                      onChange={(e) => setRegForm({ ...regForm, notes: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border/80 focus:outline-none focus:border-primary text-text resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mengirim Pendaftaran...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Kirim Pendaftaran</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </main>
  );
}
