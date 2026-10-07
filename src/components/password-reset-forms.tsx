"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Alert, Button, Field, TextInput } from "@/components/ui";
import { api, ApiError } from "@/lib/api";

const NEUTRAL_MESSAGE = "Se houver uma conta com este e-mail, enviaremos um link para redefinir sua senha.";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Lê do <form> (via FormData), não só do estado: um valor digitado antes da
    // hidratação do React ainda existe no DOM e precisa contar no envio.
    const value = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!value) {
      setError("Informe seu e-mail.");
      return;
    }
    setError(null);
    setPending(true);
    try {
      await api("/auth/password/forgot", { method: "POST", body: { email: value, app: "PATIENT_APP" } });
    } catch {
      // A API sempre responde 202 com mensagem neutra; erros de rede não devem revelar nada.
    } finally {
      setPending(false);
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="registration-form">
        <Alert tone="success" role="status">
          {NEUTRAL_MESSAGE}
        </Alert>
        <Link href="/entrar" className="header-link">
          Voltar para entrar
        </Link>
      </div>
    );
  }

  return (
    <form noValidate method="post" onSubmit={(e) => void submit(e)} className="registration-form">
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
      {error && (
        <Alert tone="error" role="alert">
          {error}
        </Alert>
      )}
      <Button type="submit" className="full-width" loading={pending}>
        Enviar link {!pending && <ArrowRight size={18} />}
      </Button>
      <Link href="/entrar" className="header-link">
        Voltar para entrar
      </Link>
    </form>
  );
}

function validate(password: string, confirm: string): string | null {
  if (password.length < 8) return "Use pelo menos 8 caracteres.";
  if (password !== confirm) return "As senhas não coincidem.";
  return null;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const client = useQueryClient();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invalidToken, setInvalidToken] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Lê do <form> (via FormData), não só do estado: um valor digitado antes da
    // hidratação do React ainda existe no DOM e precisa contar no envio.
    const data = new FormData(e.currentTarget);
    const newPassword = String(data.get("password") ?? "");
    const newConfirm = String(data.get("confirm") ?? "");
    const validation = validate(newPassword, newConfirm);
    if (validation) {
      setError(validation);
      return;
    }
    setPending(true);
    setError(null);
    setInvalidToken(false);
    try {
      await api("/auth/password/reset", { method: "POST", body: { token, password: newPassword } });
      // Nova senha: descarta todo o cache antes de mandar para o login.
      client.clear();
      router.replace("/entrar?senha=redefinida");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError(err.message);
        setInvalidToken(true);
      } else {
        setError(err instanceof ApiError ? err.message : "Não foi possível redefinir sua senha. Tente novamente.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form noValidate method="post" onSubmit={(e) => void submit(e)} className="registration-form">
      <Field id="password" label="Nova senha">
        <div className="password-field">
          <TextInput
            id="password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
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
      <Field id="confirm" label="Confirmar nova senha">
        <TextInput
          id="confirm"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </Field>
      {error && (
        <Alert tone="error" role="alert">
          {error}
        </Alert>
      )}
      {invalidToken && (
        <Link href="/esqueci-senha" className="header-link">
          Pedir novo link
        </Link>
      )}
      <Button type="submit" className="full-width" loading={pending}>
        Salvar nova senha {!pending && <ArrowRight size={18} />}
      </Button>
    </form>
  );
}
