import { getAgenda } from "@/app/actions/agenda";
import AgendaClient, { AgendaItem } from "@/components/AgendaClient";

export const revalidate = 60;

export default async function AgendaPage() {
  const res = await getAgenda();
  const agendas: AgendaItem[] =
    res.success && Array.isArray(res.data) ? (res.data as AgendaItem[]) : [];

  return <AgendaClient initialAgendas={agendas} />;
}
