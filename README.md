# Luvimind · PWA Paciente

Aplicativo do paciente da Luvimind (`app.luvimind.com`). Next.js 16, React 19 e TypeScript, mobile-first, em português, com o design system Luvimind (verde suave, branco, Inter).

Toda regra de negócio fica na **API central** ([LUVIMIND-API](../LUVIMIND-API), `api.luvimind.com`). Este app só apresenta os dados e envia ações. Idade mínima, RBAC, criptografia, agenda, pagamento e cancelamento são validados no servidor.

## Rodar localmente

Requisitos: Node.js 24+ e Microsoft Edge (para os testes de navegador).

1. **API e banco.** Em outro terminal, siga o README da LUVIMIND-API:
   ```sh
   npm run db:local      # Postgres local (PGlite) na porta 54329
   npm run db:seed       # 8 profissionais fictícios
   npm run start:dev     # API em http://127.0.0.1:4000
   ```
2. **App:**
   ```sh
   npm install
   npm run dev           # http://127.0.0.1:3000
   ```

### Variáveis de ambiente (`.env.local`, opcional)

| Variável | Padrão | Uso |
| --- | --- | --- |
| `API_URL` | `http://127.0.0.1:4000` | Endereço da API. O Next reescreve `/api/*` para ela, então os cookies de sessão são do próprio domínio do app. Em produção: `https://api.luvimind.com`. |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | (vazio) | E-mail exibido na Central de ajuda. |

### Usar o banco de teste na nuvem

O app não muda: ele fala com a API em `API_URL`, e é a API que escolhe o banco. Para navegar com os dados do Supabase de teste, suba a API assim:

```sh
npm run build && npm run start:staging   # na pasta LUVIMIND-API
```

O ambiente de produção nunca é usado localmente; veja a seção "Ambientes" no README da API.

O app **não** usa `@supabase/supabase-js` nem chaves do Supabase. O Supabase é o PostgreSQL por trás da API: o navegador nunca acessa o banco diretamente.

## Fluxo

| Etapa | Rota |
| --- | --- |
| Boas-vindas | `/onboarding` |
| Introdução e 10 perguntas | `/questionario`, `/questionario/1..10` |
| Apoio imediato (resposta de urgência: CVV 188, SAMU 192) | `/apoio` |
| Processamento e prévia (sem cadastro, nada é salvo) | `/matching` |
| Cadastro (18+ validado na API) | `/cadastro` |
| Entrar | `/entrar` |
| Resultados (Top 5 por compatibilidade + demais) | `/resultados` |
| Início | `/inicio` |
| Profissionais, busca, filtros e favoritos | `/profissionais` |
| Perfil do profissional (vídeo YouTube sem cookies) | `/profissionais/[slug]` |
| Agendamento: data → horário → pré-consulta e consentimento → resumo | `/profissionais/[slug]/agendar` |
| Pagamento (Pix/cartão, reserva de 15 min) | `/consultas/[id]/pagamento` |
| Confirmação (+ arquivo de calendário) | `/consultas/[id]/confirmada` |
| Consultas e detalhe (link do Google Meet, cancelamento com regra de 4h) | `/consultas`, `/consultas/[id]` |
| Avaliação | `/consultas/[id]/avaliar` |
| Jornada | `/jornada` |
| Perfil, preferências, privacidade (exportar/excluir dados) | `/perfil`, `/perfil/preferencias`, `/perfil/privacidade` |
| Notificações e ajuda | `/notificacoes`, `/ajuda` |
| Termos e Privacidade | `/termos`, `/privacidade` |

Navegação principal: Início, Profissionais, Consultas, Jornada e Perfil. No celular fica na barra inferior; no desktop, na lateral.

**Consultas online** acontecem no **Google Meet**, fora da Luvimind. O profissional cadastra o link no app profissional, a API só aceita `https://meet.google.com/xxx-xxxx-xxx` e o paciente vê o botão 15 minutos antes do horário.

## Segurança e privacidade

- Sessão em cookies `HttpOnly` e `SameSite=Lax` emitidos pela API (acesso de 15 min e refresh rotativo de 30 dias). Nenhum token fica em `localStorage`.
- `src/proxy.ts` faz só redirecionamentos otimistas; a autorização real acontece na API a cada requisição.
- As respostas do questionário ficam apenas em memória até o cadastro. Depois ficam criptografadas na API.
- Cabeçalhos: CSP, HSTS, `nosniff`, `Referrer-Policy` e `Permissions-Policy` (`next.config.ts`).
- O service worker guarda apenas `/offline.html`, nunca dados do paciente.

## Estrutura

```text
src/
  app/                 Rotas (App Router); (patient)/ = área autenticada
  components/          UI compartilhada (ui.tsx), shells e telas de domínio
  lib/api.ts           Cliente HTTP (renovação de sessão automática, erros em português)
  lib/api-types.ts     Contratos da API
  lib/queries.ts       Hooks React Query
  lib/format.ts        Datas (America/Sao_Paulo), dinheiro, máscaras
  proxy.ts             Redirecionamentos por presença de sessão
  styles/tokens.css    Tokens do design system
public/                Ícones, service worker e página offline
tests/unit.test.ts     Testes unitários
tests/e2e/             Playwright + axe
```

## Verificar

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e     # requer API + banco com seed rodando
```

A suíte de navegador (`tests/e2e/patient-flow.spec.ts`) cobre:

- A jornada completa em 390px: questionário, prévia, cadastro, favorito, perfil, agendamento com consentimento, Pix sandbox, confirmação, cancelamento com reembolso, notificações e jornada, sem erros de console.
- Bloqueio de menores de 18 anos na tela e na API.
- Apoio imediato para respostas de urgência.
- Sessão preservada após visita anônima.
- Rotas protegidas.
- Ausência de rolagem horizontal em 320, 390, 768 e 1440px.
- WCAG 2.1 AA (axe).
- Manifesto e cache offline.

## Pendências

Veja [docs/EVOLUCAO.md](docs/EVOLUCAO.md).
