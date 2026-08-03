"use server";

import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ============================================================================
// PEDOMAN & INFORMASI KUSTOM DARI ADMIN (SILAKAN EDIT & TAMBAHKAN DI SINI)
// ============================================================================
// Anda dapat mengisi atau mengubah informasi sepuasnya di bawah ini, seperti sejarah,
// visi misi, aturan, atau jawaban untuk pertanyaan-pertanyaan tertentu dari jamaah.
// AI "Tanya RIMBA" akan memprioritaskan catatan di sini saat menjawab pertanyaan.

const CUSTOM_ADMIN_KNOWLEDGE_BASE = `
1. PROFIL & SEJARAH SINGKAT:
   - Remaja Islam Masjid Albarkah (RIMBA) adalah wadah organisasi pemuda dan pemudi yang berpusat di Masjid Raya Al-Barkah Bekasi, Kota Bekasi, Jawa Barat.
   - Bertujuan memakmurkan masjid, mempererat ukhuwah islamiyah, serta membangun generasi pemuda muslim yang berakhlak mulia, cerdas, dan aktif dalam dakwah maupun pelayanan kemasyarakatan.

2. VISI & MISI ORGANISASI:
   - Visi: Menjadikan Masjid Raya Al-Barkah sebagai pusat pengembangan keilmuan, karakter, dan peradaban pemuda Islam terkemuka di Bekasi dan sekitarnya.
   - Misi: Menyelenggarakan kajian rutin (tahfidz, aqidah, fikih pemuda), mengadakan pelatihan keterampilan & kepemimpinan pemuda, serta melaksanakan program bakti sosial dan kemakmuran masjid.

3. INFORMASI KONTAK & ALAMAT KUSTOM:
   - Lokasi Sekretariat: Komplek Masjid Raya Al-Barkah, Jl. Veteran No.46, Marga Jaya, Kec. Bekasi Selatan, Kota Bekasi, Jawa Barat 17141.
   - Waktu Pelayanan Sekretariat: Terbuka untuk umum setiap hari usai salat Ashar hingga Isya.
   - Layanan Pertanyaan / Kerjasama / Undangan Penceramah: Silakan gunakan menu "Kontak" di website atau tinggalkan pesan melalui form obrolan/pesan masuk.

4. PEDOMAN KHUSUS BAGI ASISTEN VIRTUAL:
   - Selalu sapa jamaah atau pengunjung dengan santun, ceria, dan menginspirasi.
   - Berikan panduan yang mudah dipahami bagi pemuda yang berminat mendaftar atau mengikuti agenda kajian RIMBA.
   - Jika ada hal spesifik yang belum tertuang di dalam pedoman maupun jadwal agenda, arahkan pengaju pertanyaan dengan ramah untuk menghubungi panitia lewat menu "Kontak".
`;

// ============================================================================
// BATAS PEDOMAN KUSTOM (Bagian di bawah ini adalah logika sistem AI)
// ============================================================================

export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

// Fungsi pengambil data secara aman dari database tanpa memicu error
async function getSafeData() {
  let agendas: any[] = [];
  let beritas: any[] = [];
  let anggota: any[] = [];
  let divisi: any[] = [];

  try {
    if ((prisma as any).agenda?.findMany) {
      agendas = await (prisma as any).agenda.findMany({
        where: { status: "Aktif" },
        take: 5,
        orderBy: { date: "asc" },
      });
    }
  } catch (e) {
    console.error("Gagal membaca agenda untuk bot:", e);
  }

  try {
    if ((prisma as any).berita?.findMany) {
      beritas = await (prisma as any).berita.findMany({
        where: { status: "Published" },
        take: 4,
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (e) {
    console.error("Gagal membaca berita untuk bot:", e);
  }

  try {
    if ((prisma as any).anggota?.findMany) {
      anggota = await (prisma as any).anggota.findMany({
        take: 15,
        orderBy: { order: "asc" },
      });
    }
  } catch (e) {
    console.error("Gagal membaca anggota untuk bot:", e);
  }

  try {
    if ((prisma as any).divisi?.findMany) {
      divisi = await (prisma as any).divisi.findMany({
        take: 10,
      });
    }
  } catch (e) {
    console.error("Gagal membaca divisi untuk bot:", e);
  }

  return { agendas, beritas, anggota, divisi };
}

export async function askRimbaAI(userMessage: string, history: ChatMessage[] = []): Promise<{ success: boolean; reply: string }> {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const { agendas, beritas, anggota, divisi } = await getSafeData();

    // Format knowledge base dari database (ringkas)
    const agendaText = agendas.length > 0
      ? agendas.map((a) => `- **${a.title}** (${a.formattedDate || a.date}, ${a.time || "-"}) @ ${a.location || "-"}`).join("\n")
      : "Saat ini belum ada agenda kegiatan aktif terdekat.";

    const beritaText = beritas.length > 0
      ? beritas.map((b) => `- **${b.title}**`).join("\n")
      : "Belum ada berita terbaru.";

    const pengurusText = anggota.length > 0
      ? anggota.slice(0, 4).map((ang) => `- **${ang.name}**: ${ang.role || ang.category}`).join("\n")
      : "Terdiri dari Badan Pengurus Harian & Divisi Pemuda.";

    const divisiText = divisi.length > 0
      ? divisi.map((d) => d.name).join(", ")
      : "Dakwah, Humas, Pubdekdoc, Sosial, Acara, Sponsor";

    const systemPrompt = `Kamu adalah **Tanya RIMBA**, Asisten Virtual resmi dari **Remaja Islam Masjid Albarkah (RIMBA)** Bekasi.

### PENTING - ATURAN PANJANG BALASAN:
- Jawablah secara **SANGAT RINGKAS, PADAT, DAN LANGSUNG PADA INTI** (maksimal 2-3 kalimat atau 3 poin pendek).
- Widget obrolan berlayar kecil, jadi HINDARI jawaban yang panjang/berbelit-belit.
- Jika pengguna membutuhkan rincian lengkap, sarankan secara ramah untuk membuka menu **Agenda**, **Struktur**, atau **Kontak**.

### INGATAN PERCAKAPAN:
Selalu ingat riwayat percakapan sebelumnya untuk pertanyaan lanjutan (seperti "kapan?", "siapa ketuanya?", "di mana?").

### PEDOMAN KUSTOM ADMIN:
${CUSTOM_ADMIN_KNOWLEDGE_BASE}

### DATA LIVE DATABASE:
- **Agenda**: ${agendaText}
- **Berita**: ${beritaText}
- **Pengurus Inti**: ${pengurusText}
- **Divisi**: ${divisiText}`;

    // Fungsi penanganan jawaban lokal cerdas (ringkas & padat)
    const getLocalResponse = (msg: string, historyMsgs: ChatMessage[]) => {
      const lower = msg.toLowerCase();
      
      // 1. Ekstraksi nama pengguna dari seluruh riwayat pesan user
      const allUserMessages = [
        ...historyMsgs.filter((h) => h.role === "user").map((h) => h.content),
        msg,
      ];

      let foundName = "";
      for (const text of allUserMessages) {
        const patterns = [
          /(?:nama\s+saya|namaku|nama\s+aku|panggil\s+saya|panggil\s+aku)\s+is\s+([A-Za-z]+)/i,
          /(?:nama\s+saya|namaku|nama\s+aku|panggil\s+saya|panggil\s+aku)\s+([A-Za-z]+)/i,
          /(?:halo|hi|hai|salam)\s+(?:aku|saya)\s+([A-Za-z]+)/i,
          /(?:aku|saya)\s+([A-Za-z]+),\s*(?:mau|ingin|butuh)/i,
        ];

        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match && match[1]) {
            const candidate = match[1].trim();
            const ignoredWords = ["siapa", "mau", "ingin", "bisa", "yang", "dan", "di", "ke", "dari", "ini", "itu", "tanya", "admin"];
            if (!ignoredWords.includes(candidate.toLowerCase()) && candidate.length > 1) {
              foundName = candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
              break;
            }
          }
        }
        if (foundName) break;
      }

      const sapaanNama = foundName ? `, Kak **${foundName}**` : "";

      // 2. Pertanyaan khusus tentang identitas/nama pengguna
      if (
        lower.includes("nama aku") || lower.includes("namaku") || lower.includes("nama saya") ||
        lower.includes("siapa aku") || lower.includes("siapa saya") || lower.includes("kamu tau namaku") || lower.includes("ingat nama")
      ) {
        if (foundName) {
          return `Nama Anda adalah **${foundName}**! 😊 Ada yang bisa dibantu lagi${sapaanNama}?`;
        } else {
          return `Mohon maaf, Anda belum menyebutkan nama. Siapa nama Anda? 😊`;
        }
      }

      // 3. Konteks percakapan riwayat sebelumnya
      const context = historyMsgs.map((h) => h.content.toLowerCase()).join(" ");

      // Pertanyaan lanjutan tentang Ketua / Pimpinan
      if (lower.includes("siapa ketuanya") || lower.includes("ketua umum") || (context.includes("pengurus") && lower.includes("ketua"))) {
        return `Ketua Umum **RIMBA Masjid Al-Barkah** saat ini adalah **Fikri Ardiansyah** (BPH).\n\n📌 Rincian divisi & pengurus ada di menu **Struktur**!`;
      }

      // Pertanyaan tentang Lokasi / Alamat
      if (lower.includes("lokasi") || lower.includes("alamat") || lower.includes("di mana") || lower.includes("dimana") || (context.includes("rimba") && lower.includes("dimana"))) {
        return `📍 **Alamat Sekretariat RIMBA:**\nKomplek Masjid Raya Al-Barkah, Jl. Veteran No. 46, Marga Jaya, Bekasi Selatan.\n(Buka setiap hari usai Ashar - Isya).`;
      }

      // Pertanyaan tentang Agenda / Kegiatan
      if (
        lower.includes("agenda") || lower.includes("kegiatan") || lower.includes("kajian") || lower.includes("jadwal") || lower.includes("kapan") || lower.includes("acara") ||
        (context.includes("agenda") && (lower.includes("kapan") || lower.includes("jam")))
      ) {
        return `Berikut **Agenda RIMBA** terdekat${sapaanNama}:\n\n${agendaText}\n\n📌 Pendaftaran lengkap ada di menu **Agenda**!`;
      }

      // Pertanyaan tentang Pengurus & Divisi / Struktur
      if (
        lower.includes("pengurus") || lower.includes("ketua") || lower.includes("anggota") || lower.includes("bph") || lower.includes("divisi") || lower.includes("struktur")
      ) {
        return `Kepengurusan **RIMBA Masjid Al-Barkah** dipimpin oleh BPH (Ketua: **Fikri Ardiansyah**) & divisi (${divisiText}).\n\n📌 Daftar lengkap pengurus dapat dilihat di menu **Struktur**!`;
      }

      // Pertanyaan tentang Cara Pendaftaran
      if (
        lower.includes("daftar") || lower.includes("join") || lower.includes("gabung") || lower.includes("pendaftaran") ||
        (context.includes("agenda") && (lower.includes("cara") || lower.includes("ikut")))
      ) {
        return `Untuk mendaftar kegiatan atau bergabung${sapaanNama}:\n1. Kunjungi menu **Agenda** untuk event terdekat.\n2. Atau hubungi pengurus via menu **Kontak**.`;
      }

      // Pertanyaan Profil / Sejarah
      if (
        lower.includes("apa") || lower.includes("rimba") || lower.includes("sejarah") || lower.includes("profil") || lower.includes("visi") || lower.includes("tentang")
      ) {
        return `**RIMBA** (Remaja Islam Masjid Albarkah) adalah wadah organisasi pemuda Masjid Raya Al-Barkah Bekasi yang berfokus pada keilmuan, dakwah, dan kegiatan sosial pemuda.`;
      }

      // Berita
      if (lower.includes("berita") || lower.includes("kabari") || lower.includes("artikel") || lower.includes("informasi")) {
        return `Berikut **Berita Terbaru** RIMBA${sapaanNama}:\n\n${beritaText}`;
      }

      return `Assalamu'alaikum${sapaanNama}! Saya **Tanya RIMBA**.\n\nAda yang bisa dibantu tentang **Agenda**, **Struktur Pengurus**, atau **Pendaftaran** kegiatan?`;
    };

    // Jika API Key belum dikonfigurasi
    if (!apiKey) {
      return {
        success: true,
        reply: getLocalResponse(userMessage, history),
      };
    }

    // Panggil Gemini AI dengan model resmi terbaru (gemini-2.0-flash / gemini-2.0-flash-lite)
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const validHistory = history.map((msg) => ({
      role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const candidateModels = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName, 
          systemInstruction: systemPrompt 
        });
        const chat = model.startChat({ history: validHistory });
        const result = await chat.sendMessage(userMessage);
        
        return {
          success: true,
          reply: result.response.text(),
        };
      } catch (apiError: any) {
        console.warn(`Gemini API Warning (${modelName}):`, apiError?.message || apiError);

        // Percobaan fallback prompt gabungan untuk model ini
        try {
          const backupModel = genAI.getGenerativeModel({ model: modelName });
          const backupPrompt = `${systemPrompt}\n\nRiwayat Percakapan Sebelumnya:\n${JSON.stringify(validHistory)}\n\nPesan Pengguna saat ini: ${userMessage}\n\nJawaban Anda (berformat Markdown ramah dan sopan):`;
          const resultBackup = await backupModel.generateContent(backupPrompt);
          return {
            success: true,
            reply: resultBackup.response.text(),
          };
        } catch (backupErr) {
          // Lanjut coba model berikutnya di candidateModels loop
        }
      }
    }

    // Jika semua model Gemini API mengalami kendala (kuota/limit/offline), gunakan jawaban lokal cerdas
    return {
      success: true,
      reply: getLocalResponse(userMessage, history),
    };
  } catch (error: any) {
    console.error("Error utama askRimbaAI:", error?.message || error);
    return {
      success: true,
      reply: `Assalamu'alaikum! Terima kasih telah menghubungi Tanya RIMBA.\n\nSaat ini sistem perpesanan AI sedang menangani pemeliharaan jaringan. Anda dapat tetap melihat informasi agenda dan pengurus di menu utama website atau menghubungi kami di halaman **Kontak**.`,
    };
  }
}
