// script.js — versão integrada com o background service worker

const display = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Função para formatar o tempo (mm:ss)
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Função para pedir o estado atual do timer ao background
async function requestState() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'getState' }, (res) => {
      if (!res) {
        // Caso não receba resposta (erro ou não inicializado)
        res = { remaining: 25 * 60, running: false };
      }
      resolve(res);
    });
  });
}

// Atualiza o display e os botões conforme o estado
function updateUI(state) {
  display.textContent = formatTime(state.remaining);
  startBtn.disabled = state.running;
  pauseBtn.disabled = !state.running;
}

// ---- Botões enviam comandos ao background ----
startBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'command', command: 'start' });
});

pauseBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'command', command: 'pause' });
});

resetBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'command', command: 'reset' });
});

// ---- Recebe mensagens do background (atualizações do timer) ----
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'state') {
    updateUI({ remaining: msg.remaining, running: msg.running });
  }
});

// ---- Inicializa o popup ----
(async () => {
  const state = await requestState();
  updateUI(state);
})();
