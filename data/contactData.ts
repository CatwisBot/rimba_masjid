import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const CONTACT_INFO = [
  {
    title: "Lokasi Sekretariat",
    name: "Masjid Al-Barkah",
    detail: "Jl. Masjid Al-Barkah No. 12, Bekasi Selatan, Kota Bekasi, Jawa Barat",
    icon: MapPin,
    badgeColor: "text-accent bg-primary/10 border-primary/20",
  },
  {
    title: "WhatsApp & Telepon",
    name: "+62 812-3456-7890",
    detail: "Layanan Humas RIMBA (Senin - Sabtu)",
    icon: Phone,
    badgeColor: "text-emerald-700 bg-emerald-100 border-emerald-200",
  },
  {
    title: "Email Resmi",
    name: "info@rimbamasjid.or.id",
    detail: "Untuk surat resmi dan penawaran kerjasama",
    icon: Mail,
    badgeColor: "text-primary bg-accent/15 border-accent/30",
  },
  {
    title: "Jam Sekretariat",
    name: "08.00 - 20.00 WIB",
    detail: "Terbuka setiap hari untuk konsultasi & silaturahmi",
    icon: Clock,
    badgeColor: "text-primary bg-primary/10 border-primary/20",
  },
];

export const FORM_CATEGORIES = ["Pertanyaan", "Pengaduan", "Masukan"] as const;
