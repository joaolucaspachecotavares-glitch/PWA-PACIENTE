// Cliente HTTP da PWA. Todas as chamadas passam por /api (rewrite para a API
// central), para que os cookies de sessão pertençam ao domínio do app.

import { shouldRefreshOn401 } from "./session";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly errors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Options = Omit<RequestInit, "body"> & { body?: unknown };

let refreshing: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  refreshing ??= fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "same-origin",
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

async function parseError(res: Response): Promise<ApiError> {
  let message = "Algo não saiu como esperado. Tente novamente.";
  let errors: Record<string, string> = {};
  try {
    const data = (await res.json()) as {
      message?: string | string[];
      errors?: Record<string, string>;
    };
    if (typeof data.message === "string") message = data.message;
    if (data.errors) errors = data.errors;
  } catch {
    // resposta sem corpo JSON
  }
  if (res.status === 429) {
    message = "Muitas tentativas em pouco tempo. Aguarde um minuto e tente novamente.";
  }
  if (res.status >= 500) {
    message = "Nossos serviços estão instáveis no momento. Tente novamente em instantes.";
  }
  return new ApiError(res.status, message, errors);
}

/** Faz a requisição renovando a sessão uma vez se o acesso expirou; lança ApiError se falhar. */
async function request(path: string, options: Options, accept: string): Promise<Response> {
  const { body, headers, ...rest } = options;
  const init: RequestInit = {
    ...rest,
    credentials: "same-origin",
    headers: {
      Accept: accept,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
  const url = `/api${path}`;

  let res: Response;
  try {
    res = await fetch(url, init);
    if (res.status === 401 && shouldRefreshOn401(path)) {
      if (await refreshSession()) res = await fetch(url, init);
    }
  } catch {
    throw new ApiError(0, "Sem conexão com a internet. Confira sua rede e tente novamente.");
  }
  if (!res.ok) throw await parseError(res);
  return res;
}

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const res = await request(path, options, "application/json");
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Baixa um arquivo gerado pela API (ex.: PDF) e dispara o download no navegador. */
export async function downloadFile(path: string, filename: string, accept: string): Promise<void> {
  const res = await request(path, {}, accept);
  const url = URL.createObjectURL(await res.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // Revoga depois que o navegador inicia o download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const isUnauthorized = (error: unknown) =>
  error instanceof ApiError && error.status === 401;
