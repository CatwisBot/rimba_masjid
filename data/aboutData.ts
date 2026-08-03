import {
  Compass,
  Target,
  Flag,
  ShieldCheck,
  Palette,
  HandHeart,
  Shield,
  UserCheck,
  FileText,
  Wallet,
  Megaphone,
  Coins,
  Utensils,
  CalendarCheck,
  Package,
  Camera
} from "lucide-react";

export const ABOUT_PILLARS = [
  {
    title: "Visi",
    description: "Membangun generasi remaja masjid yang aktif, berakhlak, dan berdampak di masyarakat.",
    icon: Compass,
    badgeColor: "bg-primary text-white",
  },
  {
    title: "Misi",
    description: "Menguatkan pembinaan keislaman, kepedulian sosial, dan kreativitas dakwah digital secara berkelanjutan.",
    icon: Target,
    badgeColor: "bg-accent text-white",
  },
  {
    title: "Tujuan",
    description: "Menjadi ruang tumbuh untuk remaja: belajar, berorganisasi, melayani, dan berkontribusi lewat program nyata.",
    icon: Flag,
    badgeColor: "bg-primary-dark text-white",
  },
];

export const CORE_VALUES = [
  {
    title: "Berakhlak",
    description: "Menjunjung adab, saling menghormati, dan menjaga nilai-nilai islami dalam setiap aktivitas.",
    icon: ShieldCheck,
  },
  {
    title: "Berkarya",
    description: "Mendorong kreativitas remaja masjid dalam media dakwah dan kegiatan sosial yang bermanfaat.",
    icon: Palette,
  },
  {
    title: "Berdampak",
    description: "Memberi kontribusi nyata bagi masjid dan masyarakat melalui aksi kolaboratif dan pembinaan berkelanjutan.",
    icon: HandHeart,
  },
];

export const INTI_LIST = [
  {
    role: "Pembina RIMBA",
    title: "Pembina Organisasi",
    description: "Pengarah spiritual dan pelindung kegiatan remaja masjid.",
    icon: Shield,
  },
  {
    role: "Ketua RIMBA",
    title: "Ketua Umum",
    description: "Pemimpin utama pergerakan, kebijakan, dan nakhoda organisasi.",
    icon: UserCheck,
  },
  {
    role: "Sekretaris",
    title: "Sekretaris Umum",
    description: "Pengelola administrasi, kearsipan, dan persuratan organisasi.",
    icon: FileText,
  },
  {
    role: "Bendahara",
    title: "Bendahara Umum",
    description: "Pengelola keuangan, sirkulasi kas, dan transparansi anggaran.",
    icon: Wallet,
  },
];

export const BPH_LIST = [
  {
    role: "Ketua Pelaksana",
    title: "Ketua Pelaksana BPH",
    description: "Penanggung jawab operasional jalannya eksekusi program.",
    icon: UserCheck,
  },
  {
    role: "Sekretaris",
    title: "Sekretaris BPH",
    description: "Pendata rekapitulasi dan notulensi administrasi pelaksana.",
    icon: FileText,
  },
  {
    role: "Bendahara",
    title: "Bendahara BPH",
    description: "Pencatat transaksi dan pertanggungjawaban dana operasional.",
    icon: Wallet,
  },
];

export const DIVISIONS = [
  {
    code: "HUMAS",
    name: "Hubungan Masyarakat",
    description: "Jembatan komunikasi antara organisasi dengan jamaah masjid, tokoh masyarakat, dan mitra eksternal.",
    icon: Megaphone,
  },
  {
    code: "Dana",
    name: "Penggalangan Dana",
    description: "Pengelola penggalangan dana, donasi kegiatan, sponsor, serta usaha kemandirian finansial organisasi.",
    icon: Coins,
  },
  {
    code: "Konsumsi",
    name: "Divisi Konsumsi",
    description: "Penanggung jawab perencanaan, penyediaan, dan penyaluran logistik makanan pada setiap kegiatan.",
    icon: Utensils,
  },
  {
    code: "Acara",
    name: "Manajemen Acara",
    description: "Perancang konsep, penyusun rundown, dan koordinator pengisi acara kajian maupun perlombaan.",
    icon: CalendarCheck,
  },
  {
    code: "Perlengkapan",
    name: "Divisi Perlengkapan",
    description: "Penyedia sarana prasarana, tata panggung, sound system, serta perawatan aset operasional acara.",
    icon: Package,
  },
  {
    code: "PDD",
    name: "Publikasi, Dokumentasi & Desain",
    description: "Tim kreatif pembuat desain visual, konten media sosial, video dakwah, serta dokumentasi kegiatan.",
    icon: Camera,
  },
];
