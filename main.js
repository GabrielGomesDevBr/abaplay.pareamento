document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // CONFIGURAÇÕES E CONSTANTES DO JOGO
    // =========================================================================
    
    const paresDeImagens = [
        ['utensilios', 'garfo.png', 'prato.png'],
        ['vestuario', 'sapato.png', 'meia.png'],
        ['escolar', 'lapis.png', 'caderno.png'],
        ['bebida', 'xicara.png', 'cafe.png'],
        ['ferramentas', 'martelo.png', 'prego.png'],
        ['seguranca', 'chave.png', 'cadeado.png']
    ];

    // Elementos da DOM
    const gameBoard = document.getElementById('game-board');
    const scoreEl = document.getElementById('score');
    const totalPairsEl = document.getElementById('total-pairs');
    const resultsScreenEl = document.getElementById('results-screen');
    const totalAttemptsEl = document.getElementById('total-attempts');
    const correctMatchesEl = document.getElementById('correct-matches');
    const wrongMatchesEl = document.getElementById('wrong-matches');
    const playAgainBtn = document.getElementById('play-again-btn');

    // Variáveis de estado do jogo
    let primeiraCarta, segundaCarta;
    let tabuleiroBloqueado = false;
    let dadosPartida = { acertos: 0, tentativas: 0 };

    // =========================================================================
    // FUNÇÕES PRINCIPAIS DO JOGO
    // =========================================================================

    function iniciarJogo() {
        resetarEstado();

        const imagensDoJogo = [];
        paresDeImagens.forEach(par => {
            imagensDoJogo.push({ id: par[0], src: par[1] });
            imagensDoJogo.push({ id: par[0], src: par[2] });
        });

        embaralharArray(imagensDoJogo);

        imagensDoJogo.forEach(item => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.pairId = item.id;

            // Todas as cartas começam visíveis
            cardElement.innerHTML = `
                <img src="assets/images/${item.src}" alt="${item.id}" onerror="this.onerror=null;this.src='https://placehold.co/100x100/FFF/333?text=Erro';">
            `;
            
            cardElement.addEventListener('click', selecionarCarta);
            gameBoard.appendChild(cardElement);
        });
    }

    /**
     * Lógica para selecionar uma carta (não mais 'virar').
     */
    function selecionarCarta() {
        if (tabuleiroBloqueado || this.classList.contains('matched')) return;

        // Impede que a mesma carta seja selecionada duas vezes
        if (this === primeiraCarta) return;

        this.classList.add('selected');

        if (!primeiraCarta) {
            primeiraCarta = this;
            return;
        }

        segundaCarta = this;
        tabuleiroBloqueado = true;
        dadosPartida.tentativas++;

        verificarPar();
    }

    function verificarPar() {
        const ehPar = primeiraCarta.dataset.pairId === segundaCarta.dataset.pairId;

        if (ehPar) {
            processarAcerto();
        } else {
            processarErro();
        }
    }

    /**
     * Processa o acerto de um par.
     */
    function processarAcerto() {
        dadosPartida.acertos++;
        scoreEl.textContent = dadosPartida.acertos;

        // Adiciona a classe para a animação de sucesso
        primeiraCarta.classList.add('matched');
        segundaCarta.classList.add('matched');

        // Remove a capacidade de clicar novamente nessas cartas
        primeiraCarta.removeEventListener('click', selecionarCarta);
        segundaCarta.removeEventListener('click', selecionarCarta);
        
        resetarJogada();
        verificarFimDeJogo();
    }

    /**
     * Processa o erro de um par.
     */
    function processarErro() {
        primeiraCarta.classList.add('shake');
        segundaCarta.classList.add('shake');

        // Após um tempo, remove as classes de feedback visual
        setTimeout(() => {
            primeiraCarta.classList.remove('selected', 'shake');
            segundaCarta.classList.remove('selected', 'shake');
            resetarJogada();
        }, 1000);
    }
    
    function verificarFimDeJogo() {
        if (dadosPartida.acertos === paresDeImagens.length) {
            setTimeout(mostrarResultados, 1000);
        }
    }

    function mostrarResultados() {
        totalAttemptsEl.textContent = dadosPartida.tentativas;
        correctMatchesEl.textContent = dadosPartida.acertos;
        wrongMatchesEl.textContent = dadosPartida.tentativas - dadosPartida.acertos;
        resultsScreenEl.classList.remove('hidden');
    }

    // =========================================================================
    // FUNÇÕES UTILITÁRIAS
    // =========================================================================

    function resetarJogada() {
        [primeiraCarta, segundaCarta] = [null, null];
        tabuleiroBloqueado = false;
    }

    function resetarEstado() {
        gameBoard.innerHTML = '';
        resultsScreenEl.classList.add('hidden');
        dadosPartida = { acertos: 0, tentativas: 0 };
        scoreEl.textContent = '0';
        totalPairsEl.textContent = paresDeImagens.length;
        resetarJogada();
    }
    
    function embaralharArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    playAgainBtn.addEventListener('click', iniciarJogo);
    iniciarJogo();

});
