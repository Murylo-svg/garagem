document.addEventListener('DOMContentLoaded', function() {
    const veiculos = document.querySelectorAll('#selecao-veiculo img');
    const btnLigar = document.getElementById('ligar');
    const btnAcelerar = document.getElementById('acelerar');
    const btnFrear = document.getElementById('frear');
    const btnDesligar = document.getElementById('desligar');
    const btnTurbo = document.getElementById('turbo');
    const btnCarregar = document.getElementById('carregar');
    const btnDescarregar = document.getElementById('descarregar');
    const btnBuzinar = document.getElementById('buzinar');
    const velocimetroDisplay = document.getElementById('velocimetro-display');
    const cargaDisplay = document.getElementById('carga-display');
    const secaoCarga = document.getElementById('carga');
    const status = document.getElementById('status');
    const audioBuzinaCarro = document.getElementById('audio-buzina-carro');
    const audioBuzinaCaminhao = document.getElementById('audio-buzina-caminhao');

    let velocidade = 0;
    let cargaAtual = 0;
    let veiculoSelecionado = null;
    let ligado = false;

    const aceleracaoPadrao = 10;
    const frenagemPadrao = 20;
    const velocidadeMaximaNormal = 120;
    const velocidadeMaximaEsportivo = 200;
    const velocidadeMaximaCaminhao = 90;
    const capacidadeMaximaCaminhao = 5000;
    const quantidadeCarga = 500;
    let velocidadeMaximaAtual = velocidadeMaximaNormal;


    function atualizarVelocimetro() {
        velocimetroDisplay.textContent = velocidade + ' km/h';
    }

    function atualizarCargaDisplay() {
        cargaDisplay.textContent = cargaAtual + ' kg';
    }

    function atualizarBotoes() {
        btnAcelerar.disabled = !ligado;
        btnFrear.disabled = !ligado;
        btnDesligar.disabled = !ligado;
        btnCarregar.disabled = veiculoSelecionado !== 'caminhao';
        btnDescarregar.disabled = veiculoSelecionado !== 'caminhao';
        btnBuzinar.disabled = !veiculoSelecionado;
    }

    function atualizarVeiculoSelecionado(veiculo) {
        veiculos.forEach(v => v.classList.remove('selecionado'));
        veiculo.classList.add('selecionado');
        veiculoSelecionado = veiculo.dataset.veiculo;

        ligado = false;
        status.textContent = 'Veículo desligado.';

        const ehCaminhao = veiculoSelecionado === 'caminhao';
        btnTurbo.style.display = (veiculoSelecionado === 'esportivo') ? 'inline-block' : 'none';
        btnCarregar.style.display = ehCaminhao ? 'inline-block' : 'none';
        btnDescarregar.style.display = ehCaminhao ? 'inline-block' : 'none';
        secaoCarga.style.display = ehCaminhao ? 'block' : 'none';

        atualizarBotoes();

        switch (veiculoSelecionado) {
            case 'esportivo':
                velocidadeMaximaAtual = velocidadeMaximaEsportivo;
                break;
            case 'caminhao':
                velocidadeMaximaAtual = velocidadeMaximaCaminhao;
                break;
            default:
                velocidadeMaximaAtual = velocidadeMaximaNormal;
        }

        velocidade = 0;
        if (!ehCaminhao) {
            cargaAtual = 0;
        }
        atualizarVelocimetro();
        atualizarCargaDisplay();
    }

    function tocarSom(audioElement) {
        if (audioElement) {
            audioElement.currentTime = 0;
            audioElement.play().catch(error => {
                console.error("Erro ao tocar áudio:", error);
                status.textContent = "Erro ao tocar buzina. Interaja com a página.";
            });
        }
    }

    veiculos.forEach(veiculo => {
        veiculo.addEventListener('click', function() {
            atualizarVeiculoSelecionado(this);
        });
    });

    btnLigar.addEventListener('click', function() {
        if (veiculoSelecionado) {
            ligado = true;
            status.textContent = 'Veículo ligado.';
            atualizarBotoes();
        } else {
            status.textContent = 'Selecione um veículo primeiro.';
        }
    });

    btnAcelerar.addEventListener('click', function() {
        if (ligado) {
            velocidade += aceleracaoPadrao;
            velocidade = Math.min(velocidade, velocidadeMaximaAtual);
            atualizarVelocimetro();
            status.textContent = `Acelerando... Velocidade: ${velocidade} km/h`;
        }
    });

    btnFrear.addEventListener('click', function() {
        if (ligado) {
            velocidade -= frenagemPadrao;
            velocidade = Math.max(velocidade, 0);
            atualizarVelocimetro();
            status.textContent = `Freando! Velocidade: ${velocidade} km/h`;
        }
    });

    btnBuzinar.addEventListener('click', function() {
        if (veiculoSelecionado) {
            status.textContent = 'BIBIIIIII!';
            if (veiculoSelecionado === 'caminhao') {
                tocarSom(audioBuzinaCaminhao);
            } else {
                tocarSom(audioBuzinaCarro);
            }
        }
    });

    btnDesligar.addEventListener('click', function() {
        if (ligado) {
            ligado = false;
            velocidade = 0;
            status.textContent = 'Veículo desligado.';
            atualizarBotoes();
            atualizarVelocimetro();
        }
    });

    btnTurbo.addEventListener('click', function() {
        if (ligado && veiculoSelecionado === 'esportivo') {
            status.textContent = 'TURBOOOOO!';
        }
    });

    btnCarregar.addEventListener('click', function() {
        if (veiculoSelecionado === 'caminhao') {
            if (cargaAtual < capacidadeMaximaCaminhao) {
                cargaAtual += quantidadeCarga;
                cargaAtual = Math.min(cargaAtual, capacidadeMaximaCaminhao);
                atualizarCargaDisplay();
                status.textContent = `Carregando... Carga atual: ${cargaAtual} kg`;
            } else {
                status.textContent = 'Caminhão já está cheio!';
            }
        }
    });

    btnDescarregar.addEventListener('click', function() {
        if (veiculoSelecionado === 'caminhao') {
            if (cargaAtual > 0) {
                cargaAtual -= quantidadeCarga;
                cargaAtual = Math.max(cargaAtual, 0);
                atualizarCargaDisplay();
                status.textContent = `Descarregando... Carga atual: ${cargaAtual} kg`;
            } else {
                status.textContent = 'Caminhão já está vazio!';
            }
        }
    });


    atualizarBotoes();
    atualizarVelocimetro();
    atualizarCargaDisplay();
});