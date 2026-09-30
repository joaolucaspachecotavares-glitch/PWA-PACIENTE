"use client";
import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Bell, CalendarDays, CircleHelp, Heart, House, Search, Sprout, UserRound } from "lucide-react";
import { api } from "@/lib/api";
import { useMe, useNotifications } from "@/lib/queries";
import { LoadingBlock } from "./query-state";
import { Brand } from "./ui";

const navigation = [
  { href: "/inicio", label: "Início", icon: House, match: ["/inicio"] },
  { href: "/profissionais", label: "Profissionais", icon: Search, match: ["/profissionais", "/resultados"] },
  { href: "/consultas", label: "Consultas", icon: CalendarDays, match: ["/consultas"] },
  { href: "/jornada", label: "Jornada", icon: Sprout, match: ["/jornada"] },
  { href: "/perfil", label: "Perfil", icon: UserRound, match: ["/perfil", "/notificacoes", "/ajuda"] },
];

export function PatientShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const client = useQueryClient();
  const me = useMe();
  const notifications = useNotifications();
  const unread = notifications.data?.unread ?? 0;

  // Sessão inválida: limpa cookies e volta para a entrada.
  // Só age com uma resposta atual: um "null" em cache (visita anônima antes do login)
  // não pode derrubar a sessão recém-criada enquanto a revalidação está em andamento.
  const signedOut = me.data === null && !me.isFetching;
  useEffect(() => {
    if (signedOut) {
      void api("/auth/logout", { method: "POST" })
        .catch(() => undefined)
        .finally(() => {
          client.clear();
          router.replace(`/entrar?proximo=${encodeURIComponent(path)}`);
        });
    }
  }, [signedOut, path, router, client]);

  const isActive = (match: string[]) => match.some((m) => path === m || path.startsWith(`${m}/`));
  const current = navigation.find((n) => isActive(n.match))?.label ?? "Seu espaço";
  const initial = (me.data?.firstName ?? "").slice(0, 1).toUpperCase() || "•";

  return (
    <div className="patient-shell">
      <aside className="sidebar">
        <Brand />
        <div className="sidebar-label">SEU ESPAÇO DE CUIDADO</div>
        <nav aria-label="Navegação principal" className="desktop-nav">
          {navigation.map(({ href, label, icon: Icon, match }) => (
            <Link key={href} href={href} className={isActive(match) ? "nav-active" : ""} aria-current={isActive(match) ? "page" : undefined}>
              <Icon size={21} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-gentle">
            <Heart size={23} />
            <p>
              Um passo de cada vez.
              <br />
              <strong>Você está no seu tempo.</strong>
            </p>
          </div>
          <Link href="/ajuda" className="sidebar-help">
            <CircleHelp size={19} />
            Precisa de ajuda?
            <ArrowUpRight size={15} />
          </Link>
          <Link href="/perfil" className="sidebar-user">
            <span className="user-avatar">{initial}</span>
            <div>
              <strong>{me.data?.firstName ?? "Seu perfil"}</strong>
              <span>{me.data?.email ?? ""}</span>
            </div>
          </Link>
        </div>
      </aside>
      <div className="patient-workspace">
        <header className="patient-header">
          <div className="mobile-brand">
            <Brand small />
          </div>
          <div className="breadcrumb">
            Meu espaço <span>/</span> <strong>{current}</strong>
          </div>
          <div className="header-actions">
            <Link
              href="/notificacoes"
              className="icon-button notification-bell"
              aria-label={unread ? `Notificações, ${unread} não lidas` : "Notificações"}
            >
              <Bell size={21} />
              {unread > 0 && <span className="notification-count">{unread > 99 ? "99+" : unread}</span>}
            </Link>
            <Link href="/perfil" className="user-avatar" aria-label="Abrir meu perfil">
              {initial}
            </Link>
          </div>
        </header>
        <main id="main-content" className="patient-content">
          {me.isPending || me.data === null ? <LoadingBlock lines={4} /> : children}
        </main>
        <footer className="patient-footer">
          Luvimind · Um espaço de escuta, um cuidado que é seu.
          <span>
            <Link href="/termos">Termos</Link> · <Link href="/privacidade">Privacidade</Link>
          </span>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Navegação principal mobile">
        {navigation.map(({ href, label, icon: Icon, match }) => (
          <Link key={href} href={href} className={isActive(match) ? "nav-active" : ""} aria-current={isActive(match) ? "page" : undefined}>
            <span>
              <Icon size={22} />
            </span>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
