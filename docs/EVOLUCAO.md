# Evolução da PWA Paciente

## Estado atual (2026-09-29)

O app deixou de ser um protótipo com dados fixos. Agora ele consome a API central (LUVIMIND-API), com cadastro real, sessão segura, catálogo, agenda, pagamento (sandbox), cancelamento, avaliações, jornada, notificações e direitos LGPD (exportar e excluir dados).

Removido da versão de demonstração: `src/lib/{domain,professionals,professional-details,questions,types}.ts`, `POST /api/demo/cadastro`, as rotas `/dashboard` e `/meu-perfil` e os testes de navegador antigos.

## Decisões

- **Regras no servidor.** 18+ (no fuso de Brasília), limite de horários, reserva de 15 min, janela de 4h para reembolso, comissão e validação do link do Meet ficam na API. O front repete algumas validações só para dar feedback imediato.
- **Mesmo domínio.** O Next reescreve `/api/*` para a API. Os cookies ficam primários no domínio do app, sem CORS no navegador.
- **Supabase = PostgreSQL da API.** Sem `supabase-js` no front: a chave publishable daria acesso direto ao banco e contornaria RBAC, criptografia e auditoria. O RLS fica ativo em todas as tabelas como defesa extra.
- **Google Meet externo.** A Luvimind não hospeda nem grava consultas. O link é validado pela API e só aparece 15 min antes do início.
- **Troca de identidade limpa o cache.** Ao entrar ou se cadastrar, o cache do React Query é descartado, e o shell só encerra a sessão com uma resposta atual de `/auth/me`. Isso corrige um bug em que a visita anônima derrubava a sessão recém-criada; há teste de regressão.

## Pendências antes do lançamento

1. **Recuperação de senha e verificação de e-mail.** Dependem de um provedor de e-mail transacional.
2. **Notificações push (Web Push).** Hoje os lembretes de 24h, 2h e 15 min ficam na central de notificações do app.
3. **Gateway de pagamento real** (Asaas, iugu ou Pagar.me) via `PaymentProvider` na API. O sandbox é bloqueado em produção.
4. **Textos jurídicos integrais** de Termos e Privacidade (versão `2026-09` é um resumo), revisados por jurídico/DPO.
5. **Validação do questionário e do matching** com a equipe clínica.
6. **App profissional:** cadastro do link do Google Meet, agenda, vídeo e aprovação pelo Admin. Até lá, os profissionais vêm do seed de desenvolvimento.
7. **Supabase:** dois projetos separados. **Produção** (`lqaueuqlkvffdtxociht`): migrado, reforçado e auditado, sem dados. **Teste** (Neon `luvimind-teste`, gratuito — o plano free do Supabase não permite um segundo projeto): recebe os dados fictícios e as contas dos testes automáticos. Cada ambiente tem arquivo e segredos próprios; veja "Ambientes" no README da API.

## Convenções

- Componentes interativos com `"use client"`; layouts sem estado ficam no servidor.
- Cores, raios e espaçamentos só via tokens (`src/styles/tokens.css`).
- Textos, estados vazios e erros em português, sem prometer resultado clínico.
- Nunca registrar dados pessoais, respostas ou senhas em logs nem no armazenamento do navegador.
