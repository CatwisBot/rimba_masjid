"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDivisi() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const divisions = await (prisma as any).divisi.findMany({
      orderBy: { name: "asc" },
      include: {
        members: true,
        agendas: true,
      },
    });
    return { success: true, data: divisions };
  } catch (error) {
    console.error("Error fetching divisi:", error);
    return { success: false, error: "Gagal mengambil data divisi" };
  }
}

export async function createDivisi(formData: {
  code: string;
  name: string;
  description?: string;
  icon?: string;
}) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newDivisi = await (prisma as any).divisi.create({
      data: {
        code: formData.code.toUpperCase().trim(),
        name: formData.name,
        description: formData.description,
        icon: formData.icon || "Megaphone",
      },
    });

    revalidatePath("/struktur");
    revalidatePath("/admin");
    return { success: true, data: newDivisi };
  } catch (error) {
    console.error("Error creating divisi:", error);
    return { success: false, error: "Gagal membuat divisi baru" };
  }
}
