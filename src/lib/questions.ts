import type { Question } from "./types";

// Preferências de demonstração. Conteúdo sujeito à validação de produto antes do lançamento.
export const questions: Question[] = [
  {
    id: "interests",
    title: "O que mais tem ocupado seus pensamentos?",
    subtitle:
      "Este espaço é seu. Escolha o que faz sentido para você neste momento.",
    multiple: true,
    options: [
      "Ansiedade",
      "Estresse",
      "Trabalho",
      "Relacionamentos",
      "Autoestima",
      "Sono",
      "Alimentação",
      "Tristeza",
      "Só quero conversar",
      "Outro",
      "Prefiro não responder",
    ],
  },
  {
    id: "experience",
    title: "Você já fez terapia antes?",
    subtitle: "Cada jornada tem um começo. Queremos conhecer a sua.",
    options: [
      "Esta será minha primeira vez",
      "Já fiz, mas não faço atualmente",
      "Faço terapia atualmente",
      "Prefiro não responder",
    ],
  },
  {
    id: "goal",
    title: "O que você procura neste momento?",
    subtitle: "Não precisa ter tudo definido para dar o primeiro passo.",
    multiple: true,
    options: [
      "Me conhecer melhor",
      "Lidar com uma situação específica",
      "Cuidar das minhas relações",
      "Ter um espaço de escuta",
      "Ainda estou descobrindo",
    ],
  },
  {
    id: "mode",
    title: "Como você prefere ser atendido?",
    subtitle: "Pense no formato que se encaixa melhor na sua rotina.",
    options: ["Online", "Presencial em Florianópolis", "Sem preferência"],
  },
  {
    id: "style",
    title: "Como gostaria que fosse esse espaço?",
    subtitle:
      "Suas preferências nos ajudam a apresentar algumas possibilidades.",
    options: [
      "Acolhedor, com espaço para falar",
      "Objetivo, com exercícios e reflexões",
      "Um equilíbrio entre os dois",
      "Ainda não sei",
    ],
  },
  {
    id: "schedule",
    title: "Qual período funciona melhor para você?",
    subtitle: "Você poderá conferir os horários de cada profissional depois.",
    multiple: true,
    options: ["Manhã", "Tarde", "Noite", "Tenho flexibilidade"],
  },
  {
    id: "budget",
    title: "Qual valor cabe no seu momento?",
    subtitle:
      "Considere o valor de uma consulta. Você escolhe antes de agendar.",
    options: [
      "Até R$ 150",
      "Até R$ 180",
      "Até R$ 250",
      "Quero conhecer as opções",
    ],
  },
  {
    id: "gender",
    title: "Tem alguma preferência de profissional?",
    subtitle: "O mais importante é você se sentir à vontade.",
    options: [
      "Psicóloga",
      "Psicólogo",
      "Sem preferência",
      "Prefiro não responder",
    ],
  },
  {
    id: "language",
    title: "Em qual idioma prefere conversar?",
    subtitle: "Escolha o idioma em que você se sente mais confortável.",
    options: ["Português", "Inglês", "Espanhol"],
  },
  {
    id: "start",
    title: "Quando gostaria de dar o próximo passo?",
    subtitle: "Não existe pressa. Seu tempo também faz parte do cuidado.",
    options: [
      "Nos próximos dias",
      "Nas próximas semanas",
      "Estou só conhecendo por enquanto",
    ],
  },
];
