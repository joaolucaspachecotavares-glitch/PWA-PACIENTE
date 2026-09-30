"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Copy, CreditCard, FlaskConical, QrCode, TimerReset } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { PaymentState } from "@/lib/api-types";
import { formatMoney, formatTime, formatWeekdayDate } from "@/lib/format";
import { keys, useAppointment, useInvalidateAppointments, usePaymentState } from "@/lib/queries";
import { Avatar } from "./professional-card";
import { ErrorBlock, LoadingBlock } from "./query-state";
import { Alert, BackLink, Button, ButtonLink, EmptyState } from "./ui";

function useCountdown(until: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!until) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [until]);
  if (!until) return null;
  const ms = Math.max(0, new Date(until).getTime() - now);
  return { expired: ms === 0, label: `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}` };
}

export function PaymentScreen({ id }: { id: string }) {
  const router = useRouter();
  const client = useQueryClient();
  const invalidate = useInvalidateAppointments();
  const appointment = useAppointment(id);
  const [method, setMethod] = useState<"PIX" | "CARD">("PIX");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pixPending = (s?: PaymentState) => s?.payment?.status === "PENDING_PAYMENT" && s.payment.method === "PIX";
  const state = usePaymentState(id, true);
  const countdown = useCountdown(state.data?.holdExpiresAt ?? null);

  useEffect(() => {
    if (state.data?.appointmentStatus === "CONFIRMED") {
      void invalidate().then(() => router.replace(`/consultas/${id}/confirmada`));
    }
  }, [state.data?.appointmentStatus, id, router, invalidate]);

  async function run(path: string, body: unknown) {
    setBusy(true);
    setError(null);
    try {
      const next = await api<PaymentState>(path, { method: "POST", body });
      client.setQueryData(keys.payment(id), next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não conseguimos processar seu pagamento. Tente novamente.");
      void state.refetch();
    } finally {
      setBusy(false);
    }
  }

  if (state.isPending || appointment.isPending) return <LoadingBlock lines={5} label="Carregando pagamento" />;
  if (state.isError) return <ErrorBlock error={state.error} onRetry={() => void state.refetch()} />;
  if (appointment.isError) return <ErrorBlock error={appointment.error} onRetry={() => void appointment.refetch()} />;

  const data = state.data;
  const a = appointment.data;
  if (data.appointmentStatus === "CONFIRMED") return <LoadingBlock lines={2} label="Confirmando" />;

  if (data.appointmentStatus !== "PENDING_PAYMENT" || countdown?.expired) {
    const refunded = data.payment?.status === "REFUNDED";
    return (
      <EmptyState
        icon={<TimerReset size={28} />}
        title={refunded ? "Horário indisponível — pagamento estornado." : "Sua reserva expirou."}
        description={
          refunded
            ? "O horário foi ocupado antes da confirmação do pagamento. O valor foi devolvido integralmente."
            : "O horário ficou reservado por 15 minutos. Escolha um novo horário para continuar."
        }
        href={`/profissionais/${a.professional.slug}/agendar`}
        action="Escolher novo horário"
      />
    );
  }

  return (
    <div className="payment">
      <BackLink href={`/profissionais/${a.professional.slug}`} label="Voltar ao perfil" />
      <header className="booking-header">
        <Avatar person={{ ...a.professional }} />
        <div>
          <p className="eyebrow">PAGAMENTO</p>
          <h1>{formatMoney(data.amountCents)}</h1>
          <p>
            {a.professional.name} · {formatWeekdayDate(a.startsAt)} às {formatTime(a.startsAt)}
          </p>
        </div>
      </header>
      {countdown && (
        <p className="hold-timer" aria-live="polite">
          <TimerReset size={16} /> Horário reservado por mais <strong>{countdown.label}</strong>
        </p>
      )}
      {data.sandbox && (
        <Alert tone="warning" title="Ambiente de testes">
          O gateway de pagamento ainda está em contratação. Nenhum valor real é cobrado nesta etapa.
        </Alert>
      )}
      {error && (
        <Alert tone="error" role="alert">
          {error}
        </Alert>
      )}

      {pixPending(data) ? (
        <section className="booking-panel" aria-labelledby="pix-title">
          <h2 id="pix-title">
            <QrCode size={20} /> Pague via Pix
          </h2>
          <p>Copie o código abaixo e cole no aplicativo do seu banco, na opção Pix Copia e Cola.</p>
          <div className="pix-code">
            <code>{data.payment?.pixPayload}</code>
            <Button
              variant="secondary"
              onClick={() => {
                void navigator.clipboard.writeText(data.payment?.pixPayload ?? "").then(() => setCopied(true));
              }}
            >
              <Copy size={16} /> {copied ? "Código copiado" : "Copiar código Pix"}
            </Button>
          </div>
          <p className="waiting" role="status">
            <span className="live-dot" /> Aguardando pagamento… A confirmação aparece aqui automaticamente.
          </p>
          {data.sandbox && (
            <Button loading={busy} onClick={() => void run(`/appointments/${id}/payment/sandbox`, { outcome: "paid" })}>
              <FlaskConical size={17} /> Simular Pix recebido
            </Button>
          )}
          <Button variant="ghost" disabled={busy} onClick={() => void run(`/appointments/${id}/payment`, { method: "CARD" })}>
            Prefiro pagar com cartão
          </Button>
        </section>
      ) : (
        <section className="booking-panel" aria-labelledby="method-title">
          <h2 id="method-title">Como deseja pagar?</h2>
          {data.payment?.status === "FAILED" && (
            <Alert tone="error">Não conseguimos processar seu pagamento. Tente novamente ou escolha outra forma.</Alert>
          )}
          <div className="payment-methods" role="radiogroup" aria-label="Forma de pagamento">
            {(
              [
                { value: "PIX", label: "Pix", hint: "Confirmação em instantes", icon: QrCode },
                { value: "CARD", label: "Cartão de crédito", hint: "À vista", icon: CreditCard },
              ] as const
            ).map((m) => (
              <label key={m.value} className={`payment-method ${method === m.value ? "selected" : ""}`}>
                <input type="radio" name="method" value={m.value} checked={method === m.value} onChange={() => setMethod(m.value)} />
                <m.icon size={22} aria-hidden="true" />
                <span>
                  <strong>{m.label}</strong>
                  <small>{m.hint}</small>
                </span>
              </label>
            ))}
          </div>
          <dl className="detail-list">
            <div>
              <dt>Consulta</dt>
              <dd>{formatMoney(data.amountCents)}</dd>
            </div>
            <div className="detail-total">
              <dt>Total</dt>
              <dd>{formatMoney(data.amountCents)}</dd>
            </div>
          </dl>
          <Button className="full-width" loading={busy} onClick={() => void run(`/appointments/${id}/payment`, { method })}>
            Pagar {formatMoney(data.amountCents)}
          </Button>
          <ButtonLink href={`/consultas/${id}`} variant="ghost" className="full-width">
            Ver detalhes da reserva
          </ButtonLink>
        </section>
      )}
    </div>
  );
}
