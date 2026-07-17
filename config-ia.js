// ==================== CONFIGURAÇÃO IA COM OPENROUTER ====================

class GeradorPerguntasOpenRouter {
    constructor() {
        this.apiKey = localStorage.getItem('openrouterKeyEP') || '';
        this.modelo = localStorage.getItem('openrouterModeloEP') || 'mistralai/mistral-7b-instruct:free';
    }

    // Modelos gratuitos disponíveis no OpenRouter
    static MODELOS_DISPONIVEIS = {
        'mistralai/mistral-7b-instruct:free': '⚡ Mistral 7B (Fast)',
        'meta-llama/llama-2-7b-chat:free': '🦙 Llama 2 (Balanced)',
        'google/palm-2-chat-bison:free': '🔷 Google PaLM 2',
        'nous-hermes-2-mistral-7b-dpo:free': '🧠 Nous Hermes 2',
        'nousresearch/nous-hermes-2-mixtral-8x7b-sft:free': '🚀 Nous Hermes Mixtral'
    };

    async gerar(conteudo, quantidade) {
        if (!this.apiKey.trim()) {
            throw new Error('❌ Cole sua chave OpenRouter nas Definições');
        }

        if (!conteudo.trim()) {
            throw new Error('❌ Cole o conteúdo primeiro');
        }

        const prompt = `Gere exatamente ${quantidade} perguntas de múltipla escolha em inglês com base no seguinte conteúdo:

"${conteudo}"

Formato JSON obrigatório (RETORNE APENAS JSON):
[
  {
    "tema": "Assunto da pergunta",
    "pergunta": "Pergunta em inglês",
    "traducao": "Tradução para português",
    "resposta": "Resposta correta"
  }
]

RETORNE APENAS O JSON SEM NENHUM OUTRO TEXTO.`;

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'English Practice',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.modelo,
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um professor de inglês especializado em gerar perguntas de múltipla escolha. Sempre retorne APENAS JSON válido, sem explicações adicionais.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                const erro = await response.json();
                const mensagemErro = erro.error?.message || `Erro ${response.status}`;
                throw new Error(`Erro OpenRouter: ${mensagemErro}`);
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0]) {
                throw new Error('Resposta inválida da API');
            }

            const conteudoResposta = data.choices[0].message?.content || '';
            
            // Extrai JSON da resposta
            const jsonMatch = conteudoResposta.match(/\[\s*\{[\s\S]*?\}\s*\]/s);
            if (!jsonMatch) {
                console.error('Resposta recebida:', conteudoResposta);
                throw new Error('Formato de resposta inválido. O modelo não retornou JSON válido.');
            }
            
            const perguntas = JSON.parse(jsonMatch[0]);
            
            // Valida estrutura
            if (!Array.isArray(perguntas)) {
                throw new Error('Resposta deve ser um array');
            }

            // Validar cada pergunta
            return perguntas.map((p, i) => {
                if (!p.tema || !p.pergunta || !p.traducao || !p.resposta) {
                    throw new Error(`Pergunta ${i + 1} está incompleta`);
                }
                return {
                    tema: String(p.tema).substring(0, 100),
                    pergunta: String(p.pergunta).substring(0, 500),
                    traducao: String(p.traducao).substring(0, 500),
                    resposta: String(p.resposta).substring(0, 200)
                };
            });
        } catch (erro) {
            console.error('Erro ao gerar com OpenRouter:', erro);
            throw erro;
        }
    }

    salvarChave(chave) {
        localStorage.setItem('openrouterKeyEP', chave);
        this.apiKey = chave;
    }

    salvarModelo(modelo) {
        localStorage.setItem('openrouterModeloEP', modelo);
        this.modelo = modelo;
    }

    obterChave() {
        return this.apiKey;
    }

    obterModelo() {
        return this.modelo;
    }
}

// Instância global
const geradorIA = new GeradorPerguntasOpenRouter();