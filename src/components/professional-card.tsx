"use client";
import { BadgeCheck, Heart, Star, Video, ArrowRight, Sparkles, MapPin, Clock3 } from "lucide-react";
import type { Professional } from "@/lib/types";
import { professionalProfileHref } from "@/lib/professionals";
import { useJourney } from "./providers";
import { ButtonLink } from "./ui";

export function Avatar({ person, large = false }: { person: Professional; large?: boolean }) {
  return (
    <span
      className={`avatar avatar-${person.tone} ${large ? "avatar-large" : ""}`}
      aria-label={`Avatar ilustrativo de ${person.name}`}
    >
      <span>{person.initials}</span>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="37" r="18" />
        <path d="M15 100V88C15 49 85 49 85 88V100" />
      </svg>
    </span>
  );
}
export function ProfessionalCard({
  person,
  preview = false,
  recommended = false,
}: {
  person: Professional;
  preview?: boolean;
  recommended?: boolean;
}) {
  const { favorites, toggleFavorite } = useJourney();
  const saved = favorites.includes(person.id);
  return (
    <article className={`professional-card ${recommended ? "professional-recommended" : ""}`}>
      {recommended && (
        <div className="recommendation-strip">
          <Sparkles size={14} /> Combina com suas preferências
        </div>
      )}
      <div className="professional-body">
        <div className="professional-top">
          <Avatar person={person} />
          <div className="professional-identity">
            <h3>{person.name}</h3>
            <p>{person.role}</p>
            <span className="verified">
              <BadgeCheck size={14} /> CRP ilustrativo
            </span>
          </div>
          <button
            type="button"
            className={`icon-button favorite-button ${saved ? "is-favorite" : ""}`}
            aria-label={`${saved ? "Remover" : "Adicionar"} ${person.name} ${saved ? "dos" : "aos"} favoritos`}
            aria-pressed={saved}
            onClick={() => toggleFavorite(person.id)}
          >
            <Heart size={20} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="rating">
          <Star size={14} fill="currentColor" />
          <strong>{person.rating}</strong>
          <span>({person.reviews} avaliações ilustrativas)</span>
        </div>
        <p className="professional-approach">{person.approach}</p>
        <div className="chips">
          {person.specialties.slice(0, 2).map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>
        <div className="professional-meta">
          <span>
            {person.mode === "Online" ? <Video size={15} /> : <MapPin size={15} />}
            {person.mode === "Online" ? "Online" : "Florianópolis"}
          </span>
          <span>
            <Clock3 size={14} />
            50 min
          </span>
        </div>
        <div className="professional-divider" />
        <div className="professional-price">
          <div>
            <strong>R$ {person.price}</strong>
            <span> / consulta</span>
          </div>
          <span className="availability">
            <span className="live-dot" />
            {person.time}
          </span>
        </div>
        {preview ? (
          <ButtonLink href="/cadastro" variant="secondary" className="full-width">
            Conhecer profissional <ArrowRight size={16} />
          </ButtonLink>
        ) : (
          <ButtonLink
            className="full-width"
            variant="secondary"
            href={professionalProfileHref(person.id)}
          >
            Ver perfil <ArrowRight size={16} />
          </ButtonLink>
        )}
      </div>
    </article>
  );
}
