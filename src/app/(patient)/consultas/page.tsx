"use client";
import { useState } from "react";
import { AppointmentCard } from "@/components/appointment-card";
import { EmptyState } from "@/components/ui";
export default function AppointmentsPage() {
  const [tab, setTab] = useState("Próximas");
  return (
    <>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">TEMPO PARA VOCÊ</p>
          <h1>Minhas consultas</h1>
          <p>Seus encontros, organizados em um só lugar.</p>
        </div>
      </div>
      <div className="tabs" role="group" aria-label="Filtrar consultas">
        {["Próximas", "Realizadas", "Canceladas"].map((t) => (
          <button
            key={t}
            aria-pressed={tab === t}
            className={tab === t ? "tab-active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Próximas" ? (
        <div className="appointments-list">
          <AppointmentCard />
        </div>
      ) : (
        <EmptyState
          title={
            tab === "Realizadas"
              ? "Cada encontro faz parte da sua história."
              : "Nenhuma consulta cancelada."
          }
          description={
            tab === "Realizadas"
              ? "O histórico detalhado será conectado na próxima etapa. Os números da jornada são ilustrativos."
              : "Quando houver um cancelamento, você poderá consultar os detalhes aqui."
          }
          href="/profissionais"
          action="Explorar profissionais"
        />
      )}
    </>
  );
}
