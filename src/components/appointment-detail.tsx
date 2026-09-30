"use client";
import { useState } from "react";
import { CalendarDays, Clock3, ExternalLink, MapPin, ShieldCheck, Star, Video } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { Appointment } from "@/lib/api-types";
import {
  formatMoney,
  formatTime,
  formatWeekdayDate,
  modalityLabel,
  statusLabel,
  statusTone,
} from "@/lib/format";
import { useCancellationPreview, useInvalidateAppointments } from "@/lib/queries";
import { Avatar } from "./professional-card";
import { Alert, BackLink, Badge, Button, ButtonLink, Dialog } from "./ui";

function hoursLabel(minutes: number) {
  if (minutes < 60) return `${minutes} minutos`;
  const h = Math.floor(minutes / 60);
  return `${h} ${h === 1 ? "hora" : "horas"}`;
}

export function AppointmentDetail({ appointment: a }: { appointment: Appointment }) {
  const invalidate = useInvalidateAppointments();
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const preview = useCancellationPreview(a.id, confirming);
  const paid = a.status === "CONFIRMED" && a.priceCents > 0;

  async function cancel() {
    setCancelling(true);
    setError(null);
    try {
      await api(`/appointments/${a.id}/cancel`, { method: "POST" });
      await invalidate();
      setConfirming(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível cancelar. Tente novamente.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="appointment-detail">
      <BackLink href="/consultas" label="Minhas consultas" />
      <header className="booking-header">
        <Avatar person={a.professional} />
        <div>
          <p className="eyebrow">{a.kind === "INTRO_CALL" ? "CONVERSA INICIAL" : "CONSULTA"}</p>
          <h1>{a.professional.name}</h1>
          <p>{a.professional.profession}</p>
        </div>
        <Badge tone={statusTone(a.status)}>{statusLabel[a.status]}</Badge>
      </header>

      {a.status === "PENDING_PAYMENT" && (
        <Alert tone="warning" title="Pagamento pendente">
          Conclua o pagamento para confirmar seu horário. <a href={`/consultas/${a.id}/pagamento`}>Ir para pagamento</a>
        </Alert>
      )}
      {a.status === "CANCELLED_BY_PATIENT" && a.refundEligible !== null && (
        <Alert tone={a.refundEligible ? "success" : "info"}>
          {a.refundEligible
            ? "Consulta cancelada com antecedência: o valor será reembolsado integralmente."
            : "Consulta cancelada com menos de 4 horas: pela política de cancelamento, não há reembolso."}
        </Alert>
      )}
      {a.status === "CANCELLED_BY_PROFESSIONAL" && (
        <Alert tone="info">O profissional cancelou esta consulta. O valor pago será reembolsado integralmente.</Alert>
      )}

      <section className="booking-panel">
        <dl className="detail-list">
          <div>
            <dt>
              <CalendarDays size={16} /> Data
            </dt>
            <dd>{formatWeekdayDate(a.startsAt)}</dd>
          </div>
          <div>
            <dt>
              <Clock3 size={16} /> Horário
            </dt>
            <dd>
              {formatTime(a.startsAt)} – {formatTime(a.endsAt)}
            </dd>
          </div>
          <div>
            <dt>{a.modality === "ONLINE" ? <Video size={16} /> : <MapPin size={16} />} Modalidade</dt>
            <dd>{modalityLabel[a.modality]}</dd>
          </div>
          <div>
            <dt>Valor</dt>
            <dd>
              {a.priceCents ? formatMoney(a.priceCents) : "Gratuito"}
              {a.payment && ` · ${a.payment.method === "PIX" ? "Pix" : "Cartão"}`}
            </dd>
          </div>
        </dl>

        {a.canJoin &&
          (a.meetingUrl ? (
            <a className="button button-primary full-width" href={a.meetingUrl} target="_blank" rel="noopener noreferrer">
              Entrar no Google Meet <ExternalLink size={16} />
            </a>
          ) : (
            <Alert tone="info">O link do Google Meet será disponibilizado pelo profissional antes do horário.</Alert>
          ))}

        {a.canReview && (
          <ButtonLink href={`/consultas/${a.id}/avaliar`} className="full-width">
            <Star size={17} /> Avaliar consulta
          </ButtonLink>
        )}
        {a.reviewed && <p className="microcopy">Obrigado por avaliar esta consulta.</p>}
      </section>

      <section className="booking-panel" aria-labelledby="shared-title">
        <h2 id="shared-title">
          <ShieldCheck size={19} /> Informações compartilhadas
        </h2>
        <ul className="shared-list">
          <li className={a.shared.summary ? "yes" : "no"}>Resumo pré-consulta {a.shared.summary ? "✓" : "✕"}</li>
          <li className={a.shared.preferences ? "yes" : "no"}>Preferências de atendimento {a.shared.preferences ? "✓" : "✕"}</li>
          <li className="no">Questionário completo ✕</li>
        </ul>
        {a.summary && <blockquote className="shared-summary">“{a.summary}”</blockquote>}
      </section>

      {a.canCancel && (
        <Button variant="danger" className="full-width" onClick={() => setConfirming(true)}>
          Cancelar {a.status === "PENDING_PAYMENT" ? "reserva" : "consulta"}
        </Button>
      )}

      <Dialog open={confirming} onClose={() => setConfirming(false)} title="Cancelar consulta?">
        {a.status === "PENDING_PAYMENT" ? (
          <p>A reserva será liberada e nenhum valor foi cobrado.</p>
        ) : preview.isPending ? (
          <p>Verificando a política de cancelamento…</p>
        ) : preview.data ? (
          <>
            <p>Faltam {hoursLabel(preview.data.minutesUntilStart)} para sua consulta.</p>
            {paid && (
              <Alert tone={preview.data.refundEligible ? "success" : "warning"}>
                {preview.data.refundEligible
                  ? "Você receberá reembolso integral conforme nossa política."
                  : "Este cancelamento está dentro do período inferior a 4 horas e não gera reembolso."}
              </Alert>
            )}
          </>
        ) : null}
        {error && (
          <Alert tone="error" role="alert">
            {error}
          </Alert>
        )}
        <div className="dialog-actions">
          <Button variant="secondary" onClick={() => setConfirming(false)}>
            Manter consulta
          </Button>
          <Button variant="danger" loading={cancelling} onClick={() => void cancel()}>
            Confirmar cancelamento
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
