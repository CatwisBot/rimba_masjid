export interface AgendaEvent {
  id: string;
  date: string; // format YYYY-MM-DD
  formattedDate: string;
  badge: string;
  badgeColor?: string;
  title: string;
  snippet: string;
}

export const EVENTS_DATA: AgendaEvent[] = [
  {
    id: "1",
    date: "2026-07-21",
    formattedDate: "21 Juli 2026",
    badge: "Lomba Tahfidz",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    title: "Pembukaan Lomba Tahfidz Pasar Minggu",
    snippet:
      "📢 ⏰ Pembukaan Lomba Tahfidz Pasar Minggu telah tiba! 🌙 Ayo ikuti kegiatan seru ini pada tanggal 30 Mei 2026, mulai dari pagi hingga...",
  },
  {
    id: "2",
    date: "2026-08-15",
    formattedDate: "15 Agustus 2026",
    badge: "Lomba Tahfidz",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    title: "Lomba Tahfidz Al-Qur'an Remaja 2026",
    snippet:
      "Kompetisi hafalan Al-Qur'an (Juz 30 & Juz 29) tingkat remaja se-Kota Bekasi dengan total hadiah jutaan rupiah.",
  },
  {
    id: "3",
    date: "2026-08-22",
    formattedDate: "22 Agustus 2026",
    badge: "Kajian Remaja",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
    title: "Kajian Bulanan Remaja: Pemuda Rabbani di Era Digital",
    snippet:
      "Pembinaan karakter dan pemahaman fiqih muamalah digital bersama Ustadz Pembina RIMBA.",
  },
];
