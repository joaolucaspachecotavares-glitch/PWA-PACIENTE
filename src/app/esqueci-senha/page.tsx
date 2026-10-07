import type { Metadata } from "next";
import { Suspense } from "react";
import { KeyRound } from "lucide-react";
import { FlowShell } from "@/components/flow-shell";
import { ForgotPasswordForm } from "@/components/password-reset-forms";

export const metadata: Metadata = { title: "Esqueci minha senha" };

export default function ForgotPasswordPage() {
  return (
    <FlowShell>
      <div className="small-page">
        <span className="round-icon">
          <KeyRound size={30} />
        </span>
        <p className="eyebrow">RECUPERAR ACESSO</p>
        <h1>
          Esqueceu sua
          <br />
          <span>senha?</span>
        </h1>
        <p>Informe seu e-mail e enviaremos um link para você criar uma nova senha.</p>
        <Suspense>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </FlowShell>
  );
}
