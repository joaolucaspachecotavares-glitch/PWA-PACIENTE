"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Bell, CircleHelp, ListChecks, LogOut, ShieldCheck } from "lucide-react";
import { ErrorBlock, LoadingBlock } from "@/components/query-state";
import { Alert, Button, Field, SectionTitle, TextInput } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import type { PatientProfile } from "@/lib/api-types";
import { formatShortDate, maskPhone, onlyDigits } from "@/lib/format";
import { keys, useProfile } from "@/lib/queries";

function ProfileForm({ profile }: { profile: PatientProfile }) {
  const client = useQueryClient();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(maskPhone(profile.phone ?? ""));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    setSaved(false);
    try {
      const updated = await api<PatientProfile>("/patients/me", {
        method: "PATCH",
        body: { name: name.trim(), phone: onlyDigits(phone) },
      });
      client.setQueryData(keys.profile, updated);
      await client.invalidateQueries({ queryKey: keys.me });
      setSaved(true);
    } catch (err) {
      setErrors(err instanceof ApiError ? { ...err.errors, form: err.message } : { form: "Não foi possível salvar." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="registration-form" onSubmit={(e) => void submit(e)} noValidate>
      <Field id="name" label="Nome" error={errors.name}>
        <TextInput id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      </Field>
      <Field id="phone" label="Celular" error={errors.phone}>
        <TextInput id="phone" type="tel" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} error={errors.phone} />
      </Field>
      <dl className="detail-list">
        <div>
          <dt>E-mail</dt>
          <dd>{profile.email}</dd>
        </div>
        <div>
          <dt>Data de nascimento</dt>
          <dd>{formatShortDate(`${profile.birthDate}T12:00:00Z`)}</dd>
        </div>
        {profile.cpfMasked && (
          <div>
            <dt>CPF</dt>
            <dd>{profile.cpfMasked}</dd>
          </div>
        )}
      </dl>
      {saved && (
        <Alert tone="success" role="status">
          Alterações salvas.
        </Alert>
      )}
      {errors.form && !saved && (
        <Alert tone="error" role="alert">
          {errors.form}
        </Alert>
      )}
      <Button type="submit" variant="secondary" loading={pending}>
        Salvar alterações
      </Button>
    </form>
  );
}

export default function PatientProfilePage() {
  const router = useRouter();
  const client = useQueryClient();
  const profile = useProfile();
  const [leaving, setLeaving] = useState(false);

  async function logout() {
    setLeaving(true);
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      client.clear();
      router.replace("/onboarding");
    }
  }

  const links = [
    { href: "/perfil/preferencias", icon: ListChecks, title: "Meu questionário", text: "Ver e atualizar suas preferências" },
    { href: "/notificacoes", icon: Bell, title: "Notificações", text: "Lembretes e avisos das suas consultas" },
    { href: "/perfil/privacidade", icon: ShieldCheck, title: "Privacidade e seus dados", text: "Compartilhamentos, exportação e exclusão" },
    { href: "/ajuda", icon: CircleHelp, title: "Ajuda e suporte", text: "Dúvidas frequentes e apoio" },
  ];

  return (
    <>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">DO SEU JEITO</p>
          <h1>Meu perfil</h1>
          <p>Seus dados e preferências, com você no controle.</p>
        </div>
      </div>
      <div className="profile-columns">
        <section className="panel">
          <SectionTitle title="Dados pessoais" />
          {profile.isPending ? (
            <LoadingBlock lines={3} />
          ) : profile.isError ? (
            <ErrorBlock error={profile.error} onRetry={() => void profile.refetch()} />
          ) : (
            <ProfileForm profile={profile.data} />
          )}
        </section>
        <section className="panel">
          <SectionTitle title="Conta" />
          {links.map(({ href, icon: Icon, title, text }) => (
            <Link key={href} href={href} className="profile-row">
              <Icon size={21} />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
              <ArrowRight size={18} />
            </Link>
          ))}
          <Button variant="ghost" loading={leaving} onClick={() => void logout()}>
            <LogOut size={18} /> Sair
          </Button>
        </section>
      </div>
    </>
  );
}
