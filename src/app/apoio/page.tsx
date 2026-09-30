import type { Metadata } from "next";
import { HeartHandshake, MessageCircle, Phone, Siren } from "lucide-react";
import { FlowShell } from "@/components/flow-shell";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "Apoio imediato" };

// Tela de apoio: orienta ajuda humana imediata, sem diagnosticar.
// Conteúdo final deve ser validado com profissionais e jurídico antes do lançamento.
export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ continuar?: string }>;
}) {
  const { continuar } = await searchParams;
  const next = continuar?.startsWith("/") && !continuar.startsWith("//") ? continuar : "/questionario/3";
  return (
    <FlowShell>
      <div className="container support-page">
        <span className="round-icon">
          <HeartHandshake size={28} />
        </span>
        <p className="eyebrow">VOCÊ NÃO PRECISA PASSAR POR ISSO SOZINHO</p>
        <h1>Queremos garantir que você tenha o apoio adequado.</h1>
        <p className="lead">
          Pelo que você compartilhou, talvez seja importante procurar ajuda humana agora. Existem pessoas
          prontas para ouvir você, gratuitamente e a qualquer hora.
        </p>
        <div className="support-options" role="list">
          <a className="support-option" role="listitem" href="tel:188">
            <Phone size={22} aria-hidden="true" />
            <div>
              <strong>CVV — ligue 188</strong>
              <span>Apoio emocional gratuito, 24 horas, todos os dias.</span>
            </div>
          </a>
          <a
            className="support-option"
            role="listitem"
            href="https://cvv.org.br/chat/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={22} aria-hidden="true" />
            <div>
              <strong>Conversar pelo chat do CVV</strong>
              <span>cvv.org.br — se preferir escrever.</span>
            </div>
          </a>
          <a className="support-option support-urgent" role="listitem" href="tel:192">
            <Siren size={22} aria-hidden="true" />
            <div>
              <strong>Emergência — SAMU 192</strong>
              <span>Se você estiver em risco imediato, ligue agora ou procure o pronto-socorro mais próximo.</span>
            </div>
          </a>
        </div>
        <p className="microcopy">
          A Luvimind não oferece atendimento de urgência. Os profissionais da plataforma atendem com
          horário agendado.
        </p>
        <ButtonLink href={next} variant="secondary">
          Continuar na Luvimind
        </ButtonLink>
      </div>
    </FlowShell>
  );
}
