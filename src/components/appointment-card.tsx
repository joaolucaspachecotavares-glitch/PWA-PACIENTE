"use client";
import { useState } from "react";
import { CalendarDays, Clock3, Video, ArrowUpRight } from "lucide-react";
import { professionals } from "@/lib/professionals";
import { Avatar } from "./professional-card";
import { Badge, Button, Dialog } from "./ui";
export function AppointmentCard() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <article className="appointment-card">
        <div className="appointment-heading">
          <span className="eyebrow">PRÓXIMA CONSULTA</span>
          <Badge neutral>Exemplo de consulta</Badge>
        </div>
        <div className="appointment-person">
          <Avatar person={professionals[0]} />
          <div>
            <h3>Ana Martins</h3>
            <p>Psicóloga · Terapia cognitivo-comportamental</p>
          </div>
        </div>
        <div className="appointment-details">
          <span>
            <CalendarDays size={18} />
            <strong>28 de setembro</strong>
            <small>Segunda-feira · 2026</small>
          </span>
          <span>
            <Clock3 size={18} />
            <strong>19:00</strong>
            <small>50 minutos</small>
          </span>
          <span>
            <Video size={18} />
            <strong>Online</strong>
            <small>No seu espaço</small>
          </span>
        </div>
        <div className="appointment-footer">
          <span>
            <span className="live-dot" /> Um tempo reservado para você.
          </span>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Ver consulta <ArrowUpRight size={17} />
          </Button>
        </div>
      </article>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Seu próximo encontro"
      >
        <div className="appointment-person">
          <Avatar person={professionals[0]} />
          <div>
            <h3>Ana Martins</h3>
            <p>Psicóloga · Perfil ilustrativo</p>
          </div>
        </div>
        <dl className="detail-list">
          <div>
            <dt>Data</dt>
            <dd>28 de setembro de 2026</dd>
          </div>
          <div>
            <dt>Horário</dt>
            <dd>19:00 · horário de Brasília</dd>
          </div>
          <div>
            <dt>Formato</dt>
            <dd>Online · 50 minutos</dd>
          </div>
          <div>
            <dt>Valor de exemplo</dt>
            <dd>R$ 150,00</dd>
          </div>
        </dl>
        <div className="notice">
          <CalendarDays size={22} />
          <p>
            Esta consulta é um exemplo visual. Não há reserva, cobrança ou
            chamada de vídeo disponível nesta demonstração.
          </p>
        </div>
        <Button className="full-width" onClick={() => setOpen(false)}>
          Entendi
        </Button>
      </Dialog>
    </>
  );
}
