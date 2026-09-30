"use client";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { AppointmentCard } from "@/components/appointment-card";
import { ErrorBlock, LoadingBlock } from "@/components/query-state";
import { EmptyState } from "@/components/ui";
import { useAppointments } from "@/lib/queries";

const TABS = [
  { id: "upcoming", label: "Próximas" },
  { id: "done", label: "Realizadas" },
  { id: "cancelled", label: "Canceladas" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function AppointmentsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const upcoming = useAppointments("upcoming");
  const past = useAppointments("past");
  const source = tab === "upcoming" ? upcoming : past;
  const items = (source.data ?? []).filter((a) => {
    if (tab === "upcoming") return true;
    const cancelled = a.status.startsWith("CANCELLED") || a.status === "NO_SHOW";
    return tab === "cancelled" ? cancelled : !cancelled;
  });

  return (
    <>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">TEMPO PARA VOCÊ</p>
          <h1>Minhas consultas</h1>
          <p>Seus encontros, organizados em um só lugar.</p>
        </div>
      </div>
      <div className="tabs" role="tablist" aria-label="Filtrar consultas">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "tab-active" : ""} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {source.isPending ? (
        <LoadingBlock lines={4} />
      ) : source.isError ? (
        <ErrorBlock error={source.error} onRetry={() => void source.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={28} />}
          title={
            tab === "upcoming" ? "Nenhuma consulta agendada." : tab === "done" ? "Nenhuma consulta realizada ainda." : "Nenhuma consulta cancelada."
          }
          description={
            tab === "upcoming"
              ? "Quando você agendar, sua consulta aparece aqui com todos os detalhes."
              : "Seu histórico aparecerá aqui."
          }
          href={tab === "upcoming" ? "/profissionais" : undefined}
          action={tab === "upcoming" ? "Encontrar profissional" : undefined}
        />
      ) : (
        <div className="appointments-list">
          {items.map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
          ))}
        </div>
      )}
    </>
  );
}
