import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, MapPin, Video } from "lucide-react";
import type { Appointment } from "@/lib/api-types";
import { formatTime, formatWeekdayDate, modalityLabel, statusLabel, statusTone } from "@/lib/format";
import { Avatar } from "./professional-card";
import { Badge } from "./ui";

export function AppointmentCard({ appointment: a, highlight = false }: { appointment: Appointment; highlight?: boolean }) {
  const ModalityIcon = a.modality === "ONLINE" ? Video : MapPin;
  return (
    <article className={`appointment-card ${highlight ? "" : "appointment-compact"}`}>
      <div className="appointment-heading">
        <span className="eyebrow">{highlight ? "PRÓXIMA CONSULTA" : a.kind === "INTRO_CALL" ? "CONVERSA INICIAL" : "CONSULTA"}</span>
        <Badge tone={statusTone(a.status)}>{statusLabel[a.status]}</Badge>
      </div>
      <div className="appointment-person">
        <Avatar person={a.professional} />
        <div>
          <h3>{a.professional.name}</h3>
          <p>{a.professional.profession}</p>
        </div>
      </div>
      <div className="appointment-details">
        <span>
          <CalendarDays size={18} />
          <strong>{formatWeekdayDate(a.startsAt)}</strong>
        </span>
        <span>
          <Clock3 size={18} />
          <strong>{formatTime(a.startsAt)}</strong>
        </span>
        <span>
          <ModalityIcon size={18} />
          <strong>{modalityLabel[a.modality]}</strong>
        </span>
      </div>
      <div className="appointment-footer">
        {a.status === "PENDING_PAYMENT" ? (
          <Link className="button button-primary" href={`/consultas/${a.id}/pagamento`}>
            Concluir pagamento <ArrowUpRight size={17} />
          </Link>
        ) : (
          <Link className="button button-secondary" href={a.canReview ? `/consultas/${a.id}/avaliar` : `/consultas/${a.id}`}>
            {a.canReview ? "Avaliar consulta" : "Ver consulta"} <ArrowUpRight size={17} />
          </Link>
        )}
      </div>
    </article>
  );
}
