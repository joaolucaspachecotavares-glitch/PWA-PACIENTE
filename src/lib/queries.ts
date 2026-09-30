"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, isUnauthorized } from "./api";
import type {
  Answers,
  Appointment,
  CancellationPreview,
  Journey,
  MatchingResults,
  Me,
  NotificationItem,
  PatientProfile,
  PaymentState,
  ProfessionalCardData,
  ProfessionalProfileData,
  Questionnaire,
  Review,
  SharedData,
  SlotsResponse,
  Specialty,
} from "./api-types";

export const keys = {
  me: ["me"] as const,
  questionnaire: ["questionnaire"] as const,
  results: ["matching", "results"] as const,
  answers: ["matching", "answers"] as const,
  professionals: (filters: Record<string, string>) => ["professionals", filters] as const,
  professional: (slug: string) => ["professional", slug] as const,
  reviews: (slug: string) => ["professional", slug, "reviews"] as const,
  slots: (slug: string) => ["professional", slug, "slots"] as const,
  favorites: ["favorites"] as const,
  specialties: ["specialties"] as const,
  appointments: (scope: string) => ["appointments", scope] as const,
  appointment: (id: string) => ["appointment", id] as const,
  payment: (id: string) => ["appointment", id, "payment"] as const,
  journey: ["journey"] as const,
  profile: ["profile"] as const,
  notifications: ["notifications"] as const,
  shared: ["shared-data"] as const,
};

/** Sessão atual; `null` quando não autenticado. */
export function useMe() {
  return useQuery({
    queryKey: keys.me,
    queryFn: async () => {
      try {
        return await api<Me>("/auth/me");
      } catch (error) {
        if (isUnauthorized(error)) return null;
        throw error;
      }
    },
    staleTime: 60_000,
  });
}

export function useQuestionnaire() {
  return useQuery({
    queryKey: keys.questionnaire,
    queryFn: () => api<Questionnaire>("/questionnaire"),
    staleTime: Infinity,
  });
}

export function useResults() {
  return useQuery({ queryKey: keys.results, queryFn: () => api<MatchingResults>("/matching/results") });
}

export function useSavedAnswers() {
  return useQuery({
    queryKey: keys.answers,
    queryFn: () => api<{ answers: Answers | null; answeredAt: string | null }>("/matching/answers"),
  });
}

export function useProfessionals(filters: Record<string, string>) {
  const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
  return useQuery({
    queryKey: keys.professionals(filters),
    queryFn: () => api<ProfessionalCardData[]>(`/professionals?${params}`),
    placeholderData: (previous) => previous,
  });
}

export function useProfessional(slug: string) {
  return useQuery({
    queryKey: keys.professional(slug),
    queryFn: () => api<ProfessionalProfileData>(`/professionals/${encodeURIComponent(slug)}`),
  });
}

export function useProfessionalReviews(slug: string) {
  return useQuery({
    queryKey: keys.reviews(slug),
    queryFn: () => api<Review[]>(`/professionals/${encodeURIComponent(slug)}/reviews`),
  });
}

export function useSlots(slug: string) {
  return useQuery({
    queryKey: keys.slots(slug),
    queryFn: () => api<SlotsResponse>(`/professionals/${encodeURIComponent(slug)}/slots`),
    refetchInterval: 60_000,
  });
}

export function useSpecialties() {
  return useQuery({
    queryKey: keys.specialties,
    queryFn: () => api<Specialty[]>("/specialties"),
    staleTime: Infinity,
  });
}

export function useFavorites() {
  return useQuery({ queryKey: keys.favorites, queryFn: () => api<ProfessionalCardData[]>("/favorites") });
}

export function useToggleFavorite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) =>
      api<void>(`/favorites/${id}`, { method: favorite ? "PUT" : "DELETE" }),
    onSettled: () => {
      void client.invalidateQueries({ queryKey: keys.favorites });
      void client.invalidateQueries({ queryKey: ["professionals"] });
      void client.invalidateQueries({ queryKey: ["professional"] });
    },
  });
}

export function useAppointments(scope: "upcoming" | "past" | "all") {
  return useQuery({
    queryKey: keys.appointments(scope),
    queryFn: () => api<Appointment[]>(`/appointments?scope=${scope}`),
  });
}

export function useAppointment(id: string) {
  return useQuery({ queryKey: keys.appointment(id), queryFn: () => api<Appointment>(`/appointments/${id}`) });
}

export function useCancellationPreview(id: string, enabled: boolean) {
  return useQuery({
    queryKey: [...keys.appointment(id), "cancellation"],
    queryFn: () => api<CancellationPreview>(`/appointments/${id}/cancellation`),
    enabled,
    staleTime: 0,
  });
}

export function usePaymentState(id: string, poll: boolean) {
  return useQuery({
    queryKey: keys.payment(id),
    queryFn: () => api<PaymentState>(`/appointments/${id}/payment`),
    refetchInterval: poll ? 4000 : false,
  });
}

export function useJourneyData() {
  return useQuery({ queryKey: keys.journey, queryFn: () => api<Journey>("/patients/me/journey") });
}

export function useProfile() {
  return useQuery({ queryKey: keys.profile, queryFn: () => api<PatientProfile>("/patients/me") });
}

export function useNotifications() {
  return useQuery({
    queryKey: keys.notifications,
    queryFn: () => api<{ items: NotificationItem[]; unread: number }>("/notifications"),
    refetchInterval: 60_000,
  });
}

export function useSharedData() {
  return useQuery({ queryKey: keys.shared, queryFn: () => api<SharedData>("/patients/me/shared-data") });
}

/** Após ações que alteram consultas/pagamentos, atualiza tudo que depende delas. */
export function useInvalidateAppointments() {
  const client = useQueryClient();
  return () =>
    Promise.all([
      client.invalidateQueries({ queryKey: ["appointments"] }),
      client.invalidateQueries({ queryKey: ["appointment"] }),
      client.invalidateQueries({ queryKey: keys.journey }),
      client.invalidateQueries({ queryKey: keys.notifications }),
      client.invalidateQueries({ queryKey: ["professional"] }),
    ]);
}
