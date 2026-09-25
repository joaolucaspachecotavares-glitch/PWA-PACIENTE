import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Ver perfil abre a página do profissional escolhido e funciona ao recarregar", async ({
  page,
}) => {
  await page.goto("/profissionais");
  for (const [id, name] of [
    ["ana", "Ana Martins"],
    ["lucas", "Lucas Almeida"],
  ]) {
    const card = page
      .getByRole("article")
      .filter({ has: page.getByRole("heading", { name, exact: true }) });
    await card.getByRole("link", { name: "Ver perfil", exact: true }).click();
    await expect(page).toHaveURL(`/perfil?profissional=${id}`);
    await expect(page.getByRole("heading", { level: 1, name, exact: true })).toBeVisible();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    for (const title of [
      "Sobre mim",
      "Especialidades",
      "Minha abordagem",
      "Formação e experiência",
      "Avaliações",
      "Informações da consulta",
    ]) {
      await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    }
    await page.reload();
    await expect(page.getByRole("heading", { level: 1, name, exact: true })).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL("/profissionais");
  }
});

test("favoritos sincronizam com a lista e Perfil no menu continua sendo do paciente", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/perfil?profissional=ana");
  await page.getByRole("button", { name: "Adicionar Ana Martins aos favoritos" }).click();
  await expect(
    page.getByRole("button", { name: "Remover Ana Martins dos favoritos" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: "Voltar para profissionais", exact: true }).click();
  await page.getByRole("button", { name: "Favoritos 1", exact: true }).click();
  await expect(page.locator(".professional-card")).toHaveCount(1);
  await expect(page.locator(".professional-card h3")).toHaveText("Ana Martins");
  await page
    .getByRole("navigation", { name: "Navegação principal mobile", exact: true })
    .getByRole("link", { name: "Perfil", exact: true })
    .click();
  await expect(page).toHaveURL("/meu-perfil");
  await expect(page.getByRole("heading", { level: 1, name: "Meu perfil" })).toBeVisible();
});

test("links do dashboard e entrada direta identificam o profissional, inclusive inválidos", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await page.getByRole("link", { name: "Ver perfil", exact: true }).first().click();
  await expect(page).toHaveURL("/perfil?profissional=ana");
  await page.getByRole("button", { name: "Adicionar Ana Martins aos favoritos" }).click();
  await page
    .getByRole("navigation", { name: "Navegação principal", exact: true })
    .getByRole("link", { name: "Início", exact: true })
    .click();
  await page.locator(".saved-list").getByRole("link").click();
  await expect(page).toHaveURL("/perfil?profissional=ana");
  await page.goto("/perfil");
  await expect(
    page.getByRole("heading", { name: "Qual profissional você quer conhecer?" }),
  ).toBeVisible();
  await page.goto("/perfil?profissional=inexistente");
  await expect(page.getByRole("heading", { name: "Não encontramos este perfil." })).toBeVisible();
});

test("perfil completo mantém legibilidade e navegação em mobile e desktop", async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/perfil?profissional=carolina");
    await expect(page.getByRole("heading", { level: 1, name: "Carolina Alves" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
    await page.getByRole("link", { name: "Ver disponibilidade", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Disponibilidade", exact: true }),
    ).toBeInViewport();
    await expect(page.getByText("Nenhuma consulta é reservada nesta prévia.")).toBeVisible();
  }
});
