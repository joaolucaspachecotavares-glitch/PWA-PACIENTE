"use client";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Info,
  LoaderCircle,
  Sprout,
  Star,
  TriangleAlert,
  X,
} from "lucide-react";

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className={`brand ${small ? "brand-small" : ""}`} aria-label="Luvimind, página inicial">
      <span className="brand-symbol" aria-hidden="true">
        <Sprout size={27} strokeWidth={1.7} />
      </span>
      <span>
        luvi<span className="brand-light">mind</span>
        <span className="brand-dot">.</span>
      </span>
    </Link>
  );
}

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle className="spin" size={18} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  arrow = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link href={href} className={`button button-${variant} ${className}`}>
      {children}
      {arrow && <ArrowRight size={18} />}
    </Link>
  );
}

export function BackLink({ href, label = "Voltar" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="back-link">
      <ArrowLeft size={18} />
      {label}
    </Link>
  );
}

export function Badge({
  children,
  tone = "success",
}: {
  children: ReactNode;
  tone?: "success" | "warning" | "error" | "neutral" | "info";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onCancel={onClose}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="dialog"
    >
      <div className="dialog-inner">
        <div className="dialog-heading">
          <h2 id={id}>{title}</h2>
          <button type="button" className="icon-button" aria-label="Fechar" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  href,
  action,
  icon,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="round-icon">{icon ?? <Sprout size={28} />}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {href && action && (
        <ButtonLink href={href} arrow>
          {action}
        </ButtonLink>
      )}
    </div>
  );
}

const ALERT_ICONS = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
};

export function Alert({
  tone = "info",
  title,
  children,
  role,
}: {
  tone?: keyof typeof ALERT_ICONS;
  title?: string;
  children?: ReactNode;
  role?: "alert" | "status";
}) {
  const Icon = ALERT_ICONS[tone];
  return (
    <div className={`alert alert-${tone}`} role={role}>
      <Icon size={20} aria-hidden="true" />
      <div>
        {title && <strong>{title}</strong>}
        {children && <div className="alert-body">{children}</div>}
      </div>
    </div>
  );
}

export function Field({
  label,
  error,
  hint,
  id,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  id: string;
  children?: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && (
        <span id={`${id}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}

/** Input com ligação acessível de erro/ajuda para uso dentro de <Field>. */
export function TextInput({
  id,
  error,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string; error?: string; hint?: string }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return <input id={id} name={id} aria-invalid={!!error} aria-describedby={describedBy} {...props} />;
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} fill={n <= Math.round(value) ? "currentColor" : "none"} />
      ))}
    </span>
  );
}
