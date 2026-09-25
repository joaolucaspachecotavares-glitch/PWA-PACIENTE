import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
const output = process.argv[2] || "test-results/previews";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage();
for (const [label, width, height] of [["desktop", 1440, 1000], ["mobile", 390, 844]]) {
  await page.setViewportSize({ width, height });
  for (const [name, route] of [["onboarding", "/"], ["questionario-intro", "/questionario"], ["questionario", "/questionario/1"], ["matching", "/matching"], ["cadastro", "/cadastro"], ["resultados", "/resultados"], ["dashboard", "/dashboard"]]) {
    await page.goto(`http://127.0.0.1:3000${route}`);
    if (route === "/matching") await page.getByRole("heading", { name: "Existe um apoio que combina com você." }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(output, `${name}-${label}.png`), fullPage: true });
  }
}
await browser.close();
console.log(`Capturas salvas em ${output}`);
