export interface GalleryItem {
  id: string;
  title: string;
  category: "Kajian" | "Sosial" | "Lomba" | "Kebersamaan";
  date: string;
  image: string;
  caption: string;
}

export const GALLERY_CATEGORIES = ["Semua", "Kajian", "Sosial", "Lomba", "Kebersamaan"] as const;

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: "g-1",
    title: "Pengajian Rutin Bulanan Remaja",
    category: "Kajian",
    date: "14 Mei 2026",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
    caption: "Suasana pengajian rutin bulanan remaja di Aula Utama Masjid Al-Barkah bersama Ustadz Pembina.",
  },
  {
    id: "g-2",
    title: "Pelaksanaan Lomba Tahfidz Al-Qur'an",
    category: "Lomba",
    date: "15 Agustus 2026",
    image: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=1000&auto=format&fit=crop",
    caption: "Momen peserta Lomba Tahfidz Al-Qur'an melantunkan ayat-ayat suci di hadapan dewan juri.",
  },
  {
    id: "g-3",
    title: "Aksi Santunan Yatim & Bakti Sosial",
    category: "Sosial",
    date: "28 April 2026",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop",
    caption: "Pembagian bantuan paket sembako dan santunan kepada anak-anak yatim di lingkungan sekitar masjid.",
  },
  {
    id: "g-4",
    title: "Rapat Kerja & Silaturahmi Pengurus RIMBA",
    category: "Kebersamaan",
    date: "10 Maret 2026",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
    caption: "Kebersamaan dan musyawarah kerja pengurus RIMBA membahas agenda kegiatan tahunan.",
  },
  {
    id: "g-5",
    title: "Lomba Adzan Remaja Putra",
    category: "Lomba",
    date: "16 Agustus 2026",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000&auto=format&fit=crop",
    caption: "Gema adzan merdu peserta lomba adzan remaja putra di mihrab Masjid Al-Barkah.",
  },
  {
    id: "g-6",
    title: "Kajian Tematik & Buka Puasa Bersama",
    category: "Kajian",
    date: "20 Ramadan 2026",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    caption: "Suasana kehangatan buka puasa bersama jamaah remaja setelah menyimak kajian jelang maghrib.",
  },
];
