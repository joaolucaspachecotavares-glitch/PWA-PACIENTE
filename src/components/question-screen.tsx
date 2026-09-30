"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check, Leaf, LockKeyhole } from "lucide-react";
import { api } from "@/lib/api";
import { toggleOption } from "@/lib/answers";
import { useMe, useQuestionnaire } from "@/lib/queries";
import { useJourney } from "./providers";
import { FlowShell } from "./flow-shell";
import { ErrorBlock, LoadingBlock } from "./query-state";
import { Alert, BackLink, Button } from "./ui";

const chapter = (step: number) => (step <= 3 ? 0 : step <= 7 ? 1 : 2);
const CHAPTERS = ["O SEU MOMENTO", "SUAS PREFERÊNCIAS", "SEU PRÓXIMO PASSO"];

export function QuestionScreen({ step }: { step: number }) {
  const router = useRouter();
  const client = useQueryClient();
  const questionnaire = useQuestionnaire();
  const me = useMe();
  const { answers, setAnswer, clearAnswers } = useJourney();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const questions = questionnaire.data?.questions ?? [];
  const q = questions[step - 1];
  const total = questions.length || 10;
  const selected = q ? (answers[q.id] ?? []) : [];
  const isLast = step === total;
  const loggedIn = !!me.data;

  async function next() {
    if (!q) return;
    if (q.id === "feeling" && selected.includes("urgent")) {
      router.push(`/apoio?continuar=${encodeURIComponent(isLast ? "/matching" : `/questionario/${step + 1}`)}`);
      return;
    }
    if (!isLast) {
      router.push(`/questionario/${step + 1}`);
      return;
    }
    if (!loggedIn) {
      router.push("/matching");
      return;
    }
    // Paciente autenticado atualizando preferências.
    setSaving(true);
    setSaveError(null);
    try {
      await api("/matching/answers", { method: "PUT", body: { answers } });
      clearAnswers();
      await client.invalidateQueries({ queryKey: ["matching"] });
      router.push("/resultados");
    } catch {
      setSaveError("Não conseguimos salvar suas respostas. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <FlowShell>
      <div className="question-layout container">
        <aside className="question-aside">
          <span className="round-icon">
            <Leaf size={25} />
          </span>
          <p className="eyebrow">SEU PRIMEIRO PASSO</p>
          <h2>
            Vamos encontrar
            <br />
            um cuidado que
            <br />
            <span>faça sentido.</span>
          </h2>
          <p>
            Com calma, do seu jeito.
            <br />
            Você pode voltar e mudar suas respostas a qualquer momento.
          </p>
          <div className="question-chapters">
            {["O seu momento", "Suas preferências", "Seu próximo passo"].map((label, i) => (
              <span key={label} className={chapter(step) === i ? "chapter-current" : ""}>
                {String(i + 1).padStart(2, "0")} <i /> {label}
              </span>
            ))}
          </div>
          <span className="private-label">
            <LockKeyhole size={14} /> Suas respostas são privadas.
          </span>
        </aside>
        <section className="question-main">
          <div className="question-top">
            <BackLink href={step === 1 ? "/questionario" : `/questionario/${step - 1}`} />
            <span>
              Pergunta <strong>{String(step).padStart(2, "0")}</strong> de {total}
            </span>
          </div>
          <progress className="progress-bar" value={step} max={total} aria-label="Progresso do questionário" />
          {questionnaire.isPending ? (
            <LoadingBlock lines={5} label="Carregando pergunta" />
          ) : questionnaire.isError ? (
            <ErrorBlock error={questionnaire.error} onRetry={() => void questionnaire.refetch()} />
          ) : q ? (
            <>
              <p className="eyebrow">{CHAPTERS[chapter(step)]}</p>
              <h1>{q.title}</h1>
              <p className="question-description">{q.subtitle}</p>
              <fieldset className="option-fieldset">
                <legend>{q.multiple ? "Você pode selecionar mais de uma opção." : "Selecione uma opção."}</legend>
                <div className={`answer-options ${q.options.length <= 5 ? "options-single-column" : ""}`}>
                  {q.options.map((option, index) => {
                    const checked = selected.includes(option.code);
                    return (
                      <label className={`answer-option ${checked ? "selected" : ""}`} key={option.code}>
                        <input
                          type={q.multiple ? "checkbox" : "radio"}
                          name={q.id}
                          value={option.code}
                          checked={checked}
                          onChange={() =>
                            setAnswer(q.id, toggleOption(selected, option, q.multiple, q.options))
                          }
                        />
                        <span className="option-index">{String(index + 1).padStart(2, "0")}</span>
                        <span>{option.label}</span>
                        <span className={`option-check ${!q.multiple ? "is-radio" : ""}`}>
                          {checked && <Check size={13} />}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              {saveError && (
                <Alert tone="error" role="alert">
                  {saveError}
                </Alert>
              )}
              <div className="question-actions">
                <span aria-live="polite">
                  {selected.length
                    ? `${selected.length} ${selected.length === 1 ? "opção selecionada" : "opções selecionadas"}`
                    : "Escolha uma opção para continuar"}
                </span>
                <Button disabled={!selected.length} loading={saving} onClick={() => void next()}>
                  {isLast ? (loggedIn ? "Salvar preferências" : "Encontrar meu apoio") : "Continuar"}
                  <ArrowRight size={18} />
                </Button>
              </div>
            </>
          ) : null}
        </section>
      </div>
    </FlowShell>
  );
}
