"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { Appointment } from "@/lib/api-types";
import { formatWeekdayDate } from "@/lib/format";
import { useInvalidateAppointments } from "@/lib/queries";
import { Avatar } from "./professional-card";
import { Alert, BackLink, Button } from "./ui";

// Avaliamos a experiência do atendimento — nunca "eficácia" ou resultado clínico.
const CATEGORIES = [
  { key: "overall", label: "Avaliação geral" },
  { key: "punctuality", label: "Pontualidade" },
  { key: "communication", label: "Comunicação" },
  { key: "welcoming", label: "Acolhimento" },
  { key: "organization", label: "Organização" },
  { key: "experience", label: "Experiência geral" },
] as const;
type Key = (typeof CATEGORIES)[number]["key"];

function StarInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <fieldset className="star-input">
      <legend>{label}</legend>
      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className={n <= value ? "on" : ""}>
            <input type="radio" name={label} value={n} checked={value === n} onChange={() => onChange(n)} />
            <Star size={30} fill={n <= value ? "currentColor" : "none"} aria-hidden="true" />
            <span className="sr-only">
              {n} {n === 1 ? "estrela" : "estrelas"}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ReviewForm({ appointment: a }: { appointment: Appointment }) {
  const router = useRouter();
  const invalidate = useInvalidateAppointments();
  const [scores, setScores] = useState<Record<Key, number>>({
    overall: 0,
    punctuality: 0,
    communication: 0,
    welcoming: 0,
    organization: 0,
    experience: 0,
  });
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const complete = Object.values(scores).every((v) => v > 0);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!complete) {
      setError("Dê uma nota de 1 a 5 estrelas para cada item.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await api(`/appointments/${a.id}/review`, { method: "POST", body: { ...scores, comment: comment.trim() || undefined } });
      await invalidate();
      router.replace(`/consultas/${a.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível enviar sua avaliação.");
      setPending(false);
    }
  }

  return (
    <form className="review-form" onSubmit={(e) => void submit(e)} noValidate>
      <BackLink href={`/consultas/${a.id}`} />
      <header className="booking-header">
        <Avatar person={a.professional} />
        <div>
          <p className="eyebrow">{formatWeekdayDate(a.startsAt).toUpperCase()}</p>
          <h1>Como foi sua experiência com {a.professional.name.split(" ")[0]}?</h1>
        </div>
      </header>
      <section className="booking-panel">
        {CATEGORIES.map((c) => (
          <StarInput key={c.key} label={c.label} value={scores[c.key]} onChange={(v) => setScores({ ...scores, [c.key]: v })} />
        ))}
        <label htmlFor="comment" className="field-label">
          Quer deixar um comentário? (opcional)
        </label>
        <textarea id="comment" rows={4} maxLength={1000} value={comment} onChange={(e) => setComment(e.target.value)} />
        <p className="field-hint">Comentários aparecem no perfil de forma anônima.</p>
        {error && (
          <Alert tone="error" role="alert">
            {error}
          </Alert>
        )}
        <Button type="submit" className="full-width" loading={pending}>
          Enviar avaliação
        </Button>
      </section>
    </form>
  );
}
