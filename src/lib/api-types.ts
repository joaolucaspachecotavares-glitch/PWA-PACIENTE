// Contratos da API Luvimind consumidos pela PWA Paciente.
// Datas em ISO 8601 (UTC). Valores monetários em centavos.

export type Answers = Record<string, string[]>;

export type QuestionOption = { code: string; label: string; exclusive: boolean };
export type Question = {
  id: string;
  title: string;
  subtitle: string;
  multiple: boolean;
  options: QuestionOption[];
};
export type Questionnaire = { key: string; questions: Question[] };

export type Compatibility = "HIGH" | "GOOD";
export type Modality = "ONLINE" | "IN_PERSON";

export type MatchingPreview = {
  urgentSupport: boolean;
  preferences: string[];
  total: number;
  preview: {
    id: string;
    name: string;
    initials: string;
    profession: string;
    verified: boolean;
    photoUrl: string | null;
    ratingAverage: number | null;
    ratingCount: number;
    modalities: Modality[];
    priceCents: number;
    compatibility: Compatibility;
  }[];
};

export type ProfessionalCardData = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  profession: string;
  verified: boolean;
  photoUrl: string | null;
  ratingAverage: number | null;
  ratingCount: number;
  specialties: { slug: string; name: string }[];
  approach: string;
  modalities: Modality[];
  priceCents: number;
  durationMin: number;
  nextSlotAt: string | null;
  offersIntroCall: boolean;
  compatibility?: Compatibility | null;
  favorite?: boolean;
  bookable?: boolean;
};

export type MatchingResults =
  | { needsQuestionnaire: true }
  | {
      needsQuestionnaire: false;
      answeredAt: string;
      urgentSupport: boolean;
      preferences: string[];
      top: ProfessionalCardData[];
      others: ProfessionalCardData[];
    };

export type ProfessionalProfileData = ProfessionalCardData & {
  registrationNumber: string | null;
  bio: string;
  education: string;
  experience: string;
  careStyles: ("WELCOMING" | "OBJECTIVE")[];
  languages: string[];
  city: string | null;
  video: { provider: "YOUTUBE"; externalId: string } | null;
  bookable: boolean;
  favorite: boolean;
  ratingCategories: Record<
    "welcoming" | "communication" | "punctuality" | "organization" | "experience",
    number | null
  > | null;
};

export type SlotsResponse = {
  timeZone: string;
  durationMin: number;
  slots: { startsAt: string; date: string }[];
};

export type Specialty = { slug: string; name: string };

export type AppointmentStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED_BY_PATIENT"
  | "CANCELLED_BY_PROFESSIONAL"
  | "NO_SHOW"
  | "EXPIRED";

export type PaymentStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "AWAITING_SESSION"
  | "SESSION_COMPLETED"
  | "ELIGIBLE_FOR_PAYOUT"
  | "PAYOUT_SCHEDULED"
  | "PAID_OUT"
  | "REFUNDED"
  | "FAILED"
  | "EXPIRED"
  | "CHARGEBACK";

export type Appointment = {
  id: string;
  kind: "CONSULTATION" | "INTRO_CALL";
  status: AppointmentStatus;
  modality: Modality;
  startsAt: string;
  endsAt: string;
  priceCents: number;
  holdExpiresAt: string | null;
  professional: {
    id: string;
    slug: string;
    name: string;
    initials: string;
    profession: string;
    photoUrl: string | null;
  };
  payment: { status: PaymentStatus; method: "PIX" | "CARD" } | null;
  canCancel: boolean;
  refundIfCancelledNow: boolean;
  canReview: boolean;
  reviewed: boolean;
  attended: boolean;
  canJoin: boolean;
  meetingUrl: string | null;
  shared: { summary: boolean; preferences: boolean; questionnaire: false };
  summary?: string;
  refundEligible: boolean | null;
};

export type CancellationPreview = {
  allowed: boolean;
  refundEligible: boolean;
  minutesUntilStart: number;
};

export type PaymentState = {
  appointmentStatus: AppointmentStatus;
  amountCents: number;
  holdExpiresAt: string | null;
  sandbox: boolean;
  cpfRequired: boolean;
  payment: {
    status: PaymentStatus;
    method: "PIX" | "CARD";
    pixPayload: string | null;
    pixQrImage: string | null;
    checkoutUrl: string | null;
    expiresAt: string | null;
    paidAt: string | null;
  } | null;
};

export type Me = {
  id: string;
  name: string;
  firstName: string;
  email: string;
  phone: string | null;
  role: "PATIENT";
  createdAt: string;
};

export type PatientProfile = {
  name: string;
  firstName: string;
  email: string;
  phone: string | null;
  birthDate: string;
  createdAt: string;
  cpfMasked: string | null;
};

export type Journey = {
  attended: number;
  upcoming: number;
  cancelled: number;
  missed: number;
  consecutive: number;
  achievements: {
    code: string;
    title: string;
    description: string;
    target: number;
    progress: number;
    achieved: boolean;
  }[];
  byMonth: { month: string; attended: number }[];
};

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  readAt: string | null;
  createdAt: string;
};

export type SharedData = {
  appointmentId: string;
  professionalName: string;
  startsAt: string;
  consentAt: string | null;
  summary: boolean;
  preferences: boolean;
  questionnaire: false;
}[];

export type Review = {
  id: string;
  overall: number;
  comment: string | null;
  createdAt: string;
};
