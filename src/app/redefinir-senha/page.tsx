import type { Metadata } from "next";
import { Suspense } from "react";
import { KeyRound } from "lucide-react";
import { FlowShell } from "@/components/flow-shell";
import { ResetPasswordForm } from "@/components/password-reset-forms";

export const metadata: Metadata = { title: "Redefinir senha" };

export default function ResetPasswordPage() {
  return (
    <FlowShell>
      <div className="small-page">
        <span className="round-icon">
          <KeyRound size={30} />
        </span>
        <p className="eyebrow">RECUPERAR ACESSO</p>
        <h1>
          Crie sua
          <br />
          <span>nova senha.</span>
        </h1>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </FlowShell>
  );
}
