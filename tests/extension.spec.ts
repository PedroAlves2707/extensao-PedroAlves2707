// tests/extension.spec.ts

import path from "path";
import { fileURLToPath } from "url"; // CORREÇÃO 1
import { chromium, test, expect } from "@playwright/test";

// --- CORREÇÃO 1: Definindo o __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ---

const pathToExtension = path.resolve(__dirname, "..", "dist");

test("Extensão carrega content script na página", async () => {
  console.log("🚀 Iniciando teste do content script...");

  const context = await chromium.launchPersistentContext("", {
    
    // --- CORREÇÃO 2: 'headless' dinâmico ---
    headless: !!process.env.CI, 
    // ---
    
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });

  const page = await context.newPage();
  await page.goto("https://example.com", { waitUntil: "load" });

  console.log("⏳ Aguardando content script injetar atributo...");

  // Espera até o content script realmente modificar o DOM
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