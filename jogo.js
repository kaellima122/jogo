// Seleciona o botão de "Play", o canvas do jogo e o seletor de cor
const startButton = document.getElementById('startButton');
const gameCanvas = document.getElementById('gameCanvas');
const gameContainer = document.getElementById('game-container');
const snakeColorInput = document.getElementById('snakeColor'); // Seletor de cor

// Função para iniciar o jogo
startButton.addEventListener('click', () => {
    startButton.style.display = 'none'; // Esconde o botão "Play"
    gameContainer.style.display = 'block'; // Exibe o container do jogo
    iniciarJogo(); // Inicia o jogo
});

// Função para o jogo
function iniciarJogo() {
    const ctx = gameCanvas.getContext('2d');
    const tamanho = 20;
    const velocidade = 100; // Ajuste para controle de velocidade
    let cobra = [{ x: 160, y: 160 }]; // Posição inicial ajustada para não colidir imediatamente
    let direcao = 'RIGHT';
    let comida = gerarComida();
    let gameOver = false;

    // Define as dimensões do canvas
    gameCanvas.width = 400;  // Largura do canvas
    gameCanvas.height = 400; // Altura do canvas

    // Define a cor da cobra com base no valor selecionado pelo usuário
    const corCobra = snakeColorInput.value;

    // Desenha os elementos na tela
    function desenhar() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height); // Limpa a tela

        // Desenha a comida
        ctx.fillStyle = "red";
        ctx.fillRect(comida.x, comida.y, tamanho, tamanho);

        // Desenha a cobra com a cor selecionada
        ctx.fillStyle = corCobra;
        cobra.forEach(segmento => {
            ctx.fillRect(segmento.x, segmento.y, tamanho, tamanho);
        });

        // Pontuação
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Pontuação: ${cobra.length - 1}`, 10, 30);
    }

    // Atualiza a posição da cobra e a comida
    function atualizar() {
        if (gameOver) return;

        let cabeca = { ...cobra[0] }; // Copia a cabeça da cobra
        if (direcao === 'UP') cabeca.y -= tamanho;
        if (direcao === 'DOWN') cabeca.y += tamanho;
        if (direcao === 'LEFT') cabeca.x -= tamanho;
        if (direcao === 'RIGHT') cabeca.x += tamanho;

        // Verifica se a cobra colidiu com a parede ou com ela mesma
        if (cabeca.x < 0 || cabeca.x >= gameCanvas.width || cabeca.y < 0 || cabeca.y >= gameCanvas.height ||
            cobra.some(segmento => segmento.x === cabeca.x && segmento.y === cabeca.y)) {
            gameOver = true;
            alert("Game Over!"); // Alerta de game over
            document.location.reload(); // Reinicia o jogo
        }

        cobra.unshift(cabeca); // Adiciona a nova cabeça

        // Verifica se a cobra comeu a comida
        if (cabeca.x === comida.x && cabeca.y === comida.y) {
            comida = gerarComida(); // Gera nova comida
        } else {
            cobra.pop(); // Remove a cauda da cobra
        }
    }

    // Gera a posição aleatória da comida
    function gerarComida() {
        return {
            x: Math.floor(Math.random() * (gameCanvas.width / tamanho)) * tamanho,
            y: Math.floor(Math.random() * (gameCanvas.height / tamanho)) * tamanho
        };
    }

    // Controla a direção da cobra através das teclas
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp' && direcao !== 'DOWN') direcao = 'UP';
        if (event.key === 'ArrowDown' && direcao !== 'UP') direcao = 'DOWN';
        if (event.key === 'ArrowLeft' && direcao !== 'RIGHT') direcao = 'LEFT';
        if (event.key === 'ArrowRight' && direcao !== 'LEFT') direcao = 'RIGHT';
    });

    // Loop principal do jogo
    function loop() {
        if (gameOver) return;

        atualizar();
        desenhar();
        setTimeout(loop, velocidade); // Ajusta a velocidade do jogo
    }

    loop(); // Inicia o loop do jogo
}
