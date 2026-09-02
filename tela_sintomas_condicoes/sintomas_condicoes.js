// =========================================================
// GENSAÚDE SUS
// AVALIAÇÃO PREVENTIVA
// ETAPA 4 - SINTOMAS E CONDIÇÕES
// =========================================================


// =========================================================
// ELEMENTOS
// =========================================================

const symptomsForm =
    document.getElementById(
        "symptomsForm"
    );


const conditionInputs =
    document.querySelectorAll(
        'input[name="condicoesDiagnosticadas"]'
    );


const symptomInputs =
    document.querySelectorAll(
        'input[name="sintomasRecentes"]'
    );


const noConditionsInput =
    document.getElementById(
        "noConditions"
    );


const detailsInput =
    document.getElementById(
        "detalhesAdicionais"
    );


const characterCounter =
    document.getElementById(
        "characterCounter"
    );


const formMessage =
    document.getElementById(
        "formMessage"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


const continueButton =
    document.getElementById(
        "continueButton"
    );


// =========================================================
// LOCALSTORAGE
// =========================================================

const ASSESSMENT_KEY =
    "gensaude_avaliacao_preventiva";


const LOGIN_DESTINATION_KEY =
    "gensaude_destino_apos_login";


// =========================================================
// ROTAS
// =========================================================

const PREVIOUS_PAGE =
    "../tela_estilo_vida/estilo_vida.html";


const NEXT_PAGE =
    "../tela_resumo/resumo.html";


const LOGIN_PAGE =
    "../tela_login/login.html";


const FIRST_PAGE =
    "../tela_prevencao/prevencao.html";


// =========================================================
// VARIÁVEIS
// =========================================================

let sessao =
    null;


let avaliacaoAtual =
    null;


// =========================================================
// PEGAR SESSÃO
// =========================================================

if (
    typeof getSessao ===
    "function"
) {

    sessao =
        getSessao();

}


// =========================================================
// PROTEGER PÁGINA
// =========================================================

if (!sessao) {

    localStorage.setItem(
        LOGIN_DESTINATION_KEY,
        "../tela_sintomas_condicoes/sintomas_condicoes.html"
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
    // NÃO EXISTE AVALIAÇÃO
    // =====================================================

    if (!avaliacaoAtual) {

        window.location.href =
            FIRST_PAGE;

        return;

    }


    // =====================================================
    // AVALIAÇÃO PERTENCE A OUTRO USUÁRIO
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
            FIRST_PAGE;

        return;

    }


    // =====================================================
    // GARANTIR ESTRUTURA
    // =====================================================

    if (
        !avaliacaoAtual.sintomasCondicoes
    ) {

        avaliacaoAtual.sintomasCondicoes =
            criarSintomasCondicoesVazio();

    }


    carregarRespostasSalvas();

    atualizarContador();

    configurarEventos();

}


// =========================================================
// CRIAR OBJETO VAZIO
// =========================================================

function criarSintomasCondicoesVazio() {

    return {

        condicoesDiagnosticadas: [],

        sintomasRecentes: [],

        detalhesAdicionais: ""

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

    const dados =
        avaliacaoAtual
            .sintomasCondicoes;


    if (!dados) {

        return;

    }


    // =====================================================
    // CONDIÇÕES
    // =====================================================

    const condicoes =
        Array.isArray(
            dados.condicoesDiagnosticadas
        )
            ? dados.condicoesDiagnosticadas
            : [];


    conditionInputs.forEach(
        (input) => {

            input.checked =
                condicoes.includes(
                    input.value
                );

        }
    );


    // =====================================================
    // NORMALIZAR "NENHUMA"
    // =====================================================

    normalizarNenhuma();


    // =====================================================
    // SINTOMAS
    // =====================================================

    const sintomas =
        Array.isArray(
            dados.sintomasRecentes
        )
            ? dados.sintomasRecentes
            : [];


    symptomInputs.forEach(
        (input) => {

            input.checked =
                sintomas.includes(
                    input.value
                );

        }
    );


    // =====================================================
    // DETALHES
    // =====================================================

    if (detailsInput) {

        detailsInput.value =
            dados.detalhesAdicionais ||
            "";

    }

}


// =========================================================
// CONFIGURAR EVENTOS
// =========================================================

function configurarEventos() {

    // =====================================================
    // CONDIÇÕES
    // =====================================================

    conditionInputs.forEach(
        (input) => {

            input.addEventListener(
                "change",
                () => {

                    tratarSelecaoCondicao(
                        input
                    );


                    limparMensagem();

                    removerDestaques();

                    salvarRespostasParciais();

                }
            );

        }
    );


    // =====================================================
    // SINTOMAS
    // =====================================================

    symptomInputs.forEach(
        (input) => {

            input.addEventListener(
                "change",
                () => {

                    limparMensagem();

                    salvarRespostasParciais();

                }
            );

        }
    );


    // =====================================================
    // DETALHES
    // =====================================================

    if (detailsInput) {

        detailsInput.addEventListener(
            "input",
            () => {

                atualizarContador();

                salvarRespostasParciais();

            }
        );

    }


    // =====================================================
    // VOLTAR
    // =====================================================

    if (backButton) {

        backButton.addEventListener(
            "click",
            voltarEtapa
        );

    }


    // =====================================================
    // CONTINUAR
    // =====================================================

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            continuarEtapa
        );

    }


    // =====================================================
    // SUBMIT
    // =====================================================

    if (symptomsForm) {

        symptomsForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                continuarEtapa();

            }
        );

    }

}


// =========================================================
// LÓGICA DA OPÇÃO "NENHUMA"
// =========================================================

function tratarSelecaoCondicao(
    inputAlterado
) {

    // =====================================================
    // USUÁRIO MARCOU "NENHUMA"
    // =====================================================

    if (
        inputAlterado.value ===
        "nenhuma" &&
        inputAlterado.checked
    ) {

        conditionInputs.forEach(
            (input) => {

                if (
                    input.value !==
                    "nenhuma"
                ) {

                    input.checked =
                        false;

                }

            }
        );


        return;

    }


    // =====================================================
    // MARCOU ALGUMA CONDIÇÃO REAL
    // =====================================================

    if (
        inputAlterado.value !==
        "nenhuma" &&
        inputAlterado.checked &&
        noConditionsInput
    ) {

        noConditionsInput.checked =
            false;

    }

}


// =========================================================
// NORMALIZAR "NENHUMA"
// =========================================================

function normalizarNenhuma() {

    if (!noConditionsInput) {

        return;

    }


    const existeCondicaoReal =
        Array
            .from(
                conditionInputs
            )
            .some(
                (input) =>
                    input.value !==
                        "nenhuma" &&
                    input.checked
            );


    if (existeCondicaoReal) {

        noConditionsInput.checked =
            false;

    }

}


// =========================================================
// PEGAR CHECKBOXES SELECIONADOS
// =========================================================

function obterSelecionados(
    nome
) {

    return Array
        .from(
            document.querySelectorAll(
                `input[name="${nome}"]:checked`
            )
        )
        .map(
            (input) =>
                input.value
        );

}


// =========================================================
// MONTAR OBJETO DA ETAPA
// =========================================================

function montarSintomasCondicoes() {

    return {

        condicoesDiagnosticadas:
            obterSelecionados(
                "condicoesDiagnosticadas"
            ),

        sintomasRecentes:
            obterSelecionados(
                "sintomasRecentes"
            ),

        detalhesAdicionais:
            detailsInput
                ? detailsInput
                    .value
                    .trim()
                : ""

    };

}


// =========================================================
// SALVAR PARCIALMENTE
// =========================================================

function salvarRespostasParciais() {

    if (!avaliacaoAtual) {

        return;

    }


    avaliacaoAtual.sintomasCondicoes =
        montarSintomasCondicoes();


    avaliacaoAtual.etapaAtual =
        4;


    salvarAvaliacao(
        avaliacaoAtual
    );

}


// =========================================================
// CONTADOR
// =========================================================

function atualizarContador() {

    if (
        !detailsInput ||
        !characterCounter
    ) {

        return;

    }


    const quantidade =
        detailsInput
            .value
            .length;


    characterCounter.textContent =
        `${quantidade}/500`;

}


// =========================================================
// VOLTAR
// =========================================================

function voltarEtapa() {

    salvarRespostasParciais();


    avaliacaoAtual.etapaAtual =
        3;


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
    // VALIDAR CONDIÇÕES
    // =====================================================

    const condicoes =
        obterSelecionados(
            "condicoesDiagnosticadas"
        );


    if (
        condicoes.length === 0
    ) {

        mostrarMensagem(
            'Selecione pelo menos uma condição ou marque "Nenhuma".',
            "error"
        );


        destacarSecao(
            ".question-section:first-of-type"
        );


        return;

    }


    // =====================================================
    // OBSERVAÇÃO SOBRE SINTOMAS
    //
    // Sintomas recentes NÃO são obrigatórios.
    // O usuário pode não estar sentindo nenhum sintoma.
    // =====================================================


    // =====================================================
    // SALVAR ETAPA
    // =====================================================

    avaliacaoAtual.sintomasCondicoes =
        montarSintomasCondicoes();


    avaliacaoAtual.etapaAtual =
        5;


    salvarAvaliacao(
        avaliacaoAtual
    );


    // =====================================================
    // SUCESSO
    // =====================================================

    mostrarMensagem(
        "Sintomas e condições salvos com sucesso.",
        "success"
    );


    if (continueButton) {

        continueButton.disabled =
            true;

    }


    // =====================================================
    // IR PARA RESUMO
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
// DESTACAR SEÇÃO
// =========================================================

function destacarSecao(
    seletor
) {

    const secao =
        document.querySelector(
            seletor
        );


    if (!secao) {

        return;

    }


    secao.classList.add(
        "question-error"
    );


    secao.scrollIntoView(
        {
            behavior:
                "smooth",

            block:
                "center"
        }
    );


    setTimeout(
        () => {

            secao.classList.remove(
                "question-error"
            );

        },
        2200
    );

}


// =========================================================
// REMOVER DESTAQUES
// =========================================================

function removerDestaques() {

    const elementos =
        document.querySelectorAll(
            ".question-error"
        );


    elementos.forEach(
        (elemento) => {

            elemento.classList.remove(
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