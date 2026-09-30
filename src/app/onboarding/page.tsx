import type { Metadata } from "next";
import { ArrowUpRight, Check, Clock3, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { BotanicalArt } from "@/components/botanical-art";
import { FlowShell } from "@/components/flow-shell";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "Bem-vindo" };

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
              Cuidar de você começa
              <br />
              encontrando o <span>apoio certo.</span>
            </h1>
            <p className="lead">
              Responda algumas perguntas e encontre profissionais compatíveis com o que você procura.
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
            <div className="art-caption">RESPIRE. VOCÊ PODE COMEÇAR POR AQUI.</div>
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
              <h2>Profissionais verificados</h2>
              <p>Registro profissional conferido antes de aparecer.</p>
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
