import "dotenv/config";
import { PrismaClient, Role, StatusPesan, TipeKeuangan, StatusPendaftaran } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma: any = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database RIMBA Masjid ke Supabase dengan Relasi Divisi, Kategori, & User...");

  // Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.keuangan.deleteMany();
  await prisma.pendaftaran.deleteMany();
  await prisma.anggota.deleteMany();
  await prisma.pesanMasuk.deleteMany();
  await prisma.galeri.deleteMany();
  await prisma.agenda.deleteMany();
  await prisma.berita.deleteMany();
  await prisma.divisi.deleteMany();
  await prisma.kategori.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Master Divisi (6 Divisi Utama)
  const divHumas = await prisma.divisi.create({
    data: {
      code: "HUMAS",
      name: "Hubungan Masyarakat",
      description: "Jembatan komunikasi antara organisasi dengan jamaah masjid, masyarakat, dan media.",
      icon: "Megaphone",
    },
  });

  const divPDD = await prisma.divisi.create({
    data: {
      code: "PDD",
      name: "Publikasi, Dokumentasi & Desain",
      description: "Tim kreatif pembuat desain visual, konten media sosial, dan dokumentasi acara.",
      icon: "Camera",
    },
  });

  const divKeislaman = await prisma.divisi.create({
    data: {
      code: "KEISLAMAN",
      name: "Divisi Keislaman & Dakwah",
      description: "Perancang program pembinaan spiritual, kajian rutin, dan kegiatan keagamaan.",
      icon: "Shield",
    },
  });

  const divSosial = await prisma.divisi.create({
    data: {
      code: "SOSIAL",
      name: "Divisi Sosial & Masyarakatan",
      description: "Penanggung jawab santunan anak yatim, bakti sosial, dan kepedulian warga.",
      icon: "Heart",
    },
  });

  const divAcara = await prisma.divisi.create({
    data: {
      code: "ACARA",
      name: "Manajemen Acara & Ops",
      description: "Penyusun rundown, pengisi acara, dan eksekusi panggung perlombaan.",
      icon: "CalendarCheck",
    },
  });

  const divDana = await prisma.divisi.create({
    data: {
      code: "DANA",
      name: "Penggalangan Dana & Sponsor",
      description: "Pengelola donasi kegiatan, sponsor, serta usaha finansial mandiri.",
      icon: "Coins",
    },
  });

  console.log("Sukses membuat 6 Master Divisi:", divHumas.code, divPDD.code, divKeislaman.code, divSosial.code, divAcara.code, divDana.code);

  // 2. Seed Master Kategori (Terpusat)
  const katKegiatan = await prisma.kategori.create({
    data: { name: "Kegiatan", type: "UMUM", description: "Kegiatan rutin & acara kebersamaan" },
  });
  const katKajian = await prisma.kategori.create({
    data: { name: "Kajian", type: "BERITA", description: "Kajian islami & dakwah digital" },
  });
  const katLomba = await prisma.kategori.create({
    data: { name: "Lomba", type: "AGENDA", description: "Kompetisi & lomba keislaman" },
  });
  await prisma.kategori.create({
    data: { name: "Pengumuman", type: "BERITA", description: "Pengumuman resmi organisasi" },
  });
  const katSosial = await prisma.kategori.create({
    data: { name: "Sosial", type: "UMUM", description: "Aksi bakti sosial & santunan" },
  });
  const katKebersamaan = await prisma.kategori.create({
    data: { name: "Kebersamaan", type: "GALERI", description: "Momen silaturahmi pengurus" },
  });

  console.log("Sukses membuat Master Kategori Terpusat");

  // 3. Seed 3 User Accounts
  const passwordBPH = await bcrypt.hash("adminbph", 10);
  const passwordHumas = await bcrypt.hash("adminhumas", 10);
  const passwordBendahara = await bcrypt.hash("adminbendahara", 10);

  const userBPH = await prisma.user.create({
    data: {
      name: "Admin BPH",
      email: "adminbph@gmail.com",
      password: passwordBPH,
      role: Role.BPH,
      badge: "Super Admin",
    },
  });

  const userHumas = await prisma.user.create({
    data: {
      name: "Admin Humas",
      email: "adminhumas@gmail.com",
      password: passwordHumas,
      role: Role.HUMAS,
      badge: "Humas Admin",
    },
  });

  const userBendahara = await prisma.user.create({
    data: {
      name: "Admin Benda",
      email: "adminbendahara@gmail.com",
      password: passwordBendahara,
      role: Role.BENDAHARA,
      badge: "Bendahara Admin",
    },
  });

  console.log("Sukses membuat 3 Akun Admin:", userBPH.email, userHumas.email, userBendahara.email);

  // 4. Seed Berita (Linked to User & Kategori)
  await prisma.berita.createMany({
    data: [
      {
        id: "b-1",
        title: "Perlombaan Rimba 2026",
        slug: "perlombaan-rimba-2026",
        category: "Lomba",
        kategoriId: katLomba.id,
        excerpt: "Marhaban ya Ramadhan! Dalam rangka menyemarakkan bulan suci dan milad organisasi, RIMBA kembali menyelenggarakan Lomba Tahunan.",
        content: "Marhaban ya Ramadhan! Dalam rangka menyemarakkan bulan suci dan milad organisasi, RIMBA kembali menyelenggarakan Lomba Tahunan untuk pemuda dan pemudi.",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop",
        status: "Published",
        author: "Humas RIMBA",
        authorId: userHumas.id,
        readTime: "3 min baca",
      },
      {
        id: "b-2",
        title: "Pembukaan Pengajian Bulanan RIMBA Masjid Al-Barkah",
        slug: "pembukaan-pengajian-bulanan-rimba-masjid-al-barkah",
        category: "Kegiatan",
        kategoriId: katKegiatan.id,
        excerpt: "Pengajian rutin bulanan remaja kembali digelar sebagai wadah pembinaan generasi muda Islam untuk mempererat ukhuwah.",
        content: "Remaja Islam Masjid Albarkah (RIMBA) sukses menggelar Pembukaan Pengajian Bulanan Remaja bertempat di Aula Utama Masjid Al-Barkah.",
        image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop",
        status: "Published",
        author: "Divisi Keislaman",
        authorId: userHumas.id,
        readTime: "4 min baca",
      },
      {
        id: "b-3",
        title: "Bakti Sosial & Santunan Yatim Ceria Bersama Remaja Masjid",
        slug: "bakti-sosial-santunan-yatim-ceria-bersama-remaja-masjid",
        category: "Kegiatan",
        kategoriId: katSosial.id,
        excerpt: "Aksi kepedulian masyarakat melalui pembagian 100+ paket sembako dan santunan anak yatim di wilayah sekitar Masjid Al-Barkah.",
        content: "Sebagai wujud aksi nyata kepedulian sosial, pengurus RIMBA menyalurkan bantuan berupa paket sembako dan santunan kepada anak-anak yatim.",
        image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop",
        status: "Published",
        author: "Divisi Sosial",
        authorId: userHumas.id,
        readTime: "3 min baca",
      },
    ],
  });

  // 5. Seed Agenda (Linked to Divisi & Kategori)
  const agenda1 = await prisma.agenda.create({
    data: {
      id: "a-1",
      title: "Lomba Tahfidz Al-Qur'an Remaja 2026",
      description: "Kompetisi hafalan Al-Qur'an (Juz 30 & Juz 29) tingkat remaja se-Kota Bekasi dengan total hadiah jutaan rupiah.",
      category: "Lomba Tahfidz",
      kategoriId: katLomba.id,
      divisiId: divAcara.id,
      date: new Date("2026-08-15"),
      formattedDate: "Sabtu, 15 Agustus 2026",
      time: "08.00 - 12.00 WIB",
      location: "Ruang Utama Masjid Al-Barkah",
      deadline: "14 Agustus 2026, 23.59 WIB",
      requirements: "1. Beragama Islam\n2. Usia 13-25 tahun\n3. Membawa Al-Qur'an hafalan",
      status: "Aktif",
    },
  });

  const agenda2 = await prisma.agenda.create({
    data: {
      id: "a-2",
      title: "Kajian Bulanan Remaja: Pemuda Rabbani di Era Digital",
      description: "Pembinaan karakter dan pemahaman fiqih muamalah digital bersama Ustadz Pembina RIMBA.",
      category: "Kajian Islami",
      kategoriId: katKajian.id,
      divisiId: divKeislaman.id,
      date: new Date("2026-08-22"),
      formattedDate: "Sabtu, 22 Agustus 2026",
      time: "18.30 WIB (Ba'da Maghrib)",
      location: "Aula Masjid Al-Barkah",
      deadline: "21 Agustus 2026, 20.00 WIB",
      requirements: "1. Terbuka untuk umum remaja\n2. Menjaga adab majelis ilmu",
      status: "Aktif",
    },
  });

  // 6. Seed Pendaftaran (Linked to Agenda & User)
  await prisma.pendaftaran.createMany({
    data: [
      {
        name: "Muhammad Rizki",
        contact: "081299887766",
        agendaTitle: agenda1.title,
        agendaId: agenda1.id,
        userId: userHumas.id,
        status: StatusPendaftaran.DIKONFIRMASI,
        notes: "Peserta Cabang Juz 30",
      },
      {
        name: "Siti Nurhaliza",
        contact: "085711223344",
        agendaTitle: agenda2.title,
        agendaId: agenda2.id,
        userId: userHumas.id,
        status: StatusPendaftaran.MENUNGGU,
        notes: "Daftar kelompok pengajian",
      },
    ],
  });

  // 7. Seed Galeri (Linked to Kategori & User)
  await prisma.galeri.createMany({
    data: [
      {
        id: "g-1",
        title: "Pengajian Rutin Bulanan Remaja",
        category: "Kajian",
        kategoriId: katKajian.id,
        image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
        caption: "Suasana pengajian rutin bulanan remaja di Aula Utama Masjid Al-Barkah.",
        createdById: userHumas.id,
      },
      {
        id: "g-2",
        title: "Pelaksanaan Lomba Tahfidz Al-Qur'an",
        category: "Lomba",
        kategoriId: katLomba.id,
        image: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=1000&auto=format&fit=crop",
        caption: "Momen peserta Lomba Tahfidz Al-Qur'an melantunkan ayat-ayat suci.",
        createdById: userHumas.id,
      },
      {
        id: "g-3",
        title: "Aksi Santunan Yatim & Bakti Sosial",
        category: "Sosial",
        kategoriId: katSosial.id,
        image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop",
        caption: "Pembagian bantuan paket sembako dan santunan kepada anak-anak yatim.",
        createdById: userHumas.id,
      },
      {
        id: "g-4",
        title: "Rapat Kerja & Silaturahmi Pengurus RIMBA",
        category: "Kebersamaan",
        kategoriId: katKebersamaan.id,
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
        caption: "Kebersamaan dan musyawarah kerja pengurus RIMBA.",
        createdById: userHumas.id,
      },
    ],
  });

  // 8. Seed Pesan Masuk
  await prisma.pesanMasuk.createMany({
    data: [
      {
        id: "pm-1",
        senderName: "Budi Santoso",
        contact: "08123456789",
        category: "Pertanyaan",
        message: "Apakah Lomba Tahfidz dibuka untuk peserta dari luar kecamatan?",
        status: StatusPesan.Baru,
      },
      {
        id: "pm-2",
        senderName: "Anonymous",
        contact: "-",
        category: "Masukan",
        message: "Saran agar jadwal pengajian bulanan bisa dipublikasikan H-7 di Instagram.",
        status: StatusPesan.Baru,
      },
      {
        id: "pm-3",
        senderName: "Dewi Lestari",
        contact: "dewi@gmail.com",
        category: "Pengaduan",
        message: "Mohon info konfirmasi kajian via WhatsApp belum ada balasan.",
        status: StatusPesan.Diproses,
      },
    ],
  });

  // 9. Seed Anggota (Linked to Divisi)
  await prisma.anggota.createMany({
    data: [
      {
        id: "ang-1",
        name: "Fikri Ardiansyah",
        role: "Ketua Umum",
        category: "BPH",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        order: 1,
      },
      {
        id: "ang-2",
        name: "Aisyah Putri",
        role: "Sekretaris Umum",
        category: "BPH",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
        order: 2,
      },
      {
        id: "ang-3",
        name: "Rizky Ramadhan",
        role: "Koordinator Humas",
        category: "Pengurus Inti",
        divisiId: divHumas.id,
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
        order: 3,
      },
    ],
  });

  // 10. Seed Keuangan (Linked to User Bendahara)
  await prisma.keuangan.createMany({
    data: [
      {
        type: TipeKeuangan.PEMASUKAN,
        category: "Infaq Jamaah",
        amount: 30000000,
        description: "Pemasukan kas awal organisasi & donasi kegiatan 2026",
        createdById: userBendahara.id,
        date: new Date("2026-01-10"),
      },
      {
        type: TipeKeuangan.PENGELUARAN,
        category: "Logistik & Banner",
        amount: 875000,
        description: "Pembelian spanduk & konsumsi rapat koordinasi awal",
        createdById: userBendahara.id,
        date: new Date("2026-01-20"),
      },
    ],
  });

  // 11. Seed Activity Log (Linked to User BPH & Humas)
  await prisma.activityLog.createMany({
    data: [
      {
        action: "created",
        entity: "Berita",
        description: "Membuat artikel berita 'Perlombaan Rimba 2026'",
        user: "Humas RIMBA",
        userId: userHumas.id,
        timeAgo: "1 jam yang lalu",
      },
      {
        action: "created",
        entity: "Agenda",
        description: "Menambahkan agenda baru 'Lomba Tahfidz Al-Qur'an'",
        user: "Admin BPH",
        userId: userBPH.id,
        timeAgo: "2 hari yang lalu",
      },
    ],
  });

  console.log("SUCCESS: Seeding database RIMBA Masjid dengan Relasi Divisi, Kategori, & User BERHASIL!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
