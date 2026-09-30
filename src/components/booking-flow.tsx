"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Clock3, LockKeyhole, ShieldCheck } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { Appointment, Modality, ProfessionalProfileData } from "@/lib/api-types";
import { calendarDate, formatMoney, formatTime, formatWeekdayDate, modalityLabel, TIME_ZONE } from "@/lib/format";
import { useInvalidateAppointments, useSavedAnswers, useSlots } from "@/lib/queries";
import { Avatar } from "./professional-card";
import { ErrorBlock, LoadingBlock } from "./query-state";
import { Alert, BackLink, Button, EmptyState } from "./ui";

type Step = "date" | "time" | "context" | "summary";
const STEP_ORDER: Step[] = ["date", "time", "context", "summary"];
const STEP_LABELS: Record<Step, string> = {
  date: "Data",
  time: "Horário",
  context: "Antes da consulta",
  summary: "Resumo",
};
const SUMMARY_LIMIT = 1000;

const hourFormatter = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "numeric", hourCycle: "h23" });
function periodOf(iso: string): "Manhã" | "Tarde" | "Noite" {
  const hour = Number(hourFormatter.format(new Date(iso)));
  return hour < 12 ? "Manhã" : hour < 18 ? "Tarde" : "Noite";
}

export function BookingFlow({
  person,
  introCall,
  preselected,
}: {
  person: ProfessionalProfileData;
  introCall: boolean;
  preselected?: string;
}) {
  const router = useRouter();
  const invalidate = useInvalidateAppointments();
  const slots = useSlots(person.slug);
  const saved = useSavedAnswers();
  const preselectedSlot = slots.data?.slots.find((s) => s.startsAt === preselected);
  const [step, setStep] = useState<Step>(preselected ? "context" : "date");
  const [date, setDate] = useState<string | null>(null);
  const [startsAt, setStartsAt] = useState<string | null>(preselected ?? null);
  const [modality, setModality] = useState<Modality>(person.modalities[0]);
  const [summary, setSummary] = useState("");
  const [sharePreferences, setSharePreferences] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const byDate = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of slots.data?.slots ?? []) map.set(s.date, [...(map.get(s.date) ?? []), s.startsAt]);
    return map;
  }, [slots.data]);

  const selectedDate = date ?? preselectedSlot?.date ?? null;
  const sharing = summary.trim().length > 0 || sharePreferences;
  const priceCents = introCall ? 0 : person.priceCents;
  const duration = introCall ? 15 : person.durationMin;
  const stepIndex = STEP_ORDER.indexOf(step);

  async function confirm() {
    if (!startsAt) return;
    setSubmitting(true);
    setError(null);
    try {
      const appointment = await api<Appointment>("/appointments", {
        method: "POST",
        body: {
          professionalId: person.id,
          startsAt,
          kind: introCall ? "INTRO_CALL" : "CONSULTATION",
          modality,
          summary: summary.trim() || undefined,
          sharePreferences,
          consentToShare: sharing ? consent : false,
        },
      });
      await invalidate();
      router.push(
        appointment.status === "CONFIRMED"
          ? `/consultas/${appointment.id}/confirmada`
          : `/consultas/${appointment.id}/pagamento`,
      );
    } catch (err) {
      setSubmitting(false);
      if (err instanceof ApiError && err.status === 409) {
        setError(err.message);
        setStartsAt(null);
        setStep("time");
        void slots.refetch();
        return;
      }
      setError(err instanceof ApiError ? err.message : "Não foi possível reservar. Tente novamente.");
    }
  }

  if (slots.isPending) return <LoadingBlock lines={5} label="Carregando agenda" />;
  if (slots.isError) return <ErrorBlock error={slots.error} onRetry={() => void slots.refetch()} />;
  if (!byDate.size) {
    return (
      <EmptyState
        icon={<CalendarDays size={28} />}
        title="Nenhum horário disponível."
        description="Este profissional não tem horários livres nas próximas semanas. Salve nos favoritos e volte depois."
        href={`/profissionais/${person.slug}`}
        action="Voltar ao perfil"
      />
    );
  }

  return (
    <div className="booking">
      <BackLink
        href={`/profissionais/${person.slug}`}
        label={stepIndex === 0 ? "Voltar ao perfil" : "Cancelar agendamento"}
      />
      <header className="booking-header">
        <Avatar person={person} />
        <div>
          <p className="eyebrow">{introCall ? "CONVERSA INICIAL · 15 MIN" : "AGENDAR CONSULTA"}</p>
          <h1>{introCall ? `Conheça ${person.name.split(" ")[0]}` : `Agendar com ${person.name}`}</h1>
        </div>
      </header>
      <ol className="booking-steps" aria-label="Etapas do agendamento">
        {STEP_ORDER.map((s, i) => (
          <li key={s} className={i < stepIndex ? "done" : i === stepIndex ? "current" : ""} aria-current={i === stepIndex ? "step" : undefined}>
            <span className="step-num" aria-hidden="true">
              {i + 1}
            </span>
            <span className="step-label">{STEP_LABELS[s]}</span>
          </li>
        ))}
      </ol>

      {error && (
        <Alert tone="error" role="alert">
          {error}
        </Alert>
      )}

      {step === "date" && (
        <section className="booking-panel" aria-labelledby="date-title">
          <h2 id="date-title">Escolha uma data</h2>
          <div className="date-grid" role="listbox" aria-label="Datas disponíveis">
            {[...byDate.keys()].map((d) => {
              const info = calendarDate(d);
              const active = selectedDate === d;
              return (
                <button
                  key={d}
                  type="button"
                  role="option"
                  aria-selected={active}
                  aria-label={`${info.label}, ${byDate.get(d)?.length} horários`}
                  className={`date-option ${active ? "selected" : ""}`}
                  onClick={() => {
                    setDate(d);
                    setStartsAt(null);
                    setStep("time");
                  }}
                >
                  <small>{info.weekday}</small>
                  <strong>{info.day}</strong>
                  <span>{byDate.get(d)?.length} horários</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {step === "time" && selectedDate && (
        <section className="booking-panel" aria-labelledby="time-title">
          <h2 id="time-title">{calendarDate(selectedDate).label}</h2>
          {(["Manhã", "Tarde", "Noite"] as const).map((period) => {
            const times = (byDate.get(selectedDate) ?? []).filter((t) => periodOf(t) === period);
            if (!times.length) return null;
            return (
              <div key={period} className="time-group">
                <h3>{period}</h3>
                <div className="time-slots">
                  {times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`time-slot ${startsAt === t ? "selected" : ""}`}
                      aria-pressed={startsAt === t}
                      onClick={() => setStartsAt(t)}
                    >
                      {formatTime(t)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="booking-actions">
            <Button variant="ghost" onClick={() => setStep("date")}>
              Trocar data
            </Button>
            <Button disabled={!startsAt} onClick={() => setStep("context")}>
              Continuar <ArrowRight size={17} />
            </Button>
          </div>
        </section>
      )}

      {step === "context" && (
        <section className="booking-panel" aria-labelledby="context-title">
          <h2 id="context-title">Antes da consulta</h2>
          <p>Se quiser, conte um pouco sobre o que gostaria de conversar. É opcional.</p>
          <label htmlFor="summary" className="field-label">
            Faça um breve resumo sobre você, o que está vivendo neste momento e o que espera encontrar neste atendimento.
          </label>
          <textarea
            id="summary"
            rows={5}
            maxLength={SUMMARY_LIMIT}
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              setConsent(false);
            }}
            aria-describedby="summary-count"
          />
          <span id="summary-count" className="field-hint">
            {summary.length} / {SUMMARY_LIMIT}
          </span>
          {saved.data?.answers && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={sharePreferences}
                onChange={(e) => {
                  setSharePreferences(e.target.checked);
                  setConsent(false);
                }}
              />
              <span>Compartilhar meu resumo de preferências (modalidade, horário e estilo de atendimento)</span>
            </label>
          )}
          {sharing && (
            <div className="share-preview">
              <h3>
                <ShieldCheck size={18} /> Veja o que será compartilhado com {person.name}
              </h3>
              <ul>
                {summary.trim() && <li>Seu resumo: “{summary.trim()}”</li>}
                {sharePreferences && <li>Suas preferências de atendimento</li>}
                <li className="not-shared">O questionário completo não é compartilhado.</li>
              </ul>
              <label className="checkbox-label">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>Autorizo compartilhar estas informações com {person.name} para esta consulta.</span>
              </label>
            </div>
          )}
          <div className="booking-actions">
            <Button variant="ghost" onClick={() => setStep(selectedDate ? "time" : "date")}>
              Voltar
            </Button>
            <Button disabled={sharing && !consent} onClick={() => setStep("summary")}>
              Continuar <ArrowRight size={17} />
            </Button>
          </div>
          {sharing && !consent && <p className="field-hint">Autorize o compartilhamento ou apague as informações para continuar.</p>}
        </section>
      )}

      {step === "summary" && startsAt && (
        <section className="booking-panel" aria-labelledby="summary-title">
          <h2 id="summary-title">Confirme sua consulta</h2>
          <dl className="detail-list">
            <div>
              <dt>Profissional</dt>
              <dd>
                {person.name} · {person.profession}
              </dd>
            </div>
            <div>
              <dt>
                <CalendarDays size={16} /> Data
              </dt>
              <dd>{formatWeekdayDate(startsAt)}</dd>
            </div>
            <div>
              <dt>
                <Clock3 size={16} /> Horário
              </dt>
              <dd>
                {formatTime(startsAt)} · {duration} minutos
              </dd>
            </div>
            <div>
              <dt>Modalidade</dt>
              <dd>
                {person.modalities.length > 1 ? (
                  <select aria-label="Modalidade" value={modality} onChange={(e) => setModality(e.target.value as Modality)}>
                    {person.modalities.map((m) => (
                      <option key={m} value={m}>
                        {modalityLabel[m]}
                      </option>
                    ))}
                  </select>
                ) : (
                  modalityLabel[modality]
                )}
              </dd>
            </div>
            {!introCall && (
              <div>
                <dt>Consulta</dt>
                <dd>{formatMoney(priceCents)}</dd>
              </div>
            )}
            <div className="detail-total">
              <dt>Total</dt>
              <dd>{introCall ? "Gratuito" : formatMoney(priceCents)}</dd>
            </div>
          </dl>
          {!introCall && (
            <div className="policy-note">
              <LockKeyhole size={18} />
              <p>
                <strong>Política de cancelamento:</strong> cancelando com pelo menos 4 horas de antecedência, você recebe
                reembolso integral. Com menos de 4 horas ou em caso de ausência, não há reembolso.
              </p>
            </div>
          )}
          <p className="field-hint">Seu horário fica reservado por 15 minutos para concluir o pagamento.</p>
          <div className="booking-actions">
            <Button variant="ghost" onClick={() => setStep("context")}>
              Voltar
            </Button>
            <Button loading={submitting} onClick={() => void confirm()}>
              {introCall ? "Confirmar conversa inicial" : "Ir para pagamento"} <ArrowRight size={17} />
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
