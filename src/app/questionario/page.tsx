"use client";
import { useState } from "react";
import {
  ArrowRight,
  Clock3,
  ListChecks,
  LockKeyhole,
  Heart,
  Sparkles,
} from "lucide-react";
import { FlowShell } from "@/components/flow-shell";
import { BackLink, ButtonLink, Dialog } from "@/components/ui";
import { BotanicalArt } from "@/components/botanical-art";

export default function QuestionnaireIntro() {
  const [privacy, setPrivacy] = useState(false);
  return (
    <FlowShell>
      <div className="container flow-content">
        <BackLink href="/" />
        <div className="intro-grid">
          <section className="intro-copy">
            <span className="round-icon">
              <Heart size={27} />
            </span>
            <p className="eyebrow">VAMOS COMEÇAR POR VOCÊ</p>
            <h1>
              Como você tem
              <br />
              <span>se sentido?</span>
            </h1>
            <p className="lead">
              Um pouco sobre você.
              <br />
              Um encontro com novas possibilidades.
            </p>
            <p>
              Responda algumas perguntas para encontrarmos profissionais que
              podem combinar com o que você procura.
            </p>
            <div className="intro-facts">
              <span>
                <ListChecks size={18} />
                10 perguntas
              </span>
              <span>
                <Clock3 size={18} />≈ 2 minutos
              </span>
              <span>
                <Sparkles size={18} />
                Gratuito
              </span>
            </div>
            <div className="privacy-note">
              <LockKeyhole size={20} />
              <div>
                <strong>Suas respostas são privadas.</strong>
                <p>
                  Elas ajudam a entender suas preferências e não representam um
                  diagnóstico.
                </p>
                <button className="text-link" onClick={() => setPrivacy(true)}>
                  Como usamos minhas respostas? <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <ButtonLink href="/questionario/1" arrow className="wide-mobile">
              Começar meu questionário
            </ButtonLink>
            <p className="microcopy">
              Não existem respostas certas ou erradas. Só as suas.
            </p>
          </section>
          <aside className="intro-aside">
            <BotanicalArt compact />
            <blockquote>
              “Cada história é única.
              <br />O seu cuidado também.”
            </blockquote>
            <div className="aside-rule" />
            <p>
              Um passo de cada vez.
              <br />
              Estamos com você nessa jornada.
            </p>
          </aside>
        </div>
      </div>
      <Dialog
        open={privacy}
        onClose={() => setPrivacy(false)}
        title="Você no controle das suas respostas"
      >
        <p>
          Usamos suas preferências para organizar opções de profissionais. O
          questionário não representa um diagnóstico e não é compartilhado
          automaticamente com profissionais.
        </p>
        <p>
          Nesta prévia, as respostas ficam apenas na memória desta página e são
          apagadas ao recarregar ou fechar a aba. Não são enviadas para um
          serviço de matching.
        </p>
        <ButtonLink href="/questionario/1" arrow>
          Entendi, vamos começar
        </ButtonLink>
      </Dialog>
    </FlowShell>
  );
}
