import type { Answers, Professional } from "./types.ts";

export function isAdult(birthDate: string, today = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return false;
  const [year, month, day] = birthDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    year < 1900 ||
    date > today
  )
    return false;
  let age = today.getFullYear() - year;
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  )
    age--;
  return age >= 18;
}

// Ordenação ilustrativa e determinística. Não é um instrumento clínico.
export function rankProfessionals(
  items: Professional[],
  answers: Answers,
): Professional[] {
  const score = (p: Professional) => {
    let total =
      p.specialties.filter((s) => answers.interests?.includes(s)).length * 4;
    if (answers.mode?.includes(p.mode)) total += 3;
    const budget = Number(answers.budget?.[0]?.match(/\d+/)?.[0]);
    if (budget && p.price <= budget) total += 2;
    const hour = Number(p.time.split(":")[0]);
    if (
      answers.schedule?.includes(
        hour < 12 ? "Manhã" : hour < 18 ? "Tarde" : "Noite",
      )
    )
      total += 1;
    return total;
  };
  return [...items].sort((a, b) => score(b) - score(a));
}

export function toggleAnswer(
  current: string[],
  option: string,
  multiple: boolean,
): string[] {
  if (!multiple) return [option];
  if (current.includes(option)) return current.filter((v) => v !== option);
  if (option === "Prefiro não responder") return [option];
  return [...current.filter((v) => v !== "Prefiro não responder"), option];
}

export function preferenceSummary(answers: Answers): string[] {
  return [
    answers.mode?.[0],
    answers.budget?.[0],
    answers.schedule?.join(" e "),
    answers.style?.[0],
  ].filter((v): v is string => !!v);
}

export type RegistrationInput = {
  name: string;
  birthDate: string;
  email: string;
  phone: string;
  password: string;
  consent: boolean;
};
export function validateRegistration(
  input: RegistrationInput,
  today = new Date(),
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (typeof input.name !== "string" || input.name.trim().length < 2)
    errors.name = "Informe seu nome.";
  if (typeof input.birthDate !== "string" || !isAdult(input.birthDate, today))
    errors.birthDate =
      "O cadastro está disponível para pessoas com 18 anos ou mais. Confira a data informada.";
  if (
    typeof input.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
  )
    errors.email = "Informe um e-mail válido.";
  if (
    typeof input.phone !== "string" ||
    !/^\d{10,11}$/.test(input.phone.replace(/\D/g, ""))
  )
    errors.phone = "Informe o telefone com DDD.";
  if (typeof input.password !== "string" || input.password.length < 8)
    errors.password = "Use pelo menos 8 caracteres.";
  if (input.consent !== true)
    errors.consent = "Confirme sua idade e o aceite para continuar.";
  return errors;
}
