// Cliente HTTP da PWA. Todas as chamadas passam por /api (rewrite para a API
// central), para que os cookies de sessão pertençam ao domínio do app.

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

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const init: RequestInit = {
    ...rest,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
  const url = `/api${path}`;

  let res: Response;
  try {
    res = await fetch(url, init);
    if (res.status === 401 && !path.startsWith("/auth/")) {
      if (await refreshSession()) res = await fetch(url, init);
    }
  } catch {
    throw new ApiError(0, "Sem conexão com a internet. Confira sua rede e tente novamente.");
  }
  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const isUnauthorized = (error: unknown) =>
  error instanceof ApiError && error.status === 401;
