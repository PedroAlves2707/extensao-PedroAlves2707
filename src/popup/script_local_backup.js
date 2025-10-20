// Pegando os elementos do HTML
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Variáveis de estado do timer
let timer; // Para guardar o ID do setInterval
let minutes = 25;
let seconds = 0;
let isPaused = true; // Começa pausado

// Função para formatar o tempo e atualizar o display
function updateDisplay() {
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
    document.title = `${formattedMinutes}:${formattedSeconds} - Pomodoro Timer`;
}

// Função principal que executa a cada segundo
function countdown() {
    if (seconds === 0) {
        if (minutes === 0) {
            // Timer chegou ao fim
            clearInterval(timer);
            alert("Tempo esgotado! Hora de uma pausa.");
            resetTimer();
            return;
        }
        minutes--;
        seconds = 59;
    } else {
        seconds--;
    }
    updateDisplay();
}

// Função para iniciar ou resumir o timer
function startTimer() {
    if (isPaused) {
        isPaused = false;
        // Inicia o intervalo, executando a função countdown a cada 1000ms (1 segundo)
        timer = setInterval(countdown, 1000);
    }
}

// Função para pausar o timer
function pauseTimer() {
    isPaused = true;
    // Para o intervalo
    clearInterval(timer);
}

// Função para resetar o timer
function resetTimer() {
    isPaused = true;
    clearInterval(timer);
    minutes = 25;
    seconds = 0;
    updateDisplay(); // Atualiza o display para o tempo inicial
}

// Adicionando os eventos aos botões
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Garante que o display mostre o tempo inicial quando a página carrega
updateDisplay();