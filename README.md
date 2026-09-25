# Luvimind · PWA Paciente

Primeira implementação de alta fidelidade em Next.js 16, React 19 e TypeScript. Interface em português, mobile-first, com Inter local e o design system Luvimind v0.1.

## Iniciar

Recomendado: Node.js 24 LTS e npm.

```sh
npm install
npm run dev
```

Abra http://localhost:3000. O servidor escuta somente a máquina local.

```sh
npm run build
npm run start
```

O service worker é registrado em produção. Para conferir instalação e modo offline, use `build` + `start` em localhost ou HTTPS. Ele guarda somente a página pública de fallback offline, sem cache de informações do paciente.

## Fluxo implementado

| Tela | Rota | Interações |
| --- | --- | --- |
| Onboarding | `/` | Iniciar questionário ou explorar demonstração |
| Introdução | `/questionario` | Explicação de privacidade em diálogo |
| Pergunta | `/questionario/1` a `/questionario/10` | Seleção, progresso, avançar e voltar mantendo respostas |
| Matching | `/matching` | Transição, resumo de preferências, dois perfis e acesso ao cadastro |
| Cadastro | `/cadastro` | Validação, mostrar senha, aceite e bloqueio 18+ no cliente e servidor |
| Resultado | `/resultados` | Cinco primeiros perfis, demais opções, busca, filtros, favoritos e detalhes |
| Dashboard | `/dashboard` | Consulta de exemplo, jornada, recomendações, favoritos e atalhos |
| Perfil profissional | `/perfil?profissional=ana` | Página completa, apresentação, especialidades, abordagem, formação, avaliações, informações da consulta, disponibilidade ilustrativa e favoritos |
| Perfil do paciente | `/meu-perfil` | Preferências, conta e privacidade |

Navegação principal: Início, Profissionais, Consultas, Jornada e Perfil. Em telas pequenas, barra inferior; em desktop, barra lateral. O item Perfil abre `/meu-perfil` (paciente). Os botões “Ver perfil” na listagem, nos resultados e no dashboard abrem a página completa `/perfil?profissional=<id>`, sem modal. O parâmetro mantém o profissional escolhido ao atualizar ou compartilhar o endereço. Sem um identificador, a página convida a escolher um profissional; identificadores inválidos exibem um estado de perfil não encontrado. As rotas de apoio `/profissionais`, `/consultas`, `/jornada` e `/entrar` também são navegáveis.

## Estrutura

```text
src/
  app/                 Rotas, metadados, manifest e endpoint de demonstração
    (patient)/         Layout comum da área do paciente
    api/demo/cadastro/ Validação sem criação de conta
  components/          UI compartilhada, shells e componentes de domínio
  lib/                 Tipos, perguntas, fixtures e funções puras
  styles/tokens.css    Cores, espaçamentos, raios e sombras
public/                Ícones, service worker e página offline
tests/                 Regras de domínio e testes no navegador
docs/                  Decisões e próximos passos
```

## O que é demonstração

- Os oito profissionais, avaliações, disponibilidade, consultas e métricas são fictícios. As iniciais e ilustrações substituem fotos reais.
- O cadastro não autentica e não cria uma conta. O endpoint valida campos e idade e retorna apenas o primeiro nome. Não há banco, cookies de sessão, envio de e-mail ou armazenamento de senha.
- Respostas, primeiro nome e favoritos ficam na memória do contexto React. Navegar preserva o estado; recarregar ou fechar a aba o apaga. Use apenas dados fictícios.
- O matching organiza fixtures por afinidade com interesses, modalidade, preço e período. Não é um modelo clínico nem um sistema de matching de produção. Os cinco primeiros ficam separados dos demais.
- Não há reserva, pagamento, videochamada, notificação push nem atendimento real. As ações relacionadas explicam o estado da demonstração.
- As perguntas além do exemplo recuperado foram propostas para completar o fluxo de dez etapas; precisam de validação de produto. Não há triagem clínica implementada.
- O link "Já tenho uma conta" abre uma entrada de demonstração, sem sugerir autenticação existente.

## Design e acessibilidade

Tokens oficiais: `#7BC6A4`, `#A8DCC5`, `#EAF7F1`, branco, off-white e neutros do catálogo. O verde escuro `#356B4D` é um token complementar para texto e foco. Botões com fundo verde suave usam texto escuro para legibilidade; a combinação branco sobre esse verde não oferece contraste suficiente para texto pequeno.

Inter é servida localmente pelo pacote `@fontsource-variable/inter`. Ícones Lucide; ilustração vetorial própria em código. Botões, campos, cards, badges, diálogos e estados vazios são reutilizáveis. Foco visível, inputs nativos, feedback textual, diálogos com foco modal nativo, navegação por teclado, link para pular ao conteúdo e preferência de movimento reduzido.

## Verificar

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Os testes de navegador usam o Microsoft Edge instalado e iniciam o servidor de produção se a porta 3000 estiver livre. Para executá-los com Chromium, ajuste `channel` em `playwright.config.ts` e instale o navegador do Playwright. A suíte cobre o fluxo principal, rejeição de menor na API, diálogos/favoritos/filtros, overflow responsivo, verificações axe WCAG A/AA e fallback offline.

## Próximos passos

Veja `docs/EVOLUCAO.md` para limites de escopo e integrações previstas. Nenhuma configuração externa ou credencial é necessária para esta prévia.

Referência técnica: [instalação do Next.js App Router](https://nextjs.org/docs/app/getting-started/installation).
