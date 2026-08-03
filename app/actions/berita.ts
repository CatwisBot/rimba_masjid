"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

let beritaListCache: CacheItem<unknown> | null = null;
const slugCacheMap = new Map<string, CacheItem<unknown>>();
const CACHE_TTL_MS = 60 * 1000; // 60 detik (1 menit)

export async function invalidateBeritaCache() {
  beritaListCache = null;
  slugCacheMap.clear();
}

export async function getBerita() {
  const now = Date.now();
  if (beritaListCache && now - beritaListCache.timestamp < CACHE_TTL_MS) {
    return { success: true, data: beritaListCache.data };
  }

  try {
    const news = await prisma.berita.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        excerpt: true,
        image: true,
        status: true,
        author: true,
        readTime: true,
        createdAt: true,
      },
    });
    beritaListCache = { data: news, timestamp: now };
    return { success: true, data: news };
  } catch (error) {
    console.error("Error fetching berita:", error);
    return { success: false, error: "Gagal mengambil data berita" };
  }
}

export async function getBeritaBySlug(slug: string) {
  const now = Date.now();
  const cached = slugCacheMap.get(slug);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return { success: true, data: cached.data };
  }

  try {
    const item = await prisma.berita.findUnique({
      where: { slug },
    });
    if (!item) {
      return { success: false, error: "Berita tidak ditemukan" };
    }
    slugCacheMap.set(slug, { data: item, timestamp: now });
    return { success: true, data: item };
  } catch (error) {
    console.error("Error fetching berita by slug:", error);
    return { success: false, error: "Gagal mengambil data berita" };
  }
}

export async function getBeritaById(id: string) {
  try {
    const item = await prisma.berita.findUnique({
      where: { id },
    });
    if (!item) {
      return { success: false, error: "Berita tidak ditemukan" };
    }
    return { success: true, data: item };
  } catch (error) {
    console.error("Error fetching berita by id:", error);
    return { success: false, error: "Gagal mengambil data berita" };
  }
}

export async function createBerita(formData: {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author?: string;
}) {
  try {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newBerita = await prisma.berita.create({
      data: {
        title: formData.title,
        slug: slug || `berita-${Date.now()}`,
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop",
        author: formData.author || "Admin RIMBA",
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: "created",
        entity: "Berita",
        description: `Membuat berita '${formData.title}'`,
        user: formData.author || "Admin RIMBA",
      },
    });

    await invalidateBeritaCache();
    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath("/");
    return { success: true, data: newBerita };
  } catch (error) {
    console.error("Error creating berita:", error);
    return { success: false, error: "Gagal membuat berita" };
  }
}

export async function updateBerita(
  id: string,
  formData: {
    title: string;
    category: string;
    excerpt: string;
    content: string;
    image: string;
  }
) {
  try {
    const updated = await prisma.berita.update({
      where: { id },
      data: {
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image,
      },
    });

    await invalidateBeritaCache();
    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating berita:", error);
    return { success: false, error: "Gagal memperbarui berita" };
  }
}

export async function deleteBerita(id: string) {
  try {
    await prisma.berita.delete({ where: { id } });
    await invalidateBeritaCache();
    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath("/");
    return { success: true, data: { id } };
  } catch (error) {
    console.error("Error deleting berita:", error);
    return { success: false, error: "Gagal menghapus berita" };
  }
}
