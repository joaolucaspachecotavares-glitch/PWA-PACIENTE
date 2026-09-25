import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("jornada mobile: questionário, cadastro, favoritos, filtros e navegação", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("link", { name: "Quero encontrar um profissional" }).click();
  await page.getByRole("link", { name: "Começar meu questionário" }).click();
  await expect(page.getByRole("button", { name: "Continuar", exact: true })).toBeDisabled();
  for (let i = 1; i <= 10; i++) {
    await expect(page).toHaveURL(new RegExp(`/questionario/${i}$`));
    await page.locator(".answer-option").first().click();
    await page
      .getByRole("button", {
        name: i === 10 ? "Encontrar meu apoio" : "Continuar",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", {
      name: "Existe um apoio que combina com você.",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Ver meus resultados" }).click();
  await page.getByLabel("Como podemos chamar você?").fill("Pessoa Teste");
  await page.getByLabel("Data de nascimento").fill("2015-01-01");
  await page.getByLabel("E-mail", { exact: true }).fill("teste@example.com");
  await page.getByLabel("Celular").fill("48999999999");
  await page.getByLabel("Senha", { exact: true }).fill("teste-exemplo-123");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Criar conta e ver resultados" }).click();
  await expect(
    page.getByText("O cadastro está disponível para pessoas com 18 anos ou mais.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.getByLabel("Data de nascimento").fill("1990-01-01");
  await page.getByRole("button", { name: "Criar conta e ver resultados" }).click();
  await expect(page).toHaveURL(/\/resultados$/);
  await page
    .getByRole("button", { name: /Adicionar .* aos favoritos/ })
    .first()
    .click();
  await page.getByRole("button", { name: /Favoritos 1/ }).click();
  await expect(page.locator(".professional-card")).toHaveCount(1);
  const professionalName = await page.locator(".professional-card h3").innerText();
  await page.getByRole("link", { name: "Ver perfil", exact: true }).click();
  await expect(page).toHaveURL(/\/perfil\?profissional=/);
  await expect(page.getByRole("heading", { level: 1, name: professionalName })).toBeVisible();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("link", { name: "Voltar para profissionais", exact: true }).click();
  await expect(page.getByRole("button", { name: /Favoritos 1/ })).toBeVisible();
  await page.getByRole("button", { name: "Filtros", exact: true }).click();
  await page.getByLabel("Modalidade", { exact: true }).selectOption("Presencial");
  await page.getByRole("button", { name: "Aplicar filtros" }).click();
  await expect(page.locator(".professional-card")).toHaveCount(2);
  await page
    .getByRole("navigation", {
      name: "Navegação principal mobile",
      exact: true,
    })
    .getByRole("link", { name: "Início", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "Olá, Pessoa." })).toBeVisible();
  await page.getByRole("button", { name: "Ver consulta" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(errors).toEqual([]);
});

test("API recusa menor e corpo inválido independentemente da interface", async ({ request }) => {
  const response = await request.post("/api/demo/cadastro", {
    data: {
      name: "Teste",
      birthDate: "2015-01-01",
      email: "teste@example.com",
      phone: "48999999999",
      password: "exemplo123",
      consent: true,
    },
  });
  expect(response.status()).toBe(422);
  expect((await response.json()).errors.birthDate).toBeTruthy();
  expect((await request.post("/api/demo/cadastro", { data: null })).status()).toBe(400);
});

test("telas responsivas sem rolagem horizontal e acessibilidade essencial", async ({ page }) => {
  const routes = [
    "/",
    "/questionario",
    "/questionario/1",
    "/matching",
    "/cadastro",
    "/resultados",
    "/dashboard",
  ];
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      if (route === "/matching")
        await page
          .getByRole("heading", {
            name: "Existe um apoio que combina com você.",
          })
          .waitFor();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${route} @ ${width}`,
      ).toBe(true);
      if (width === 390 || width === 1440) {
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          `${route} @ ${width}`,
        ).toEqual([]);
      }
    }
  }
});

test("PWA publica ícones e fallback offline sem cache de dados privados", async ({
  page,
  context,
  request,
}) => {
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.display).toBe("standalone");
  for (const icon of manifest.icons) expect((await request.get(icon.src)).status()).toBe(200);
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Uma pausa na conexão." })).toBeVisible();
  const cached = await page.evaluate(async () => {
    const result: string[] = [];
    for (const name of await caches.keys()) {
      const cache = await caches.open(name);
      result.push(...(await cache.keys()).map((r) => new URL(r.url).pathname));
    }
    return result;
  });
  expect(cached).toEqual(["/offline.html"]);
  await context.setOffline(false);
});
