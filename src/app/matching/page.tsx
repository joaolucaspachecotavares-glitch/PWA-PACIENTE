"use client";
import { useEffect, useState } from "react";
import { Check, Sparkles, ArrowRight, LockKeyhole, Leaf } from "lucide-react";
import { FlowShell } from "@/components/flow-shell";
import { BackLink, Badge, ButtonLink } from "@/components/ui";
import { ProfessionalCard } from "@/components/professional-card";
import { useJourney } from "@/components/providers";
import { professionals } from "@/lib/professionals";
import { preferenceSummary, rankProfessionals } from "@/lib/domain";

export default function MatchingPage() {
  const { answers } = useJourney();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);
  const ranked = rankProfessionals(professionals, answers);
  const summary = preferenceSummary(answers);
  return (
    <FlowShell stage={1}>
      {loading ? (
        <div className="matching-loading" role="status" aria-live="polite">
          <span className="matching-orbit">
            <Leaf size={40} />
          </span>
          <p className="eyebrow">PREPARANDO SEU ENCONTRO</p>
          <h1>
            Um cuidado com
            <br />
            <span>mais a sua cara.</span>
          </h1>
          <p>Organizando possibilidades a partir das suas preferências.</p>
          <div className="loading-checks">
            <span>
              <Check size={17} /> Entendendo suas preferências
            </span>
            <span>
              <Check size={17} /> Organizando os perfis de exemplo
            </span>
          </div>
          <span className="loading-dots">
            <i />
            <i />
            <i />
          </span>
        </div>
      ) : (
        <div className="container preview-page">
          <BackLink href="/questionario/10" label="Rever respostas" />
          <div className="centered-title">
            <Badge>
              <Sparkles size={14} /> SEU PRÓXIMO ENCONTRO
            </Badge>
            <h1>
              Existe um apoio
              <br />
              <span>que combina com você.</span>
            </h1>
            <p>
              Conheça uma prévia dos{" "}
              <strong>{professionals.length} profissionais de exemplo</strong>
              <br className="desktop-only" /> que preparamos para a sua jornada.
            </p>
          </div>
          <div className="preference-strip">
            <span>Suas preferências</span>
            <div className="chips">
              {summary.length ? (
                summary.map((s) => (
                  <span className="chip chip-white" key={s}>
                    {s}
                  </span>
                ))
              ) : (
                <span>
                  Responda ao questionário para personalizar esta prévia.
                </span>
              )}
            </div>
          </div>
          <div className="preview-card-grid">
            {ranked.slice(0, 2).map((person) => (
              <ProfessionalCard
                key={person.id}
                person={person}
                preview
                recommended
              />
            ))}
          </div>
          <div className="unlock-card">
            <span className="round-icon">
              <LockKeyhole size={24} />
            </span>
            <div>
              <h2>Seu próximo passo está aqui.</h2>
              <p>
                Crie seu espaço para explorar todos os resultados
                <br className="desktop-only" /> e salvar seus profissionais
                favoritos.
              </p>
            </div>
            <div className="unlock-action">
              <ButtonLink href="/cadastro">
                Ver meus resultados <ArrowRight size={18} />
              </ButtonLink>
              <span>
                Cadastro gratuito · +{professionals.length - 2} perfis para
                conhecer
              </span>
            </div>
          </div>
          <p className="center microcopy">
            A compatibilidade considera preferências, não representa avaliação
            psicológica.
          </p>
        </div>
      )}
    </FlowShell>
  );
}
