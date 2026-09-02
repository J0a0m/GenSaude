// =========================================================
// GENSAÚDE SUS
// AVALIAÇÃO PREVENTIVA
// ETAPA 2 - HISTÓRICO FAMILIAR
// =========================================================


// =========================================================
// ELEMENTOS
// =========================================================

const familyHistoryForm =
    document.getElementById(
        "familyHistoryForm"
    );


const formMessage =
    document.getElementById(
        "formMessage"
    );


const radioInputs =
    document.querySelectorAll(
        '#familyHistoryForm input[type="radio"]'
    );


// =========================================================
// CHAVES DO LOCALSTORAGE
// =========================================================

const ASSESSMENT_KEY =
    "gensaude_avaliacao_preventiva";


const LOGIN_DESTINATION_KEY =
    "gensaude_destino_apos_login";


// =========================================================
// ROTAS
// =========================================================

const PREVIOUS_PAGE =
    "../tela_prevencao/prevencao.html";


const NEXT_PAGE =
    "../tela_estilo_vida/estilo_vida.html";


const LOGIN_PAGE =
    "../tela_login/login.html";


// =========================================================
// TODAS AS PERGUNTAS DA ETAPA 2
// =========================================================

const QUESTIONS = [

    // MÃE

    "mae_diabetes",
    "mae_hipertensao",
    "mae_cardiaca",


    // PAI

    "pai_diabetes",
    "pai_hipertensao",
    "pai_cardiaca",


    // AVÓS

    "avos_diabetes",
    "avos_hipertensao",
    "avos_cardiaca",


    // PERGUNTAS COMPLEMENTARES

    "familia_cancer",
    "familia_avc",
    "familia_doenca_renal",
    "familia_hereditaria"

];


// =========================================================
// VARIÁVEIS
// =========================================================

let sessao =
    null;


let avaliacaoAtual =
    null;


// =========================================================
// VERIFICAR SESSÃO
// =========================================================

if (
    typeof getSessao ===
    "function"
) {

    sessao =
        getSessao();

}


// =========================================================
// PROTEGER A PÁGINA
// =========================================================

if (!sessao) {

    localStorage.setItem(
        LOGIN_DESTINATION_KEY,
        "../tela_historico_familiar/historico.html"
    );


    window.location.href =
        LOGIN_PAGE;

} else {

    iniciarPagina();

}


// =========================================================
// INICIAR PÁGINA
// =========================================================

function iniciarPagina() {

    avaliacaoAtual =
        carregarAvaliacao();


    // =====================================================
    // AVALIAÇÃO NÃO ENCONTRADA
    // =====================================================

    if (!avaliacaoAtual) {

        window.location.href =
            PREVIOUS_PAGE;

        return;

    }


    // =====================================================
    // AVALIAÇÃO DE OUTRO USUÁRIO
    // =====================================================

    if (
        String(
            avaliacaoAtual.usuarioId
        ) !==
        String(
            sessao.id
        )
    ) {

        window.location.href =
            PREVIOUS_PAGE;

        return;

    }


    // =====================================================
    // GARANTIR ESTRUTURA
    // =====================================================

    if (
        !avaliacaoAtual.historicoFamiliar
    ) {

        avaliacaoAtual.historicoFamiliar =
            criarHistoricoVazio();

    }


    carregarRespostasSalvas();

    configurarEventos();

}


// =========================================================
// CRIAR ESTRUTURA VAZIA
// =========================================================

function criarHistoricoVazio() {

    return {

        mae: {

            diabetes:
                "",

            hipertensao:
                "",

            cardiaca:
                ""

        },


        pai: {

            diabetes:
                "",

            hipertensao:
                "",

            cardiaca:
                ""

        },


        avos: {

            diabetes:
                "",

            hipertensao:
                "",

            cardiaca:
                ""

        },


        complementares: {

            cancer:
                "",

            avc:
                "",

            doencaRenal:
                "",

            hereditaria:
                ""

        }

    };

}


// =========================================================
// CARREGAR AVALIAÇÃO
// =========================================================

function carregarAvaliacao() {

    const dados =
        localStorage.getItem(
            ASSESSMENT_KEY
        );


    if (!dados) {

        return null;

    }


    try {

        return JSON.parse(
            dados
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar avaliação:",
            erro
        );


        return null;

    }

}


// =========================================================
// SALVAR AVALIAÇÃO
// =========================================================

function salvarAvaliacao(
    avaliacao
) {

    avaliacao.atualizadoEm =
        new Date()
            .toISOString();


    localStorage.setItem(
        ASSESSMENT_KEY,
        JSON.stringify(
            avaliacao
        )
    );


    avaliacaoAtual =
        avaliacao;

}


// =========================================================
// CARREGAR RESPOSTAS SALVAS
// =========================================================

function carregarRespostasSalvas() {

    const historico =
        avaliacaoAtual.historicoFamiliar;


    if (!historico) {

        return;

    }


    // =====================================================
    // MÃE
    // =====================================================

    marcarResposta(
        "mae_diabetes",
        obterResposta(
            historico,
            "mae",
            "diabetes",
            "mae_diabetes"
        )
    );


    marcarResposta(
        "mae_hipertensao",
        obterResposta(
            historico,
            "mae",
            "hipertensao",
            "mae_hipertensao"
        )
    );


    marcarResposta(
        "mae_cardiaca",
        obterResposta(
            historico,
            "mae",
            "cardiaca",
            "mae_cardiaca"
        )
    );


    // =====================================================
    // PAI
    // =====================================================

    marcarResposta(
        "pai_diabetes",
        obterResposta(
            historico,
            "pai",
            "diabetes",
            "pai_diabetes"
        )
    );


    marcarResposta(
        "pai_hipertensao",
        obterResposta(
            historico,
            "pai",
            "hipertensao",
            "pai_hipertensao"
        )
    );


    marcarResposta(
        "pai_cardiaca",
        obterResposta(
            historico,
            "pai",
            "cardiaca",
            "pai_cardiaca"
        )
    );


    // =====================================================
    // AVÓS
    // =====================================================

    marcarResposta(
        "avos_diabetes",
        obterResposta(
            historico,
            "avos",
            "diabetes",
            "avos_diabetes"
        )
    );


    marcarResposta(
        "avos_hipertensao",
        obterResposta(
            historico,
            "avos",
            "hipertensao",
            "avos_hipertensao"
        )
    );


    marcarResposta(
        "avos_cardiaca",
        obterResposta(
            historico,
            "avos",
            "cardiaca",
            "avos_cardiaca"
        )
    );


    // =====================================================
    // PERGUNTAS COMPLEMENTARES
    // =====================================================

    marcarResposta(
        "familia_cancer",
        obterRespostaComplementar(
            historico,
            "cancer",
            "familia_cancer"
        )
    );


    marcarResposta(
        "familia_avc",
        obterRespostaComplementar(
            historico,
            "avc",
            "familia_avc"
        )
    );


    marcarResposta(
        "familia_doenca_renal",
        obterRespostaComplementar(
            historico,
            "doencaRenal",
            "familia_doenca_renal"
        )
    );


    marcarResposta(
        "familia_hereditaria",
        obterRespostaComplementar(
            historico,
            "hereditaria",
            "familia_hereditaria"
        )
    );

}


// =========================================================
// BUSCAR RESPOSTA DE UM FAMILIAR
// =========================================================

function obterResposta(
    historico,
    familiar,
    condicao,
    chaveAntiga
) {

    // =====================================================
    // FORMATO ATUAL
    // =====================================================

    if (
        historico[familiar] &&
        historico[familiar][condicao]
    ) {

        return historico[familiar][condicao];

    }


    // =====================================================
    // COMPATIBILIDADE COM O FORMATO ANTIGO
    // =====================================================

    if (
        historico[chaveAntiga]
    ) {

        return historico[chaveAntiga];

    }


    return "";

}


// =========================================================
// BUSCAR RESPOSTA COMPLEMENTAR
// =========================================================

function obterRespostaComplementar(
    historico,
    chave,
    chaveAntiga
) {

    // =====================================================
    // FORMATO ATUAL
    // =====================================================

    if (
        historico.complementares &&
        historico.complementares[chave]
    ) {

        return historico.complementares[chave];

    }


    // =====================================================
    // COMPATIBILIDADE COM O FORMATO ANTIGO
    // =====================================================

    if (
        historico[chaveAntiga]
    ) {

        return historico[chaveAntiga];

    }


    return "";

}


// =========================================================
// MARCAR RESPOSTA
// =========================================================

function marcarResposta(
    nome,
    valor
) {

    if (!valor) {

        return;

    }


    const radio =
        document.querySelector(
            `input[name="${nome}"][value="${valor}"]`
        );


    if (radio) {

        radio.checked =
            true;

    }

}


// =========================================================
// CONFIGURAR EVENTOS
// =========================================================

function configurarEventos() {

    // =====================================================
    // SALVAMENTO AUTOMÁTICO
    // =====================================================

    radioInputs.forEach(
        (radio) => {

            radio.addEventListener(
                "change",
                () => {

                    limparMensagem();

                    removerDestaques();

                    salvarRespostasParciais();

                }
            );

        }
    );


    // =====================================================
    // EVENTO DO FOOTER - VOLTAR
    // =====================================================

    document.addEventListener(
        "avaliacao:voltar",
        (event) => {

            event.preventDefault();


            voltarEtapa();

        }
    );


    // =====================================================
    // EVENTO DO FOOTER - CONTINUAR
    // =====================================================

    document.addEventListener(
        "avaliacao:continuar",
        (event) => {

            event.preventDefault();


            continuarEtapa();

        }
    );


    // =====================================================
    // ENVIAR FORMULÁRIO PELO ENTER
    // =====================================================

    if (familyHistoryForm) {

        familyHistoryForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                continuarEtapa();

            }
        );

    }

}


// =========================================================
// PEGAR VALOR DE UMA RESPOSTA
// =========================================================

function obterValorResposta(
    nome
) {

    const selecionado =
        document.querySelector(
            `input[name="${nome}"]:checked`
        );


    if (!selecionado) {

        return "";

    }


    return selecionado.value;

}


// =========================================================
// MONTAR HISTÓRICO FAMILIAR COMPLETO
// =========================================================

function montarHistoricoFamiliar() {

    return {

        // =================================================
        // MÃE
        // =================================================

        mae: {

            diabetes:
                obterValorResposta(
                    "mae_diabetes"
                ),

            hipertensao:
                obterValorResposta(
                    "mae_hipertensao"
                ),

            cardiaca:
                obterValorResposta(
                    "mae_cardiaca"
                )

        },


        // =================================================
        // PAI
        // =================================================

        pai: {

            diabetes:
                obterValorResposta(
                    "pai_diabetes"
                ),

            hipertensao:
                obterValorResposta(
                    "pai_hipertensao"
                ),

            cardiaca:
                obterValorResposta(
                    "pai_cardiaca"
                )

        },


        // =================================================
        // AVÓS
        // =================================================

        avos: {

            diabetes:
                obterValorResposta(
                    "avos_diabetes"
                ),

            hipertensao:
                obterValorResposta(
                    "avos_hipertensao"
                ),

            cardiaca:
                obterValorResposta(
                    "avos_cardiaca"
                )

        },


        // =================================================
        // PERGUNTAS COMPLEMENTARES
        // =================================================

        complementares: {

            cancer:
                obterValorResposta(
                    "familia_cancer"
                ),

            avc:
                obterValorResposta(
                    "familia_avc"
                ),

            doencaRenal:
                obterValorResposta(
                    "familia_doenca_renal"
                ),

            hereditaria:
                obterValorResposta(
                    "familia_hereditaria"
                )

        }

    };

}


// =========================================================
// SALVAR RESPOSTAS PARCIAIS
// =========================================================

function salvarRespostasParciais() {

    if (!avaliacaoAtual) {

        return;

    }


    avaliacaoAtual.historicoFamiliar =
        montarHistoricoFamiliar();


    avaliacaoAtual.etapaAtual =
        2;


    salvarAvaliacao(
        avaliacaoAtual
    );

}


// =========================================================
// VOLTAR
// =========================================================

function voltarEtapa() {

    /*
        As respostas marcadas são salvas antes
        de retornar para a etapa anterior.
    */

    salvarRespostasParciais();


    avaliacaoAtual.etapaAtual =
        1;


    salvarAvaliacao(
        avaliacaoAtual
    );


    window.location.href =
        PREVIOUS_PAGE;

}


// =========================================================
// CONTINUAR
// =========================================================

function continuarEtapa() {

    limparMensagem();

    removerDestaques();


    // =====================================================
    // PROCURAR PERGUNTA NÃO RESPONDIDA
    // =====================================================

    const perguntaSemResposta =
        encontrarPerguntaSemResposta();


    if (perguntaSemResposta) {

        mostrarMensagem(
            "Responda todas as perguntas antes de continuar.",
            "error"
        );


        destacarPergunta(
            perguntaSemResposta
        );


        return;

    }


    // =====================================================
    // SALVAR HISTÓRICO FAMILIAR
    // =====================================================

    avaliacaoAtual.historicoFamiliar =
        montarHistoricoFamiliar();


    avaliacaoAtual.etapaAtual =
        3;


    salvarAvaliacao(
        avaliacaoAtual
    );


    // =====================================================
    // MOSTRAR SUCESSO
    // =====================================================

    mostrarMensagem(
        "Histórico familiar salvo com sucesso.",
        "success"
    );


    // =====================================================
    // DESATIVAR BOTÃO TEMPORARIAMENTE
    // =====================================================

    if (
        typeof definirAvaliacaoFooterCarregando ===
        "function"
    ) {

        definirAvaliacaoFooterCarregando(
            true
        );

    }


    // =====================================================
    // IR PARA A ETAPA 3
    // =====================================================

    setTimeout(
        () => {

            window.location.href =
                NEXT_PAGE;

        },
        350
    );

}


// =========================================================
// ENCONTRAR PERGUNTA SEM RESPOSTA
// =========================================================

function encontrarPerguntaSemResposta() {

    for (
        const pergunta
        of QUESTIONS
    ) {

        const resposta =
            document.querySelector(
                `input[name="${pergunta}"]:checked`
            );


        if (!resposta) {

            return pergunta;

        }

    }


    return null;

}


// =========================================================
// DESTACAR PERGUNTA
// =========================================================

function destacarPergunta(
    nomePergunta
) {

    const primeiroRadio =
        document.querySelector(
            `input[name="${nomePergunta}"]`
        );


    if (!primeiroRadio) {

        return;

    }


    const bloco =
        primeiroRadio.closest(
            ".condition-row, .complementary-question"
        );


    if (bloco) {

        bloco.classList.add(
            "question-error"
        );


        bloco.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "center"
            }
        );


        setTimeout(
            () => {

                bloco.classList.remove(
                    "question-error"
                );

            },
            2200
        );

    }


    primeiroRadio.focus();

}


// =========================================================
// REMOVER DESTAQUES
// =========================================================

function removerDestaques() {

    const blocos =
        document.querySelectorAll(
            ".question-error"
        );


    blocos.forEach(
        (bloco) => {

            bloco.classList.remove(
                "question-error"
            );

        }
    );

}


// =========================================================
// MOSTRAR MENSAGEM
// =========================================================

function mostrarMensagem(
    mensagem,
    tipo
) {

    if (!formMessage) {

        return;

    }


    formMessage.textContent =
        mensagem;


    formMessage.className =
        `form-message ${tipo}`;

}


// =========================================================
// LIMPAR MENSAGEM
// =========================================================

function limparMensagem() {

    if (!formMessage) {

        return;

    }


    formMessage.textContent =
        "";


    formMessage.className =
        "form-message";

}