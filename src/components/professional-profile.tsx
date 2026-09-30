"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  Languages,
  MessageCircle,
  Play,
  Sparkles,
  Sprout,
  Star,
  UserRound,
} from "lucide-react";
import type { ProfessionalProfileData } from "@/lib/api-types";
import { formatPrice, formatRating, formatRelativeDays, formatShortDate, formatTime } from "@/lib/format";
import { useProfessionalReviews, useSlots } from "@/lib/queries";
import { Avatar, CompatibilityTag, FavoriteButton, ModalityLine, RatingLine } from "./professional-card";
import { LoadingBlock } from "./query-state";
import { Alert, BackLink, Badge, ButtonLink, Stars } from "./ui";
import styles from "./professional-profile.module.css";

const CATEGORY_LABELS = {
  welcoming: "Acolhimento",
  communication: "Comunicação",
  punctuality: "Pontualidade",
  organization: "Organização",
  experience: "Experiência geral",
} as const;

function VideoPresentation({ externalId, name }: { externalId: string; name: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <div className={styles.video}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(externalId)}?autoplay=1&rel=0`}
          title={`Vídeo de apresentação de ${name}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button type="button" className={styles.videoFacade} onClick={() => setPlaying(true)}>
      <span className={styles.playIcon}>
        <Play size={26} fill="currentColor" />
      </span>
      <span>
        <strong>Assistir apresentação</strong>
        <small>Conheça {name.split(" ")[0]} em até 1 minuto</small>
      </span>
    </button>
  );
}

export function ProfessionalProfile({ person }: { person: ProfessionalProfileData }) {
  const slots = useSlots(person.slug);
  const reviews = useProfessionalReviews(person.slug);
  const nextSlots = (slots.data?.slots ?? []).slice(0, 6);
  const bookHref = `/profissionais/${person.slug}/agendar`;

  return (
    <div className={`${styles.page} ${person.bookable ? styles.withCta : ""}`}>
      <BackLink href="/profissionais" label="Voltar para profissionais" />

      <header className={styles.hero}>
        <div className={styles.heroAccent} aria-hidden="true">
          <Sprout size={100} strokeWidth={1} />
        </div>
        <div className={styles.identity}>
          <Avatar person={person} large />
          <div className={styles.identityText}>
            <CompatibilityTag value={person.compatibility} />
            <h1>{person.name}</h1>
            <p>
              {person.profession}
              {person.approach ? ` · ${person.approach}` : ""}
            </p>
            {person.verified && (
              <span className={styles.registration}>
                <BadgeCheck size={15} /> CRP {person.registrationNumber} verificado
              </span>
            )}
          </div>
          <div className={styles.favorite}>
            <FavoriteButton id={person.id} name={person.name} favorite={person.favorite} />
          </div>
        </div>
        <div className={styles.highlights}>
          <Link href="#avaliacoes">
            <RatingLine average={person.ratingAverage} count={person.ratingCount} />
          </Link>
          <ModalityLine modalities={person.modalities} />
          <span>
            <Clock3 size={17} />
            Consultas de {person.durationMin} minutos
          </span>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.details}>
          {person.video && (
            <section className={styles.panel} aria-label="Vídeo de apresentação">
              <VideoPresentation externalId={person.video.externalId} name={person.name} />
            </section>
          )}

          <section className={styles.panel} id="sobre" aria-labelledby="sobre-title">
            <div className={styles.sectionHeading}>
              <MessageCircle size={21} />
              <h2 id="sobre-title">Sobre mim</h2>
            </div>
            <p className={styles.bio}>{person.bio}</p>
            <div className={styles.divider} />
            <h2 className={styles.subheading}>Especialidades</h2>
            <div className="chips">
              {person.specialties.map((item) => (
                <Badge key={item.slug}>{item.name}</Badge>
              ))}
            </div>
            {person.approach && (
              <>
                <div className={styles.divider} />
                <h2 className={styles.subheading}>Abordagem</h2>
                <h3 className={styles.approachName}>{person.approach}</h3>
              </>
            )}
            <div className={styles.gentleNote}>
              <Sprout size={22} />
              <p>Não é preciso ter todas as respostas para começar uma conversa.</p>
            </div>
          </section>

          <section className={styles.panel} id="formacao" aria-labelledby="formacao-title">
            <div className={styles.sectionHeading}>
              <GraduationCap size={22} />
              <h2 id="formacao-title">Formação e experiência</h2>
            </div>
            <div className={styles.credentials}>
              <div>
                <span className={styles.smallIcon}>
                  <GraduationCap size={20} />
                </span>
                <div>
                  <h3>Formação</h3>
                  <p>{person.education || "Não informada."}</p>
                </div>
              </div>
              <div>
                <span className={styles.smallIcon}>
                  <BookOpen size={20} />
                </span>
                <div>
                  <h3>Experiência</h3>
                  <p>{person.experience || "Não informada."}</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.panel} id="avaliacoes" aria-labelledby="avaliacoes-title">
            <div className={styles.sectionHeading}>
              <Star size={21} />
              <h2 id="avaliacoes-title">Avaliações</h2>
            </div>
            {person.ratingCount === 0 ? (
              <p>
                <Sparkles size={15} /> {person.name.split(" ")[0]} chegou recentemente à Luvimind e ainda não recebeu avaliações.
              </p>
            ) : (
              <>
                <div className={styles.reviewSummary}>
                  <div className={styles.score}>
                    <strong>{formatRating(person.ratingAverage)}</strong>
                    <Star size={23} fill="currentColor" />
                  </div>
                  <div>
                    <strong>
                      {person.ratingCount} {person.ratingCount === 1 ? "avaliação" : "avaliações"}
                    </strong>
                    <p>De pacientes que se consultaram pela Luvimind.</p>
                  </div>
                </div>
                {person.ratingCategories && (
                  <dl className={styles.categoryList}>
                    {(Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]).map((key) => (
                      <div key={key}>
                        <dt>{CATEGORY_LABELS[key]}</dt>
                        <dd>{formatRating(person.ratingCategories?.[key] ?? null)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {reviews.data && reviews.data.length > 0 && (
                  <ul className={styles.reviewList}>
                    {reviews.data.map((r) => (
                      <li key={r.id}>
                        <Stars value={r.overall} />
                        <p>“{r.comment}”</p>
                        <small>{formatShortDate(r.createdAt)}</small>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </section>
        </div>

        <aside className={styles.aside} aria-label="Atendimento e disponibilidade">
          <section className={`${styles.panel} ${styles.booking}`} id="atendimento" aria-labelledby="atendimento-title">
            <p className="eyebrow">SEU PRÓXIMO PASSO</p>
            <h2 id="atendimento-title">Informações da consulta</h2>
            <div className={styles.price}>
              <strong>{formatPrice(person.priceCents)}</strong>
              <span>por consulta de {person.durationMin} min</span>
            </div>
            <dl className={styles.facts}>
              <div>
                <dt>
                  <UserRound size={19} />
                  Modalidade
                </dt>
                <dd>
                  <ModalityLine modalities={person.modalities} />
                  {person.city && person.modalities.includes("IN_PERSON") ? ` · ${person.city}` : ""}
                </dd>
              </div>
              <div>
                <dt>
                  <Languages size={19} />
                  Idiomas
                </dt>
                <dd>{person.languages.join(", ")}</dd>
              </div>
            </dl>
            {person.bookable ? (
              <ButtonLink href={bookHref} className="full-width">
                Agendar consulta <ArrowRight size={17} />
              </ButtonLink>
            ) : (
              <Alert tone="warning">Este profissional não está recebendo novos agendamentos no momento.</Alert>
            )}
          </section>

          {person.offersIntroCall && person.bookable && (
            <section className={styles.panel} aria-labelledby="intro-title">
              <div className={styles.sectionHeading}>
                <MessageCircle size={21} />
                <h2 id="intro-title">Conheça antes de agendar</h2>
              </div>
              <p>
                {person.name.split(" ")[0]} oferece uma conversa inicial gratuita de 15 minutos para vocês se conhecerem
                e tirarem dúvidas. Não é uma sessão terapêutica.
              </p>
              <ButtonLink href={`${bookHref}?tipo=conversa-inicial`} variant="secondary" className="full-width">
                Agendar conversa inicial
              </ButtonLink>
            </section>
          )}

          <section className={`${styles.panel} ${styles.availability}`} id="disponibilidade" aria-labelledby="disponibilidade-title">
            <div className={styles.sectionHeading}>
              <CalendarDays size={21} />
              <h2 id="disponibilidade-title">Próximos horários</h2>
            </div>
            {slots.isPending ? (
              <LoadingBlock lines={2} />
            ) : nextSlots.length === 0 ? (
              <p>Nenhum horário disponível nas próximas semanas.</p>
            ) : (
              <ul className={styles.slotList}>
                {nextSlots.map((s) => (
                  <li key={s.startsAt}>
                    <Link href={`${bookHref}?horario=${encodeURIComponent(s.startsAt)}`}>
                      <span>{formatRelativeDays(s.startsAt)}</span>
                      <strong>{formatTime(s.startsAt)}</strong>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className={styles.disclaimer}>Horários no fuso de Brasília.</p>
          </section>
        </aside>
      </div>

      {person.bookable && (
        <div className={styles.mobileCta}>
          <div>
            <strong>{formatPrice(person.priceCents)}</strong>
            <span>Consulta de {person.durationMin} min</span>
          </div>
          <ButtonLink href={bookHref}>
            Agendar <ArrowRight size={17} />
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
