"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Sprout,
  LoaderCircle,
} from "lucide-react";
import { FlowShell } from "@/components/flow-shell";
import { BackLink, Button, Dialog } from "@/components/ui";
import { useJourney } from "@/components/providers";
import { validateRegistration, type RegistrationInput } from "@/lib/domain";

const initial: RegistrationInput = {
  name: "",
  birthDate: "",
  email: "",
  phone: "",
  password: "",
  consent: false,
};
export default function RegistrationPage() {
  const router = useRouter();
  const { setName } = useJourney();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [terms, setTerms] = useState(false);
  function field(key: keyof RegistrationInput, value: string | boolean) {
    setValues((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "", form: "" }));
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = validateRegistration(values);
    setErrors(validation);
    if (Object.keys(validation).length) {
      document.getElementById(Object.keys(validation)[0])?.focus();
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/demo/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      if (!res.ok) {
        setErrors(
          result.errors || {
            form: "Não foi possível continuar. Tente novamente.",
          },
        );
        return;
      }
      setName(result.name);
      setValues(initial);
      router.push("/resultados");
    } catch {
      setErrors({
        form: "Não conseguimos conectar. Confira sua conexão e tente novamente.",
      });
    } finally {
      setPending(false);
    }
  }
  return (
    <FlowShell stage={2}>
      <div className="container registration-page">
        <BackLink href="/matching" />
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
            <p>
              Você já deu o primeiro passo.
              <br />
              Agora, vamos cuidar do próximo juntos.
            </p>
            <ul className="benefit-list">
              <li>
                <Check size={18} />
                Explore profissionais para você
              </li>
              <li>
                <Check size={18} />
                Salve seus encontros favoritos
              </li>
              <li>
                <Check size={18} />
                Acompanhe sua jornada de cuidado
              </li>
            </ul>
            <div className="registration-quote">
              <span>“</span>
              <p>
                Às vezes, tudo o que precisamos
                <br />é de um lugar para começar.
              </p>
              <div className="aside-rule" />
            </div>
          </aside>
          <section className="registration-form-card">
            <p className="eyebrow">BEM-VINDO À LUVIMIND</p>
            <h2>Crie sua conta</h2>
            <p>Seu próximo encontro começa aqui.</p>
            <div className="demo-note">
              <span className="live-dot" /> Demonstração: use dados fictícios.
              Nenhuma conta real será criada.
            </div>
            <form noValidate onSubmit={submit} className="registration-form">
              <div className="field">
                <label htmlFor="name">Como podemos chamar você?</label>
                <input
                  id="name"
                  name="name"
                  autoComplete="given-name"
                  placeholder="Seu nome"
                  value={values.name}
                  onChange={(e) => field("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  maxLength={80}
                />
                {errors.name && (
                  <span id="name-error" className="field-error">
                    {errors.name}
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor="birthDate">Data de nascimento</label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  autoComplete="bday"
                  value={values.birthDate}
                  onChange={(e) => field("birthDate", e.target.value)}
                  aria-invalid={!!errors.birthDate}
                  aria-describedby={
                    errors.birthDate ? "birthDate-error" : undefined
                  }
                />
                {errors.birthDate && (
                  <span id="birthDate-error" className="field-error">
                    {errors.birthDate}
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  value={values.email}
                  onChange={(e) => field("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  maxLength={254}
                />
                {errors.email && (
                  <span id="email-error" className="field-error">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor="phone">Celular</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(48) 99999-9999"
                  value={values.phone}
                  onChange={(e) => field("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  maxLength={20}
                />
                {errors.phone && (
                  <span id="phone-error" className="field-error">
                    {errors.phone}
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor="password">Senha</label>
                <div className="password-field">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Pelo menos 8 caracteres"
                    value={values.password}
                    onChange={(e) => field("password", e.target.value)}
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    maxLength={128}
                  />
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
                {errors.password && (
                  <span id="password-error" className="field-error">
                    {errors.password}
                  </span>
                )}
              </div>
              <div>
                <label className="checkbox-label">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={values.consent}
                    onChange={(e) => field("consent", e.target.checked)}
                    aria-invalid={!!errors.consent}
                    aria-describedby={
                      errors.consent ? "consent-error" : undefined
                    }
                  />
                  <span>
                    Confirmo que tenho 18 anos ou mais e li as{" "}
                    <button
                      type="button"
                      className="inline-link"
                      onClick={() => setTerms(true)}
                    >
                      condições desta demonstração
                    </button>
                    .
                  </span>
                </label>
                {errors.consent && (
                  <p id="consent-error" className="field-error">
                    {errors.consent}
                  </p>
                )}
              </div>
              {errors.form && (
                <p role="alert" className="field-error">
                  {errors.form}
                </p>
              )}
              <Button type="submit" className="full-width" disabled={pending}>
                {pending ? (
                  <>
                    <LoaderCircle className="spin" size={18} />
                    Preparando seu espaço…
                  </>
                ) : (
                  <>
                    Criar conta e ver resultados
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </form>
            <p className="form-bottom">
              Já tem uma conta? <Link href="/entrar">Entrar</Link>
            </p>
            <div className="private-label">
              <LockKeyhole size={13} /> Nesta prévia, seus dados não são
              armazenados.
            </div>
          </section>
        </div>
      </div>
      <Dialog
        open={terms}
        onClose={() => setTerms(false)}
        title="Sobre esta demonstração"
      >
        <p>
          Esta é uma versão interativa para avaliar a experiência da Luvimind.
          Use apenas dados fictícios. O formulário valida os campos e a idade,
          mas não cria uma conta real.
        </p>
        <p>
          Dados do formulário são enviados apenas ao servidor local para
          validação, sem gravação em banco. Senhas não são guardadas. Respostas
          e favoritos permanecem na memória da página até recarregar ou fechar a
          aba.
        </p>
        <p>
          Termos de uso e política de privacidade definitivos serão incorporados
          antes da abertura do serviço.
        </p>
        <Button onClick={() => setTerms(false)}>Entendi</Button>
      </Dialog>
    </FlowShell>
  );
}
