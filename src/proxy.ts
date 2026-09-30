import { NextResponse, type NextRequest } from "next/server";

// Redirecionamentos otimistas baseados na presença do cookie de sessão.
// A autorização real acontece na API a cada requisição.

const SESSION_COOKIE = "lm_rt";
const PATIENT_AREA = [
  "/inicio",
  "/resultados",
  "/profissionais",
  "/consultas",
  "/jornada",
  "/perfil",
  "/notificacoes",
  "/ajuda",
];
const GUEST_ONLY = ["/entrar", "/cadastro", "/esqueci-senha"];

const matches = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(`${p}/`));

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasSession ? "/inicio" : "/onboarding", request.url));
  }
  if (!hasSession && matches(pathname, PATIENT_AREA)) {
    const url = new URL("/entrar", request.url);
    url.searchParams.set("proximo", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }
  if (hasSession && matches(pathname, GUEST_ONLY)) {
    return NextResponse.redirect(new URL("/inicio", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icons|favicon|icon.svg|apple-icon|manifest|sw.js|offline.html).*)"],
};
