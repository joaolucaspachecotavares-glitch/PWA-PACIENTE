import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Requer a stack local rodando: banco (npm run db:local + db:seed) e API (porta 4000) no LUVIMIND-API.
const API_ORIGIN = "http://127.0.0.1:3000";
const PASSWORD = "senha-segura-123";

const ANSWERS: string[][] = [
  ["Ansiedade", "Trabalho"],
  ["Com alguns dias difíceis"],
  ["Esta será minha primeira vez"],
  ["Me conhecer melhor"],
  ["Online"],
  ["Acolhedor, com espaço para falar"],
  ["Noite", "Tarde"],
  ["Quero conhecer as opções"],
  ["Sem preferência"],
  ["Português"],
];

const uniqueEmail = () => `paciente-${Date.now()}-${Math.floor(Math.random() * 1e6)}@teste.luvimind.dev`;

function adultBirthDate() {
  const d = new Date();
  return `${d.getFullYear() - 30}-01-15`;
}

function underageBirthDate() {
  const d = new Date();
  return `${d.getFullYear() - 17}-01-15`;
}

/**
 * Erros de console inesperados (401 de sessão ausente é esperado para
 * visitantes; 422 é esperado ao testar o CPF inválido no pagamento).
 */
function trackConsole(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (/status of (401|422)/.test(text)) return;
    errors.push(text);
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

async function answerQuestionnaire(page: Page) {
  await page.goto("/onboarding");
  await page.getByRole("link", { name: "Quero encontrar um profissional" }).click();
  await page.getByRole("link", { name: "Começar" }).click();
  for (const [index, labels] of ANSWERS.entries()) {
    await expect(page).toHaveURL(new RegExp(`/questionario/${index + 1}$`));
    for (const label of labels) {
      await page.locator("label.answer-option", { hasText: label }).first().click();
    }
    await page.getByRole("button", { name: index === ANSWERS.length - 1 ? "Encontrar meu apoio" : "Continuar" }).click();
  }
  await expect(page).toHaveURL(/\/matching$/);
}

async function fillSignup(page: Page, email: string, birthDate: string) {
  await page.getByLabel("Nome", { exact: true }).fill("Paciente de Teste");
  await page.getByLabel("Data de nascimento").fill(birthDate);
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Celular").fill("48999990000");
  await page.getByLabel("Senha", { exact: true }).fill(PASSWORD);
  await page.locator("#acceptTerms").check();
}

test.describe("jornada do paciente", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("questionário → cadastro → agendamento → pagamento → cancelamento", async ({ page }) => {
    const errors = trackConsole(page);
    await answerQuestionnaire(page);

    // Prévia sem cadastro
    await expect(page.getByRole("link", { name: /Ver meus resultados/ })).toBeVisible();
    await page.getByRole("link", { name: /Ver meus resultados/ }).click();

    // Cadastro
    await expect(page).toHaveURL(/\/cadastro$/);
    await fillSignup(page, uniqueEmail(), adultBirthDate());
    await page.getByRole("button", { name: /Criar conta e ver resultados/ }).click();

    // Resultados
    await expect(page).toHaveURL(/\/resultados$/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Seus resultados" })).toBeVisible();
    const favorite = page.getByRole("button", { name: /Adicionar .* aos favoritos/ }).first();
    await favorite.click();
    await expect(page.getByRole("button", { name: /Remover .* dos favoritos/ }).first()).toBeVisible();

    // Perfil
    await page.getByRole("link", { name: /Ver perfil/ }).first().click();
    await expect(page).toHaveURL(/\/profissionais\/[a-z-]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Agendamento: última data disponível garante mais de 4h de antecedência (reembolso integral)
    await page.getByRole("link", { name: /^Agendar( consulta)?/ }).first().click();
    await expect(page).toHaveURL(/\/agendar/);
    await page.getByRole("option").last().click();
    await page.locator("button.time-slot").first().click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.locator("#summary").fill("Quero conversar sobre ansiedade no trabalho.");
    await page.getByText(/Autorizo compartilhar estas informações/).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("heading", { name: "Confirme sua consulta" })).toBeVisible();
    await page.getByRole("button", { name: /Ir para pagamento/ }).click();

    // Pagamento Pix (sandbox) — exige CPF na primeira cobrança
    await expect(page).toHaveURL(/\/pagamento$/);
    await page.getByLabel("CPF").fill("111.111.111-11");
    await page.getByRole("button", { name: /^Pagar / }).click();
    await expect(page.getByText("CPF inválido. Confira os números.")).toBeVisible();
    await page.getByLabel("CPF").fill("529.982.247-25");
    await page.getByRole("button", { name: /^Pagar / }).click();
    await expect(page.getByText("Copie o código abaixo")).toBeVisible();
    await page.getByRole("button", { name: /Simular Pix recebido/ }).click();

    // Confirmação
    await expect(page).toHaveURL(/\/confirmada$/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Sua consulta está confirmada!" })).toBeVisible();
    await expect(page.getByText("Google Meet")).toBeVisible();

    // Detalhe e cancelamento com reembolso
    await page.getByRole("link", { name: "Ver minha consulta" }).click();
    await expect(page.getByText("Resumo pré-consulta ✓")).toBeVisible();
    await page.getByRole("button", { name: "Cancelar consulta" }).click();
    await expect(page.getByText("Você receberá reembolso integral conforme nossa política.")).toBeVisible();
    await page.getByRole("button", { name: "Confirmar cancelamento" }).click();
    await expect(page.getByRole("button", { name: "Cancelar consulta" })).toHaveCount(0);

    // Notificações têm volta para o Perfil
    await page.goto("/notificacoes");
    await expect(page.getByRole("heading", { name: "Notificações" })).toBeVisible();
    await page.getByRole("link", { name: "Meu perfil", exact: true }).click();
    await expect(page).toHaveURL(/\/perfil$/);

    // Privacidade: "Baixar" entrega um PDF com os dados
    await page.goto("/perfil/privacidade");
    const downloading = page.waitForEvent("download");
    await page.getByRole("button", { name: "Baixar", exact: true }).click();
    const download = await downloading;
    expect(download.suggestedFilename()).toBe("meus-dados-luvimind.pdf");
    const file = await readFile(await download.path());
    expect(file.subarray(0, 5).toString("latin1")).toBe("%PDF-");

    await page.goto("/jornada");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("menores de 18 anos são bloqueados na tela e na API", async ({ page, request }) => {
    await answerQuestionnaire(page);
    await page.goto("/cadastro");
    await fillSignup(page, uniqueEmail(), underageBirthDate());
    await page.getByRole("button", { name: /Criar conta e ver resultados/ }).click();
    await expect(
      page.getByText("A Luvimind está disponível atualmente apenas para pessoas com 18 anos ou mais.").first(),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/cadastro$/);

    // A regra não depende do front: a API recusa diretamente.
    const response = await request.post("/api/auth/patient/register", {
      headers: { Origin: API_ORIGIN },
      data: {
        name: "Menor de Idade",
        birthDate: underageBirthDate(),
        email: uniqueEmail(),
        phone: "48999990000",
        password: PASSWORD,
        acceptTerms: true,
      },
    });
    expect(response.status()).toBe(422);
    expect(JSON.stringify(await response.json())).toContain("18 anos ou mais");
  });

  test("resposta de urgência leva ao apoio imediato", async ({ page }) => {
    await page.goto("/questionario/1");
    await page.locator("label.answer-option", { hasText: "Ansiedade" }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.locator("label.answer-option", { hasText: "Preciso de ajuda urgente agora" }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page).toHaveURL(/\/apoio/);
    await expect(page.locator('a[href="tel:188"]').first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Continuar na Luvimind/ })).toHaveAttribute("href", "/questionario/3");
  });

  test("visita anônima antes do login não derruba a sessão nova", async ({ page, playwright }) => {
    // Conta criada fora do navegador (contexto de requisição isolado).
    const email = uniqueEmail();
    const api = await playwright.request.newContext({ baseURL: API_ORIGIN });
    const created = await api.post("/api/auth/patient/register", {
      headers: { Origin: API_ORIGIN },
      data: { name: "Paciente Retorno", birthDate: adultBirthDate(), email, phone: "48999990000", password: PASSWORD, acceptTerms: true },
    });
    expect(created.status()).toBe(201);
    await api.dispose();

    await page.goto("/questionario/1"); // guarda "sem sessão" no cache do cliente
    await expect(page.locator("label.answer-option").first()).toBeVisible();
    await page.getByRole("link", { name: "Já tenho uma conta" }).click();
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Senha", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/inicio$/);
    await page.getByRole("navigation", { name: "Navegação principal mobile" }).getByRole("link", { name: "Consultas" }).click();
    await expect(page).toHaveURL(/\/consultas$/);
  });

  test("área logada exige sessão e login inválido mostra erro genérico", async ({ page }) => {
    await page.goto("/consultas");
    await expect(page).toHaveURL(/\/entrar\?proximo=/);
    await page.getByLabel("E-mail").fill("ninguem@teste.luvimind.dev");
    await page.getByLabel("Senha", { exact: true }).fill("senha-errada-123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText("E-mail ou senha incorretos.")).toBeVisible();
  });

  test("esqueci minha senha → link por e-mail → nova senha", async ({ page, playwright }) => {
    const email = uniqueEmail();
    const api = await playwright.request.newContext({ baseURL: API_ORIGIN });
    expect(
      (
        await api.post("/api/auth/patient/register", {
          headers: { Origin: API_ORIGIN },
          data: { name: "Paciente Senha", birthDate: adultBirthDate(), email, phone: "48999990000", password: PASSWORD, acceptTerms: true },
        })
      ).status(),
    ).toBe(201);
    await page.goto("/entrar");
    await page.getByRole("link", { name: "Esqueci minha senha" }).click();
    await page.getByLabel("E-mail").fill(email);
    await page.getByRole("button", { name: "Enviar link" }).click();
    await expect(page.getByText("Se houver uma conta com este e-mail")).toBeVisible();
    const outbox = await api.get(`/api/dev/outbox/latest?to=${encodeURIComponent(email)}`);
    const { text } = (await outbox.json()) as { text: string };
    const link = /http:\/\/127\.0\.0\.1:3000(\/redefinir-senha\?token=[^\s]+)/.exec(text)![1];
    await page.goto(link);
    await page.getByLabel("Nova senha", { exact: true }).fill("outra-senha-123");
    await page.getByLabel("Confirmar nova senha").fill("outra-senha-123");
    await page.getByRole("button", { name: "Salvar nova senha" }).click();
    await expect(page).toHaveURL(/\/entrar\?senha=redefinida/);
    await expect(page.getByText("Senha alterada. Entre com a nova senha.")).toBeVisible();
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Senha", { exact: true }).fill("outra-senha-123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/inicio$/);
    await api.dispose();
  });
});

test.describe("responsividade e acessibilidade", () => {
  const publicRoutes = ["/onboarding", "/questionario", "/questionario/1", "/entrar", "/cadastro", "/apoio", "/termos", "/privacidade"];

  for (const width of [320, 390, 768, 1440]) {
    test(`sem rolagem horizontal em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of publicRoutes) {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${route} em ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  for (const width of [390, 1440]) {
    test(`WCAG 2.1 AA em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of publicRoutes) {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        const summary = result.violations.map((v) => `${route}: ${v.id} (${v.nodes.length})`);
        expect(summary).toEqual([]);
      }
    });
  }
});

test("PWA: manifesto e cache apenas da página offline", async ({ page }) => {
  const manifest = await page.request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBe(true);
  const json = await manifest.json();
  expect(json.display).toBe("standalone");

  await page.goto("/onboarding");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect
    .poll(async () =>
      page.evaluate(async () => {
        const urls: string[] = [];
        for (const key of await caches.keys()) {
          const cache = await caches.open(key);
          for (const req of await cache.keys()) urls.push(new URL(req.url).pathname);
        }
        return urls;
      }),
    )
    .toEqual(["/offline.html"]);
});
