"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GenerateMediaRequest {
  title: string;
  description: string;
  category?: string;
  formattedDate?: string;
  time?: string | null;
  location?: string | null;
  requirements?: string | null;
  contentType?: "agenda" | "berita";
  slug?: string;
  targetType: "whatsapp" | "instagram" | "tiktok" | "story";
  tone?: "santun" | "semangat" | "formal";
}

export async function generateBroadcastAndCaption(data: GenerateMediaRequest): Promise<{
  success: boolean;
  content: string;
  type: string;
}> {
  const {
    title,
    description,
    category,
    formattedDate,
    time,
    location,
    requirements,
    contentType = "agenda",
    slug,
    targetType,
    tone = "santun",
  } = data;
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // Helper Fallback Generator jika AI API berhalangan/kuota habis
  const generateFallbackContent = (): string => {
    if (contentType === "berita") {
      const articleUrl = slug ? `\n\n📖 Baca artikel selengkapnya di website:\n/berita/${slug}` : "";

      if (targetType === "whatsapp") {
        return `*INFO BERITA & ARTIKEL RIMBA MASJID AL-BARKAH* 📰✨

*${title.toUpperCase()}*

Assalamu'alaikum Warahmatullahi Wabarakatuh,

${description}${articleUrl}

_Wassalamu'alaikum Warahmatullahi Wabarakatuh_
*~ Redaksi Media RIMBA Masjid Al-Barkah ~*`;
      }

      if (targetType === "instagram") {
        return `📰 **${title.toUpperCase()}** 📰

Assalamu'alaikum Sahabat RIMBA! 👋
${description}

Simak selengkapnya artikel dan ulasan lengkapnya di website resmi RIMBA Masjid Al-Barkah!

👉 Klik link di bio kami untuk membaca kabar selengkapnya! 📲

#BeritaMasjid #RIMBAMasjid #MasjidAlBarkahBekasi #ArtikelIslami #InfoKajian #RemajaMasjidBekasi #BekasiBerilmu`;
      }

      if (targetType === "tiktok") {
        return `🎬 **IDE KONTEN KABAR / REEL:**
1. Hook (3 Detik): Tampilkan foto header berita + judul "${title}"
2. Voiceover / Highlight ringkasan kabar.

---
📝 **CAPTION TIKTOK / REEL:**
Info & kabar terbaru dari RIMBA Masjid Al-Barkah Bekasi! 📰✨

📌 **${title}**
${description.slice(0, 150)}...

Baca selengkapnya di website via link bio profil kami! 📲

#RIMBAMasjid #MasjidAlBarkah #BeritaBekasi #InfoIslami #FYPIslami`;
      }

      // Story
      return `📰 **BERITA TERBARU RIMBA**

✨ **${title}**
${description.slice(0, 100)}${description.length > 100 ? "..." : ""}

Baca artikel selengkapnya via link di Bio / Website! 📲
#RIMBAMasjid #MasjidAlBarkahBekasi`;
    }

    // Default Agenda Fallback
    const timeStr = time ? ` ⏰ Pukul: ${time}` : "";
    const locStr = location ? ` 📍 Lokasi: ${location}` : " 📍 Lokasi: Masjid Raya Al-Barkah Bekasi";
    const dateStr = formattedDate ? ` 📅 Tanggal: ${formattedDate}` : "";

    if (targetType === "whatsapp") {
      return `*ASSALAMU'ALAIKUM WARAHMATULLAHI WABARAKATUH* 🌙✨

*HADIRILAH! ${title.toUpperCase()}*

Bismillah, Mari makmurkan masjid dan pererat ukhuwah islamiyah bersama **Remaja Islam Masjid Albarkah (RIMBA)**!

📝 *Deskripsi Kegiatan:*
${description}

${dateStr}
${timeStr}
${locStr}
${requirements ? `\n📋 *Persyaratan/Catatan:* ${requirements}` : ""}

Yuk ajak keluarga, sahabat, dan kerabat untuk bergabung dalam kebaikan ini! 

📱 *Informasi & Pendaftaran:*
Silakan mendaftar melalui website resmi RIMBA Masjid Al-Barkah atau hubungi pengurus.

_Wassalamu'alaikum Warahmatullahi Wabarakatuh_
*~ Pengurus RIMBA Masjid Al-Barkah Bekasi ~*`;
    }

    if (targetType === "instagram") {
      return `✨ **${title.toUpperCase()}** ✨

Assalamu'alaikum Sahabat RIMBA! 👋
${description}

Yuk catat waktu dan lokasinya biar nggak ketinggalan:
${dateStr}
${timeStr}
${locStr}

Ajak teman-teman kamu dan rasakan semangat ukhuwah pemuda masjid! Semangat menebar kebaikan! 🚀

👉 Informasi & Pendaftaran lengkap klik link di bio kami!

#RIMBAMasjid #MasjidAlBarkahBekasi #RemajaMasjid #KajianBekasi #PemudaHijrah #InfoKajianBekasi #BekasiBerilmu #KajianPemuda`;
    }

    if (targetType === "tiktok") {
      return `🎬 **IDE KONTEN TIKTOK / REEL:**
1. Hook 3 Detik Pertama: Tampilkan suasana masjid / teks "Mau ikutan event seru pemuda masjid di Bekasi?"
2. Isi Video: Video b-roll kegiatan + flyer ${title}

---
📝 **CAPTION TIKTOK / REEL:**
Spill acara pemuda masjid ter-seru bulan ini di Bekasi! 🤩✨

📌 **${title}**
${dateStr} ${timeStr}
${locStr}

Jangan lupa save & share ke bestie kamu ya! Link pendaftaran ada di bio profil kami 📲

#RIMBAMasjid #MasjidAlBarkah #BekasiPride #KajianBekasi #PemudaMasjid #FYPIslami`;
    }

    // Story / WA Status / Twitter
    return `📢 **INFO AGENDA RIMBA**

✨ **${title}**
${description.slice(0, 100)}${description.length > 100 ? "..." : ""}

${dateStr} ${timeStr}
${locStr}

Daftar sekarang via link di Bio / Website RIMBA! 🚀
#RIMBAMasjid #MasjidAlBarkahBekasi`;
  };

  // Jika API Key tidak ada
  if (!apiKey) {
    return {
      success: true,
      content: generateFallbackContent(),
      type: targetType,
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    let promptDetail = "";
    if (targetType === "whatsapp") {
      promptDetail = `Buatkan pesan BROADCAST WHATSAPP untuk ${contentType === "berita" ? "publikasi berita/artikel" : "pengumuman agenda"} yang rapi, resmi, Islami, dan terstruktur. Gunakan format bold (*teks*) dan miring (_teks_).`;
    } else if (targetType === "instagram") {
      promptDetail = `Buatkan CAPTION INSTAGRAM untuk ${contentType === "berita" ? "publikasi berita/artikel" : "agenda acara"} yang sangat menarik, engaging, ramah anak muda, menggunakan emoji yang tepat, hook kalimat pertama yang kuat, Call to Action 'link di bio', serta daftar hashtag populer pemuda masjid di Bekasi.`;
    } else if (targetType === "tiktok") {
      promptDetail = `Buatkan CAPTION TIKTOK/REELS untuk ${contentType === "berita" ? "kabar berita" : "acara pemuda"} yang gaul dan viral (FYP friendly), beserta ide konsep rekaman video 3 detik pertama (hook). Gunakan hashtag TikTok populer.`;
    } else {
      promptDetail = `Buatkan TEKS PENGUMUMAN SINGKAT STORY/STATUS WHATSAPP (di bawah 280 karakter) yang padat, jelas, menarik, dan efisien.`;
    }

    const systemPrompt = `Kamu adalah Pakar Copywriter Media Sosial dan Humas Resmi **Remaja Islam Masjid Albarkah (RIMBA)** Bekasi.
Gaya Bahasa: ${tone === "semangat" ? "Sangat Semangat, Energik & Pemuda" : tone === "formal" ? "Santun, Berbobot & Formal Keagamaan" : "Santun, Ramah, Islami & Hangat"}.

Tugasmu adalah membuat konten promosi media sosial berdasarkan data ${contentType === "berita" ? "Berita/Artikel" : "Agenda"} berikut:
- Judul: ${title}
- Kategori: ${category || "Berita Organisasi"}
- Ringkasan/Deskripsi: ${description}
${contentType === "agenda" ? `- Tanggal: ${formattedDate || "Akan Datang"}\n- Waktu: ${time || "Terjadwal"}\n- Lokasi: ${location || "Masjid Raya Al-Barkah Bekasi"}` : ""}
${slug ? `- Link Artikel: /berita/${slug}` : ""}

${promptDetail}

HANYA berikan hasil teks siap pakai tanpa pengantar tambahan dari kamu.`;

    const candidateModels = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();
        if (text && text.trim()) {
          return {
            success: true,
            content: text.trim(),
            type: targetType,
          };
        }
      } catch (err: unknown) {
        console.warn(`AI Generator Warning (${modelName}):`, err instanceof Error ? err.message : err);
      }
    }

    // Jika Gemini gagal
    return {
      success: true,
      content: generateFallbackContent(),
      type: targetType,
    };
  } catch (error: unknown) {
    console.error("AI Generator Error:", error instanceof Error ? error.message : error);
    return {
      success: true,
      content: generateFallbackContent(),
      type: targetType,
    };
  }
}

export async function summarizeArticleAction(
  title: string,
  content: string
): Promise<{
  success: boolean;
  summaryPoints: string[];
}> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // Fallback summary generator jika AI API berhalangan (Smart NLP Sentence Synthesizer)
  const getFallbackSummary = (): string[] => {
    // Bersihkan dateline lokasi di awal (misal: "Jeruk Purut – ", "Bekasi – ")
    const cleanContent = content.replace(/^[A-Za-z\s]+[–-]\s*/, "");
    
    // Pisahkan isi artikel menjadi kalimat-kalimat utuh
    const sentences = cleanContent
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    if (sentences.length === 0) {
      return [
        `📌 **Garis Besar**: Pembahasan artikel "${title}" mengenai kegiatan dan peran aktif pemuda RIMBA Masjid Al-Barkah.`,
      ];
    }

    const points: string[] = [];

    // 1. Cari kalimat tentang Peran / Kegiatan Utama (RIMBA / kurban / membantu / panitia / kegiatan)
    const kegiatanSentence =
      sentences.find(
        (s) =>
          (s.toLowerCase().includes("rimba") || s.toLowerCase().includes("pemuda")) &&
          (s.toLowerCase().includes("membantu") ||
            s.toLowerCase().includes("peran") ||
            s.toLowerCase().includes("kegiatan") ||
            s.toLowerCase().includes("kurban") ||
            s.toLowerCase().includes("panitia"))
      ) || sentences[0];

    points.push(`📌 **Kegiatan & Peran Utama**: ${kegiatanSentence}`);

    // 2. Cari kalimat tentang Nilai / Pembelajaran / Karakter
    const nilaiSentence = sentences.find(
      (s) =>
        s.toLowerCase().includes("nilai") ||
        s.toLowerCase().includes("karakter") ||
        s.toLowerCase().includes("gotong royong") ||
        s.toLowerCase().includes("keikhlasan") ||
        s.toLowerCase().includes("tanggung jawab") ||
        s.toLowerCase().includes("pembelajaran") ||
        s.toLowerCase().includes("belajar")
    );

    if (nilaiSentence && nilaiSentence !== kegiatanSentence) {
      points.push(`💡 **Nilai & Karakter**: ${nilaiSentence}`);
    } else if (sentences.length > 1) {
      const secondSent = sentences.find((s) => s !== kegiatanSentence) || sentences[1];
      points.push(`💡 **Poin Penting**: ${secondSent}`);
    }

    // 3. Cari kalimat tentang Dukungan / Harapan / Ukhuwah
    const harapanSentence = sentences.find(
      (s) =>
        (s.toLowerCase().includes("harapan") ||
          s.toLowerCase().includes("dukungan") ||
          s.toLowerCase().includes("ukhuwah") ||
          s.toLowerCase().includes("kebersamaan") ||
          s.toLowerCase().includes("masyarakat") ||
          s.toLowerCase().includes("inspirasi")) &&
        s !== kegiatanSentence &&
        s !== nilaiSentence
    );

    if (harapanSentence) {
      points.push(`🤝 **Dukungan & Harapan**: ${harapanSentence}`);
    } else if (sentences.length > 2) {
      const lastSent = sentences[sentences.length - 1];
      if (lastSent !== kegiatanSentence && lastSent !== nilaiSentence) {
        points.push(`✨ **Kesimpulan**: ${lastSent}`);
      }
    }

    return points;
  };

  if (!apiKey) {
    return { success: true, summaryPoints: getFallbackSummary() };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = `Kamu adalah Pakar Jurnalis & Rangkuman Berita RIMBA Masjid Al-Barkah Bekasi.
Tugasmu adalah membaca naskah artikel berikut dan BUATKAN RINGKASAN INTISARI dalam 3 poin sintetis (BUKAN sekadar menyalin ulang kalimat pembuka di awal artikel).

STRUKTUR 3 POIN INTISARI:
1. 📌 **Kegiatan & Peran Utama**: Ringkas inti peristiwa/kegiatan yang berlangsung serta bagaimana keterlibatan aktif pemuda/RIMBA.
2. 💡 **Nilai & Pembelajaran**: Ringkas nilai positif, pembentukan karakter, atau pelajaran yang diperoleh (seperti gotong royong, keikhlasan, tanggung jawab).
3. 🤝 **Dukungan & Harapan**: Ringkas dukungan masyarakat/aparat, dampak sosial, atau harapan ukhuwah ke depan.

ATURAN SANGAT PENTING:
- SINTESISKAN isi artikel menggunakan kalimat yang padat, jelas, dan informatif (HINDARI mencantumkan nama tempat/lokasi dateline di awal seperti 'Jeruk Purut -').
- Setiap poin HARUS 1-2 kalimat lengkap utuh yang diakhiri tanda titik (.). HINDARI memberi tanda titik tiga '...'.
- Gunakan format cetak tebal (**teks**).

Judul Artikel: ${title}
Isi Artikel: ${content.slice(0, 3500)}

HANYA berikan 3 poin ringkasan tanpa kata pengantar tambahan.`;

    const candidateModels = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();
        if (responseText && responseText.trim()) {
          const points = responseText
            .split("\n")
            .map((line) => line.replace(/^[-*•\d.]+\s*/, "").trim())
            .filter((line) => line.length > 0);
          if (points.length > 0) {
            return { success: true, summaryPoints: points.slice(0, 3) };
          }
        }
      } catch (err: unknown) {
        console.warn(`Summarizer Warning (${modelName}):`, err instanceof Error ? err.message : err);
      }
    }

    return { success: true, summaryPoints: getFallbackSummary() };
  } catch (error: unknown) {
    console.error("Summarizer Error:", error instanceof Error ? error.message : error);
    return { success: true, summaryPoints: getFallbackSummary() };
  }
}
