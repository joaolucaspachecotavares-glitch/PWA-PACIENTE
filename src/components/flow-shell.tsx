import type { ReactNode } from "react";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Brand } from "./ui";

/** Estrutura das telas antes do cadastro (onboarding, questionário, prévia, cadastro, entrar). */
export function FlowShell({ children, stage = 0 }: { children: ReactNode; stage?: number }) {
  return (
    <div className="flow-shell">
      <header className="flow-header">
        <Brand />
        <div className="flow-steps" aria-label="Etapas da jornada">
          {["Sobre você", "Seu encontro", "Seu espaço"].map((text, i) => (
            <span key={text} className={stage >= i ? "step-active" : ""}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              {text}
              {i < 2 && <i />}
            </span>
          ))}
        </div>
        <Link href="/entrar" className="header-link">
          Já tenho uma conta
        </Link>
      </header>
      <main id="main-content">{children}</main>
      <footer className="flow-footer">
        <span>© {new Date().getFullYear()} Luvimind</span>
        <span>
          <LockKeyhole size={13} /> Cuidado que começa com confiança.
        </span>
        <span className="flow-footer-links">
          <Link href="/termos">Termos de Uso</Link>
          <Link href="/privacidade">Privacidade</Link>
        </span>
      </footer>
    </div>
  );
}
