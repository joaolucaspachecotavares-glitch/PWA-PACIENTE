"use client";
import { CloudOff, RotateCcw } from "lucide-react";
import { ApiError } from "@/lib/api";
import { Button } from "./ui";

/** Esqueleto de carregamento que mantém o layout estável. */
export function LoadingBlock({ lines = 3, label = "Carregando" }: { lines?: number; label?: string }) {
  return (
    <div className="skeleton-block" role="status" aria-live="polite">
      <span className="sr-only">{label}…</span>
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="skeleton-line" style={{ width: `${95 - i * 15}%` }} />
      ))}
    </div>
  );
}

export function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <div className="professional-grid" role="status" aria-live="polite">
      <span className="sr-only">Carregando profissionais…</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card" aria-hidden="true">
          <span className="skeleton-circle" />
          <span className="skeleton-line" />
          <span className="skeleton-line short" />
          <span className="skeleton-line" />
        </div>
      ))}
    </div>
  );
}

export function ErrorBlock({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message =
    error instanceof ApiError ? error.message : "Não conseguimos carregar estas informações.";
  const offline = error instanceof ApiError && error.status === 0;
  return (
    <div className="error-block" role="alert">
      <CloudOff size={26} aria-hidden="true" />
      <div>
        <strong>{offline ? "Você está sem conexão." : "Algo não saiu como esperado."}</strong>
        <p>{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RotateCcw size={16} /> Tentar novamente
        </Button>
      )}
    </div>
  );
}
