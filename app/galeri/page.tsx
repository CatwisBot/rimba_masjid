import { getGaleri } from "@/app/actions/galeri";
import GaleriClient, { GaleriItem } from "@/components/GaleriClient";

export const revalidate = 60;

export default async function GaleriPage() {
  const res = await getGaleri();
  const photos: GaleriItem[] =
    res.success && Array.isArray(res.data) ? (res.data as GaleriItem[]) : [];

  return <GaleriClient initialPhotos={photos} />;
}
