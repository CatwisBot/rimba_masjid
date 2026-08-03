"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGaleri() {
  try {
    const photos = await prisma.galeri.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: photos };
  } catch (error) {
    console.error("Error fetching galeri:", error);
    return { success: false, error: "Gagal mengambil data galeri" };
  }
}

export async function createGaleri(formData: {
  title?: string;
  category?: string;
  image: string;
  caption?: string;
}) {
  try {
    const newPhoto = await prisma.galeri.create({
      data: {
        title: formData.title || "Dokumentasi RIMBA",
        category: formData.category || "Kegiatan",
        image: formData.image || "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
        caption: formData.caption || formData.title || "Dokumentasi foto kegiatan",
      },
    });

    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
    revalidatePath("/");
    return { success: true, data: newPhoto };
  } catch (error) {
    console.error("Error creating galeri:", error);
    return { success: false, error: "Gagal menyimpannya ke galeri" };
  }
}

export async function deleteGaleri(id: string) {
  try {
    await prisma.galeri.delete({ where: { id } });
    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting galeri:", error);
    return { success: false, error: "Gagal menghapus foto" };
  }
}
