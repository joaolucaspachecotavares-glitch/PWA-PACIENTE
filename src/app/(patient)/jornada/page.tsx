"use client";
import { CalendarCheck, Check, Footprints, Heart, Sparkles, Sprout } from "lucide-react";
import { ErrorBlock, LoadingBlock } from "@/components/query-state";
import { ButtonLink, SectionTitle } from "@/components/ui";
import { formatMonth } from "@/lib/format";
import { useJourneyData } from "@/lib/queries";

const ICONS: Record<string, typeof Footprints> = {
  FIRST_STEP: Footprints,
  CONSISTENCY: Heart,
  CARING_FOR_ME: Sparkles,
  MY_JOURNEY: Sprout,
};

export default function JourneyPage() {
  const journey = useJourneyData();

  return (
    <>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">CADA PASSO IMPORTA</p>
          <h1>Minha jornada</h1>
          <p>Um olhar gentil para o caminho que você está construindo.</p>
        </div>
      </div>
      <div className="journey-hero">
        <span className="round-icon">
          <Sprout size={34} />
        </span>
        <div>
          <h2>
            Cuidar de si é um caminho.
            <br />
            <span>Você não precisa percorrê-lo sozinho.</span>
          </h2>
          <p>Seu ritmo é único. Aqui não há comparação, ranking ou pressa.</p>
        </div>
      </div>
      {journey.isPending ? (
        <LoadingBlock lines={4} />
      ) : journey.isError ? (
        <ErrorBlock error={journey.error} onRetry={() => void journey.refetch()} />
      ) : (
        <>
          <div className="metric-grid">
            <article>
              <CalendarCheck size={24} />
              <strong>{String(journey.data.attended).padStart(2, "0")}</strong>
              <span>consultas realizadas</span>
            </article>
            <article>
              <Heart size={24} />
              <strong>{String(journey.data.consecutive).padStart(2, "0")}</strong>
              <span>consultas consecutivas</span>
            </article>
            <article>
              <CalendarCheck size={24} />
              <strong>{String(journey.data.upcoming).padStart(2, "0")}</strong>
              <span>consultas agendadas</span>
            </article>
          </div>
          <SectionTitle title="Conquistas" />
          <div className="milestone-grid">
            {journey.data.achievements.map((a) => {
              const Icon = ICONS[a.code] ?? Sparkles;
              return (
                <article key={a.code} className={`milestone ${a.achieved ? "milestone-done" : ""}`}>
                  <span className="round-icon">
                    <Icon size={28} />
                  </span>
                  <h3>{a.title}</h3>
                  <p>{a.description}</p>
                  <span className="milestone-status">
                    {a.achieved ? (
                      <>
                        <Check size={15} /> Na sua história
                      </>
                    ) : (
                      `${a.progress} de ${a.target}`
                    )}
                  </span>
                </article>
              );
            })}
          </div>
          {journey.data.byMonth.length > 0 && (
            <>
              <SectionTitle title="Histórico" />
              <ul className="month-history">
                {journey.data.byMonth.map((m) => (
                  <li key={m.month}>
                    <span>{formatMonth(m.month)}</span>
                    <strong>
                      {m.attended} {m.attended === 1 ? "consulta" : "consultas"}
                    </strong>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
      <div className="journey-end">
        <p>
          Não há comparação. Não há pressa.
          <br />
          <strong>Há o seu tempo e a sua história.</strong>
        </p>
        <ButtonLink href="/inicio" variant="secondary">
          Voltar para o início
        </ButtonLink>
      </div>
    </>
  );
}
