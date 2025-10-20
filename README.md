# ⏳ Extensão Pomodoro – Pedro Alves  

Uma extensão simples de **Pomodoro** para Google Chrome / Opera GX.  
Ideal para quem quer organizar o tempo de estudo ou trabalho com ciclos de 25 minutos de foco.

---

## 🗂️ Estrutura do Projeto

```bash
pomodoro-extension/
├─ index.html
├─ style.css
├─ scrip.js
├─ manifest.json
└─ README.md
```
Simples e direto: apenas os arquivos essenciais para a extensão funcionar.

# 🖼️ Screenshots
📌 Popup da Extensão
![Preview do Pomodoro](https://github.com/user-attachments/assets/feb49234-4e26-4bd9-868f-caa80d0e1741)

📌 Alerta de Fim de Ciclo
![Preview do Pomodoro](https://github.com/user-attachments/assets/0dffbce0-506e-443c-b3d6-b8f9afbf2b61)

# 💻 Código dos Arquivos
```
index.html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pomodoro Timer - por PedroAlves2707</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>

    <div class="pomodoro-container">
        <h1>Pomodoro Timer</h1>
        
        <div id="timer-display">25:00</div>
        
        <div class="button-container">
            <button id="start-btn">Iniciar</button>
            <button id="pause-btn">Pausar</button>
            <button id="reset-btn">Resetar</button>
        </div>
    </div>

    <div class="links-container">
        <h3>Baixe a Extensão</h3>
        <ul>
            <li><a href="https://github.com/PedroAlves2707/bootcamp2-chrome-ext-PedroAlves2707" target="_blank">Ver no GitHub (Código Fonte)</a></li>
            <li><a href="https://github.com/PedroAlves2707/bootcamp2-chrome-ext-PedroAlves2707/releases" target="_blank">Baixar .zip (Instalador)</a></li>
        </ul>
    </div>

    <script src="script.js"></script>
</body>
</html>
style.css
/* Reset básico e estilo geral do corpo da página */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    background-color: #1a1a2e; /* Fundo escuro azulado */
    color: #e0e0e0; /* Cor de texto clara */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
}

/* Contêiner principal do Pomodoro */
.pomodoro-container {
    background-color: #1f1f38; /* Um pouco mais claro que o fundo */
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    text-align: center;
    width: 100%;
    max-width: 400px;
    margin-bottom: 40px;
}

h1 {
    font-size: 2.5rem;
    color: #7f5af0; /* Cor de destaque roxa */
    margin-bottom: 20px;
}

/* Estilo do display do tempo */
#timer-display {
    font-size: 6rem;
    font-weight: 600;
    color: #fffffe; /* Branco puro para destaque */
    margin-bottom: 30px;
}

/* Contêiner para os botões */
.button-container {
    display: flex;
    justify-content: center;
    gap: 15px; /* Espaço entre os botões */
}

/* Estilo geral dos botões */
.button-container button {
    border: none;
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    color: #fffffe;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.button-container button:hover {
    opacity: 0.9;
    transform: translateY(-2px); /* Efeito de levantar ao passar o mouse */
}

/* Cores específicas para cada botão */
#start-btn {
    background-color: #2cb67d; /* Verde */
}

#pause-btn {
    background-color: #ff9a00; /* Laranja */
}

#reset-btn {
    background-color: #e53e3e; /* Vermelho */
}

/* Contêiner para os links de download */
.links-container {
    text-align: center;
}

.links-container h3 {
    font-size: 1.2rem;
    color: #7f5af0;
    margin-bottom: 15px;
}

.links-container ul {
    list-style: none;
}

.links-container li {
    margin-bottom: 10px;
}

.links-container a {
    color: #a7a9be;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.2s ease;
}

.links-container a:hover {
    color: #fffffe;
    text-decoration: underline;
}
script.js
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
```
# ⚡ Funcionalidades
✅ Contagem regressiva de 25 minutos (padrão Pomodoro).
✅ Botão Iniciar para começar o ciclo.
✅ Botão para pausar a contagem.
✅ Botão Resetar para reiniciar a contagem.
✅ Alerta visual no final do ciclo para lembrar de fazer uma pausa.

# 🔧 Instalação (Modo Desenvolvedor)
Baixe este repositório como .zip ou clone no seu computador.

Abra o Chrome ou Opera GX e vá em chrome://extensions/.

Ative o Modo do Desenvolvedor (canto superior direito).

Clique em Carregar sem compactação.

Selecione a pasta onde está o projeto.

O ícone da extensão aparecerá na barra do navegador. Clique para abrir o popup.

# 📜 Licença
Distribuído sob a licença MIT.
Você pode usar, modificar e distribuir este projeto livremente, desde que mantenha os créditos.

# 🌐 GitHub Pages
(https://pedroalves2707.github.io/bootcamp2-chrome-ext-PedroAlves2707)

# 📦 Release
(https://github.com/PedroAlves2707/bootcamp2-chrome-ext-PedroAlves2707/releases)

