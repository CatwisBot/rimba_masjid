"use server";

import prisma from "@/lib/prisma";
import { StatusPendaftaran } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getPendaftaran() {
  try {
    const records = await prisma.pendaftaran.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: records };
  } catch (error) {
    console.error("Error fetching pendaftaran:", error);
    return { success: false, error: "Gagal mengambil data pendaftaran" };
  }
}

export async function createPendaftaran(formData: {
  name: string;
  contact: string;
  agendaTitle: string;
  agendaId?: string;
  notes?: string;
}) {
  try {
    const newReg = await prisma.pendaftaran.create({
      data: {
        name: formData.name,
        contact: formData.contact,
        agendaTitle: formData.agendaTitle,
        agendaId: formData.agendaId,
        notes: formData.notes,
        status: StatusPendaftaran.MENUNGGU,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    revalidatePath("/admin/pendaftaran");
    revalidatePath("/admin");
    return { success: true, data: newReg };
  } catch (error) {
    console.error("Error creating pendaftaran:", error);
    return { success: false, error: "Gagal mendaftar agenda" };
  }
}

export async function updatePendaftaranStatus(
  id: string,
  status: StatusPendaftaran
) {
  try {
    const updated = await prisma.pendaftaran.update({
      where: { id },
      data: { status },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: `diubah menjadi ${status}`,
        entity: "Pendaftaran",
        description: `Mengubah status pendaftaran ${updated.name}`,
        user: "Admin BPH",
      },
    });

    revalidatePath("/admin/pendaftaran");
    revalidatePath("/admin");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating pendaftaran status:", error);
    return { success: false, error: "Gagal memperbarui status pendaftaran" };
  }
}
