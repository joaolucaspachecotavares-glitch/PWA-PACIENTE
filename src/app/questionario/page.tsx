"use client";
import { useState } from "react";
import { ArrowRight, Clock3, Heart, ListChecks, LockKeyhole, Sparkles } from "lucide-react";
import { BotanicalArt } from "@/components/botanical-art";
import { FlowShell } from "@/components/flow-shell";
import { BackLink, ButtonLink, Dialog } from "@/components/ui";

export default function QuestionnaireIntro() {
  const [privacy, setPrivacy] = useState(false);
  return (
    <FlowShell>
      <div className="container flow-content">
        <BackLink href="/onboarding" />
        <div className="intro-grid">
          <section className="intro-copy">
            <span className="round-icon">
              <Heart size={27} />
            </span>
            <p className="eyebrow">VAMOS COMEÇAR POR VOCÊ</p>
            <h1>
              Como você está se sentindo
              <br />
              <span>ultimamente?</span>
            </h1>
            <p>Responda 10 perguntas e encontre profissionais que podem combinar com o que você procura.</p>
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
                <p>Elas ajudam a entender suas preferências e não representam um diagnóstico.</p>
                <button className="text-link" onClick={() => setPrivacy(true)}>
                  Como usamos minhas respostas? <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <ButtonLink href="/questionario/1" arrow className="wide-mobile">
              Começar
            </ButtonLink>
            <p className="microcopy">Não existem respostas certas ou erradas. Só as suas.</p>
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
      <Dialog open={privacy} onClose={() => setPrivacy(false)} title="Como usamos suas respostas">
        <p>
          Utilizamos suas respostas para compreender suas preferências e apresentar profissionais
          compatíveis. Elas não representam diagnóstico.
        </p>
        <p>
          Antes do cadastro, as respostas ficam apenas nesta aba do navegador. Ao criar sua conta, elas
          são guardadas de forma criptografada e nunca são compartilhadas automaticamente com
          profissionais: você decide o que compartilhar em cada agendamento.
        </p>
        <ButtonLink href="/questionario/1" arrow>
          Entendi, vamos começar
        </ButtonLink>
      </Dialog>
    </FlowShell>
  );
}
