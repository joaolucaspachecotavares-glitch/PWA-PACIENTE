import type { Metadata } from "next";
import { FlowShell } from "@/components/flow-shell";
import { Alert, BackLink } from "@/components/ui";

export const metadata: Metadata = { title: "Política de Privacidade" };

// Resumo das práticas implementadas (versão 2026-09). O texto integral elaborado
// com a assessoria jurídica/DPO deve substituir este conteúdo antes do lançamento.
export default function PrivacyPolicyPage() {
  return (
    <FlowShell>
      <article className="container legal-page">
        <BackLink href="/onboarding" />
        <p className="eyebrow">VERSÃO 2026-09</p>
        <h1>Política de Privacidade</h1>
        <Alert tone="info">
          Este é um resumo de como a Luvimind trata seus dados, conforme a LGPD. O texto integral será publicado nesta página
          antes da abertura do serviço.
        </Alert>
        <h2>Dados que coletamos</h2>
        <ul>
          <li>Cadastro: nome, data de nascimento, e-mail, celular e senha (armazenada apenas como hash).</li>
          <li>Preferências do questionário: armazenadas de forma criptografada e separadas dos dados de cadastro.</li>
          <li>Agendamentos, pagamentos e avaliações.</li>
          <li>Resumo pré-consulta, somente se você decidir escrever e autorizar o compartilhamento.</li>
        </ul>
        <h2>Para que usamos</h2>
        <p>
          Para apresentar profissionais compatíveis, realizar agendamentos e pagamentos, enviar lembretes e manter a
          segurança da plataforma. Não vendemos seus dados.
        </p>
        <h2>Compartilhamento</h2>
        <p>
          O profissional recebe apenas o que você autorizar em cada agendamento. O questionário completo nunca é
          compartilhado. Pagamentos são processados por um provedor de pagamentos contratado. Consultas online acontecem
          no Google Meet, fora da Luvimind: a Luvimind não grava nem tem acesso ao conteúdo das consultas.
        </p>
        <h2>Acesso interno</h2>
        <p>
          Dados sensíveis têm acesso mínimo. Acessos excepcionais (por exemplo, ordem judicial) são justificados e
          registrados em trilha de auditoria.
        </p>
        <h2>Seus direitos</h2>
        <p>
          Em <strong>Perfil › Privacidade e seus dados</strong> você pode ver o que foi compartilhado, baixar uma cópia dos seus
          dados, corrigir informações e excluir sua conta. Registros financeiros são mantidos anonimizados pelo prazo exigido
          em lei.
        </p>
        <h2>Público</h2>
        <p>A Luvimind é destinada exclusivamente a maiores de 18 anos.</p>
      </article>
    </FlowShell>
  );
}
