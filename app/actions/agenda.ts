"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAgenda() {
  try {
    const agendas = await prisma.agenda.findMany({
      orderBy: { date: "asc" },
    });
    return { success: true, data: agendas };
  } catch (error) {
    console.error("Error fetching agenda:", error);
    return { success: false, error: "Gagal mengambil data agenda" };
  }
}

export async function getAgendaById(id: string) {
  try {
    const item = await prisma.agenda.findUnique({
      where: { id },
    });
    if (!item) {
      return { success: false, error: "Agenda tidak ditemukan" };
    }
    return { success: true, data: item };
  } catch (error) {
    console.error("Error fetching agenda by id:", error);
    return { success: false, error: "Gagal mengambil data agenda" };
  }
}

export async function createAgenda(formData: {
  title: string;
  category: string;
  description: string;
  formattedDate: string;
  date?: string | Date;
  time?: string;
  location?: string;
  image?: string;
  deadline?: string;
  requirements?: string;
}) {
  try {
    const eventDate = formData.date ? new Date(formData.date) : new Date();

    const newAgenda = await prisma.agenda.create({
      data: {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        date: eventDate,
        formattedDate: formData.formattedDate,
        time: formData.time || "08.00 WIB",
        location: formData.location || "Masjid Al-Barkah",
        image: formData.image || null,
        deadline: formData.deadline || null,
        requirements: formData.requirements || null,
      } as any,
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        action: "created",
        entity: "Agenda",
        description: `Menambahkan agenda '${formData.title}'`,
        user: "Admin BPH",
      },
    });

    revalidatePath("/admin/agenda");
    revalidatePath("/agenda");
    revalidatePath("/");
    return { success: true, data: newAgenda };
  } catch (error) {
    console.error("Error creating agenda:", error);
    return { success: false, error: "Gagal membuat agenda" };
  }
}

export async function updateAgenda(
  id: string,
  formData: {
    title: string;
    category: string;
    description: string;
    formattedDate: string;
    date?: string | Date;
    time?: string;
    location?: string;
    image?: string;
    deadline?: string;
    requirements?: string;
  }
) {
  try {
    const eventDate = formData.date ? new Date(formData.date) : undefined;

    const updated = await prisma.agenda.update({
      where: { id },
      data: {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        formattedDate: formData.formattedDate,
        ...(eventDate && { date: eventDate }),
        time: formData.time,
        location: formData.location,
        image: formData.image || null,
        deadline: formData.deadline || null,
        requirements: formData.requirements || null,
      } as any,
    });

    revalidatePath("/admin/agenda");
    revalidatePath("/agenda");
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating agenda:", error);
    return { success: false, error: "Gagal memperbarui agenda" };
  }
}

export async function deleteAgenda(id: string) {
  try {
    await prisma.agenda.delete({ where: { id } });
    revalidatePath("/admin/agenda");
    revalidatePath("/agenda");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting agenda:", error);
    return { success: false, error: "Gagal menghapus agenda" };
  }
}
