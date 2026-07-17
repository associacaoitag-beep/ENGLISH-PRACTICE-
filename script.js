document.addEventListener('DOMContentLoaded', () => {

// ======================= 1. MENU GLOBAL =======================
const btnMenu = document.getElementById('btn-menu');
const btnFechar = document.getElementById('btn-fechar');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

if (btnMenu) btnMenu.addEventListener('click', () => { sidebar.classList.add('ativa'); overlay.classList.add('ativa'); });
if (btnFechar) btnFechar.addEventListener('click', () => { sidebar.classList.remove('ativa'); overlay.classList.remove('ativa'); });
if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('ativa'); overlay.classList.remove('ativa'); });

// ======================= 2. LOGICA MEMBROS =======================
const listaMembros = document.getElementById('lista-membros');
const btnAddMembro = document.getElementById('btn-add-membro');

if(listaMembros) {
    let membros = JSON.parse(localStorage.getItem('membrosEP')) || [];

    function renderMembros() {
        listaMembros.innerHTML = '';
        document.getElementById('total-membros').innerText = membros.length;
        membros.forEach((membro, i) => {
            listaMembros.innerHTML += `<div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid var(--borda--); align-items:center;">
                <span>${i + 1}. ${membro}</span>
                <i class="bi bi-trash" style="cursor:pointer; color:#DC2626;" onclick="removerMembro(${i})"></i>
            </div>`;
        });
    }

    window.removerMembro = function(i) {
        if(confirm('Remover membro?')) {
            membros.splice(i, 1);
            localStorage.setItem('membrosEP', JSON.stringify(membros));
            renderMembros();
        }
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

// ======================= 3. LOGICA EQUIPES =======================
const btnAddEquipe = document.getElementById('btn-add-equipe');
const listaEquipes = document.getElementById('lista-equipes');
const selectEquipe = document.getElementById('select-equipe');
const selectMembro = document.getElementById('select-membro');
const btnAddMembroEquipe = document.getElementById('btn-add-membro-equipe');

if(btnAddEquipe) {
    let equipes = JSON.parse(localStorage.getItem('equipesEP')) || [];
    let equipesMembros = JSON.parse(localStorage.getItem('equipesMembrosEP')) || {};
    let membros = JSON.parse(localStorage.getItem('membrosEP')) || [];

    function renderEquipes() {
        listaEquipes.innerHTML = '';
        document.getElementById('total-equipes').innerText = equipes.length;
        selectEquipe.innerHTML = '<option value="">Selecione uma equipe</option>';
        
        equipes.forEach((equipe, i) => {
            const membrosEquipe = equipesMembros[equipe] || [];
            listaEquipes.innerHTML += `<div style="padding:10px; margin-bottom:10px; background:#F3F4F6; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <b>${equipe}</b>
                    <p style="font-size:12px; color:#6B7280; margin:5px 0;">Membros: ${membrosEquipe.length}</p>
                </div>
                <i class="bi bi-trash" style="cursor:pointer; color:#DC2626;" onclick="removerEquipe(${i})"></i>
            </div>`;
            selectEquipe.innerHTML += `<option value="${equipe}">${equipe}</option>`;
        });
    }

    function renderMembrosPorEquipe() {
        let html = '';
        equipes.forEach(equipe => {
            const membrosEquipe = equipesMembros[equipe] || [];
            let listaHTML = '<div style="margin-bottom:15px; padding:10px; background:#F9FAFB; border-radius:6px;">';
            listaHTML += `<b>${equipe}</b>`;
            listaHTML += '<div style="margin-top:10px;">';
            if(membrosEquipe.length === 0) {
                listaHTML += '<p style="color:#6B7280; font-size:14px;">Sem membros</p>';
            } else {
                membrosEquipe.forEach((m, idx) => {
                    listaHTML += `<div style="display:flex; justify-content:space-between; padding:5px 0;">
                        <span>${idx + 1}. ${m}</span>
                        <i class="bi bi-x" style="cursor:pointer; color:#DC2626;" onclick="removerMembroEquipe('${equipe}', ${idx})"></i>
                    </div>`;
                });
            }
            listaHTML += '</div></div>';
            html += listaHTML;
        });
        document.getElementById('membros-por-equipe').innerHTML = html;
    }

    window.removerEquipe = function(i) {
        if(confirm('Remover equipe?')) {
            const equipe = equipes[i];
            equipes.splice(i, 1);
            delete equipesMembros[equipe];
            localStorage.setItem('equipesEP', JSON.stringify(equipes));
            localStorage.setItem('equipesMembrosEP', JSON.stringify(equipesMembros));
            renderEquipes();
            renderMembrosPorEquipe();
        }
    }

    window.removerMembroEquipe = function(equipe, i) {
        const membrosEquipe = equipesMembros[equipe] || [];
        membrosEquipe.splice(i, 1);
        equipesMembros[equipe] = membrosEquipe;
        localStorage.setItem('equipesMembrosEP', JSON.stringify(equipesMembros));
        renderMembrosPorEquipe();
    }

    function atualizarSelectMembro() {
        selectMembro.innerHTML = '<option value="">Selecione um membro</option>';
        membros.forEach(m => {
            selectMembro.innerHTML += `<option value="${m}">${m}</option>`;
        });
    }

    btnAddEquipe.addEventListener('click', () => {
        const input = document.getElementById('input-equipe');
        if(input.value.trim() !== '') {
            const novaEquipe = input.value.trim();
            if(!equipes.includes(novaEquipe)) {
                equipes.push(novaEquipe);
                equipesMembros[novaEquipe] = [];
                localStorage.setItem('equipesEP', JSON.stringify(equipes));
                localStorage.setItem('equipesMembrosEP', JSON.stringify(equipesMembros));
                input.value = '';
                renderEquipes();
            } else {
                alert('Equipe já existe!');
            }
        }
    });

    btnAddMembroEquipe.addEventListener('click', () => {
        const equipe = selectEquipe.value;
        const membro = selectMembro.value;
        if(equipe && membro) {
            const membrosEquipe = equipesMembros[equipe] || [];
            if(!membrosEquipe.includes(membro)) {
                membrosEquipe.push(membro);
                equipesMembros[equipe] = membrosEquipe;
                localStorage.setItem('equipesMembrosEP', JSON.stringify(equipesMembros));
                renderMembrosPorEquipe();
            } else {
                alert('Membro já está nesta equipe!');
            }
        }
    });

    renderEquipes();
    atualizarSelectMembro();
    renderMembrosPorEquipe();
}

// ======================= 4. LOGICA CONFIG =======================
const btnSalvarConfig = document.getElementById('btn-salvar-config');

if(btnSalvarConfig) {
    const radioApi = document.getElementById('fonte-api');
    const radioBd = document.getElementById('fonte-bd');
    const modoRifa = document.getElementById('modo-rifa');
    const modoEquipe = document.getElementById('modo-equipe');
    const configApi = document.getElementById('config-api');
    const configBd = document.getElementById('config-bd');
    const openrouterKey = document.getElementById('openrouter-key');
    const openrouterModelo = document.getElementById('openrouter-modelo');

    function toggleConfig() {
        configApi.style.display = radioApi.checked? 'block' : 'none';
        configBd.style.display = radioBd.checked? 'block' : 'none';
    }
    radioApi.addEventListener('change', toggleConfig);
    radioBd.addEventListener('change', toggleConfig);

    const fonteSalva = localStorage.getItem('fonteEP') || 'bd';
    if (fonteSalva === 'api') radioApi.checked = true; else radioBd.checked = true;
    
    const modoSalvo = localStorage.getItem('modoEP') || 'rifa';
    if (modoSalvo === 'equipe') modoEquipe.checked = true; else modoRifa.checked = true;
    
    toggleConfig();

    document.getElementById('qtd-perguntas').value = localStorage.getItem('qtdEP') || 2;
    document.getElementById('tempo-resposta').value = localStorage.getItem('tempoEP') || 30;
    openrouterKey.value = localStorage.getItem('openrouterKeyEP') || '';
    openrouterModelo.value = localStorage.getItem('openrouterModeloEP') || 'mistralai/mistral-7b-instruct:free';

    btnSalvarConfig.addEventListener('click', () => {
        const fonte = document.querySelector('input[name="fonte"]:checked').value;
        const modo = document.querySelector('input[name="modo"]:checked').value;
        const chave = openrouterKey.value.trim();
        const modelo = openrouterModelo.value;

        if(fonte === 'api' && !chave) {
            alert('❌ Cole sua chave OpenRouter!');
            return;
        }

        localStorage.setItem('fonteEP', fonte);
        localStorage.setItem('modoEP', modo);
        localStorage.setItem('qtdEP', document.getElementById('qtd-perguntas').value);
        localStorage.setItem('tempoEP', document.getElementById('tempo-resposta').value);
        
        if(chave) {
            geradorIA.salvarChave(chave);
            geradorIA.salvarModelo(modelo);
        }
        
        alert('✅ Definições salvas com sucesso!');
    });
}

// ======================= 5. LOGICA BANCO DE PERGUNTAS =======================
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
            listaPerguntas.innerHTML += `<div style="padding:10px; border-bottom:1px solid var(--borda--); border-radius:6px; margin-bottom:10px; background:#F9FAFB;">
                <b style="color:#002855;">Tema:</b> ${p.tema}<br>
                <b>P:</b> ${p.pergunta}<br>
                <small style="color:#6B7280;"><b>TR:</b> ${p.traducao}</small><br>
                <b>R:</b> ${p.resposta}
                <i class="bi bi-trash" style="float:right; cursor:pointer; color:#DC2626;" onclick="removerPergunta(${i})"></i>
            </div>`;
        });
    }

    window.removerPergunta = function(i) {
        if(confirm('Remover pergunta?')) {
            bancoPerguntas.splice(i, 1);
            salvarBanco();
            renderBanco();
        }
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
            alert('✅ Pergunta salva! Banco atualizado.');
        }
        else { alert('❌ Preencha todos os campos'); }
    });

    btnLimparBd.addEventListener('click', () => {
        if(confirm('Apagar TUDO? Esta ação não pode ser desfeita!')) { bancoPerguntas = []; salvarBanco(); renderBanco(); }
    });

    btnExportar.addEventListener('click', () => salvarBanco());

    btnImportar.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            bancoPerguntas = JSON.parse(event.target.result);
            salvarBanco();
            renderBanco();
            alert('✅ Banco importado com sucesso!');
        };
        reader.readAsText(file);
    });

    carregarBanco();
}

// ======================= 6. LOGICA INDEX UNIFICADA =======================
const btnSortear = document.getElementById('btn-sortear-membro');
const btnIniciarEquipe = document.getElementById('btn-iniciar-equipe');
const btnAcertou = document.getElementById('btn-acertou');
const btnErrou = document.getElementById('btn-errou');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnGerarIA = document.getElementById('btn-gerar-api');

if(btnSortear || btnIniciarEquipe || btnGerarIA) {
    const telaGerar = document.getElementById('tela-gerar');
    const telaRifa = document.getElementById('tela-rifa');
    const telaEquipe = document.getElementById('tela-equipe');
    const telaPerguntas = document.getElementById('tela-perguntas');
    const telaFinal = document.getElementById('tela-final');
    const loadingIA = document.getElementById('loading-ia');

    let membros = JSON.parse(localStorage.getItem('membrosEP')) || [];
    let equipes = JSON.parse(localStorage.getItem('equipesEP')) || [];
    let equipesMembros = JSON.parse(localStorage.getItem('equipesMembrosEP')) || {};
    let banco = [];
    let ranking = [];
    let placardoEquipes = {};
    let membrosJaSorteados = [];
    let equipasJaSorteadas = [];
    let membroAtual = null;
    let equipeAtual = null;
    let perguntasDoMembro = [];
    let perguntaAtualIndex = 0;
    let pontosDoMembroAtual = 0;
    let timerInterval;
    let modoAtual = localStorage.getItem('modoEP') || 'rifa';
    let fonteAtual = localStorage.getItem('fonteEP') || 'bd';

    const audioFim = new Audio("data:audio/wav;base64,UklGRiZgBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAgAQAAAAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA");

    async function carregarBancoParaRifa() {
        try { const response = await fetch('banco.json'); banco = await response.json(); }
        catch { banco = JSON.parse(localStorage.getItem('bancoPerguntasEP')) || []; }
        document.getElementById('total-perguntas-rifa')?.innerText = banco.length;
        document.getElementById('total-perguntas-equipe')?.innerText = banco.length;
    }

    function mostrarTelasModoInicial() {
        document.getElementById('modo-atual').innerText = modoAtual.toUpperCase();
        
        if(fonteAtual === 'api') {
            telaGerar.style.display = 'block';
            telaRifa.style.display = 'none';
            telaEquipe.style.display = 'none';
        } else {
            telaGerar.style.display = 'none';
            if(modoAtual === 'equipe') {
                telaEquipe.style.display = 'block';
                telaRifa.style.display = 'none';
                document.getElementById('total-equipes-modo').innerText = equipes.length;
            } else {
                telaRifa.style.display = 'block';
                telaEquipe.style.display = 'none';
            }
        }

        document.getElementById('total-membros-rifa').innerText = membros.length;
    }

    // ========== GERAÇÃO COM IA ==========
    if(btnGerarIA) {
        btnGerarIA.addEventListener('click', async () => {
            const conteudo = document.getElementById('box-msm').value;
            const quantidade = parseInt(document.getElementById('qtd-ia').value) || 5;

            if(!conteudo.trim()) {
                alert('❌ Cole o conteúdo primeiro!');
                return;
            }

            if(!geradorIA.obterChave()) {
                alert('❌ Configure sua chave OpenRouter nas Definições!');
                return;
            }

            loadingIA.style.display = 'block';

            try {
                const perguntas = await geradorIA.gerar(conteudo, quantidade);
                
                banco = perguntas;
                localStorage.setItem('bancoPerguntasEP', JSON.stringify(banco));
                
                loadingIA.style.display = 'none';
                alert(`✅ ${perguntas.length} perguntas geradas com sucesso!\n\nModelo: ${geradorIA.obterModelo()}`);
                document.getElementById('box-msm').value = '';
                
                // Mudar para modo rifa automaticamente
                fonteAtual = 'bd';
                localStorage.setItem('fonteEP', 'bd');
                mostrarTelasModoInicial();
            } catch (erro) {
                loadingIA.style.display = 'none';
                alert(`❌ Erro ao gerar perguntas:\n${erro.message}`);
                console.error(erro);
            }
        });
    }

    // ========== MODO RIFA ==========
    if(btnSortear) {
        async function iniciarRifa() {
            await carregarBancoParaRifa();
            if(membros.length === 0) { alert('❌ Cadastre membros primeiro!'); return; }
            if(banco.length === 0) { alert('❌ Cadastre perguntas no banco primeiro!'); return; }

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
            document.getElementById('card-membro-sorteado').style.display = 'block';
            telaRifa.style.display = 'none';
            telaPerguntas.style.display = 'block';
            document.getElementById('info-equipe').style.display = 'none';
            mostrarPergunta();
        }

        btnSortear.addEventListener('click', () => iniciarRifa());
    }

    // ========== MODO EQUIPE ==========
    if(btnIniciarEquipe) {
        async function iniciarEquipe() {
            await carregarBancoParaRifa();
            if(equipes.length === 0) { alert('❌ Crie equipes primeiro!'); return; }
            if(banco.length === 0) { alert('❌ Cadastre perguntas no banco primeiro!'); return; }

            for(let eq of equipes) {
                if(!equipesMembros[eq] || equipesMembros[eq].length === 0) {
                    alert(`❌ Equipe "${eq}" não tem membros!`);
                    return;
                }
            }

            equipasJaSorteadas = [];
            ranking = [];
            placardoEquipes = {};
            equipes.forEach(eq => { placardoEquipes[eq] = 0; });
            
            sortearProximaEquipe();
        }

        function sortearProximaEquipe() {
            const equipasDisponiveis = equipes.filter(e =>!equipasJaSorteadas.includes(e));
            if(equipasDisponiveis.length === 0) { mostrarRankingFinal(); return; }

            const qtd = parseInt(localStorage.getItem('qtdEP')) || 2;
            perguntasDoMembro = [...banco].sort(() => 0.5 - Math.random()).slice(0, qtd);

            equipeAtual = equipasDisponiveis[Math.floor(Math.random() * equipasDisponiveis.length)];
            equipasJaSorteadas.push(equipeAtual);
            pontosDoMembroAtual = 0;
            perguntaAtualIndex = 0;
            membroAtual = null;

            telaEquipe.style.display = 'none';
            telaPerguntas.style.display = 'block';
            document.getElementById('info-equipe').style.display = 'block';
            document.getElementById('equipe-atual').innerText = equipeAtual;
            mostrarPergunta();
        }

        btnIniciarEquipe.addEventListener('click', () => iniciarEquipe());
    }

    function mostrarPergunta() {
        const tempo = parseInt(localStorage.getItem('tempoEP')) || 30;
        const p = perguntasDoMembro[perguntaAtualIndex];
        
        if(modoAtual === 'equipe') {
            document.getElementById('contador-pergunta').innerText = `${equipeAtual} - Pergunta ${perguntaAtualIndex + 1} de ${perguntasDoMembro.length}`;
        } else {
            document.getElementById('contador-pergunta').innerText = `${membroAtual} - Pergunta ${perguntaAtualIndex + 1} de ${perguntasDoMembro.length}`;
        }
        
        document.getElementById('texto-pergunta-atual').innerHTML = `${p.pergunta}<br><small style="color:#6B7280; font-weight:normal;">${p.traducao}</small>`;
        iniciarTimer(tempo);
    }

    function iniciarTimer(segundos) {
        clearInterval(timerInterval);
        let tempoRestante = segundos;
        const timerEl = document.getElementById('timer');
        timerEl.innerText = tempoRestante + 's';
        timerEl.style.color = 'var(--azul-botao--)';
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
            if(modoAtual === 'equipe') {
                placardoEquipes[equipeAtual] += pontosDoMembroAtual;
                sortearProximaEquipe();
            } else {
                ranking.push({nome: membroAtual, pontos: pontosDoMembroAtual});
                sortearProximoMembro();
            }
        }
    }

    function mostrarRankingFinal() {
        telaPerguntas.style.display = 'none';
        telaFinal.style.display = 'block';

        let htmlRanking = '';
        if(modoAtual === 'equipe') {
            document.getElementById('titulo-resultado').innerText = '🏆 Resultado Final - Equipes';
            const placardoOrdenado = Object.entries(placardoEquipes).sort((a, b) => b[1] - a[1]);
            htmlRanking += '<h3>Placar Final</h3>';
            placardoOrdenado.forEach((r, i) => {
                let medalha = i === 0? '🥇' : i === 1? '🥈' : i === 2? '🥉' : `${i+1}º`;
                htmlRanking += `<div style="padding:15px; border-bottom:1px solid var(--borda--); display:flex; justify-content:space-between; background:${i === 0 ? '#FFF8DC' : ''}; border-radius:6px; margin-bottom:8px;">
                    <span><b>${medalha} ${r[0]}</b></span>
                    <span><b>${r[1]} pts</b></span>
                </div>`;
            });
        } else {
            document.getElementById('titulo-resultado').innerText = '🏆 Resultado da Rifa';
            ranking.sort((a, b) => b.pontos - a.pontos);
            htmlRanking += '<h3>Ranking</h3>';
            ranking.forEach((r, i) => {
                let medalha = i === 0? '🥇' : i === 1? '🥈' : i === 2? '🥉' : `${i+1}º`;
                htmlRanking += `<div style="padding:15px; border-bottom:1px solid var(--borda--); display:flex; justify-content:space-between; background:${i === 0 ? '#FFF8DC' : ''}; border-radius:6px; margin-bottom:8px;">
                    <span><b>${medalha} ${r.nome}</b></span>
                    <span><b>${r.pontos} pts</b></span>
                </div>`;
            });
        }
        document.getElementById('ranking-lista').innerHTML = htmlRanking;
    }

    if(btnAcertou) btnAcertou.addEventListener('click', () => processarResposta(true));
    if(btnErrou) btnErrou.addEventListener('click', () => processarResposta(false));
    if(btnReiniciar) btnReiniciar.addEventListener('click', () => { 
        telaFinal.style.display = 'none'; 
        membros = JSON.parse(localStorage.getItem('membrosEP')) || [];
        equipes = JSON.parse(localStorage.getItem('equipesEP')) || [];
        equipesMembros = JSON.parse(localStorage.getItem('equipesMembrosEP')) || {};
        modoAtual = localStorage.getItem('modoEP') || 'rifa';
        fonteAtual = localStorage.getItem('fonteEP') || 'bd';
        mostrarTelasModoInicial();
    });

    carregarBancoParaRifa();
    mostrarTelasModoInicial();
}

});