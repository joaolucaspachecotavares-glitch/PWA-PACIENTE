"use client";
import { Button, ButtonLink } from "@/components/ui";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="small-page">
      <h1>
        Vamos tentar
        <br />
        mais uma vez?
      </h1>
      <p>
        Não foi possível carregar esta tela. Suas respostas continuam nesta
        sessão.
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
      <ButtonLink href="/" variant="ghost">
        Ir para o início
      </ButtonLink>
    </main>
  );
}
