// tests/extension.spec.ts
import path from "path";
import { fileURLToPath } from "url";
import { chromium, test, expect } from "@playwright/test";

// ... (resto do seu código inicial)
const pathToExtension = path.resolve(__dirname, "..", "dist");

test("Extensão carrega content script na página", async () => {
  console.log("🚀 Iniciando teste do content script...");

  const context = await chromium.launchPersistentContext("", {
    // 👇 MUDE AQUI
    headless: !!process.env.CI, // <-- ✅ SOLUÇÃO
    // 👆
    // Isso será 'true' no GitHub Actions e 'false' na sua máquina
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });

  const page = await context.newPage();
  // ... (resto do seu teste está ótimo)
  
  await page.goto("https://example.com", { waitUntil: "load" });
  console.log("⏳ Aguardando content script injetar atributo...");

  // (Seu loop de checagem está bom)
  let loaded = null;
  for (let i = 0; i < 15; i++) {
    loaded = await page.evaluate(() => {
      const attr = document.body.getAttribute("data-pomodoro-extension-loaded");
      return attr;
    });
    if (loaded === "true") break;
    console.log(`Tentativa ${i + 1}... atributo ainda não detectado`);
    await page.waitForTimeout(1000);
  }

  console.log("Resultado final do atributo:", loaded);
  if (loaded !== "true") {
    const html = await page.content();
    console.log("DEBUG HTML:", html.slice(0, 500));
    throw new Error("❌ Content script não foi injetado ou demorou demais.");
  }

  expect(loaded).toBe("true");
  console.log("✅ Content script foi carregado com sucesso!");
  await context.close();
});