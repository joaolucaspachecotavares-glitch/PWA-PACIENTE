"use client";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarCheck, Compass, Heart, Sparkles, Sprout } from "lucide-react";
import { AppointmentCard } from "@/components/appointment-card";
import { Avatar, ProfessionalCard } from "@/components/professional-card";
import { LoadingBlock, LoadingCards } from "@/components/query-state";
import { ButtonLink, SectionTitle } from "@/components/ui";
import { useAppointments, useFavorites, useJourneyData, useMe, useResults } from "@/lib/queries";

export default function HomePage() {
  const me = useMe();
  const upcoming = useAppointments("upcoming");
  const journey = useJourneyData();
  const results = useResults();
  const favorites = useFavorites();
  const next = upcoming.data?.find((a) => a.status === "CONFIRMED") ?? upcoming.data?.[0];
  const recommended = results.data && !results.data.needsQuestionnaire ? results.data.top.slice(0, 3) : [];
  const favoriteIds = new Set((favorites.data ?? []).map((f) => f.id));

  return (
    <>
      <div className="dashboard-greeting">
        <div>
          <p className="eyebrow">QUE BOM TER VOCÊ POR AQUI</p>
          <h1>
            Olá, {me.data?.firstName}
            <span className="greeting-dot">.</span>
          </h1>
          <p>Como você está hoje? Seu espaço de cuidado está aqui.</p>
        </div>
        <span className="dashboard-date">
          <Sprout size={19} /> Um passo de cada vez
        </span>
      </div>

      <section className="dashboard-top-grid">
        {upcoming.isPending ? (
          <LoadingBlock lines={4} />
        ) : next ? (
          <AppointmentCard appointment={next} highlight />
        ) : (
          <article className="appointment-card appointment-empty">
            <span className="eyebrow">PRÓXIMA CONSULTA</span>
            <h3>Nenhuma consulta agendada.</h3>
            <p>Quando você agendar, os detalhes aparecem aqui.</p>
            <ButtonLink href={recommended.length ? "/resultados" : "/profissionais"} variant="secondary">
              Encontrar um horário <ArrowRight size={16} />
            </ButtonLink>
          </article>
        )}
        <article className="journey-card">
          <div>
            <span className="eyebrow">SUA JORNADA</span>
            <Sprout size={23} />
          </div>
          <h2>
            Pequenos passos.
            <br />
            <span>Novos caminhos.</span>
          </h2>
          <div className="journey-stats">
            <div>
              <strong>{String(journey.data?.attended ?? 0).padStart(2, "0")}</strong>
              <span>consultas realizadas</span>
            </div>
            <div>
              <strong>{String(journey.data?.consecutive ?? 0).padStart(2, "0")}</strong>
              <span>consultas consecutivas</span>
            </div>
          </div>
          <Link href="/jornada" className="text-link">
            Ver minha jornada <ArrowRight size={17} />
          </Link>
        </article>
      </section>

      <section>
        <SectionTitle eyebrow="POSSIBILIDADES PARA O SEU CUIDADO" title="Profissionais que podem combinar com você">
          <Link className="text-link" href="/resultados">
            Ver todos <ArrowRight size={16} />
          </Link>
        </SectionTitle>
        {results.isPending ? (
          <LoadingCards />
        ) : recommended.length ? (
          <div className="professional-grid dashboard-professionals">
            {recommended.map((p) => (
              <ProfessionalCard key={p.id} person={{ ...p, favorite: favoriteIds.has(p.id) }} highlight />
            ))}
          </div>
        ) : (
          <div className="next-steps-panel">
            <Link className="next-step" href="/questionario">
              <span className="round-icon small">
                <Compass size={20} />
              </span>
              <div>
                <strong>Responder o questionário</strong>
                <span>Assim mostramos os profissionais mais compatíveis com você.</span>
              </div>
              <ArrowRight size={19} />
            </Link>
          </div>
        )}
      </section>

      <div className="dashboard-bottom-grid">
        <section className="favorites-panel">
          <SectionTitle title="Seus favoritos">
            <Heart size={19} />
          </SectionTitle>
          {favorites.data?.length ? (
            <div className="saved-list">
              {favorites.data.slice(0, 3).map((person) => (
                <Link href={`/profissionais/${person.slug}`} key={person.id}>
                  <Avatar person={person} />
                  <div>
                    <strong>{person.name}</strong>
                    <span>{person.profession}</span>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="favorites-empty">
              <span className="round-icon small">
                <Heart size={21} />
              </span>
              <p>
                Alguns encontros merecem
                <br />
                ser guardados.
              </p>
              <ButtonLink href="/profissionais" variant="ghost">
                Encontrar profissionais <ArrowRight size={16} />
              </ButtonLink>
            </div>
          )}
        </section>
        <section className="next-steps-panel">
          <SectionTitle title="Próximos passos" />
          <Link className="next-step" href="/perfil/preferencias">
            <span className="round-icon small">
              <Compass size={20} />
            </span>
            <div>
              <strong>Refazer preferências</strong>
              <span>Você muda. Seu cuidado pode mudar também.</span>
            </div>
            <ArrowRight size={19} />
          </Link>
          <Link className="next-step" href="/profissionais">
            <span className="round-icon small">
              <CalendarCheck size={20} />
            </span>
            <div>
              <strong>Encontrar outro profissional</strong>
              <span>Explore perfis verificados.</span>
            </div>
            <ArrowRight size={19} />
          </Link>
          <div className="gentle-reminder">
            <Sparkles size={18} /> Seu tempo também faz parte do cuidado.
          </div>
        </section>
      </div>
    </>
  );
}
