"use client";
import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  House,
  Search,
  CalendarDays,
  Sprout,
  UserRound,
  Bell,
  CircleHelp,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { Brand, Dialog, ButtonLink } from "./ui";
import { useJourney } from "./providers";

const navigation = [
  { href: "/dashboard", label: "Início", icon: House },
  { href: "/profissionais", label: "Profissionais", icon: Search },
  { href: "/consultas", label: "Consultas", icon: CalendarDays },
  { href: "/jornada", label: "Jornada", icon: Sprout },
  { href: "/meu-perfil", label: "Perfil", icon: UserRound },
];
export function PatientShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { name } = useJourney();
  const [modal, setModal] = useState<"help" | "notifications" | null>(null);
  const isActive = (href: string) =>
    path === href || (href === "/profissionais" && ["/resultados", "/perfil"].includes(path));
  const current =
    path === "/perfil"
      ? "Perfil do profissional"
      : path === "/resultados"
        ? "Profissionais"
        : navigation.find((n) => n.href === path)?.label || "Seu espaço";
  return (
    <div className="patient-shell">
      <aside className="sidebar">
        <Brand />
        <div className="sidebar-label">SEU ESPAÇO DE CUIDADO</div>
        <nav aria-label="Navegação principal" className="desktop-nav">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={isActive(href) ? "nav-active" : ""}
              aria-current={isActive(href) ? "page" : undefined}
            >
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
          <button className="sidebar-help" onClick={() => setModal("help")}>
            <CircleHelp size={19} />
            Precisa de ajuda?
            <ArrowUpRight size={15} />
          </button>
          <Link href="/meu-perfil" className="sidebar-user">
            <span className="user-avatar">{(name || "Você").slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{name || "Seu perfil"}</strong>
              <span>Conta de demonstração</span>
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
            <span className="demo-pill">Demonstração</span>
            <button
              className="icon-button"
              aria-label="Notificações"
              onClick={() => setModal("notifications")}
            >
              <Bell size={21} />
            </button>
            <Link href="/meu-perfil" className="user-avatar" aria-label="Abrir meu perfil">
              {(name || "Você").slice(0, 1).toUpperCase()}
            </Link>
          </div>
        </header>
        <main id="main-content" className="patient-content">
          {children}
        </main>
        <footer className="patient-footer">
          Luvimind · Um espaço de escuta, um cuidado que é seu.
          <span>Perfis e consultas ilustrativos</span>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Navegação principal mobile">
        {navigation.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={isActive(href) ? "nav-active" : ""}
            aria-current={isActive(href) ? "page" : undefined}
          >
            <span>
              <Icon size={22} />
            </span>
            {label}
          </Link>
        ))}
      </nav>
      <Dialog
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === "help" ? "Estamos aqui para ajudar" : "Suas notificações"}
      >
        {modal === "help" ? (
          <>
            <p>
              Explore as telas e conheça a experiência do paciente. Esta prévia não oferece
              atendimentos ou suporte em tempo real.
            </p>
            <ButtonLink href="/questionario">Conhecer a jornada inicial</ButtonLink>
          </>
        ) : (
          <div className="empty-state compact">
            <Bell size={30} />
            <h3>Tudo tranquilo por aqui.</h3>
            <p>
              Seus lembretes e avisos aparecerão neste espaço quando o serviço estiver conectado.
            </p>
          </div>
        )}
      </Dialog>
    </div>
  );
}
