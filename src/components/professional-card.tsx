"use client";
import { ArrowRight, BadgeCheck, CalendarClock, Heart, MapPin, Sparkles, Star, Video } from "lucide-react";
import type { Compatibility, Modality, ProfessionalCardData } from "@/lib/api-types";
import {
  compatibilityLabel,
  formatPrice,
  formatRating,
  formatRelativeDays,
  formatTime,
  modalityLabel,
} from "@/lib/format";
import { useToggleFavorite } from "@/lib/queries";
import { ButtonLink } from "./ui";

const TONES = ["sage", "sand", "rose", "blue"];

export function Avatar({
  person,
  large = false,
}: {
  person: { id: string; name: string; initials: string; photoUrl: string | null };
  large?: boolean;
}) {
  const tone = TONES[[...person.id].reduce((sum, c) => sum + c.charCodeAt(0), 0) % TONES.length];
  if (person.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- fotos hospedadas por terceiros
      <img
        className={`avatar avatar-photo ${large ? "avatar-large" : ""}`}
        src={person.photoUrl}
        alt={`Foto de ${person.name}`}
        loading="lazy"
      />
    );
  }
  return (
    <span className={`avatar avatar-${tone} ${large ? "avatar-large" : ""}`} role="img" aria-label={`Iniciais de ${person.name}`}>
      <span>{person.initials}</span>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="37" r="18" />
        <path d="M15 100V88C15 49 85 49 85 88V100" />
      </svg>
    </span>
  );
}

export function RatingLine({ average, count }: { average: number | null; count: number }) {
  if (!count || average === null) {
    return (
      <div className="rating">
        <Sparkles size={14} />
        <span>Novo na Luvimind</span>
      </div>
    );
  }
  return (
    <div className="rating">
      <Star size={14} fill="currentColor" />
      <strong>{formatRating(average)}</strong>
      <span>
        ({count} {count === 1 ? "avaliação" : "avaliações"})
      </span>
    </div>
  );
}

export function ModalityLine({ modalities }: { modalities: Modality[] }) {
  return (
    <span className="modality-line">
      {modalities.includes("ONLINE") ? <Video size={15} /> : <MapPin size={15} />}
      {modalities.map((m) => modalityLabel[m]).join(" · ")}
    </span>
  );
}

export function CompatibilityTag({ value }: { value: Compatibility | null | undefined }) {
  if (!value) return null;
  return (
    <div className={`compatibility-tag compatibility-${value.toLowerCase()}`}>
      <Sparkles size={14} /> {compatibilityLabel[value]}
    </div>
  );
}

export function FavoriteButton({ id, name, favorite }: { id: string; name: string; favorite: boolean }) {
  const toggle = useToggleFavorite();
  const saved = toggle.isPending ? !favorite : favorite;
  return (
    <button
      type="button"
      className={`icon-button favorite-button ${saved ? "is-favorite" : ""}`}
      aria-label={`${saved ? "Remover" : "Adicionar"} ${name} ${saved ? "dos" : "aos"} favoritos`}
      aria-pressed={saved}
      disabled={toggle.isPending}
      onClick={() => toggle.mutate({ id, favorite: !favorite })}
    >
      <Heart size={20} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}

export function ProfessionalCard({ person, highlight = false }: { person: ProfessionalCardData; highlight?: boolean }) {
  const href = `/profissionais/${person.slug}`;
  return (
    <article className={`professional-card ${highlight ? "professional-recommended" : ""}`}>
      <CompatibilityTag value={person.compatibility} />
      <div className="professional-body">
        <div className="professional-top">
          <Avatar person={person} />
          <div className="professional-identity">
            <h3>{person.name}</h3>
            <p>{person.profession}</p>
            {person.verified && (
              <span className="verified">
                <BadgeCheck size={14} /> CRP verificado
              </span>
            )}
          </div>
          {person.favorite !== undefined && (
            <FavoriteButton id={person.id} name={person.name} favorite={person.favorite} />
          )}
        </div>
        <RatingLine average={person.ratingAverage} count={person.ratingCount} />
        {person.approach && <p className="professional-approach">{person.approach}</p>}
        <div className="chips">
          {person.specialties.slice(0, 3).map((s) => (
            <span className="chip" key={s.slug}>
              {s.name}
            </span>
          ))}
        </div>
        <div className="professional-meta">
          <ModalityLine modalities={person.modalities} />
          <span>{person.durationMin} min</span>
        </div>
        <div className="professional-divider" />
        <div className="professional-price">
          <div>
            <strong>{formatPrice(person.priceCents)}</strong>
            <span> / consulta</span>
          </div>
          {person.nextSlotAt ? (
            <span className="availability">
              <CalendarClock size={14} />
              {formatRelativeDays(person.nextSlotAt)} · {formatTime(person.nextSlotAt)}
            </span>
          ) : (
            <span className="availability muted">Sem horários no momento</span>
          )}
        </div>
        <ButtonLink className="full-width" variant="secondary" href={href}>
          Ver perfil <ArrowRight size={16} />
        </ButtonLink>
      </div>
    </article>
  );
}
