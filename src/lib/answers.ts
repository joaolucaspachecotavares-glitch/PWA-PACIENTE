import type { QuestionOption } from "./api-types";

/**
 * Seleção de respostas do questionário.
 * - Pergunta única: sempre uma opção.
 * - Opção exclusiva (ex.: "Prefiro não responder"): substitui as demais.
 * - Opção comum: remove as exclusivas e alterna a seleção.
 */
export function toggleOption(
  current: string[],
  option: QuestionOption,
  multiple: boolean,
  all: QuestionOption[],
): string[] {
  if (!multiple) return [option.code];
  if (option.exclusive) return current.includes(option.code) ? [] : [option.code];
  const exclusive = new Set(all.filter((o) => o.exclusive).map((o) => o.code));
  const base = current.filter((c) => !exclusive.has(c));
  return base.includes(option.code) ? base.filter((c) => c !== option.code) : [...base, option.code];
}
