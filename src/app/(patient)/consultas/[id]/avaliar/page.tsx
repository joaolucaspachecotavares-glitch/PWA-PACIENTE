"use client";
import { use } from "react";
import { ErrorBlock, LoadingBlock } from "@/components/query-state";
import { ReviewForm } from "@/components/review-form";
import { EmptyState } from "@/components/ui";
import { useAppointment } from "@/lib/queries";

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const appointment = useAppointment(id);
  if (appointment.isPending) return <LoadingBlock lines={5} />;
  if (appointment.isError) return <ErrorBlock error={appointment.error} onRetry={() => void appointment.refetch()} />;
  const a = appointment.data;
  if (a.reviewed) {
    return <EmptyState title="Avaliação enviada." description="Obrigado por compartilhar sua experiência." href="/consultas" action="Minhas consultas" />;
  }
  if (!a.canReview) {
    return (
      <EmptyState
        title="Avaliação ainda indisponível."
        description="Você poderá avaliar depois que a consulta acontecer."
        href={`/consultas/${a.id}`}
        action="Ver consulta"
      />
    );
  }
  return <ReviewForm appointment={a} />;
}
