"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Download, ShieldCheck, Trash2 } from "lucide-react";
import { ErrorBlock, LoadingBlock } from "@/components/query-state";
import { Alert, BackLink, Button, Dialog, SectionTitle } from "@/components/ui";
import { api, ApiError, downloadFile } from "@/lib/api";
import { formatShortDate } from "@/lib/format";
import { useSharedData } from "@/lib/queries";

const CONFIRM_WORD = "EXCLUIR";

export default function PrivacyPage() {
  const router = useRouter();
  const client = useQueryClient();
  const shared = useSharedData();
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function download() {
    setExporting(true);
    setExportError(null);
    try {
      await downloadFile("/patients/me/export/pdf", "meus-dados-luvimind.pdf", "application/pdf");
    } catch (err) {
      setExportError(err instanceof ApiError ? err.message : "Não foi possível gerar o PDF.");
    } finally {
      setExporting(false);
    }
  }

  async function removeAccount() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await api("/patients/me", { method: "DELETE" });
      client.clear();
      router.replace("/onboarding");
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Não foi possível excluir sua conta.");
      setDeleting(false);
    }
  }

  return (
    <>
      <BackLink href="/perfil" label="Meu perfil" />
      <div className="page-title-row">
        <div>
          <p className="eyebrow">LGPD</p>
          <h1>Privacidade e seus dados</h1>
          <p>Você decide o que compartilhar. Aqui você acompanha e controla seus dados.</p>
        </div>
      </div>

      <section className="panel">
        <SectionTitle title="Dados compartilhados com profissionais" />
        {shared.isPending ? (
          <LoadingBlock lines={2} />
        ) : shared.isError ? (
          <ErrorBlock error={shared.error} onRetry={() => void shared.refetch()} />
        ) : shared.data.length === 0 ? (
          <p>Você ainda não compartilhou informações com nenhum profissional.</p>
        ) : (
          <ul className="shared-history">
            {shared.data.map((s) => (
              <li key={s.appointmentId}>
                <Link href={`/consultas/${s.appointmentId}`}>
                  <strong>{s.professionalName}</strong> · consulta de {formatShortDate(s.startsAt)}
                </Link>
                <ul className="shared-list">
                  <li className={s.summary ? "yes" : "no"}>Resumo pré-consulta {s.summary ? "✓" : "✕"}</li>
                  <li className={s.preferences ? "yes" : "no"}>Preferências {s.preferences ? "✓" : "✕"}</li>
                  <li className="no">Questionário completo ✕</li>
                </ul>
                {s.consentAt && <small>Autorizado em {formatShortDate(s.consentAt)}</small>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <SectionTitle title="Seus direitos" />
        <div className="privacy-actions">
          <div>
            <Download size={21} />
            <div>
              <strong>Baixar meus dados em PDF</strong>
              <span>PDF com seu cadastro, preferências, consultas e avaliações.</span>
            </div>
            <Button variant="secondary" loading={exporting} onClick={() => void download()}>
              Baixar
            </Button>
          </div>
          {exportError && <Alert tone="error">{exportError}</Alert>}
          <div>
            <ShieldCheck size={21} />
            <div>
              <strong>Corrigir dados</strong>
              <span>Nome e celular podem ser alterados em Meu perfil.</span>
            </div>
            <Link className="button button-secondary" href="/perfil">
              Editar
            </Link>
          </div>
          <div>
            <Trash2 size={21} />
            <div>
              <strong>Excluir minha conta</strong>
              <span>Remove seus dados pessoais e preferências. Registros financeiros são mantidos anonimizados pelo prazo legal.</span>
            </div>
            <Button variant="danger" onClick={() => setOpen(true)}>
              Excluir
            </Button>
          </div>
        </div>
        <p className="microcopy">
          Leia a <Link href="/privacidade">Política de Privacidade</Link>.
        </p>
      </section>

      <Dialog open={open} onClose={() => setOpen(false)} title="Excluir sua conta?">
        <p>Esta ação não pode ser desfeita. Suas preferências, favoritos e resumos compartilhados serão apagados.</p>
        <label htmlFor="confirm-delete" className="field-label">
          Digite <strong>{CONFIRM_WORD}</strong> para confirmar
        </label>
        <input id="confirm-delete" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} autoComplete="off" />
        {deleteError && (
          <Alert tone="error" role="alert">
            {deleteError}
          </Alert>
        )}
        <div className="dialog-actions">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Manter conta
          </Button>
          <Button variant="danger" disabled={confirmText.trim().toUpperCase() !== CONFIRM_WORD} loading={deleting} onClick={() => void removeAccount()}>
            Excluir definitivamente
          </Button>
        </div>
      </Dialog>
    </>
  );
}
