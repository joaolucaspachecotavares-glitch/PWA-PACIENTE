"use client";
import { use } from "react";
import { CalendarPlus, CircleCheck } from "lucide-react";
import { ErrorBlock, LoadingBlock } from "@/components/query-state";
import { Button, ButtonLink } from "@/components/ui";
import { buildCalendarFile, formatTime, formatWeekdayDate, modalityLabel } from "@/lib/format";
import { useAppointment } from "@/lib/queries";

export default function ConfirmedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const appointment = useAppointment(id);
  if (appointment.isPending) return <LoadingBlock lines={4} />;
  if (appointment.isError) return <ErrorBlock error={appointment.error} onRetry={() => void appointment.refetch()} />;
  const a = appointment.data;

  function downloadCalendar() {
    const blob = new Blob([buildCalendarFile({ id: a.id, startsAt: a.startsAt, endsAt: a.endsAt, professionalName: a.professional.name })], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "consulta-luvimind.ics";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="confirmation">
      <span className="confirmation-icon">
        <CircleCheck size={44} />
      </span>
      <h1>{a.kind === "INTRO_CALL" ? "Sua conversa inicial está confirmada!" : "Sua consulta está confirmada!"}</h1>
      <dl className="detail-list">
        <div>
          <dt>Profissional</dt>
          <dd>{a.professional.name}</dd>
        </div>
        <div>
          <dt>Data</dt>
          <dd>{formatWeekdayDate(a.startsAt)}</dd>
        </div>
        <div>
          <dt>Horário</dt>
          <dd>{formatTime(a.startsAt)}</dd>
        </div>
        <div>
          <dt>Modalidade</dt>
          <dd>{modalityLabel[a.modality]}</dd>
        </div>
      </dl>
      {a.modality === "ONLINE" && (
        <p>
          A consulta acontece pelo <strong>Google Meet</strong>. O link aparece em “Minhas consultas” 15 minutos antes do
          horário.
        </p>
      )}
      <p>Enviaremos lembretes 24 horas, 2 horas e 15 minutos antes, na central de notificações.</p>
      <div className="confirmation-actions">
        <Button variant="secondary" onClick={downloadCalendar}>
          <CalendarPlus size={17} /> Adicionar ao calendário
        </Button>
        <ButtonLink href={`/consultas/${a.id}`}>Ver minha consulta</ButtonLink>
        <ButtonLink href="/inicio" variant="ghost">
          Ir para o início
        </ButtonLink>
      </div>
    </div>
  );
}
