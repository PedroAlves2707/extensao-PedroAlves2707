// background.js — controla o timer global da extensão

let remaining = 25 * 60; // 25 minutos
let running = false;
let timerId = null;

// Envia atualização para todos os popups abertos
function broadcastState() {
  chrome.runtime.sendMessage({ type: 'state', remaining, running });
}

// Salva o estado atual no storage (para persistência)
function saveState() {
  chrome.storage.local.set({ remaining, running });
}

// Lê o estado salvo (quando a extensão inicia)
async function restoreState() {
  const res = await chrome.storage.local.get(['remaining', 'running']);
  remaining = res.remaining ?? 25 * 60;
  running = res.running ?? false;
}

// Lógica do timer
function tick() {
  if (running && remaining > 0) {
    remaining--;
    broadcastState();
    saveState();
  }
  if (remaining <= 0) {
    clearInterval(timerId);
    running = false;
    broadcastState();
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Pomodoro Finalizado!',
      message: 'Hora de fazer uma pausa.',
    });
  }
}

// Inicia o intervalo (a cada 1s)
function startTimer() {
  if (!running) {
    running = true;
    timerId = setInterval(tick, 1000);
    broadcastState();
    saveState();
  }
}

function pauseTimer() {
  running = false;
  clearInterval(timerId);
  broadcastState();
  saveState();
}

function resetTimer() {
  running = false;
  clearInterval(timerId);
  remaining = 25 * 60;
  broadcastState();
  saveState();
}

// Listener de mensagens vindas do popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'getState') {
    sendResponse({ remaining, running });
  } else if (msg.type === 'command') {
    if (msg.command === 'start') startTimer();
    if (msg.command === 'pause') pauseTimer();
    if (msg.command === 'reset') resetTimer();
  }
});

// Inicialização do background
chrome.runtime.onInstalled.addListener(() => {
  restoreState().then(() => {
    broadcastState();
  });
});
