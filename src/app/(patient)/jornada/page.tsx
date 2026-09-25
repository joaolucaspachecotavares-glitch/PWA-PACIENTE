import {
  Sprout,
  Heart,
  Footprints,
  Sparkles,
  Check,
  CalendarCheck,
} from "lucide-react";
import { ButtonLink, SectionTitle, Badge } from "@/components/ui";
export default function JourneyPage() {
  return (
    <>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">CADA PASSO IMPORTA</p>
          <h1>Minha jornada</h1>
          <p>Um olhar gentil para o caminho que você está construindo.</p>
        </div>
        <Badge neutral>Histórico ilustrativo</Badge>
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
          <p>Seu ritmo é único. Celebre cada encontro com você.</p>
        </div>
      </div>
      <div className="metric-grid">
        <article>
          <CalendarCheck size={24} />
          <strong>04</strong>
          <span>consultas realizadas</span>
        </article>
        <article>
          <Heart size={24} />
          <strong>03</strong>
          <span>encontros consecutivos</span>
        </article>
        <article>
          <Sprout size={24} />
          <strong>01</strong>
          <span>jornada que é só sua</span>
        </article>
      </div>
      <SectionTitle title="Marcos do seu cuidado" />
      <div className="milestone-grid">
        {[
          {
            icon: Footprints,
            title: "Primeiro passo",
            text: "Você abriu espaço para o seu cuidado.",
            done: true,
          },
          {
            icon: Heart,
            title: "Criando conexões",
            text: "Uma relação de confiança se constrói aos poucos.",
            done: true,
          },
          {
            icon: Sparkles,
            title: "Cuidando de mim",
            text: "Mais encontros com você, no seu tempo.",
            done: false,
          },
        ].map(({ icon: Icon, title, text, done }) => (
          <article
            key={title}
            className={`milestone ${done ? "milestone-done" : ""}`}
          >
            <span className="round-icon">
              <Icon size={28} />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
            <span className="milestone-status">
              {done ? (
                <>
                  <Check size={15} /> Na sua história
                </>
              ) : (
                "Um caminho a explorar"
              )}
            </span>
          </article>
        ))}
      </div>
      <div className="journey-end">
        <p>
          Não há comparação. Não há pressa.
          <br />
          <strong>Há o seu tempo e a sua história.</strong>
        </p>
        <ButtonLink href="/dashboard" variant="secondary">
          Voltar para meu início
        </ButtonLink>
      </div>
    </>
  );
}
