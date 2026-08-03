import { getBerita } from "@/app/actions/berita";
import BeritaClient, { BeritaItem } from "@/components/BeritaClient";

export const revalidate = 60;

export default async function BeritaPage() {
  const res = await getBerita();
  const articles: BeritaItem[] =
    res.success && Array.isArray(res.data) ? (res.data as BeritaItem[]) : [];

  return <BeritaClient initialArticles={articles} />;
}
