import { FlowShell } from "@/components/flow-shell";
import { ButtonLink, BackLink } from "@/components/ui";
import { Sprout } from "lucide-react";
export default function LoginPreview() {
  return (
    <FlowShell>
      <div className="small-page">
        <BackLink href="/" />
        <span className="round-icon">
          <Sprout size={30} />
        </span>
        <p className="eyebrow">BOM TER VOCÊ POR AQUI</p>
        <h1>
          Seu espaço
          <br />
          <span>está te esperando.</span>
        </h1>
        <p>
          Explore o painel do paciente com dados de exemplo. O acesso por e-mail
          e senha será conectado na próxima etapa.
        </p>
        <ButtonLink href="/dashboard" arrow className="full-width">
          Entrar na demonstração
        </ButtonLink>
        <ButtonLink href="/questionario" variant="ghost" className="full-width">
          Quero começar minha jornada
        </ButtonLink>
      </div>
    </FlowShell>
  );
}
