"use client";
import { use } from "react";
import { ProfessionalProfile } from "@/components/professional-profile";
import { ErrorBlock, LoadingBlock } from "@/components/query-state";
import { EmptyState } from "@/components/ui";
import { ApiError } from "@/lib/api";
import { useProfessional } from "@/lib/queries";

export default function ProfessionalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const professional = useProfessional(slug);
  if (professional.isPending) return <LoadingBlock lines={6} label="Carregando perfil" />;
  if (professional.isError) {
    if (professional.error instanceof ApiError && professional.error.status === 404) {
      return (
        <EmptyState
          title="Perfil não encontrado."
          description="Este profissional não está disponível no momento."
          href="/profissionais"
          action="Ver outros profissionais"
        />
      );
    }
    return <ErrorBlock error={professional.error} onRetry={() => void professional.refetch()} />;
  }
  return <ProfessionalProfile person={professional.data} />;
}
