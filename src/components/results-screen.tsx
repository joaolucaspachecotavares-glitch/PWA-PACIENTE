"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ProfessionalCardData } from "@/lib/api-types";
import { useFavorites, useResults } from "@/lib/queries";
import { ProfessionalCard } from "./professional-card";
import { ErrorBlock, LoadingCards } from "./query-state";
import { Alert, Badge, EmptyState, SectionTitle } from "./ui";

export function ResultsScreen() {
  const results = useResults();
  const favorites = useFavorites();
  const favoriteIds = new Set((favorites.data ?? []).map((f) => f.id));
  const withFavorite = (p: ProfessionalCardData) => ({ ...p, favorite: favoriteIds.has(p.id) });

  return (
    <>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">UM ENCONTRO QUE FAZ SENTIDO</p>
          <h1>Seus resultados</h1>
          <p>Conheça os profissionais e escolha com quem você se sente à vontade.</p>
        </div>
      </div>
      {results.isPending ? (
        <LoadingCards />
      ) : results.isError ? (
        <ErrorBlock error={results.error} onRetry={() => void results.refetch()} />
      ) : results.data.needsQuestionnaire ? (
        <EmptyState
          title="Conte um pouco sobre suas preferências."
          description="Responda o questionário para vermos quais profissionais combinam com você."
          href="/questionario"
          action="Responder questionário"
        />
      ) : (
        <>
          {results.data.urgentSupport && (
            <Alert tone="info" title="Você não está sozinho.">
              Se precisar de apoio agora, o CVV atende gratuitamente pelo <a href="tel:188">188</a>, 24 horas.{" "}
              <Link href="/apoio?continuar=/resultados">Ver opções de apoio</Link>
            </Alert>
          )}
          <div className="results-banner">
            <span className="round-icon">
              <Sparkles size={24} />
            </span>
            <div>
              <h2>
                Encontramos {results.data.top.length + results.data.others.length}{" "}
                {results.data.top.length + results.data.others.length === 1 ? "profissional" : "profissionais"} para você.
              </h2>
              <p>Estas são as preferências que guiaram seus resultados.</p>
              <div className="chips">
                {results.data.preferences.map((s) => (
                  <Badge key={s} tone="neutral">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <Link href="/perfil/preferencias" className="text-link">
              Atualizar preferências <ArrowRight size={15} />
            </Link>
          </div>
          {results.data.top.length === 0 ? (
            <EmptyState
              title="Ainda não há profissionais compatíveis disponíveis."
              description="Novos profissionais chegam com frequência. Explore todos os perfis ou ajuste suas preferências."
              href="/profissionais"
              action="Explorar profissionais"
            />
          ) : (
            <>
              <SectionTitle title="Mais indicados para você">
                <span className="section-caption">
                  <Sparkles size={14} /> Ordenados pela compatibilidade com suas preferências
                </span>
              </SectionTitle>
              <div className="professional-grid">
                {results.data.top.map((p) => (
                  <ProfessionalCard key={p.id} person={withFavorite(p)} highlight />
                ))}
              </div>
              {results.data.others.length > 0 && (
                <>
                  <SectionTitle title="Outros profissionais disponíveis" />
                  <div className="professional-grid">
                    {results.data.others.map((p) => (
                      <ProfessionalCard key={p.id} person={withFavorite(p)} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          <div className="results-footnote">
            <Sparkles size={17} />
            <p>
              Nenhum profissional pode pagar para aparecer primeiro. A ordem reflete compatibilidade e qualidade.
              <br />
              <span>A compatibilidade considera suas preferências e não representa avaliação psicológica.</span>
            </p>
          </div>
        </>
      )}
    </>
  );
}
