"use client";
import Link from "next/link";
import {
  ArrowRight,
  Sprout,
  Heart,
  Sparkles,
  Compass,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react";
import { useJourney } from "@/components/providers";
import { ButtonLink, SectionTitle } from "@/components/ui";
import { AppointmentCard } from "@/components/appointment-card";
import { ProfessionalCard, Avatar } from "@/components/professional-card";
import { professionals, professionalProfileHref } from "@/lib/professionals";
import { rankProfessionals } from "@/lib/domain";

export default function DashboardPage() {
  const { name, answers, favorites } = useJourney();
  const recommended = rankProfessionals(professionals, answers).slice(0, 3);
  const saved = professionals.filter((p) => favorites.includes(p.id));
  return (
    <>
      <div className="dashboard-greeting">
        <div>
          <p className="eyebrow">QUE BOM TER VOCÊ POR AQUI</p>
          <h1>
            Olá, {name || "que bom te ver"}
            <span className="greeting-dot">.</span>
          </h1>
          <p>Como você está hoje? Seu espaço de cuidado está aqui.</p>
        </div>
        <span className="dashboard-date">
          <Sprout size={19} /> Um passo de cada vez
        </span>
      </div>
      <section className="dashboard-top-grid">
        <AppointmentCard />
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
              <strong>04</strong>
              <span>consultas realizadas</span>
            </div>
            <div>
              <strong>03</strong>
              <span>encontros consecutivos</span>
            </div>
          </div>
          <Link href="/jornada" className="text-link">
            Ver minha jornada <ArrowRight size={17} />
          </Link>
          <span className="microcopy">Histórico ilustrativo</span>
        </article>
      </section>
      <section>
        <SectionTitle eyebrow="POSSIBILIDADES PARA O SEU CUIDADO" title="Profissionais para você">
          <Link className="text-link" href="/profissionais">
            Ver todos <ArrowRight size={16} />
          </Link>
        </SectionTitle>
        <div className="professional-grid dashboard-professionals">
          {recommended.map((person) => (
            <ProfessionalCard key={person.id} person={person} />
          ))}
        </div>
      </section>
      <div className="dashboard-bottom-grid">
        <section className="favorites-panel">
          <SectionTitle title="Seus favoritos">
            <Heart size={19} />
          </SectionTitle>
          {saved.length ? (
            <div className="saved-list">
              {saved.slice(0, 3).map((person) => (
                <Link href={professionalProfileHref(person.id)} key={person.id}>
                  <Avatar person={person} />
                  <div>
                    <strong>{person.name}</strong>
                    <span>
                      {person.role} · {person.mode === "Online" ? "Online" : "Presencial"}
                    </span>
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
          <SectionTitle title="Seu próximo passo" />
          <Link className="next-step" href="/questionario">
            <span className="round-icon small">
              <Compass size={20} />
            </span>
            <div>
              <strong>Revisitar suas preferências</strong>
              <span>Você muda. Seu cuidado pode mudar também.</span>
            </div>
            <ArrowRight size={19} />
          </Link>
          <Link className="next-step" href="/profissionais">
            <span className="round-icon small">
              <CalendarCheck size={20} />
            </span>
            <div>
              <strong>Conhecer um novo profissional</strong>
              <span>Encontre um espaço de escuta para você.</span>
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
