"use client";
import { use } from "react";
import { AppointmentDetail } from "@/components/appointment-detail";
import { ErrorBlock, LoadingBlock } from "@/components/query-state";
import { EmptyState } from "@/components/ui";
import { ApiError } from "@/lib/api";
import { useAppointment } from "@/lib/queries";

export default function AppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const appointment = useAppointment(id);
  if (appointment.isPending) return <LoadingBlock lines={5} />;
  if (appointment.isError) {
    if (appointment.error instanceof ApiError && [400, 404].includes(appointment.error.status)) {
      return <EmptyState title="Consulta não encontrada." description="Confira suas consultas." href="/consultas" action="Minhas consultas" />;
    }
    return <ErrorBlock error={appointment.error} onRetry={() => void appointment.refetch()} />;
  }
  return <AppointmentDetail appointment={appointment.data} />;
}
