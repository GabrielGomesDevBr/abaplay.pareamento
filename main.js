document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // CONFIGURAÇÕES E CONSTANTES DO JOGO
    // =========================================================================
    
    // ATENÇÃO, DESENVOLVEDOR JÚNIOR:
    // Para adicionar novos pares, adicione um novo array aqui.
    // O primeiro item é o NOME do par (para identificação), e os dois
    // seguintes são os nomes dos arquivos de imagem na pasta 'assets/images/'.
    const paresDeImagens = [
        ['utensilios', 'garfo.png', 'prato.png'],
        ['vestuario', 'sapato.png', 'meia.png'],
        ['escolar', 'lapis.png', 'caderno.png'],
        ['bebida', 'xicara.png', 'cafe.png'], // Ajustado para corresponder às imagens
        ['ferramentas', 'martelo.png', 'prego.png'],
        ['seguranca', 'chave.png', 'cadeado.png']
    ];

    // Elementos da DOM
    const gameBoard = document.getElementById('game-board');
    const scoreEl = document.getElementById('score');
    const totalPairsEl = document.getElementById('total-pairs');
    
    // Elementos da tela de resultados
    const resultsScreenEl = document.getElementById('results-screen');
    const totalAttemptsEl = document.getElementById('total-attempts');
    const correctMatchesEl = document.getElementById('correct-matches');
    const wrongMatchesEl = document.getElementById('wrong-matches');
    const playAgainBtn = document.getElementById('play-again-btn');

    // Variáveis de estado do jogo
    let cartas = []; // Array que guardará os elementos das cartas
    let primeiraCarta, segundaCarta;
    let tabuleiroBloqueado = false; // Impede cliques durante animações
    let dadosPartida = {
        acertos: 0,
        tentativas: 0
    };

    // =========================================================================
    // FUNÇÕES PRINCIPAIS DO JOGO
    // =========================================================================

    /**
     * Inicia o jogo, criando e embaralhando as cartas.
     */
    function iniciarJogo() {
        // Reseta o estado
        resetarEstado();

        // Cria a lista de todas as imagens que estarão no tabuleiro
        const imagensDoJogo = [];
        paresDeImagens.forEach(par => {
            // Adiciona as duas imagens do par, com seu identificador
            imagensDoJogo.push({ id: par[0], src: par[1] });
            imagensDoJogo.push({ id: par[0], src: par[2] });
        });

        // Embaralha o array de imagens
        embaralharArray(imagensDoJogo);

        // Cria o HTML para cada carta e adiciona ao tabuleiro
        imagensDoJogo.forEach(item => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.pairId = item.id; // Atributo para identificar o par

            // *** CORREÇÃO APLICADA AQUI ***
            // O caminho da imagem agora aponta para a pasta correta.
            cardElement.innerHTML = `
                <div class="card-face card-front">
                    <img src="assets/images/${item.src}" alt="${item.id}" onerror="this.onerror=null;this.src='https://placehold.co/100x100/FFF/333?text=Erro';">
                </div>
                <div class="card-face card-back">?</div>
            `;
            
            gameBoard.appendChild(cardElement);
            cartas.push(cardElement); // Guarda a referência da carta
        });

        // Adiciona o listener de clique para cada carta
        cartas.forEach(carta => carta.addEventListener('click', virarCarta));
    }

    /**
     * Lida com o clique em uma carta.
     */
    function virarCarta() {
        // Se o tabuleiro estiver bloqueado ou a carta já foi clicada/combinada, ignora
        if (tabuleiroBloqueado || this === primeiraCarta || this.classList.contains('matched')) return;

        this.classList.add('flipped');

        if (!primeiraCarta) {
            // Se é a primeira carta da jogada
            primeiraCarta = this;
            return;
        }

        // Se é a segunda carta da jogada
        segundaCarta = this;
        tabuleiroBloqueado = true; // Bloqueia o tabuleiro para evitar mais cliques
        dadosPartida.tentativas++;

        verificarPar();
    }

    /**
     * Verifica se as duas cartas viradas formam um par.
     */
    function verificarPar() {
        const ehPar = primeiraCarta.dataset.pairId === segundaCarta.dataset.pairId;

        if (ehPar) {
            // Se formam um par
            dadosPartida.acertos++;
            scoreEl.textContent = dadosPartida.acertos;
            desabilitarCartas();
            verificarFimDeJogo();
        } else {
            // Se não formam um par
            desvirarCartas();
        }
    }

    /**
     * Remove os listeners e marca as cartas como combinadas.
     */
    function desabilitarCartas() {
        primeiraCarta.removeEventListener('click', virarCarta);
        segundaCarta.removeEventListener('click', virarCarta);

        // Adiciona a classe de sucesso para a animação de desaparecer
        primeiraCarta.classList.add('matched');
        segundaCarta.classList.add('matched');

        resetarJogada();
    }

    /**
     * Vira as cartas de volta se elas não formarem um par.
     */
    function desvirarCartas() {
        // Adiciona a animação de "tremer"
        primeiraCarta.classList.add('shake');
        segundaCarta.classList.add('shake');

        // Após um tempo, remove as classes para virar de volta e parar de tremer
        setTimeout(() => {
            primeiraCarta.classList.remove('flipped', 'shake');
            segundaCarta.classList.remove('flipped', 'shake');
            resetarJogada();
        }, 1200); // Tempo para o jogador ver as duas cartas e a animação
    }

    /**
     * Verifica se o jogo terminou.
     */
    function verificarFimDeJogo() {
        if (dadosPartida.acertos === paresDeImagens.length) {
            // Atraso para a última animação de acerto terminar
            setTimeout(mostrarResultados, 1000);
        }
    }

    /**
     * Mostra a tela de resultados finais.
     */
    function mostrarResultados() {
        totalAttemptsEl.textContent = dadosPartida.tentativas;
        correctMatchesEl.textContent = dadosPartida.acertos;
        wrongMatchesEl.textContent = dadosPartida.tentativas - dadosPartida.acertos;
        resultsScreenEl.classList.remove('hidden');
    }

    // =========================================================================
    // FUNÇÕES UTILITÁRIAS
    // =========================================================================

    /**
     * Reseta as variáveis de uma jogada.
     */
    function resetarJogada() {
        [primeiraCarta, segundaCarta] = [null, null];
        tabuleiroBloqueado = false;
    }

    /**
     * Limpa o tabuleiro e reseta o estado do jogo para uma nova partida.
     */
    function resetarEstado() {
        gameBoard.innerHTML = '';
        resultsScreenEl.classList.add('hidden');
        cartas = [];
        dadosPartida = { acertos: 0, tentativas: 0 };
        scoreEl.textContent = '0';
        totalPairsEl.textContent = paresDeImagens.length;
        resetarJogada();
    }
    
    /**
     * Embaralha os elementos de um array (algoritmo Fisher-Yates).
     * @param {Array} array - O array a ser embaralhado.
     */
    function embaralharArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Listener para o botão de jogar novamente
    playAgainBtn.addEventListener('click', iniciarJogo);

    // Inicia o jogo pela primeira vez
    iniciarJogo();

});
