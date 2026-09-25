"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  Heart,
  Languages,
  MapPin,
  MessageCircle,
  Sprout,
  Star,
  UserRound,
  Video,
} from "lucide-react";
import type { Professional } from "@/lib/types";
import { approachDescriptions } from "@/lib/professional-details";
import { useJourney } from "./providers";
import { Avatar } from "./professional-card";
import { BackLink, Badge, Button, ButtonLink } from "./ui";
import styles from "./professional-profile.module.css";

export function ProfessionalProfile({ person }: { person: Professional }) {
  const { favorites, toggleFavorite } = useJourney();
  const saved = favorites.includes(person.id);
  const online = person.mode === "Online";
  const ModeIcon = online ? Video : MapPin;

  return (
    <div className={styles.page}>
      <BackLink href="/profissionais" label="Voltar para profissionais" />

      <header className={styles.hero}>
        <div className={styles.heroAccent} aria-hidden="true">
          <Sprout size={100} strokeWidth={1} />
        </div>
        <div className={styles.identity}>
          <Avatar person={person} large />
          <div className={styles.identityText}>
            <p className="eyebrow">UM ENCONTRO COM O SEU CUIDADO</p>
            <h1>{person.name}</h1>
            <p>
              {person.role} · {person.approach}
            </p>
            <span className={styles.registration}>CRP ilustrativo · Perfil de demonstração</span>
          </div>
          <Button
            variant="secondary"
            className={styles.favorite}
            aria-label={`${saved ? "Remover" : "Adicionar"} ${person.name} ${saved ? "dos" : "aos"} favoritos`}
            aria-pressed={saved}
            onClick={() => toggleFavorite(person.id)}
          >
            <Heart size={18} fill={saved ? "currentColor" : "none"} />
            {saved ? "Salvo" : "Salvar perfil"}
          </Button>
        </div>
        <div className={styles.highlights}>
          <Link href="#avaliacoes">
            <Star size={17} />
            <strong>{person.rating}</strong>
            <span>({person.reviews} avaliações ilustrativas)</span>
          </Link>
          <span>
            <ModeIcon size={17} />
            {person.mode}
          </span>
          <span>
            <Clock3 size={17} />
            Sessões de 50 minutos
          </span>
        </div>
      </header>

      <nav className={styles.sectionNav} aria-label="Seções do perfil profissional">
        <Link href="#sobre">Sobre o profissional</Link>
        <Link href="#formacao">Formação e experiência</Link>
        <Link href="#avaliacoes">Avaliações</Link>
        <Link href="#atendimento">Atendimento</Link>
      </nav>

      <div className={styles.grid}>
        <div className={styles.details}>
          <section className={styles.panel} id="sobre" aria-labelledby="sobre-title">
            <div className={styles.sectionHeading}>
              <MessageCircle size={21} />
              <h2 id="sobre-title">Sobre mim</h2>
            </div>
            <p className={styles.bio}>{person.bio}</p>
            <p>
              O primeiro encontro é um espaço para nos conhecermos. Você pode falar sobre o que
              trouxe você até aqui, compartilhar suas expectativas e tirar dúvidas sobre o
              acompanhamento, no seu tempo.
            </p>
            <div className={styles.divider} />
            <h2 className={styles.subheading}>Especialidades</h2>
            <p className={styles.caption}>Temas que podem fazer parte da nossa conversa.</p>
            <div className="chips">
              {person.specialties.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
            <div className={styles.divider} />
            <h2 className={styles.subheading}>Minha abordagem</h2>
            <h3 className={styles.approachName}>{person.approach}</h3>
            <p>
              {approachDescriptions[person.approach] ||
                "A abordagem e o formato do acompanhamento são conversados no primeiro encontro."}
            </p>
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
                  <h3>Formação acadêmica</h3>
                  <p>Graduação em Psicologia</p>
                  <small>Instituição e ano de conclusão a informar no perfil real.</small>
                </div>
              </div>
              <div>
                <span className={styles.smallIcon}>
                  <BookOpen size={20} />
                </span>
                <div>
                  <h3>Área de atuação</h3>
                  <p>{person.approach}</p>
                  <small>Formações complementares e experiência a validar.</small>
                </div>
              </div>
              <div>
                <span className={styles.smallIcon}>
                  <MessageCircle size={20} />
                </span>
                <div>
                  <h3>Foco do acompanhamento</h3>
                  <p>{person.specialties.join(" · ")}</p>
                  <small>Atendimento individual ilustrativo.</small>
                </div>
              </div>
            </div>
            <p className={styles.disclaimer}>
              Este profissional é fictício. Credenciais, registro e experiência serão verificados
              antes da publicação de perfis reais.
            </p>
          </section>

          <section className={styles.panel} id="avaliacoes" aria-labelledby="avaliacoes-title">
            <div className={styles.sectionHeading}>
              <Star size={21} />
              <h2 id="avaliacoes-title">Avaliações</h2>
            </div>
            <div className={styles.reviewSummary}>
              <div className={styles.score}>
                <strong>{person.rating}</strong>
                <Star size={23} fill="currentColor" />
              </div>
              <div>
                <strong>{person.reviews} avaliações ilustrativas</strong>
                <p>Uma prévia de como este espaço será apresentado.</p>
              </div>
            </div>
            <p className={styles.disclaimer}>
              As notas e quantidades são exemplos visuais, não opiniões de pacientes. Nenhum
              depoimento real foi publicado nesta demonstração.
            </p>
          </section>
        </div>

        <aside className={styles.aside} aria-label="Atendimento e disponibilidade">
          <section
            className={`${styles.panel} ${styles.booking}`}
            id="atendimento"
            aria-labelledby="atendimento-title"
          >
            <p className="eyebrow">SEU PRÓXIMO PASSO</p>
            <h2 id="atendimento-title">Informações da consulta</h2>
            <div className={styles.price}>
              <strong>R$ {person.price}</strong>
              <span>por sessão de 50 min</span>
            </div>
            <dl className={styles.facts}>
              <div>
                <dt>
                  <ModeIcon size={19} />
                  Modalidade
                </dt>
                <dd>{person.mode}</dd>
              </div>
              <div>
                <dt>
                  <Clock3 size={19} />
                  Duração
                </dt>
                <dd>50 minutos</dd>
              </div>
              <div>
                <dt>
                  <UserRound size={19} />
                  Formato
                </dt>
                <dd>Individual</dd>
              </div>
              <div>
                <dt>
                  <Languages size={19} />
                  Idioma
                </dt>
                <dd>Português</dd>
              </div>
            </dl>
            <ButtonLink href="#disponibilidade" className="full-width">
              Ver disponibilidade
              <ArrowRight size={17} />
            </ButtonLink>
            <p className={styles.bookingNote}>
              {online
                ? "Conheça o atendimento online, de onde você se sentir à vontade."
                : "Atendimento presencial em Florianópolis. Endereço a confirmar no perfil real."}
            </p>
          </section>

          <section
            className={`${styles.panel} ${styles.availability}`}
            id="disponibilidade"
            aria-labelledby="disponibilidade-title"
          >
            <div className={styles.sectionHeading}>
              <CalendarDays size={21} />
              <h2 id="disponibilidade-title">Disponibilidade</h2>
            </div>
            <Badge neutral>Agenda demonstrativa</Badge>
            <p>Exemplo de horário para este profissional:</p>
            <div className={styles.time}>
              <Clock3 size={17} />
              <strong>{person.time}</strong>
              <span>Horário ilustrativo</span>
            </div>
            <p>A agenda real, as datas e o agendamento ainda não estão conectados.</p>
            <p className={styles.disclaimer}>Nenhuma consulta é reservada nesta prévia.</p>
          </section>
          <p className={styles.asideNote}>
            <Heart size={17} />
            Escolha com calma. Encontrar o seu espaço também faz parte do cuidado.
          </p>
        </aside>
      </div>
    </div>
  );
}
