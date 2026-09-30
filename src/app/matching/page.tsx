"use client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, Check, Leaf, LockKeyhole, Sparkles } from "lucide-react";
import { Avatar, CompatibilityTag, ModalityLine, RatingLine } from "@/components/professional-card";
import { FlowShell } from "@/components/flow-shell";
import { useJourney } from "@/components/providers";
import { ErrorBlock } from "@/components/query-state";
import { Alert, BackLink, Badge, ButtonLink, EmptyState } from "@/components/ui";
import { api } from "@/lib/api";
import type { MatchingPreview } from "@/lib/api-types";
import { formatPrice } from "@/lib/format";

const MIN_LOADING_MS = 1600;
const STEPS = [
  "Entendendo suas preferências",
  "Comparando especialidades",
  "Verificando disponibilidade",
  "Encontrando profissionais",
];

export default function MatchingPage() {
  const { answers } = useJourney();
  const answered = Object.keys(answers).length === 10;
  const [minElapsed, setMinElapsed] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const preview = useMutation({
    mutationFn: () => api<MatchingPreview>("/matching/preview", { method: "POST", body: { answers } }),
  });
  const { mutate } = preview;

  useEffect(() => {
    if (!answered) return;
    mutate();
    const timers = STEPS.map((_, i) => setTimeout(() => setVisibleSteps(i + 1), (i + 1) * 350));
    timers.push(setTimeout(() => setMinElapsed(true), MIN_LOADING_MS));
    return () => timers.forEach(clearTimeout);
  }, [answered, mutate]);

  if (!answered) {
    return (
      <FlowShell stage={1}>
        <div className="container small-page">
          <EmptyState
            title="Vamos começar pelas suas preferências."
            description="Responda o questionário para encontrarmos profissionais compatíveis com você."
            href="/questionario"
            action="Responder questionário"
          />
        </div>
      </FlowShell>
    );
  }

  if (preview.isError) {
    return (
      <FlowShell stage={1}>
        <div className="container small-page">
          <ErrorBlock error={preview.error} onRetry={() => mutate()} />
        </div>
      </FlowShell>
    );
  }

  if (!minElapsed || !preview.data) {
    return (
      <FlowShell stage={1}>
        <div className="matching-loading" role="status" aria-live="polite">
          <span className="matching-orbit">
            <Leaf size={40} />
          </span>
          <p className="eyebrow">PREPARANDO SEU ENCONTRO</p>
          <h1>
            Estamos encontrando
            <br />
            <span>opções para você.</span>
          </h1>
          <div className="loading-checks">
            {STEPS.map((step, i) => (
              <span key={step} className={i < visibleSteps ? "is-done" : ""}>
                <Check size={17} /> {step}
              </span>
            ))}
          </div>
          <span className="loading-dots">
            <i />
            <i />
            <i />
          </span>
        </div>
      </FlowShell>
    );
  }

  const data = preview.data;
  const remaining = Math.max(0, data.total - data.preview.length);
  return (
    <FlowShell stage={1}>
      <div className="container preview-page">
        <BackLink href="/questionario/10" label="Rever respostas" />
        {data.urgentSupport && (
          <Alert tone="info" title="Você não está sozinho.">
            Se precisar de apoio agora, o CVV atende gratuitamente pelo <a href="tel:188">188</a>, 24 horas.{" "}
            <a href="/apoio?continuar=/matching">Ver opções de apoio</a>
          </Alert>
        )}
        {data.total === 0 ? (
          <EmptyState
            title="Ainda não encontramos profissionais com essas preferências."
            description="Novos profissionais chegam à Luvimind com frequência. Você pode ajustar suas respostas ou criar sua conta para explorar todas as opções."
            href="/questionario/1"
            action="Ajustar preferências"
          />
        ) : (
          <>
            <div className="centered-title">
              <Badge>
                <Sparkles size={14} /> SEU PRÓXIMO ENCONTRO
              </Badge>
              <h1>
                Encontramos {data.total} {data.total === 1 ? "profissional" : "profissionais"}
                <br />
                <span>que podem combinar com o que você procura.</span>
              </h1>
            </div>
            {data.preferences.length > 0 && (
              <div className="preference-strip">
                <span>Seu perfil de preferência</span>
                <div className="chips">
                  {data.preferences.map((s) => (
                    <span className="chip chip-white" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="preview-card-grid">
              {data.preview.map((person) => (
                <article className="professional-card professional-recommended" key={person.id}>
                  <CompatibilityTag value={person.compatibility} />
                  <div className="professional-body">
                    <div className="professional-top">
                      <Avatar person={person} />
                      <div className="professional-identity">
                        <h3>{person.name}</h3>
                        <p>{person.profession}</p>
                        {person.verified && (
                          <span className="verified">
                            <BadgeCheck size={14} /> CRP verificado
                          </span>
                        )}
                      </div>
                    </div>
                    <RatingLine average={person.ratingAverage} count={person.ratingCount} />
                    <div className="professional-meta">
                      <ModalityLine modalities={person.modalities} />
                    </div>
                    <div className="professional-price">
                      <div>
                        <strong>{formatPrice(person.priceCents)}</strong>
                        <span> / consulta</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="unlock-card">
              <span className="round-icon">
                <LockKeyhole size={24} />
              </span>
              <div>
                <h2>{remaining > 0 ? `+ ${remaining} profissionais encontrados` : "Seu próximo passo está aqui."}</h2>
                <p>Crie sua conta gratuitamente para ver todos os resultados, abrir perfis completos e agendar.</p>
              </div>
              <div className="unlock-action">
                <ButtonLink href="/cadastro">
                  Ver meus resultados <ArrowRight size={18} />
                </ButtonLink>
                <span>Cadastro gratuito</span>
              </div>
            </div>
          </>
        )}
        <p className="center microcopy">
          A compatibilidade considera suas preferências e não representa avaliação psicológica.
        </p>
      </div>
    </FlowShell>
  );
}
