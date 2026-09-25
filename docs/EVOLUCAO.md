# Evolução da base

## Referências de produto

Baseada no Design System v0.1, Catálogo de Componentes v0.1 e fluxo textual P01–P34 da conversa “Motoristas Uber em Florianópolis”. As imagens de wireframes não estavam presentes nos anexos recuperados; a hierarquia foi implementada a partir das descrições tela a tela.

Decisões preservadas: verde suave e branco, Inter, fluxo sem cadastro antes da prévia, dez perguntas, compatibilidade qualitativa (sem percentuais psicológicos), cinco recomendações principais, idade mínima de 18 anos e cinco itens de navegação.

## Fronteiras de implementação

- `src/lib/types.ts` define os modelos usados pelos componentes. Substituir as fixtures por um repositório/API mantendo os componentes de apresentação.
- `src/lib/domain.ts` centraliza seleção, maioridade, validação e ordenação ilustrativa. A função de maioridade é reaplicada pelo servidor, independentemente do checkbox.
- `JourneyProvider` mantém apenas o estado efêmero da prévia. Migrar para um serviço de sessão e uma persistência autenticada após definir o modelo de consentimento. Não mover senha ou respostas para localStorage.
- `POST /api/demo/cadastro` é deliberadamente uma simulação sem autenticação. Não usar esse endpoint como cadastro de produção.
- O `PatientShell` não é uma barreira de autenticação. Rotas são públicas para revisão do protótipo. Adicionar autorização no servidor antes de conectar dados reais.
- O service worker tem escopo mínimo: fallback offline público. Qualquer política futura de cache precisa considerar dados privados e logout.

## Próxima implementação sugerida

1. Validar texto das perguntas, identidade visual e comportamento do matching com produto e profissionais responsáveis.
2. Criar autenticação, verificação de e-mail, sessão segura, termos definitivos e regra 18+ em uma API persistente. Definir fuso de negócio para a data de corte (a prévia usa a data local do servidor).
3. Conectar catálogo real, registro profissional validado e disponibilidade; substituir avaliações/avatares fictícios.
4. Implementar perfil completo, calendário, horário, contexto pré-consulta e consentimento de compartilhamento.
5. Conectar pagamento, confirmação por webhook e política de cancelamento. Não confirmar consulta apenas com um clique local.
6. Conectar dashboard e jornada aos eventos reais, sem competição ou promessa de resultado clínico.

## Convenções

- Componentes interativos recebem `use client`; layouts e rotas sem estado permanecem no servidor.
- Cor, raio e espaçamento são definidos em tokens; evite valores de marca duplicados.
- Mantenha rótulos, estados vazios e erros em português. Não indique que uma ação real foi concluída quando a integração ainda não existe.
- Não registre dados pessoais, respostas ou senhas em logs.
- Sem serviços de terceiros, rastreadores ou fontes remotas nesta entrega.

## Revisão antes de produção

Este repositório entrega a experiência visual inicial. Cadastro real, segurança de sessão, persistência, consentimentos definitivos, matching validado, notificações, pagamentos, agenda e atendimento ainda dependem das próximas etapas de produto e desenvolvimento.
