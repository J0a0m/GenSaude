// =========================================================
// GENSAÚDE SUS
// AVALIAÇÃO PREVENTIVA
// ETAPA 3 - ESTILO DE VIDA
// =========================================================


// =========================================================
// ELEMENTOS DA PÁGINA
// =========================================================

const lifestyleForm =
    document.getElementById(
        "lifestyleForm"
    );

const sonoHorasSelect =
    document.getElementById(
        "sonoHoras"
    );

const observacoesInput =
    document.getElementById(
        "observacoes"
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

const radioInputs =
    document.querySelectorAll(
        '#lifestyleForm input[type="radio"]'
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
    "../tela_historico_familiar/historico.html";

const NEXT_PAGE =
    "../tela_sintomas_condicoes/sintomas_condicoes.html";

const LOGIN_PAGE =
    "../tela_login/login.html";


// =========================================================
// CAMPOS OBRIGATÓRIOS
// =========================================================

const REQUIRED_FIELDS = [

    "atividadeFisica",
    "alimentacao",
    "sonoHoras",
    "fuma",
    "alcool"

];


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
        "../tela_estilo_vida/estilo_vida.html"
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
    // AVALIAÇÃO NÃO EXISTE
    // =====================================================

    if (!avaliacaoAtual) {

        window.location.href =
            "../tela_prevencao/prevencao.html";

        return;

    }


    // =====================================================
    // AVALIAÇÃO É DE OUTRO USUÁRIO
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
            "../tela_prevencao/prevencao.html";

        return;

    }


    // =====================================================
    // GARANTIR OBJETO
    // =====================================================

    if (
        !avaliacaoAtual.estiloDeVida
    ) {

        avaliacaoAtual.estiloDeVida =
            criarEstiloVidaVazio();

    }


    carregarRespostasSalvas();

    atualizarContador();

    configurarEventos();

}


// =========================================================
// OBJETO VAZIO
// =========================================================

function criarEstiloVidaVazio() {

    return {

        atividadeFisica:
            "",

        alimentacao:
            "",

        sonoHoras:
            "",

        fuma:
            "",

        alcool:
            "",

        observacoes:
            ""

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

    const estilo =
        avaliacaoAtual.estiloDeVida;


    if (!estilo) {

        return;

    }


    // =====================================================
    // ATIVIDADE FÍSICA
    // =====================================================

    marcarRadio(
        "atividadeFisica",
        estilo.atividadeFisica
    );


    // =====================================================
    // ALIMENTAÇÃO
    // =====================================================

    marcarRadio(
        "alimentacao",
        estilo.alimentacao
    );


    // =====================================================
    // SONO
    // =====================================================

    if (
        sonoHorasSelect &&
        estilo.sonoHoras
    ) {

        sonoHorasSelect.value =
            estilo.sonoHoras;

    }


    // =====================================================
    // FUMO
    // =====================================================

    marcarRadio(
        "fuma",
        estilo.fuma
    );


    // =====================================================
    // ÁLCOOL
    // =====================================================

    marcarRadio(
        "alcool",
        estilo.alcool
    );


    // =====================================================
    // OBSERVAÇÕES
    // =====================================================

    if (observacoesInput) {

        observacoesInput.value =
            estilo.observacoes || "";

    }

}


// =========================================================
// MARCAR RADIO
// =========================================================

function marcarRadio(
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
    // RADIOS
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
    // SONO
    // =====================================================

    if (sonoHorasSelect) {

        sonoHorasSelect.addEventListener(
            "change",
            () => {

                limparMensagem();

                removerDestaques();

                salvarRespostasParciais();

            }
        );

    }


    // =====================================================
    // OBSERVAÇÕES
    // =====================================================

    if (observacoesInput) {

        observacoesInput.addEventListener(
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

    if (lifestyleForm) {

        lifestyleForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                continuarEtapa();

            }
        );

    }

}


// =========================================================
// CONTADOR DE CARACTERES
// =========================================================

function atualizarContador() {

    if (
        !observacoesInput ||
        !characterCounter
    ) {

        return;

    }


    const quantidade =
        observacoesInput
            .value
            .length;


    characterCounter.textContent =
        `${quantidade}/500`;

}


// =========================================================
// OBTER RADIO SELECIONADO
// =========================================================

function obterRadio(
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
// MONTAR OBJETO ESTILO DE VIDA
// =========================================================

function montarEstiloDeVida() {

    return {

        atividadeFisica:
            obterRadio(
                "atividadeFisica"
            ),

        alimentacao:
            obterRadio(
                "alimentacao"
            ),

        sonoHoras:
            sonoHorasSelect
                ? sonoHorasSelect.value
                : "",

        fuma:
            obterRadio(
                "fuma"
            ),

        alcool:
            obterRadio(
                "alcool"
            ),

        observacoes:
            observacoesInput
                ? observacoesInput
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


    avaliacaoAtual.estiloDeVida =
        montarEstiloDeVida();


    avaliacaoAtual.etapaAtual =
        3;


    salvarAvaliacao(
        avaliacaoAtual
    );

}


// =========================================================
// VOLTAR
// =========================================================

function voltarEtapa() {

    salvarRespostasParciais();


    avaliacaoAtual.etapaAtual =
        2;


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
    // VALIDAR
    // =====================================================

    const campoPendente =
        encontrarCampoPendente();


    if (campoPendente) {

        mostrarMensagem(
            "Responda todas as perguntas obrigatórias antes de continuar.",
            "error"
        );


        destacarCampo(
            campoPendente
        );


        return;

    }


    // =====================================================
    // SALVAR DADOS
    // =====================================================

    avaliacaoAtual.estiloDeVida =
        montarEstiloDeVida();


    avaliacaoAtual.etapaAtual =
        4;


    salvarAvaliacao(
        avaliacaoAtual
    );


    // =====================================================
    // SUCESSO
    // =====================================================

    mostrarMensagem(
        "Informações de estilo de vida salvas com sucesso.",
        "success"
    );


    if (continueButton) {

        continueButton.disabled =
            true;

    }


    // =====================================================
    // PRÓXIMA TELA
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
// ENCONTRAR CAMPO PENDENTE
// =========================================================

function encontrarCampoPendente() {

    // =====================================================
    // ATIVIDADE FÍSICA
    // =====================================================

    if (
        !obterRadio(
            "atividadeFisica"
        )
    ) {

        return "atividadeFisica";

    }


    // =====================================================
    // ALIMENTAÇÃO
    // =====================================================

    if (
        !obterRadio(
            "alimentacao"
        )
    ) {

        return "alimentacao";

    }


    // =====================================================
    // SONO
    // =====================================================

    if (
        !sonoHorasSelect ||
        !sonoHorasSelect.value
    ) {

        return "sonoHoras";

    }


    // =====================================================
    // FUMO
    // =====================================================

    if (
        !obterRadio(
            "fuma"
        )
    ) {

        return "fuma";

    }


    // =====================================================
    // ÁLCOOL
    // =====================================================

    if (
        !obterRadio(
            "alcool"
        )
    ) {

        return "alcool";

    }


    return null;

}


// =========================================================
// DESTACAR CAMPO PENDENTE
// =========================================================

function destacarCampo(
    campo
) {

    let elemento =
        null;


    // =====================================================
    // SELECT
    // =====================================================

    if (
        campo ===
        "sonoHoras"
    ) {

        elemento =
            sonoHorasSelect;

    } else {

        elemento =
            document.querySelector(
                `input[name="${campo}"]`
            );

    }


    if (!elemento) {

        return;

    }


    const bloco =
        elemento.closest(
            ".question-block"
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


    elemento.focus();

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