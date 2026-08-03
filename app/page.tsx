import Hero from "@/components/Hero";
import NewsAgenda, { BeritaItem, AgendaItem } from "@/components/NewsAgenda";
import Programs from "@/components/Programs";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import { getBerita } from "@/app/actions/berita";
import { getAgenda } from "@/app/actions/agenda";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export default async function HomePage() {
  const [beritaRes, agendaRes, anggotaCount, agendaCount, galeriCount] = await Promise.all([
    getBerita().catch(() => ({ success: false, data: [] as BeritaItem[] })),
    getAgenda().catch(() => ({ success: false, data: [] as AgendaItem[] })),
    prisma.anggota.count().catch(() => 0),
    prisma.agenda.count().catch(() => 0),
    prisma.galeri.count().catch(() => 0),
  ]);

  const beritaList: BeritaItem[] = beritaRes.success && Array.isArray(beritaRes.data) ? (beritaRes.data as BeritaItem[]) : [];
  const agendaList: AgendaItem[] = agendaRes.success && Array.isArray(agendaRes.data) ? (agendaRes.data as AgendaItem[]) : [];

  return (
    <main className="min-h-screen">
      <Hero stats={{ anggotaCount, agendaCount, galeriCount }} />
      <NewsAgenda beritaList={beritaList} agendaList={agendaList} />
      <Programs />
      <Features />
      <CTA />
    </main>
  );
}