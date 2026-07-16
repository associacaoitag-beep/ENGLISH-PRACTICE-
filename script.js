document.addEventListener('DOMContentLoaded', () => {

// ======================= 1. MENU GLOBAL =======================
const btnMenu = document.getElementById('btn-menu');
const btnFechar = document.getElementById('btn-fechar');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

if (btnMenu) btnMenu.addEventListener('click', () => { sidebar.classList.add('ativa'); overlay.classList.add('ativa'); });
if (btnFechar) btnFechar.addEventListener('click', () => { sidebar.classList.remove('ativa'); overlay.classList.remove('ativa'); });
if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('ativa'); overlay.classList.remove('ativa'); });

// ======================= 2. LOGICA MEMBROS - membros.html =======================
const listaMembros = document.getElementById('lista-membros');
const btnAddMembro = document.getElementById('btn-add-membro');

if(listaMembros) {
    let membros = JSON.parse(localStorage.getItem('membrosEP')) || [];

    function renderMembros() {
        listaMembros.innerHTML = '';
        document.getElementById('total-membros').innerText = membros.length;
        membros.forEach((membro, i) => {
            listaMembros.innerHTML += `<li style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid var(--borda--);"><span>${i + 1}. ${membro}</span><i class="bi bi-trash" style="cursor:pointer; color:#DC2626;" onclick="removerMembro(${i})"></i></li>`;
        });
    }

    window.removerMembro = function(i) {
        membros.splice(i, 1);
        localStorage.setItem('membrosEP', JSON.stringify(membros));
        renderMembros();
    }

    btnAddMembro.addEventListener('click', () => {
        const input = document.getElementById('input-novo-membro');
        if (input.value.trim()!== '') {
            membros.push(input.value.trim());
            localStorage.setItem('membrosEP', JSON.stringify(membros));
            input.value = '';
            renderMembros();
        }
    });

    renderMembros();
}

// ======================= 3. LOGICA CONFIG - config.html =======================
const btnSalvarConfig = document.getElementById('btn-salvar-config');

if(btnSalvarConfig) {
    const radioApi = document.getElementById('fonte-api');
    const radioBd = document.getElementById('fonte-bd');
    const configApi = document.getElementById('config-api');
    const configBd = document.getElementById('config-bd');

    function toggleConfig() {
        configApi.style.display = radioApi.checked? 'block' : 'none';
        configBd.style.display = radioBd.checked? 'block' : 'none';
    }
    radioApi.addEventListener('change', toggleConfig);
    radioBd.addEventListener('change', toggleConfig);

    const fonteSalva = localStorage.getItem('fonteEP') || 'bd';
    if (fonteSalva === 'api') radioApi.checked = true; else radioBd.checked = true;
    toggleConfig();

    document.getElementById('qtd-perguntas').value = localStorage.getItem('qtdEP') || 2;
    document.getElementById('tempo-resposta').value = localStorage.getItem('tempoEP') || 30;

    btnSalvarConfig.addEventListener('click', () => {
        const fonte = document.querySelector('input[name="fonte"]:checked').value;
        localStorage.setItem('fonteEP', fonte);
        localStorage.setItem('qtdEP', document.getElementById('qtd-perguntas').value);
        localStorage.setItem('tempoEP', document.getElementById('tempo-resposta').value);
        alert('Definições salvas com sucesso!');
    });
}

// ======================= 4. LOGICA BANCO DE PERGUNTAS - relatorios.html =======================
const btnSalvarPergunta = document.getElementById('btn-salvar-pergunta');
const listaPerguntas = document.getElementById('lista-perguntas');
const btnLimparBd = document.getElementById('btn-limpar-bd');
const btnExportar = document.getElementById('btn-exportar');
const btnImportar = document.getElementById('btn-importar');

if(btnSalvarPergunta) {
    let bancoPerguntas = [];

    async function carregarBanco() {
        try { const response = await fetch('banco.json'); bancoPerguntas = await response.json(); }
        catch { bancoPerguntas = JSON.parse(localStorage.getItem('bancoPerguntasEP')) || []; }
        renderBanco();
    }

    function salvarBanco() {
        localStorage.setItem('bancoPerguntasEP', JSON.stringify(bancoPerguntas));
        baixarJSON(bancoPerguntas, 'banco.json');
    }

    function baixarJSON(dados, nomeArquivo) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dados, null, 2));
        const link = document.createElement('a');
        link.setAttribute("href", dataStr);
        link.setAttribute("download", nomeArquivo);
        link.click();
    }

    function renderBanco() {
        listaPerguntas.innerHTML = '';
        document.getElementById('total-perguntas').innerText = bancoPerguntas.length;
        if(bancoPerguntas.length === 0) { listaPerguntas.innerHTML = '<p style="color:#6B7280;">Banco vazio.</p>'; return; }
        bancoPerguntas.forEach((p, i) => {
            listaPerguntas.innerHTML += `<div style="padding:10px; border-bottom:1px solid var(--borda--);">
                <b>Tema:</b> ${p.tema}<br><b>P:</b> ${p.pergunta}<br><b>TR:</b> ${p.traducao}<br><b>R:</b> ${p.resposta}
                <i class="bi bi-trash" style="float:right; cursor:pointer; color:#DC2626;" onclick="removerPergunta(${i})"></i>
            </div>`;
        });
    }

    window.removerPergunta = function(i) {
        bancoPerguntas.splice(i, 1);
        salvarBanco();
        renderBanco();
    }

    btnSalvarPergunta.addEventListener('click', () => {
        const tema = document.getElementById('tema-pergunta').value;
        const pergunta = document.getElementById('texto-pergunta').value;
        const traducao = document.getElementById('traducao-pergunta').value;
        const resposta = document.getElementById('resposta-pergunta').value;
        if(tema && pergunta && traducao && resposta) {
            bancoPerguntas.push({tema, pergunta, traducao, resposta});
            salvarBanco();
            renderBanco();
            document.getElementById('tema-pergunta').value='';
            document.getElementById('texto-pergunta').value='';
            document.getElementById('traducao-pergunta').value='';
            document.getElementById('resposta-pergunta').value='';
            alert('Pergunta salva! Baixe o novo banco.json');
        }
        else { alert('Preencha todos os campos'); }
    });

    btnLimparBd.addEventListener('click', () => {
        if(confirm('Apagar tudo?')) { bancoPerguntas = []; salvarBanco(); renderBanco(); }
    });

    btnExportar.addEventListener('click', () => salvarBanco());

    btnImportar.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            bancoPerguntas = JSON.parse(event.target.result);
            salvarBanco();
            renderBanco();
            alert('Banco importado com sucesso!');
        };
        reader.readAsText(file);
    });

    carregarBanco();
}

// ======================= 5. LOGICA INDEX UNIFICADA - index.html =======================
const btnSortear = document.getElementById('btn-sortear-membro');
const btnAcertou = document.getElementById('btn-acertou');
const btnErrou = document.getElementById('btn-errou');
const btnReiniciar = document.getElementById('btn-reiniciar');

if(btnSortear) {
    const telaGerar = document.getElementById('tela-gerar');
    const telaRifa = document.getElementById('tela-rifa');
    const cardSorteado = document.getElementById('card-membro-sorteado'); // NOVO
    const telaPerguntas = document.getElementById('tela-perguntas');
    const telaFinal = document.getElementById('tela-final');

    let membros = JSON.parse(localStorage.getItem('membrosEP')) || [];
    let banco = [];
    let ranking = [];
    let membrosJaSorteados = [];
    let membroAtual = null;
    let perguntasDoMembro = [];
    let perguntaAtualIndex = 0;
    let pontosDoMembroAtual = 0;
    let timerInterval;

    const audioFim = new Audio("data:audio/wav;base64,UklGRiZgBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAgAQAAAAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA");

    async function carregarBancoParaRifa() {
        try { const response = await fetch('banco.json'); banco = await response.json(); }
        catch { banco = JSON.parse(localStorage.getItem('bancoPerguntasEP')) || []; }
        document.getElementById('total-perguntas-rifa').innerText = banco.length;
    }

    const fonte = localStorage.getItem('fonteEP') || 'bd';
    if(fonte === 'bd'){
        telaGerar.style.display = 'none';
        telaRifa.style.display = 'block';
    } else {
        telaGerar.style.display = 'block';
        telaRifa.style.display = 'none';
    }

    document.getElementById('total-membros-rifa').innerText = membros.length;
    carregarBancoParaRifa();

    async function iniciarRifa() {
        await carregarBancoParaRifa();
        if(membros.length === 0) { alert('Cadastre membros primeiro!'); return; }
        if(banco.length === 0) { alert('Cadastre perguntas no banco primeiro!'); return; }

        membrosJaSorteados = [];
        ranking = [];
        sortearProximoMembro();
    }

    function sortearProximoMembro() {
        const membrosDisponiveis = membros.filter(m =>!membrosJaSorteados.includes(m));
        if(membrosDisponiveis.length === 0) { mostrarRankingFinal(); return; }

        const qtd = parseInt(localStorage.getItem('qtdEP')) || 2;
        perguntasDoMembro = [...banco].sort(() => 0.5 - Math.random()).slice(0, qtd);

        membroAtual = membrosDisponiveis[Math.floor(Math.random() * membrosDisponiveis.length)];
        membrosJaSorteados.push(membroAtual);
        pontosDoMembroAtual = 0;
        perguntaAtualIndex = 0;

        document.getElementById('nome-membro-sorteado').innerText = membroAtual;
        cardSorteado.style.display = 'block'; // MOSTRA O NOME SORTEADO
        telaRifa.style.display = 'none';
        telaPerguntas.style.display = 'block';
        mostrarPergunta();
    }

    function mostrarPergunta() {
        const tempo = parseInt(localStorage.getItem('tempoEP')) || 30;
        const p = perguntasDoMembro[perguntaAtualIndex];
        document.getElementById('contador-pergunta').innerText = `${membroAtual} - Pergunta ${perguntaAtualIndex + 1} de ${perguntasDoMembro.length}`;
        document.getElementById('texto-pergunta-atual').innerHTML = `${p.pergunta}<br><small style="color:#6B7280; font-weight:normal;">${p.traducao}</small>`;
        iniciarTimer(tempo);
    }

    function iniciarTimer(segundos) {
        clearInterval(timerInterval);
        let tempoRestante = segundos;
        const timerEl = document.getElementById('timer');
        timerEl.innerText = tempoRestante + 's';
        timerEl.style.color = 'var(--azul-escuro--)';
        timerInterval = setInterval(() => {
            tempoRestante--;
            timerEl.innerText = tempoRestante + 's';
            if(tempoRestante <= 5) { timerEl.style.color = 'var(--vermelho--)'; }
            if(tempoRestante <= 0) {
                clearInterval(timerInterval);
                audioFim.play();
                processarResposta(false);
            }
        }, 1000);
    }

    function processarResposta(acertou) {
        clearInterval(timerInterval);
        if(acertou) { pontosDoMembroAtual++; }

        perguntaAtualIndex++;
        if(perguntaAtualIndex < perguntasDoMembro.length) {
            mostrarPergunta();
        }
        else {
            ranking.push({nome: membroAtual, pontos: pontosDoMembroAtual});
            sortearProximoMembro();
        }
    }

    function mostrarRankingFinal() {
        telaPerguntas.style.display = 'none';
        telaFinal.style.display = 'block';

        ranking.sort((a, b) => b.pontos - a.pontos);

        let htmlRanking = '<h3>Ranking</h3>';
        ranking.forEach((r, i) => {
            let medalha = i === 0? '🥇' : i === 1? '🥈' : i === 2? '🥉' : `${i+1}º`;
            htmlRanking += `<div style="padding:10px; border-bottom:1px solid var(--borda--); display:flex; justify-content:space-between;">
                <span><b>${medalha} ${r.nome}</b></span>
                <span><b>${r.pontos} pts</b></span>
            </div>`;
        });
        document.getElementById('ranking-lista').innerHTML = htmlRanking;
    }

    btnSortear.addEventListener('click', () => iniciarRifa());
    btnAcertou.addEventListener('click', () => processarResposta(true));
    btnErrou.addEventListener('click', () => processarResposta(false));
    btnReiniciar.addEventListener('click', () => { telaFinal.style.display = 'none'; telaRifa.style.display = 'block'; });
}

});


 
   