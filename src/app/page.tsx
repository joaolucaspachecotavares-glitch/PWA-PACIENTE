import {
  ArrowUpRight,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Check,
  Clock3,
} from "lucide-react";
import { FlowShell } from "@/components/flow-shell";
import { BotanicalArt } from "@/components/botanical-art";
import { ButtonLink } from "@/components/ui";

export default function OnboardingPage() {
  return (
    <FlowShell>
      <div className="onboarding container">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="live-dot" /> UM ENCONTRO COM O SEU BEM-ESTAR
            </p>
            <h1>
              Cuidar de você
              <br />
              começa com o<br />
              <span>apoio certo.</span>
            </h1>
            <p className="lead">
              Você não precisa ter todas as respostas.
              <br className="desktop-only" /> Só de um espaço para começar.
            </p>
            <p className="hero-description">
              Encontre profissionais que combinam com o que você procura, com
              acolhimento e no seu tempo.
            </p>
            <div className="hero-actions">
              <ButtonLink href="/questionario" arrow>
                Quero encontrar um profissional
              </ButtonLink>
              <ButtonLink href="/entrar" variant="ghost">
                Já tenho uma conta <ArrowUpRight size={16} />
              </ButtonLink>
            </div>
            <div className="hero-reassurance">
              <Clock3 size={15} />
              <span>Cerca de 2 minutos</span>
              <span className="separator-dot" />
              <span>Gratuito para começar</span>
            </div>
          </div>
          <div className="hero-visual">
            <BotanicalArt />
            <div className="floating-note note-top">
              <span className="round-icon small">
                <HeartHandshake size={21} />
              </span>
              <div>
                <strong>Um espaço de escuta.</strong>
                <span>Um cuidado que é seu.</span>
              </div>
            </div>
            <div className="floating-note note-bottom">
              <span className="small-check">
                <Check size={18} />
              </span>
              <span>Seu primeiro passo já importa.</span>
            </div>
            <div className="art-caption">
              RESPIRE. VOCÊ PODE COMEÇAR POR AQUI.
            </div>
          </div>
        </section>
        <section className="principles" aria-label="Nossa proposta">
          <div>
            <span className="feature-icon">
              <HeartHandshake />
            </span>
            <div>
              <h2>Cuidado que combina com você</h2>
              <p>Suas preferências guiam esse encontro.</p>
            </div>
          </div>
          <div>
            <span className="feature-icon">
              <ShieldCheck />
            </span>
            <div>
              <h2>Privacidade em cada passo</h2>
              <p>Você escolhe o que compartilhar.</p>
            </div>
          </div>
          <div>
            <span className="feature-icon">
              <Sparkles />
            </span>
            <div>
              <h2>No seu tempo, do seu jeito</h2>
              <p>Sem pressa. Sem julgamentos.</p>
            </div>
          </div>
        </section>
        <div className="onboarding-bottom">
          <span>SEU CUIDADO COMEÇA COM UM ENCONTRO.</span>
          <span className="line-leaf">✳</span>
          <span>ESTAMOS AQUI PARA AJUDAR.</span>
        </div>
      </div>
    </FlowShell>
  );
}
