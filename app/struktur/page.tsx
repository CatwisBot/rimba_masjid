import { getAnggota } from "@/app/actions/anggota";
import StrukturClient, { AnggotaItem } from "@/components/StrukturClient";

export const revalidate = 60;

export default async function StrukturPage() {
  const res = await getAnggota();
  const members: AnggotaItem[] =
    res.success && Array.isArray(res.data) ? (res.data as AnggotaItem[]) : [];

  return <StrukturClient initialMembers={members} />;
}
