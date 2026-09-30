"use client";
import { useRouter } from "next/navigation";
import { ListChecks } from "lucide-react";
import { useJourney } from "@/components/providers";
import { ErrorBlock, LoadingBlock } from "@/components/query-state";
import { BackLink, Button, EmptyState } from "@/components/ui";
import { formatShortDate } from "@/lib/format";
import { useQuestionnaire, useSavedAnswers } from "@/lib/queries";

// Mostra as respostas como preferências, sem interpretação psicológica.
export default function PreferencesPage() {
  const router = useRouter();
  const { setAnswer } = useJourney();
  const saved = useSavedAnswers();
  const questionnaire = useQuestionnaire();

  if (saved.isPending || questionnaire.isPending) return <LoadingBlock lines={6} />;
  if (saved.isError) return <ErrorBlock error={saved.error} onRetry={() => void saved.refetch()} />;
  if (questionnaire.isError) return <ErrorBlock error={questionnaire.error} onRetry={() => void questionnaire.refetch()} />;

  const answers = saved.data.answers;

  function update() {
    // Pré-preenche o questionário com as respostas atuais para facilitar ajustes.
    if (answers) for (const [id, values] of Object.entries(answers)) setAnswer(id, values);
    router.push("/questionario/1");
  }

  return (
    <>
      <BackLink href="/perfil" label="Meu perfil" />
      <div className="page-title-row">
        <div>
          <p className="eyebrow">MEU QUESTIONÁRIO</p>
          <h1>Suas preferências atuais</h1>
          {saved.data.answeredAt && <p>Última atualização em {formatShortDate(saved.data.answeredAt)}.</p>}
        </div>
      </div>
      {!answers ? (
        <EmptyState
          icon={<ListChecks size={28} />}
          title="Você ainda não respondeu o questionário."
          description="Suas respostas ajudam a mostrar profissionais compatíveis com você."
          href="/questionario"
          action="Responder agora"
        />
      ) : (
        <>
          <dl className="detail-list preferences-list">
            {questionnaire.data.questions.map((q) => (
              <div key={q.id}>
                <dt>{q.title}</dt>
                <dd>
                  {(answers[q.id] ?? [])
                    .map((code) => q.options.find((o) => o.code === code)?.label ?? code)
                    .join(", ") || "—"}
                </dd>
              </div>
            ))}
          </dl>
          <p className="microcopy">
            Suas respostas são criptografadas e nunca são compartilhadas automaticamente com profissionais.
          </p>
          <Button onClick={update}>Atualizar respostas</Button>
        </>
      )}
    </>
  );
}
