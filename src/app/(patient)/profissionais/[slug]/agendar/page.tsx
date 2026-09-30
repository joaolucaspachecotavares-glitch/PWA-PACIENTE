"use client";
import { use } from "react";
import { BookingFlow } from "@/components/booking-flow";
import { ErrorBlock, LoadingBlock } from "@/components/query-state";
import { EmptyState } from "@/components/ui";
import { useProfessional } from "@/lib/queries";

export default function SchedulePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tipo?: string; horario?: string }>;
}) {
  const { slug } = use(params);
  const { tipo, horario } = use(searchParams);
  const professional = useProfessional(slug);
  if (professional.isPending) return <LoadingBlock lines={5} />;
  if (professional.isError) return <ErrorBlock error={professional.error} onRetry={() => void professional.refetch()} />;
  const person = professional.data;
  const introCall = tipo === "conversa-inicial" && person.offersIntroCall;
  if (!person.bookable) {
    return (
      <EmptyState
        title="Agendamento indisponível."
        description="Este profissional não está recebendo novos agendamentos no momento."
        href="/profissionais"
        action="Ver outros profissionais"
      />
    );
  }
  return <BookingFlow person={person} introCall={introCall} preselected={horario} />;
}
