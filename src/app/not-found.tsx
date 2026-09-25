import { FlowShell } from "@/components/flow-shell";
import { ButtonLink } from "@/components/ui";
export default function NotFound() {
  return (
    <FlowShell>
      <div className="small-page">
        <p className="eyebrow">VAMOS ENCONTRAR O CAMINHO</p>
        <h1>
          Esta página
          <br />
          <span>não está por aqui.</span>
        </h1>
        <p>Volte ao início para continuar sua jornada.</p>
        <ButtonLink href="/" arrow>
          Voltar ao início
        </ButtonLink>
      </div>
    </FlowShell>
  );
}
