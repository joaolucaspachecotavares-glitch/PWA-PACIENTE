"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { ProfessionalCard } from "@/components/professional-card";
import { ErrorBlock, LoadingCards } from "@/components/query-state";
import { Button, Dialog, EmptyState } from "@/components/ui";
import { useFavorites, useProfessionals, useSpecialties } from "@/lib/queries";

type Filters = {
  specialty: string;
  modality: string;
  maxPrice: string;
  availability: string;
  period: string;
  language: string;
  sort: string;
};
const EMPTY: Filters = { specialty: "", modality: "", maxPrice: "", availability: "", period: "", language: "", sort: "relevance" };

function useDebounced(value: string, ms = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export default function ProfessionalsPage() {
  const [tab, setTab] = useState<"all" | "favorites">("all");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [draft, setDraft] = useState<Filters>(EMPTY);
  const [open, setOpen] = useState(false);
  const q = useDebounced(query.trim());
  const list = useProfessionals({ ...filters, q });
  const favorites = useFavorites();
  const specialties = useSpecialties();
  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== "sort").length;
  const favoriteIds = new Set((favorites.data ?? []).map((f) => f.id));

  return (
    <>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">PROFISSIONAIS VERIFICADOS</p>
          <h1>Encontre seu próximo apoio.</h1>
          <p>Todos os profissionais têm registro conferido pela Luvimind.</p>
        </div>
        <Link href="/resultados" className="button button-secondary">
          <Sparkles size={16} /> Meus resultados
        </Link>
      </div>

      <div className="tabs" role="tablist" aria-label="Profissionais">
        <button role="tab" aria-selected={tab === "all"} className={tab === "all" ? "tab-active" : ""} onClick={() => setTab("all")}>
          Todos
        </button>
        <button
          role="tab"
          aria-selected={tab === "favorites"}
          className={tab === "favorites" ? "tab-active" : ""}
          onClick={() => setTab("favorites")}
        >
          <Heart size={15} /> Favoritos {favorites.data ? `(${favorites.data.length})` : ""}
        </button>
      </div>

      {tab === "favorites" ? (
        favorites.isPending ? (
          <LoadingCards count={2} />
        ) : favorites.isError ? (
          <ErrorBlock error={favorites.error} onRetry={() => void favorites.refetch()} />
        ) : favorites.data.length === 0 ? (
          <EmptyState
            icon={<Heart size={28} />}
            title="Seus favoritos começam aqui."
            description="Toque no coração de um profissional para guardar e comparar depois."
          />
        ) : (
          <div className="professional-grid">
            {favorites.data.map((p) => (
              <ProfessionalCard key={p.id} person={p} />
            ))}
          </div>
        )
      ) : (
        <>
          <div className="results-toolbar">
            <label className="search-field">
              <Search size={19} />
              <span className="sr-only">Buscar por nome, especialidade ou abordagem</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome ou especialidade" />
              {query && (
                <button className="icon-button" aria-label="Limpar busca" onClick={() => setQuery("")}>
                  <X size={16} />
                </button>
              )}
            </label>
            <Button
              variant="secondary"
              onClick={() => {
                setDraft(filters);
                setOpen(true);
              }}
            >
              <SlidersHorizontal size={18} />
              Filtros{activeFilters > 0 && <span className="filter-count">{activeFilters}</span>}
            </Button>
          </div>
          <div className="results-count" aria-live="polite">
            <span>
              {list.data
                ? `${list.data.length} ${list.data.length === 1 ? "profissional encontrado" : "profissionais encontrados"}`
                : "Buscando…"}
            </span>
            {activeFilters > 0 && (
              <button className="text-link" onClick={() => setFilters(EMPTY)}>
                Limpar filtros <X size={14} />
              </button>
            )}
          </div>
          {list.isPending ? (
            <LoadingCards />
          ) : list.isError ? (
            <ErrorBlock error={list.error} onRetry={() => void list.refetch()} />
          ) : list.data.length === 0 ? (
            <EmptyState
              title="Nenhum profissional encontrado."
              description="Tente outra busca ou remova alguns filtros."
            />
          ) : (
            <div className="professional-grid">
              {list.data.map((p) => (
                <ProfessionalCard key={p.id} person={{ ...p, favorite: favoriteIds.has(p.id) }} />
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title="Filtrar profissionais">
        <form
          className="filter-form"
          onSubmit={(e) => {
            e.preventDefault();
            setFilters(draft);
            setOpen(false);
          }}
        >
          <label htmlFor="maxPrice">Valor máximo por consulta</label>
          <select id="maxPrice" value={draft.maxPrice} onChange={(e) => setDraft({ ...draft, maxPrice: e.target.value })}>
            <option value="">Qualquer valor</option>
            <option value="15000">Até R$ 150</option>
            <option value="20000">Até R$ 200</option>
            <option value="25000">Até R$ 250</option>
            <option value="35000">Até R$ 350</option>
          </select>
          <label htmlFor="specialty">Especialidade</label>
          <select id="specialty" value={draft.specialty} onChange={(e) => setDraft({ ...draft, specialty: e.target.value })}>
            <option value="">Todas</option>
            {specialties.data?.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
          <label htmlFor="modality">Atendimento</label>
          <select id="modality" value={draft.modality} onChange={(e) => setDraft({ ...draft, modality: e.target.value })}>
            <option value="">Online ou presencial</option>
            <option value="ONLINE">Online</option>
            <option value="IN_PERSON">Presencial</option>
          </select>
          <label htmlFor="availability">Disponibilidade</label>
          <select id="availability" value={draft.availability} onChange={(e) => setDraft({ ...draft, availability: e.target.value })}>
            <option value="">Qualquer data</option>
            <option value="today">Hoje</option>
            <option value="tomorrow">Amanhã</option>
            <option value="week">Esta semana</option>
          </select>
          <label htmlFor="period">Horário</label>
          <select id="period" value={draft.period} onChange={(e) => setDraft({ ...draft, period: e.target.value })}>
            <option value="">Qualquer horário</option>
            <option value="morning">Manhã</option>
            <option value="afternoon">Tarde</option>
            <option value="evening">Noite</option>
          </select>
          <label htmlFor="language">Idioma</label>
          <select id="language" value={draft.language} onChange={(e) => setDraft({ ...draft, language: e.target.value })}>
            <option value="">Qualquer idioma</option>
            <option value="Português">Português</option>
            <option value="Inglês">Inglês</option>
            <option value="Espanhol">Espanhol</option>
          </select>
          <label htmlFor="sort">Ordenar por</label>
          <select id="sort" value={draft.sort} onChange={(e) => setDraft({ ...draft, sort: e.target.value })}>
            <option value="relevance">Mais compatíveis</option>
            <option value="rating">Melhor avaliados</option>
            <option value="availability">Horário mais próximo</option>
            <option value="price">Menor valor</option>
          </select>
          <Button type="submit" className="full-width">
            Aplicar filtros
          </Button>
          <Button type="button" variant="ghost" onClick={() => setDraft(EMPTY)}>
            Limpar
          </Button>
        </form>
      </Dialog>
    </>
  );
}
