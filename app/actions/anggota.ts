"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAnggota() {
  try {
    const members = await prisma.anggota.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: members };
  } catch (error) {
    console.error("Error fetching anggota:", error);
    return { success: false, error: "Gagal mengambil data anggota" };
  }
}

export async function createAnggota(formData: {
  name: string;
  role: string;
  category: string;
  avatar?: string;
  order?: number;
}) {
  try {
    const newMember = await prisma.anggota.create({
      data: {
        name: formData.name,
        role: formData.role,
        category: formData.category,
        avatar: formData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        order: formData.order || 0,
      },
    });

    revalidatePath("/admin/anggota");
    revalidatePath("/struktur");
    revalidatePath("/tentang");
    revalidatePath("/");
    return { success: true, data: newMember };
  } catch (error) {
    console.error("Error creating anggota:", error);
    return { success: false, error: "Gagal menambahkan anggota" };
  }
}

export async function updateAnggota(
  id: string,
  formData: {
    name: string;
    role: string;
    category: string;
    avatar?: string;
    order?: number;
  }
) {
  try {
    const updated = await prisma.anggota.update({
      where: { id },
      data: {
        name: formData.name,
        role: formData.role,
        category: formData.category,
        avatar: formData.avatar,
        ...(formData.order !== undefined && { order: formData.order }),
      },
    });

    revalidatePath("/admin/anggota");
    revalidatePath("/struktur");
    revalidatePath("/tentang");
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating anggota:", error);
    return { success: false, error: "Gagal memperbarui data anggota" };
  }
}

export async function deleteAnggota(id: string) {
  try {
    await prisma.anggota.delete({ where: { id } });
    revalidatePath("/admin/anggota");
    revalidatePath("/tentang");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting anggota:", error);
    return { success: false, error: "Gagal menghapus anggota" };
  }
}
