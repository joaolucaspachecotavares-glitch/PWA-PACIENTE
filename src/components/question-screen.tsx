"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Leaf, LockKeyhole } from "lucide-react";
import { questions } from "@/lib/questions";
import { toggleAnswer } from "@/lib/domain";
import { useJourney } from "./providers";
import { FlowShell } from "./flow-shell";
import { BackLink, Button } from "./ui";

export function QuestionScreen({ step }: { step: number }) {
  const q = questions[step - 1];
  const { answers, setAnswer } = useJourney();
  const selected = answers[q.id] || [];
  const router = useRouter();
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
            <span className={step <= 3 ? "chapter-current" : ""}>
              01 <i /> O seu momento
            </span>
            <span className={step > 3 && step <= 7 ? "chapter-current" : ""}>
              02 <i /> Suas preferências
            </span>
            <span className={step > 7 ? "chapter-current" : ""}>
              03 <i /> Seu próximo passo
            </span>
          </div>
          <span className="private-label">
            <LockKeyhole size={14} /> Este espaço é só seu.
          </span>
        </aside>
        <section className="question-main">
          <div className="question-top">
            <BackLink
              href={step === 1 ? "/questionario" : `/questionario/${step - 1}`}
            />
            <span>
              Pergunta <strong>{String(step).padStart(2, "0")}</strong> de{" "}
              {questions.length}
            </span>
          </div>
          <progress
            className="progress-bar"
            value={step}
            max={questions.length}
            aria-label="Progresso do questionário"
          />
          <p className="eyebrow">
            {step <= 3
              ? "O SEU MOMENTO"
              : step <= 7
                ? "SUAS PREFERÊNCIAS"
                : "SEU PRÓXIMO PASSO"}
          </p>
          <h1>{q.title}</h1>
          <p className="question-description">{q.subtitle}</p>
          <fieldset className="option-fieldset">
            <legend>
              {q.multiple
                ? "Você pode selecionar mais de uma opção."
                : "Selecione uma opção."}
            </legend>
            <div
              className={`answer-options ${q.options.length <= 5 ? "options-single-column" : ""}`}
            >
              {q.options.map((option, index) => (
                <label
                  className={`answer-option ${selected.includes(option) ? "selected" : ""}`}
                  key={option}
                >
                  <input
                    type={q.multiple ? "checkbox" : "radio"}
                    name={q.id}
                    value={option}
                    checked={selected.includes(option)}
                    onChange={() =>
                      setAnswer(
                        q.id,
                        toggleAnswer(selected, option, !!q.multiple),
                      )
                    }
                  />
                  <span className="option-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{option}</span>
                  <span
                    className={`option-check ${!q.multiple ? "is-radio" : ""}`}
                  >
                    {selected.includes(option) && <Check size={13} />}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="question-actions">
            <span aria-live="polite">
              {selected.length
                ? `${selected.length} ${selected.length === 1 ? "opção selecionada" : "opções selecionadas"}`
                : "Escolha uma opção para continuar"}
            </span>
            <Button
              disabled={!selected.length}
              onClick={() =>
                router.push(
                  step === questions.length
                    ? "/matching"
                    : `/questionario/${step + 1}`,
                )
              }
            >
              {step === questions.length ? "Encontrar meu apoio" : "Continuar"}
              <ArrowRight size={18} />
            </Button>
          </div>
        </section>
      </div>
    </FlowShell>
  );
}
