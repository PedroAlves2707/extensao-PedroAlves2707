Set-Content -Path src\content\content.js -Value @"
// src/content/content.js

console.log("Pomodoro CRVG ativo!");

// Esta função é só ilustrativa, caso queira adicionar alguma interação na página
function initPomodoroBanner() {
  // Cria um pequeno banner na página para indicar que a extensão está ativa
  const banner = document.createElement("div");
  banner.textContent = "⏱️ Pomodoro CRVG ativo!";
  banner.style.position = "fixed";
  banner.style.bottom = "10px";
  banner.style.right = "10px";
  banner.style.backgroundColor = "#900";
  banner.style.color = "white";
  banner.style.padding = "8px 12px";
  banner.style.borderRadius = "8px";
  banner.style.fontFamily = "Arial, sans-serif";
  banner.style.fontSize = "14px";
  banner.style.zIndex = "9999";
  document.body.appendChild(banner);
}

// Marca que o content script foi carregado (para o teste reconhecer)
document.body.setAttribute('data-pomodoro-extension-loaded', 'true');

// Chama a função (opcional)
initPomodoroBanner();
"@