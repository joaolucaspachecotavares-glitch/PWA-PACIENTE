"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Sprout } from "lucide-react";
import { FlowShell } from "@/components/flow-shell";
import { useJourney } from "@/components/providers";
import { Alert, BackLink, Button, Field, TextInput } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { isAdult, maskPhone, onlyDigits } from "@/lib/format";

const UNDERAGE = "A Luvimind está disponível atualmente apenas para pessoas com 18 anos ou mais.";

type Values = { name: string; birthDate: string; email: string; phone: string; password: string; acceptTerms: boolean };
const initial: Values = { name: "", birthDate: "", email: "", phone: "", password: "", acceptTerms: false };

function validate(v: Values): Record<string, string> {
  const errors: Record<string, string> = {};
  if (v.name.trim().length < 2) errors.name = "Informe seu nome.";
  if (!v.birthDate) errors.birthDate = "Informe sua data de nascimento.";
  else if (!isAdult(v.birthDate)) errors.birthDate = UNDERAGE;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = "Informe um e-mail válido.";
  if (!/^\d{10,11}$/.test(onlyDigits(v.phone))) errors.phone = "Informe o celular com DDD.";
  if (v.password.length < 8) errors.password = "Use pelo menos 8 caracteres.";
  if (!v.acceptTerms) errors.acceptTerms = "Aceite os Termos de Uso e a Política de Privacidade para continuar.";
  return errors;
}

export default function RegistrationPage() {
  const router = useRouter();
  const client = useQueryClient();
  const { answers, clearAnswers } = useJourney();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const hasAnswers = Object.keys(answers).length === 10;

  function field<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "", form: "" }));
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    const firstError = Object.keys(validation)[0];
    if (firstError) {
      document.getElementById(firstError)?.focus();
      return;
    }
    setPending(true);
    try {
      await api("/auth/patient/register", {
        method: "POST",
        body: {
          ...values,
          email: values.email.trim(),
          phone: onlyDigits(values.phone),
          answers: hasAnswers ? answers : undefined,
        },
      });
      clearAnswers();
      setValues(initial);
      // Nova identidade: descarta todo o cache (inclusive o "sem sessão" da visita anônima).
      client.clear();
      router.replace("/resultados");
    } catch (error) {
      if (error instanceof ApiError) {
        const mapped = { ...error.errors };
        if (!Object.keys(mapped).length) mapped.form = error.message;
        setErrors(mapped);
        const first = Object.keys(mapped)[0];
        if (first !== "form") document.getElementById(first)?.focus();
      } else {
        setErrors({ form: "Não foi possível criar sua conta. Tente novamente." });
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <FlowShell stage={2}>
      <div className="container registration-page">
        <BackLink href={hasAnswers ? "/matching" : "/onboarding"} />
        <div className="registration-grid">
          <aside className="registration-aside">
            <span className="round-icon">
              <Sprout size={28} />
            </span>
            <p className="eyebrow">UM ESPAÇO PARA CHAMAR DE SEU</p>
            <h1>
              Seu cuidado.
              <br />
              Suas escolhas.
              <br />
              <span>Seu começo.</span>
            </h1>
            <ul className="benefit-list">
              <li>
                <Check size={18} />
                Veja todos os profissionais compatíveis
              </li>
              <li>
                <Check size={18} />
                Salve seus favoritos e agende quando quiser
              </li>
              <li>
                <Check size={18} />
                Acompanhe sua jornada de cuidado
              </li>
            </ul>
          </aside>
          <section className="registration-form-card">
            <p className="eyebrow">BEM-VINDO À LUVIMIND</p>
            <h2>Crie sua conta</h2>
            <p>Seu próximo encontro começa aqui.</p>
            <form noValidate onSubmit={(e) => void submit(e)} className="registration-form">
              <Field id="name" label="Nome" error={errors.name}>
                <TextInput
                  id="name"
                  autoComplete="name"
                  placeholder="Seu nome"
                  value={values.name}
                  onChange={(e) => field("name", e.target.value)}
                  error={errors.name}
                  maxLength={120}
                />
              </Field>
              <Field id="birthDate" label="Data de nascimento" error={errors.birthDate}>
                <TextInput
                  id="birthDate"
                  type="date"
                  autoComplete="bday"
                  value={values.birthDate}
                  onChange={(e) => field("birthDate", e.target.value)}
                  error={errors.birthDate}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </Field>
              <Field id="email" label="E-mail" error={errors.email}>
                <TextInput
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  value={values.email}
                  onChange={(e) => field("email", e.target.value)}
                  error={errors.email}
                  maxLength={254}
                />
              </Field>
              <Field id="phone" label="Celular" error={errors.phone}>
                <TextInput
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(48) 99999-9999"
                  value={values.phone}
                  onChange={(e) => field("phone", maskPhone(e.target.value))}
                  error={errors.phone}
                />
              </Field>
              <Field id="password" label="Senha" error={errors.password} hint="Pelo menos 8 caracteres.">
                <div className="password-field">
                  <TextInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={values.password}
                    onChange={(e) => field("password", e.target.value)}
                    error={errors.password}
                    hint="Pelo menos 8 caracteres."
                    maxLength={128}
                  />
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </Field>
              <div>
                <label className="checkbox-label">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    checked={values.acceptTerms}
                    onChange={(e) => field("acceptTerms", e.target.checked)}
                    aria-invalid={!!errors.acceptTerms}
                    aria-describedby={errors.acceptTerms ? "acceptTerms-error" : undefined}
                  />
                  <span>
                    Li e aceito os{" "}
                    <Link className="inline-link" href="/termos" target="_blank">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link className="inline-link" href="/privacidade" target="_blank">
                      Política de Privacidade
                    </Link>
                    .
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p id="acceptTerms-error" className="field-error">
                    {errors.acceptTerms}
                  </p>
                )}
              </div>
              <p className="microcopy">
                Ao criar sua conta, você confirma que as informações fornecidas são verdadeiras.
              </p>
              {errors.form && (
                <Alert tone="error" role="alert">
                  {errors.form}
                </Alert>
              )}
              <Button type="submit" className="full-width" loading={pending}>
                {pending ? "Criando sua conta…" : "Criar conta e ver resultados"}
                {!pending && <ArrowRight size={18} />}
              </Button>
            </form>
            <p className="form-bottom">
              Já tem uma conta? <Link href="/entrar">Entrar</Link>
            </p>
            <div className="private-label">
              <LockKeyhole size={13} /> Seus dados são protegidos e nunca são vendidos.
            </div>
          </section>
        </div>
      </div>
    </FlowShell>
  );
}
