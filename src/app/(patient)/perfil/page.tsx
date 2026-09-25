import type { Metadata } from "next";
import { ProfessionalProfile } from "@/components/professional-profile";
import { BackLink, ButtonLink } from "@/components/ui";
import { professionals } from "@/lib/professionals";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Perfil do profissional",
};

export default async function ProfessionalProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ profissional?: string | string[] }>;
}) {
  const { profissional } = await searchParams;
  const person =
    typeof profissional === "string"
      ? professionals.find((item) => item.id === profissional)
      : undefined;

  if (!person) {
    return (
      <>
        <BackLink href="/profissionais" label="Voltar para profissionais" />
        <div className="empty-state">
          <span className="round-icon">
            <Search size={28} />
          </span>
          <h1>
            {profissional
              ? "Não encontramos este perfil."
              : "Qual profissional você quer conhecer?"}
          </h1>
          <p>
            Explore os profissionais e escolha um perfil para conhecer sua história, abordagem e
            atendimento.
          </p>
          <ButtonLink href="/profissionais" arrow>
            Encontrar profissionais
          </ButtonLink>
        </div>
      </>
    );
  }

  return <ProfessionalProfile person={person} />;
}
