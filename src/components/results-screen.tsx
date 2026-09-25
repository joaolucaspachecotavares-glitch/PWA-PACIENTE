"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Heart,
  ArrowRight,
  X,
} from "lucide-react";
import { useJourney } from "./providers";
import {
  Badge,
  Button,
  ButtonLink,
  Dialog,
  EmptyState,
  SectionTitle,
} from "./ui";
import { ProfessionalCard } from "./professional-card";
import { professionals } from "@/lib/professionals";
import { rankProfessionals, preferenceSummary } from "@/lib/domain";

export function ResultsScreen({ discovery = false }: { discovery?: boolean }) {
  const { answers, favorites } = useJourney();
  const [query, setQuery] = useState("");
  const [onlySaved, setOnlySaved] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(250);
  const [mode, setMode] = useState("Todos");
  const [draftPrice, setDraftPrice] = useState(250);
  const [draftMode, setDraftMode] = useState("Todos");
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const ranked = rankProfessionals(professionals, answers);
  const shown = ranked.filter(
    (p) =>
      (!onlySaved || favorites.includes(p.id)) &&
      p.price <= maxPrice &&
      (mode === "Todos" || p.mode.startsWith(mode)) &&
      normalize([p.name, ...p.specialties, p.approach].join(" ")).includes(
        normalize(query),
      ),
  );
  const topIds = new Set(ranked.slice(0, 5).map((p) => p.id));
  const top = shown.filter((p) => topIds.has(p.id));
  const others = shown.filter((p) => !topIds.has(p.id));
  const hasFilters = maxPrice < 250 || mode !== "Todos";
  const summary = preferenceSummary(answers);
  return (
    <>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">UM ENCONTRO QUE FAZ SENTIDO</p>
          <h1>
            {discovery
              ? "Encontre seu próximo apoio."
              : "Seus encontros começam aqui."}
          </h1>
          <p>
            Conheça profissionais e escolha com quem você se sente à vontade.
          </p>
        </div>
        {!discovery && (
          <ButtonLink href="/dashboard" variant="secondary">
            Meu início <ArrowRight size={16} />
          </ButtonLink>
        )}
      </div>
      {!discovery && (
        <div className="results-banner">
          <span className="round-icon">
            <Sparkles size={24} />
          </span>
          <div>
            <h2>O cuidado certo respeita quem você é.</h2>
            <p>
              {summary.length
                ? "Estas são as preferências que guiaram a sua prévia."
                : "Explore os perfis ou responda ao questionário para personalizar a ordem."}
            </p>
            <div className="chips">
              {summary.map((s) => (
                <Badge key={s} neutral>
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          <Link href="/questionario/1" className="text-link">
            Rever preferências <ArrowRight size={15} />
          </Link>
        </div>
      )}
      <div className="results-toolbar">
        <label className="search-field">
          <Search size={19} />
          <span className="sr-only">Buscar profissional ou especialidade</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou especialidade"
          />
          {query && (
            <button
              className="icon-button"
              aria-label="Limpar busca"
              onClick={() => setQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </label>
        <Button
          variant="secondary"
          onClick={() => {
            setDraftPrice(maxPrice);
            setDraftMode(mode);
            setFiltersOpen(true);
          }}
        >
          <SlidersHorizontal size={18} />
          Filtros{hasFilters && <span className="filter-dot" />}
        </Button>
        <button
          className={`button favorites-filter ${onlySaved ? "selected-filter" : "button-secondary"}`}
          aria-pressed={onlySaved}
          onClick={() => setOnlySaved((p) => !p)}
        >
          <Heart size={18} />
          Favoritos <span>{favorites.length}</span>
        </button>
      </div>
      <div className="results-count" aria-live="polite">
        <span>
          {shown.length}{" "}
          {shown.length === 1
            ? "profissional encontrado"
            : "profissionais encontrados"}
          <span className="muted"> · Perfis ilustrativos</span>
        </span>
        {hasFilters && (
          <button
            className="text-link"
            onClick={() => {
              setMaxPrice(250);
              setMode("Todos");
            }}
          >
            Limpar filtros <X size={14} />
          </button>
        )}
      </div>
      {!shown.length ? (
        <EmptyState
          title={
            onlySaved && !favorites.length
              ? "Seus favoritos começam aqui."
              : "Vamos tentar de outro jeito?"
          }
          description={
            onlySaved && !favorites.length
              ? "Toque no coração de um profissional para guardar esse encontro."
              : "Não encontramos perfis com esses critérios. Altere a busca ou os filtros."
          }
        />
      ) : (
        <>
          <SectionTitle
            title={
              onlySaved
                ? "Profissionais que você salvou"
                : "Mais indicados para você"
            }
          >
            <span className="section-caption">
              <Sparkles size={14} /> Preferências em primeiro lugar
            </span>
          </SectionTitle>
          <div className="professional-grid">
            {top.map((p) => (
              <ProfessionalCard key={p.id} person={p} recommended />
            ))}
          </div>
          {others.length > 0 && (
            <>
              <SectionTitle
                title={
                  onlySaved
                    ? "Outros favoritos"
                    : "Outros profissionais para conhecer"
                }
              />
              <div className="professional-grid">
                {others.map((p) => (
                  <ProfessionalCard key={p.id} person={p} />
                ))}
              </div>
            </>
          )}
        </>
      )}
      <div className="results-footnote">
        <Sparkles size={17} />
        <p>
          Um bom encontro vai além de uma recomendação. Explore os perfis e
          escolha no seu tempo.
          <br />
          <span>
            Esta prévia usa dados fictícios e uma ordenação ilustrativa, sem
            avaliação clínica.
          </span>
        </p>
      </div>
      <Dialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Do seu jeito"
      >
        <div className="filter-form">
          <label htmlFor="price">
            Valor por consulta <strong>Até R$ {draftPrice}</strong>
          </label>
          <input
            id="price"
            type="range"
            min="130"
            max="250"
            step="10"
            value={draftPrice}
            onChange={(e) => setDraftPrice(Number(e.target.value))}
          />
          <div className="range-labels">
            <span>R$ 130</span>
            <span>R$ 250</span>
          </div>
          <label htmlFor="mode">Modalidade</label>
          <select
            id="mode"
            value={draftMode}
            onChange={(e) => setDraftMode(e.target.value)}
          >
            <option>Todos</option>
            <option>Online</option>
            <option>Presencial</option>
          </select>
          <Button
            className="full-width"
            onClick={() => {
              setMaxPrice(draftPrice);
              setMode(draftMode);
              setFiltersOpen(false);
            }}
          >
            Aplicar filtros <ArrowRight size={17} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setDraftPrice(250);
              setDraftMode("Todos");
            }}
          >
            Restaurar filtros
          </Button>
        </div>
      </Dialog>
    </>
  );
}
