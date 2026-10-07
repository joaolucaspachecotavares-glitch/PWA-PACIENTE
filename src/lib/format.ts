import type { AppointmentStatus, Compatibility, Modality } from "./api-types";

export const TIME_ZONE = "America/Sao_Paulo";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatMoney(cents: number): string {
  return money.format(cents / 100);
}

export function formatPrice(cents: number): string {
  return cents % 100 === 0 ? `R$ ${cents / 100}` : formatMoney(cents);
}

const formatters = {
  dayMonth: new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, day: "numeric", month: "long" }),
  weekdayDayMonth: new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }),
  full: new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  time: new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" }),
  short: new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }),
  monthYear: new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", month: "long", year: "numeric" }),
  weekdayShort: new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", weekday: "short" }),
  dayNumber: new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", day: "numeric" }),
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const formatDayMonth = (iso: string) => formatters.dayMonth.format(new Date(iso));
export const formatWeekdayDate = (iso: string) =>
  capitalize(formatters.weekdayDayMonth.format(new Date(iso)));
export const formatFullDate = (iso: string) => formatters.full.format(new Date(iso));
export const formatTime = (iso: string) => formatters.time.format(new Date(iso));
export const formatShortDate = (iso: string) => formatters.short.format(new Date(iso));

/** "YYYY-MM" → "setembro de 2026" */
export function formatMonth(month: string): string {
  return capitalize(formatters.monthYear.format(new Date(`${month}-01T12:00:00Z`)));
}

/** Data de calendário (YYYY-MM-DD) sem conversão de fuso. */
export function calendarDate(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  return {
    weekday: capitalize(formatters.weekdayShort.format(d).replace(".", "")),
    day: formatters.dayNumber.format(d),
    label: capitalize(
      new Intl.DateTimeFormat("pt-BR", {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(d),
    ),
  };
}

export function formatRelativeDays(iso: string, now = new Date()): string {
  const key = (d: Date) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(d);
  const today = key(now);
  const tomorrow = key(new Date(now.getTime() + 86400000));
  const day = key(new Date(iso));
  if (day === today) return "Hoje";
  if (day === tomorrow) return "Amanhã";
  return formatDayMonth(iso);
}

export function formatRating(value: number | null): string {
  return value === null ? "—" : value.toFixed(1).replace(".", ",");
}

export const compatibilityLabel: Record<Compatibility, string> = {
  HIGH: "Alta compatibilidade com suas preferências",
  GOOD: "Boa compatibilidade",
};

export const modalityLabel: Record<Modality, string> = {
  ONLINE: "Online",
  IN_PERSON: "Presencial",
};

export const statusLabel: Record<AppointmentStatus, string> = {
  PENDING_PAYMENT: "Aguardando pagamento",
  CONFIRMED: "Confirmada",
  COMPLETED: "Realizada",
  CANCELLED_BY_PATIENT: "Cancelada por você",
  CANCELLED_BY_PROFESSIONAL: "Cancelada pelo profissional",
  NO_SHOW: "Ausência",
  EXPIRED: "Reserva expirada",
};

export function statusTone(status: AppointmentStatus): "success" | "warning" | "error" | "neutral" {
  if (status === "CONFIRMED" || status === "COMPLETED") return "success";
  if (status === "PENDING_PAYMENT") return "warning";
  if (status.startsWith("CANCELLED") || status === "NO_SHOW") return "error";
  return "neutral";
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Máscara (48) 99999-9999 para exibição/digitação. */
export function maskPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Máscara 000.000.000-00 para exibição/digitação do CPF. */
export function formatCpfInput(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/**
 * URL externa segura para navegar o paciente (ex.: checkout hospedado do
 * gateway). Só aceita `https:`; qualquer outro esquema (`javascript:`,
 * `data:`, `http:` etc.) ou valor que não seja uma URL válida é recusado.
 */
export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

/**
 * Fonte segura para `<img>` vinda do gateway de pagamento (QR Code Pix):
 * uma imagem embutida (`data:image/...`) ou uma URL `https:`.
 */
export function isSafeImageSrc(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.startsWith("data:image/") || safeExternalUrl(value) !== null;
}

/**
 * Verificação imediata de idade para feedback na tela.
 * A regra decisiva é aplicada pela API.
 */
export function isAdult(birthDate: string, today = new Date()): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(today).split("-").map(Number);
  let age = parts[0] - year;
  if (parts[1] < month || (parts[1] === month && parts[2] < day)) age--;
  return year >= 1900 && age >= 18;
}

/** Arquivo .ics para adicionar a consulta ao calendário (sem dados sensíveis). */
export function buildCalendarFile(appointment: {
  id: string;
  startsAt: string;
  endsAt: string;
  professionalName: string;
}): string {
  const stamp = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Luvimind//PWA Paciente//PT",
    "BEGIN:VEVENT",
    `UID:${appointment.id}@luvimind.com`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(appointment.startsAt)}`,
    `DTEND:${stamp(appointment.endsAt)}`,
    `SUMMARY:Consulta com ${appointment.professionalName}`,
    "DESCRIPTION:Consulta agendada pela Luvimind.",
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Lembrete de consulta",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
