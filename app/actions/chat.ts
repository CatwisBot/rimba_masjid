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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let agendas: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let beritas: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let anggota: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let divisi: any[] = [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((prisma as any).agenda?.findMany) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((prisma as any).berita?.findMany) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((prisma as any).anggota?.findMany) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      anggota = await (prisma as any).anggota.findMany({
        take: 15,
        orderBy: { order: "asc" },
      });
    }
  } catch (e) {
    console.error("Gagal membaca anggota untuk bot:", e);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((prisma as any).divisi?.findMany) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      ? agendas.map((a) => `- 📅 **${a.title}** (${a.formattedDate || a.date}, ${a.time || "jam menyesuaikan"}) @ ${a.location || "Masjid Al-Barkah"}`).join("\n")
      : "Saat ini belum ada agenda atau lomba baru yang terbit di database kami, tapi terus pantau website ini ya!";

    const beritaText = beritas.length > 0
      ? beritas.map((b) => `- 📰 **${b.title}**`).join("\n")
      : "Belum ada berita atau liputan terbaru.";

    const pengurusText = anggota.length > 0
      ? anggota.slice(0, 4).map((ang) => `- **${ang.name}**: ${ang.role || ang.category}`).join("\n")
      : "Terdiri dari Badan Pengurus Harian & Divisi Pemuda.";

    const divisiText = divisi.length > 0
      ? divisi.map((d) => d.name).join(", ")
      : "Dakwah, Humas, Pubdekdoc, Sosial, Acara, Sponsor";

    const systemPrompt = `Kamu adalah **Tanya RIMBA**, Asisten Virtual dari **Remaja Islam Masjid Albarkah (RIMBA)** Bekasi. Kamu berperan sebagai pemuda masjid yang asik, ramah, bersahabat, gaul tapi tetap santun, sopan, dan hangat. 😊✨

### PENTING - GAYA BAHASA & PANJANG BALASAN:
- Gunakan bahasa Indonesia yang **asik, komunikatif, natural, dan santai namun sopan** (gunakan sapaan hangat seperti "Kak", "Yuk", "Tentu dong!", serta emoji yang menarik seperti 😊, ✨, 🚀, 🕌).
- **Panjang balasan cukup informatif dan memuaskan** (sekitar 3-5 kalimat atau 3-4 poin). Jangan terlalu pendek dan kaku, jelaskan sedikit konteks atau keseruan kegiatan agar obrolan terasa hidup dan menyenangkan!
- Jika penanya menanyakan tentang "lomba", "kajian", "info", atau "kegiatan", antusiaslah menjelaskan daftar yang ada di data live atau berikan info cara daftar/gabung dengan semangat.
- Untuk info lebih detail, sarankan dengan ramah dan semangat untuk langsung berselancar ke menu **Agenda**, **Struktur**, atau **Kontak** di website kami.

### INGATAN PERCAKAPAN:
Selalu ingat riwayat percakapan sebelumnya untuk menjawab pertanyaan lanjutan (seperti "kapan acaranya?", "siapa ketuanya?", "di mana lokasinya?").

### PEDOMAN KUSTOM ADMIN:
${CUSTOM_ADMIN_KNOWLEDGE_BASE}

### DATA LIVE DATABASE TERKINI:
- **Agenda / Event / Lomba**: 
${agendaText}
- **Berita Terbaru**: 
${beritaText}
- **Pengurus Inti (BPH)**: 
${pengurusText}
- **Divisi**: ${divisiText}`;

    // Fungsi penanganan jawaban lokal cerdas (asik & natural)
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

      const sapaanNama = foundName ? ` Kak **${foundName}**` : "";

      // 2. Pertanyaan khusus tentang identitas/nama pengguna
      if (
        lower.includes("nama aku") || lower.includes("namaku") || lower.includes("nama saya") ||
        lower.includes("siapa aku") || lower.includes("siapa saya") || lower.includes("kamu tau namaku") || lower.includes("ingat nama")
      ) {
        if (foundName) {
          return `Tanya RIMBA ingat dong! Nama kamu Kak **${foundName}** kan? 😊✨ Ada obrolan atau info seru seputar kegiatan masjid yang mau dibahas hari ini? Aku siap bantu! 🤝`;
        } else {
          return `Hmm, sejauh ini kita belum sempat berkenalan resmi nih. Siapa nama kamu, Kak? Kasih tau dong biar ngobrol kita makin akrab dan seru! 😊👋`;
        }
      }

      // 3. Konteks percakapan riwayat sebelumnya
      const context = historyMsgs.map((h) => h.content.toLowerCase()).join(" ");

      // Pertanyaan lanjutan tentang Ketua / Pimpinan
      if (lower.includes("siapa ketuanya") || lower.includes("ketua umum") || (context.includes("pengurus") && lower.includes("ketua"))) {
        return `Ketua Umum **RIMBA Masjid Al-Barkah** periode saat ini adalah **Fikri Ardiansyah** dari tim Badan Pengurus Harian (BPH)! 🌟\n\nBeliau ditemani oleh tim BPH dan ketua-ketua divisi muda yang kreatif. Kalau kamu penasaran pengen lihat foto dan profil jajaran kepengurusan lengkapnya, langsung aja mampir ke menu **Struktur** ya! 😉🤝`;
      }

      // Pertanyaan tentang Lokasi / Alamat
      if (lower.includes("lokasi") || lower.includes("alamat") || lower.includes("di mana") || lower.includes("dimana") || (context.includes("rimba") && lower.includes("dimana"))) {
        return `Hai${sapaanNama}! 📍 Sekretariat atau basecamp kami lokasinya strategis banget, yaitu di **Komplek Masjid Raya Al-Barkah**, Jl. Veteran No. 46, Marga Jaya, Bekasi Selatan. 🕌✨\n\nKami biasanya rutin kumpul dan nongkrong produktif di kesekretariatan hampir setiap hari setelah sholat Ashar atau Isya. Kalau lagi mampir atau abis sholat di masjid, jangan ragu mampir sapa kawan-kawan RIMBA ya! 😊`;
      }

      // Pertanyaan tentang Agenda / Lomba / Kegiatan / Info Event
      if (
        lower.includes("agenda") || lower.includes("kegiatan") || lower.includes("kajian") || lower.includes("jadwal") || 
        lower.includes("kapan") || lower.includes("acara") || lower.includes("lomba") || lower.includes("event") ||
        lower.includes("info") || lower.includes("infokan") || lower.includes("seminar") || lower.includes("turnamen") ||
        lower.includes("kompetisi") || lower.includes("workshop") || (context.includes("agenda") && (lower.includes("kapan") || lower.includes("jam")))
      ) {
        return `Hai${sapaanNama}! 👋 Tentu dong, di RIMBA pastinya banyak banget kegiatan, kajian seru, sampai berbagai lomba dan event yang inspiratif! ✨\n\nBerikut daftar agenda dan kegiatan terbaru kami:\n${agendaText}\n\nKalau kamu tertarik buat daftar atau pengen baca detail persyaratannya, langsung aja buka menu **Agenda** di website ini ya, Kak. Yuk buruan join biar gak ketinggalan keseruannya! 😊🚀`;
      }

      // Pertanyaan tentang Pengurus & Divisi / Struktur
      if (
        lower.includes("pengurus") || lower.includes("ketua") || lower.includes("anggota") || lower.includes("bph") || lower.includes("divisi") || lower.includes("struktur")
      ) {
        return `Halo${sapaanNama}! Kepengurusan **RIMBA Masjid Al-Barkah** saat ini dipimpin oleh BPH (Ketua: **Fikri Ardiansyah**) dan berkolaborasi seru lewat divisi-divisi keren, yaitu: **${divisiText}**. 🤝🔥\n\nSetiap divisi punya program kerja unggulan dan tim pemuda yang solutif. Kalau kamu penasaran melihat struktur lengkap dan wajah-wajah pengurus kami, langsung jelajahi halaman **Struktur** ya! 😉✨`;
      }

      // Pertanyaan tentang Cara Pendaftaran
      if (
        lower.includes("daftar") || lower.includes("join") || lower.includes("gabung") || lower.includes("pendaftaran") || lower.includes("ikut") ||
        (context.includes("agenda") && (lower.includes("cara") || lower.includes("ikut")))
      ) {
        return `Wah, seru banget denger kamu tertarik buat bergabung! 🥳✨ Untuk ikutan kegiatan atau jadi keluarga besar RIMBA sangat mudah kok:\n\n1. 📅 Kalau mau ikut kajian, lomba, atau event terdekat, kamu bisa langsung klik daftar di menu **Agenda**.\n2. 🤝 Kalau tertarik bergabung jadi aktivis remaja masjid atau kolaborasi kegiatan, kirim pesanmu di menu **Kontak** ya biar tim pengurus langsung menghubungi balik!\n\nYuk, kita tumbuhing manfaat bareng-bareng di lingkungan masjid! 🚀😊`;
      }

      // Pertanyaan Profil / Sejarah
      if (
        lower.includes("apa") || lower.includes("rimba") || lower.includes("sejarah") || lower.includes("profil") || lower.includes("visi") || lower.includes("tentang") || lower.includes("siapa")
      ) {
        return `Kenalin${sapaanNama}! 🌟 **RIMBA** (Remaja Islam Masjid Albarkah) adalah rumah dan wadah kolaborasi pemuda kreatif di lingkungan Masjid Raya Al-Barkah Kota Bekasi. 🕌\n\nDi sini kita gak cuma ngaji dan belajar ilmu agama bareng, tapi juga berkolaborasi bikin event sosial kemanusiaan, kajian masa kini yang relevan buat pemuda, pengembangan skill kepemimpinan, dan pastinya nambah circle pertemanan yang positif! 😊✨`;
      }

      // Berita
      if (lower.includes("berita") || lower.includes("kabari") || lower.includes("artikel") || lower.includes("informasi") || lower.includes("update") || lower.includes("kabar")) {
        return `Tentu dong${sapaanNama}! 📰 Nih ada update liputan kegiatan dan cerita menarik terbaru di RIMBA:\n\n${beritaText}\n\nBuat baca artikel lengkap dan keseruan dokumentasi foto dari acara-acara tersebut, kamu bisa mampir ke menu **Berita** ya! 😉✨`;
      }

      return `Assalamu'alaikum${sapaanNama}! 👋 Kenalin, aku **Tanya RIMBA**, teman virtual kamu yang siap berbagi info seru di sini! 😊✨\n\nKamu mau ngobrolin atau tanyakan info tentang apa hari ini? Aku siap bantu jawab seputar:\n📅 **Info Agenda, Lomba & Kajian**\n🤝 **Cara Daftar & Gabung Kegiatan**\n👥 **Struktur Pengurus & Divisi**\n📰 **Berita & Update Terbaru**\n\nYuk, langsung ketik aja pertanyaan yang mau kamu tanyakan! 😉🚀`;
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

    // Prioritaskan model Lite dengan kuota gratis melimpah (15 RPM / 500 RPD di dashboard), lalu fallback ke Flash
    const candidateModels = [
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-3.6-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash",
    ];

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
      } catch (apiError: unknown) {
        const errStr = apiError instanceof Error ? apiError.message : String(apiError);
        console.warn(`Gemini API Warning (${modelName}):`, errStr);

        // Jika error karena Kuota / Rate Limit (429 / limit: 0), langsung lewati ke model berikutnya tanpa membebani ulang model yang sama
        if (errStr.includes("429") || errStr.toLowerCase().includes("quota") || errStr.toLowerCase().includes("rate limit") || errStr.toLowerCase().includes("limit: 0")) {
          continue;
        }

        // Percobaan fallback prompt gabungan untuk error selain limit kuota
        try {
          const backupModel = genAI.getGenerativeModel({ model: modelName });
          const backupPrompt = `${systemPrompt}\n\nRiwayat Percakapan Sebelumnya:\n${JSON.stringify(validHistory)}\n\nPesan Pengguna saat ini: ${userMessage}\n\nJawaban Anda (berformat Markdown ramah dan sopan):`;
          const resultBackup = await backupModel.generateContent(backupPrompt);
          return {
            success: true,
            reply: resultBackup.response.text(),
          };
        } catch {
          // Lanjut coba model berikutnya di candidateModels loop
        }
      }
    }

    // Jika semua model Gemini API mengalami kendala (kuota/limit/offline), gunakan jawaban lokal cerdas
    return {
      success: true,
      reply: getLocalResponse(userMessage, history),
    };
  } catch (error: unknown) {
    console.error("Error utama askRimbaAI:", error instanceof Error ? error.message : error);
    return {
      success: true,
      reply: `Assalamu'alaikum! Terima kasih sudah menyapa Tanya RIMBA. 😊🙏\n\nMohon maaf banget saat ini server perpesanan AI kami sedang melakukan perawatan ringan. Kamu tetap bisa eksplor informasi lengkap seputar agenda, lomba, dan pengurus melalui menu utama di website ini, atau chat langsung ke pengurus kami via halaman **Kontak** ya! ✨`,
    };
  }
}
