import type { Metadata } from "next";
import { FlowShell } from "@/components/flow-shell";
import { Alert, BackLink } from "@/components/ui";

export const metadata: Metadata = { title: "Termos de Uso" };

// Resumo dos compromissos do produto (versão 2026-09). O texto integral elaborado
// com a assessoria jurídica deve substituir este conteúdo antes do lançamento.
export default function TermsPage() {
  return (
    <FlowShell>
      <article className="container legal-page">
        <BackLink href="/onboarding" />
        <p className="eyebrow">VERSÃO 2026-09</p>
        <h1>Termos de Uso</h1>
        <Alert tone="info">
          Este é um resumo das regras da Luvimind. O texto integral, revisado pela assessoria jurídica, será publicado nesta
          página antes da abertura do serviço.
        </Alert>
        <h2>1. O que é a Luvimind</h2>
        <p>
          A Luvimind é uma plataforma que aproxima pessoas que buscam apoio de profissionais de saúde mental verificados. A
          Luvimind não realiza diagnóstico, não indica tratamentos ou medicamentos e não substitui o atendimento de um
          profissional habilitado.
        </p>
        <h2>2. Quem pode usar</h2>
        <p>O uso é exclusivo para pessoas com 18 anos ou mais. As informações de cadastro devem ser verdadeiras.</p>
        <h2>3. Questionário e compatibilidade</h2>
        <p>
          O questionário identifica preferências de atendimento. A compatibilidade apresentada não é avaliação psicológica.
          Nenhum profissional pode pagar para aparecer em posição superior.
        </p>
        <h2>4. Agendamento e pagamento</h2>
        <p>
          O paciente paga somente o valor da consulta definido pelo profissional, sem taxa adicional da Luvimind. O horário
          fica reservado por 15 minutos até a confirmação do pagamento.
        </p>
        <p>
          Consultas online são realizadas externamente pelo Google Meet, em link informado pelo profissional. O uso do Google
          Meet está sujeito aos termos do Google.
        </p>
        <h2>5. Cancelamento e reembolso</h2>
        <ul>
          <li>Cancelamento com 4 horas ou mais de antecedência: reembolso integral.</li>
          <li>Cancelamento com menos de 4 horas ou ausência: sem reembolso.</li>
          <li>Cancelamento pelo profissional: reembolso integral, salvo remarcação aceita pelo paciente.</li>
          <li>Falha atribuível à Luvimind: remarcação ou reembolso integral.</li>
        </ul>
        <p>Direitos previstos em lei prevalecem sobre esta política.</p>
        <h2>6. Avaliações</h2>
        <p>
          Após a consulta, o paciente pode avaliar a experiência de atendimento. Avaliações não medem resultado clínico.
          Conteúdo ofensivo ou que identifique terceiros pode ser removido.
        </p>
        <h2>7. Situações de urgência</h2>
        <p>
          A Luvimind não oferece atendimento de urgência. Em caso de crise, ligue para o CVV (188) ou, em emergência, para o
          SAMU (192).
        </p>
      </article>
    </FlowShell>
  );
}
