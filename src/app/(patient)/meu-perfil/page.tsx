"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  SlidersHorizontal,
  LogOut,
  ListChecks,
  Heart,
  Info,
} from "lucide-react";
import { useJourney } from "@/components/providers";
import { Badge, Button, Dialog, SectionTitle } from "@/components/ui";
import { preferenceSummary } from "@/lib/domain";
export default function PatientProfilePage() {
  const { name, answers, favorites, reset } = useJourney();
  const [privacy, setPrivacy] = useState(false);
  const router = useRouter();
  const summary = preferenceSummary(answers);
  return (
    <>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">DO SEU JEITO</p>
          <h1>Meu perfil</h1>
          <p>Suas preferências e o seu cuidado, com você no controle.</p>
        </div>
      </div>
      <div className="profile-banner">
        <span className="user-avatar large">{(name || "Você").slice(0, 1).toUpperCase()}</span>
        <div>
          <h2>{name || "Seu espaço"}</h2>
          <Badge neutral>Conta de demonstração</Badge>
        </div>
      </div>
      <div className="profile-columns">
        <section className="panel">
          <SectionTitle title="Suas preferências" />
          <div className="chips">
            {summary.length ? (
              summary.map((s) => <Badge key={s}>{s}</Badge>)
            ) : (
              <p>Seu cuidado começa com um pouco sobre você.</p>
            )}
          </div>
          <Link href="/questionario" className="profile-row">
            <SlidersHorizontal size={21} />
            <div>
              <strong>Minhas preferências</strong>
              <span>Revisitar o que faz sentido para você</span>
            </div>
            <ArrowRight size={18} />
          </Link>
          <Link href="/questionario/1" className="profile-row">
            <ListChecks size={21} />
            <div>
              <strong>Meu questionário</strong>
              <span>{Object.keys(answers).length} de 10 perguntas respondidas</span>
            </div>
            <ArrowRight size={18} />
          </Link>
          <Link href="/profissionais" className="profile-row">
            <Heart size={21} />
            <div>
              <strong>Meus profissionais</strong>
              <span>{favorites.length} favoritos nesta sessão</span>
            </div>
            <ArrowRight size={18} />
          </Link>
        </section>
        <section className="panel">
          <SectionTitle title="Conta e privacidade" />
          <button className="profile-row" onClick={() => setPrivacy(true)}>
            <ShieldCheck size={21} />
            <div>
              <strong>Privacidade e seus dados</strong>
              <span>Entenda como esta prévia funciona</span>
            </div>
            <ArrowRight size={18} />
          </button>
          <div className="notice">
            <Info size={22} />
            <p>Seus dados ficam nesta sessão. Ao recarregar a página, a demonstração recomeça.</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              reset();
              router.push("/");
            }}
          >
            <LogOut size={18} />
            Sair da demonstração
          </Button>
        </section>
      </div>
      <Dialog
        open={privacy}
        onClose={() => setPrivacy(false)}
        title="Seu cuidado inclui sua privacidade"
      >
        <p>
          Esta prévia não usa banco de dados, rastreadores ou autenticação real. Suas respostas e
          favoritos ficam somente na memória da página.
        </p>
        <p>
          O formulário de cadastro envia dados fictícios ao servidor local para validar os campos e
          a regra de 18 anos. Nenhum cadastro ou senha é armazenado.
        </p>
        <p>
          O modo offline armazena apenas uma página pública de orientação. Não armazenamos
          questionários, cadastros ou páginas privadas em cache.
        </p>
        <Button onClick={() => setPrivacy(false)}>Entendi</Button>
      </Dialog>
    </>
  );
}
