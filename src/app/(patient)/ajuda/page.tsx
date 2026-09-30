import type { Metadata } from "next";
import { HeartHandshake, Phone } from "lucide-react";
import { BackLink, SectionTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Ajuda" };

const FAQ = [
  {
    q: "Como funciona o cancelamento?",
    a: "Cancelando com pelo menos 4 horas de antecedência, você recebe reembolso integral. Com menos de 4 horas ou em caso de ausência, não há reembolso. Se o profissional cancelar, o reembolso é integral.",
  },
  {
    q: "Como acontece a consulta online?",
    a: "As consultas online são realizadas pelo Google Meet. O link fica disponível em “Minhas consultas” 15 minutos antes do horário. Você pode entrar pelo navegador ou pelo aplicativo do Meet.",
  },
  {
    q: "Existe alguma taxa além do valor da consulta?",
    a: "Não. Você paga apenas o valor da consulta definido pelo profissional.",
  },
  {
    q: "O profissional vê minhas respostas do questionário?",
    a: "Não. O questionário completo nunca é compartilhado. Em cada agendamento, você pode escolher compartilhar um resumo e suas preferências, sempre com sua autorização.",
  },
  {
    q: "Como os profissionais são escolhidos para mim?",
    a: "Os cinco primeiros resultados são os mais compatíveis com suas preferências. Depois deles, também consideramos as avaliações. Nenhum profissional paga para aparecer primeiro.",
  },
  {
    q: "Os profissionais são verificados?",
    a: "Sim. Todo profissional tem o registro no conselho conferido antes de aparecer na Luvimind.",
  },
  {
    q: "Posso usar a Luvimind se tenho menos de 18 anos?",
    a: "No momento, a Luvimind está disponível apenas para pessoas com 18 anos ou mais.",
  },
];

export default function HelpPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  return (
    <>
      <BackLink href="/perfil" label="Meu perfil" />
      <div className="page-title-row">
        <div>
          <p className="eyebrow">ESTAMOS AQUI PARA AJUDAR</p>
          <h1>Ajuda e suporte</h1>
        </div>
      </div>
      <div className="alert alert-info support-callout">
        <HeartHandshake size={22} aria-hidden="true" />
        <div>
          <strong>Precisa de apoio emocional agora?</strong>
          <p>
            A Luvimind não oferece atendimento de urgência. Ligue para o CVV no <a href="tel:188">188</a> (gratuito, 24h) ou,
            em emergência, para o SAMU no <a href="tel:192">192</a>.
          </p>
        </div>
      </div>
      <SectionTitle title="Perguntas frequentes" />
      <div className="faq">
        {FAQ.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
      {supportEmail && (
        <p className="support-contact">
          <Phone size={16} /> Fale com a gente: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
        </p>
      )}
    </>
  );
}
