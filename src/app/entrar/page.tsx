"use client";
import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Eye, EyeOff, Sprout } from "lucide-react";
import { FlowShell } from "@/components/flow-shell";
import { Alert, Button, Field, TextInput } from "@/components/ui";
import { api, ApiError } from "@/lib/api";

function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/inicio";
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const client = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const resetSuccess = params.get("senha") === "redefinida";

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Informe seu e-mail e sua senha.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await api("/auth/login", { method: "POST", body: { email: email.trim(), password, app: "PATIENT_APP" } });
      // Nova identidade: descarta todo o cache (inclusive o "sem sessão" da visita anônima).
      client.clear();
      router.replace(safeNext(params.get("proximo")));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível entrar. Tente novamente.");
      setPassword("");
    } finally {
      setPending(false);
    }
  }

  return (
    <form noValidate onSubmit={(e) => void submit(e)} className="registration-form">
      {resetSuccess && (
        <Alert tone="success" role="status">
          Senha alterada. Entre com a nova senha.
        </Alert>
      )}
      <Field id="email" label="E-mail">
        <TextInput
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field id="password" label="Senha">
        <div className="password-field">
          <TextInput
            id="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="icon-button"
            onClick={() => setShow((p) => !p)}
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          >
            {show ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
      </Field>
      {/* <a> em vez de <Link>: navegação client-side deixaria o /entrar (que também tem
          um campo "E-mail") montado durante a transição, correndo o risco de preencher
          o campo errado. Navegação completa evita a ambiguidade. */}
      <a href="/esqueci-senha" className="header-link">
        Esqueci minha senha
      </a>
      {error && (
        <Alert tone="error" role="alert">
          {error}
        </Alert>
      )}
      <Button type="submit" className="full-width" loading={pending}>
        Entrar {!pending && <ArrowRight size={18} />}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <FlowShell>
      <div className="small-page">
        <span className="round-icon">
          <Sprout size={30} />
        </span>
        <p className="eyebrow">BOM TER VOCÊ DE VOLTA</p>
        <h1>
          Seu espaço
          <br />
          <span>está te esperando.</span>
        </h1>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="form-bottom">
          Ainda não tem conta? <Link href="/questionario">Começar pelo questionário</Link>
        </p>
      </div>
    </FlowShell>
  );
}
