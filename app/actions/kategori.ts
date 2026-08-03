"use server";

import prisma from "@/lib/prisma";

export async function getKategori() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categories = await (prisma as any).kategori.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching kategori:", error);
    return { success: false, error: "Gagal mengambil data master kategori" };
  }
}

export async function createKategori(formData: {
  name: string;
  type?: string;
  description?: string;
}) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newCategory = await (prisma as any).kategori.create({
      data: {
        name: formData.name.trim(),
        type: formData.type || "UMUM",
        description: formData.description,
      },
    });

    return { success: true, data: newCategory };
  } catch (error) {
    console.error("Error creating kategori:", error);
    return { success: false, error: "Gagal membuat kategori baru" };
  }
}
