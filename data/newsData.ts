export interface Article {
  id: string;
  title: string;
  category: "Kegiatan" | "Pengumuman" | "Lomba" | "Edukasi";
  date: string;
  author: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string[];
  isFeatured?: boolean;
}

export const NEWS_CATEGORIES = ["Semua", "Kegiatan", "Pengumuman", "Lomba", "Edukasi"] as const;

export const ARTICLES_DATA: Article[] = [
  {
    id: "berita-1",
    title: "Perlombaan Rimba 2026, Daftar Sekarang Juga!",
    category: "Lomba",
    date: "12 Juli 2026",
    author: "Humas RIMBA",
    readTime: "3 min baca",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    excerpt: "Marhaban ya Ramadhan! Dalam rangka menyemarakkan bulan suci dan milad organisasi, RIMBA kembali menyelenggarakan Lomba Tahunan untuk pemuda dan pemudi.",
    content: [
      "Marhaban ya Ramadhan! Dalam rangka menyemarakkan bulan suci dan milad organisasi, RIMBA (Remaja Islam Masjid Albarkah) kembali menyelenggarakan rangkaian Lomba Tahunan untuk generasi muda Islam.",
      "Beberapa kategori perlombaan yang dibuka antara lain: Lomba Tahfidz Al-Qur'an (Juz 30 & Juz 29), Lomba Adzan & Iqamah Merdu, serta Lomba Dai Remaja.",
      "Pendaftaran telah dibuka secara online maupun langsung di Sekretariat Masjid Al-Barkah. Semua perlombaan tidak dipungut biaya (Gratis) dan terbuka untuk umum. Raih hadiah tabungan pembinaan serta piala bergilir!"
    ]
  },
  {
    id: "berita-2",
    title: "Pembukaan Pengajian Bulanan RIMBA Masjid Al-Barkah",
    category: "Kegiatan",
    date: "14 Mei 2026",
    author: "Divisi Keislaman",
    readTime: "4 min baca",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop",
    excerpt: "Pengajian rutin bulanan remaja kembali digelar sebagai wadah pembinaan generasi muda Islam untuk mempererat ukhuwah dan menuntut ilmu syar'i.",
    content: [
      "Remaja Islam Masjid Albarkah (RIMBA) sukses menggelar Pembukaan Pengajian Bulanan Remaja bertempat di Aula Utama Masjid Al-Barkah.",
      "Acara diawali dengan pembacaan ayatur suci Al-Qur'an, dilanjutkan dengan penyampaian materi fiqih remaja dan tanya jawab seputar tantangan pemuda di era modern.",
      "Ketua Pembina menyampaikan apresiasi atas antusiasme ratusan pemuda pemudi yang hadir memadati aula masjid."
    ]
  },
  {
    id: "berita-3",
    title: "Bakti Sosial & Santunan Yatim Ceria Bersama Remaja Masjid",
    category: "Kegiatan",
    date: "28 April 2026",
    author: "Divisi Sosial",
    readTime: "3 min baca",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop",
    excerpt: "Aksi kepedulian masyarakat melalui pembagian 100+ paket sembako dan santunan anak yatim di wilayah sekitar Masjid Al-Barkah.",
    content: [
      "Sebagai wujud aksi nyata kepedulian sosial, pengurus RIMBA menyalurkan bantuan berupa paket sembako dan santunan kepada anak-anak yatim dan dhuafa.",
      "Selain penyerahan bantuan, acara juga dimeriahkan dengan lomba mewarnai, dongeng islami, dan buka puasa bersama.",
      "Terima kasih kepada seluruh donatur dan jamaah Masjid Al-Barkah yang telah menginfakkan hartanya untuk kelancaran kegiatan ini."
    ]
  },
  {
    id: "berita-4",
    title: "Tips Menjaga Istiqomah Ibadah Bagi Pemuda di Tengah Kesibukan",
    category: "Edukasi",
    date: "05 April 2026",
    author: "Tim Media Dakwah",
    readTime: "5 min baca",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    excerpt: "Panduan praktis dan nasihatislami bagi pelajar serta mahasiswa agar tetap konsisten menjaga shalat berjamaah dan tilawah Al-Qur'an.",
    content: [
      "Menjaga konsistensi (istiqomah) dalam beribadah di tengah padatnya tugas sekolah, kuliah, dan aktivitas harian seringkali menjadi tantangan tersendiri.",
      "Beberapa langkah praktis yang dapat diterapkan: 1) Membuat target harian tilawah yang terukur, 2) Memilih lingkungan pertemanan yang saling mengingatkan kebaikan, 3) Melazimkan doa memohon ketetapan hati.",
      "Ingatlah pesan Nabi SAW bahwa amalan yang paling dicintai Allah adalah amalan yang kontinyu meskipun sedikit."
    ]
  },
  {
    id: "berita-5",
    title: "Pengumuman Hasil Rekrutmen Pengurus Baru RIMBA Periode 2026/2027",
    category: "Pengumuman",
    date: "18 Maret 2026",
    author: "Sekretariat RIMBA",
    readTime: "2 min baca",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
    excerpt: "Selamat kepada 25 pemuda pemudi yang terpilih menjadi bagian dari kepengurusan RIMBA Masjid Al-Barkah periode terbaru.",
    content: [
      "Panitia Seleksi Kepengurusan RIMBA resmi mengumumkan hasil akhir tahapan wawancara dan pembekalan bagi calon pengurus baru.",
      "Sebanyak 25 peserta dinyatakan lolos dan siap mengemban amanah di berbagai divisi pergerakan organisasi.",
      "Pelantikan dan Muktamar Pengurus Baru akan dilaksanakan pada akhir bulan ini di Masjid Al-Barkah."
    ]
  }
];
