/**
 * Rotas de autenticação não renovam a sessão num 401 (login, cadastro, refresh), exceto
 * `/auth/me` renova: o cookie de acesso dura 15 minutos e o de renovação, 30 dias.
 */
export function shouldRefreshOn401(path: string): boolean {
  return path === "/auth/me" || !path.startsWith("/auth/");
}
