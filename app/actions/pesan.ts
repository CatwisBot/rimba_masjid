"use server";

import prisma from "@/lib/prisma";
import { StatusPesan } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getPesan() {
  try {
    const messages = await prisma.pesanMasuk.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: messages };
  } catch (error) {
    console.error("Error fetching pesan:", error);
    return { success: false, error: "Gagal mengambil data pesan" };
  }
}

export async function createPesan(formData: {
  senderName?: string;
  contact?: string;
  category: string;
  message: string;
}) {
  try {
    const newMessage = await prisma.pesanMasuk.create({
      data: {
        senderName: formData.senderName || "Anonymous",
        contact: formData.contact || "-",
        category: formData.category || "Pertanyaan",
        message: formData.message,
        status: StatusPesan.Baru,
      },
    });

    revalidatePath("/admin/pesan");
    return { success: true, data: newMessage };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Gagal mengirim pesan" };
  }
}

export async function updatePesanStatus(id: string, status: StatusPesan) {
  try {
    const updated = await prisma.pesanMasuk.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/pesan");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating pesan status:", error);
    return { success: false, error: "Gagal memperbarui status pesan" };
  }
}

export async function deletePesan(id: string) {
  try {
    await prisma.pesanMasuk.delete({ where: { id } });
    revalidatePath("/admin/pesan");
    return { success: true };
  } catch (error) {
    console.error("Error deleting pesan:", error);
    return { success: false, error: "Gagal menghapus pesan" };
  }
}
