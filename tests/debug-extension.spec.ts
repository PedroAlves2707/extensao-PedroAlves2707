import path from "path";
import { fileURLToPath } from "url";
import { chromium, test, expect } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathToExtension = path.resolve(__dirname, "..", "dist");

test("Verifica se a extensão foi carregada", async () => {
  console.log("⏳ Iniciando teste da extensão...");

  const context = await chromium.launchPersistentContext("", {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });

  let bgPage = context.backgroundPages()[0];
  for (let i = 0; i < 10 && !bgPage; i++) {
    console.log(`🔁 Tentando detectar background... tentativa ${i + 1}`);
    await new Promise((r) => setTimeout(r, 1000));
    bgPage = context.backgroundPages()[0];
  }

  if (bgPage) {
    console.log("✅ Background page detectada!");
  } else {
    const workers = context.serviceWorkers();
    if (workers.length > 0) {
      console.log("✅ Service worker detectado:", workers[0].url());
    } else {
      throw new Error("❌ Nenhum background ou service worker detectado.");
    }
  }

  const page = await context.newPage();
  await page.goto("https://example.com");
  await expect(page).toHaveTitle(/Example Domain/i);

  console.log("✅ Extensão carregada e funcional!");
  await context.close();
});
