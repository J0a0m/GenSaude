// ==========================================
// INÍCIO LOGADO - GENSAÚDE
// ==========================================


// ==========================================
// ELEMENTOS
// ==========================================

const firstName =
    document.getElementById(
        "firstName"
    );

const assessmentButton =
    document.getElementById(
        "assessmentButton"
    );

const historyCard =
    document.getElementById(
        "historyCard"
    );

const ubsCard =
    document.getElementById(
        "ubsCard"
    );

const unitsCard =
    document.getElementById(
        "unitsCard"
    );

const educationCard =
    document.getElementById(
        "educationCard"
    );

const lastAssessmentCard =
    document.getElementById(
        "lastAssessmentCard"
    );

const referenceUnitCard =
    document.getElementById(
        "referenceUnitCard"
    );

const nextActionCard =
    document.getElementById(
        "nextActionCard"
    );


// ==========================================
// VERIFICAR USUÁRIO LOGADO
// ==========================================

let sessao = null;


if (
    typeof getSessao ===
    "function"
) {

    sessao =
        getSessao();

}


// ==========================================
// PROTEGER TELA
// ==========================================

if (!sessao) {

    // Se não existir sessão,
    // o usuário não pode acessar
    // a tela inicial logada.

    window.location.href =
        "../tela_login/login.html";

} else {

    carregarUsuario();

}


// ==========================================
// CARREGAR NOME DO USUÁRIO
// ==========================================

function carregarUsuario() {

    const nomeCompleto =
        sessao.nome
            ? sessao.nome.trim()
            : "Usuário";


    // Exemplo:
    // Vitor Oliveira Rangel
    // ↓
    // Vitor

    const primeiroNome =
        nomeCompleto
            .split(/\s+/)[0];


    if (firstName) {

        firstName.textContent =
            primeiroNome;

    }

}


// ==========================================
// INICIAR AVALIAÇÃO
// ==========================================

if (assessmentButton) {

    assessmentButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "avaliacao.html";

        }
    );

}


// ==========================================
// HISTÓRICO FAMILIAR
// ==========================================

if (historyCard) {

    historyCard.addEventListener(
        "click",
        () => {

            window.location.href =
                "historico-familiar.html";

        }
    );

}


// ==========================================
// UBS OU UPA
// ==========================================

if (ubsCard) {

    ubsCard.addEventListener(
        "click",
        () => {

            window.location.href =
                "../tela_ubs_upa/ubs_upa.html";

        }
    );

}


// ==========================================
// UNIDADES PRÓXIMAS
// ==========================================

if (unitsCard) {

    unitsCard.addEventListener(
        "click",
        () => {

            window.location.href =
                "../tela_unidades/unidades.html";

        }
    );

}


// ==========================================
// EDUCAÇÃO EM SAÚDE
// ==========================================

if (educationCard) {

    educationCard.addEventListener(
        "click",
        () => {

            window.location.href =
                "../tela_educacao/educacao.html";

        }
    );

}


// ==========================================
// ÚLTIMA AVALIAÇÃO
// ==========================================

if (lastAssessmentCard) {

    lastAssessmentCard.addEventListener(
        "click",
        () => {

            window.location.href =
                "resultado-avaliacao.html";

        }
    );

}


// ==========================================
// UBS DE REFERÊNCIA
// ==========================================

if (referenceUnitCard) {

    referenceUnitCard.addEventListener(
        "click",
        () => {

            window.location.href =
                "ubs-referencia.html";

        }
    );

}


// ==========================================
// PRÓXIMA AÇÃO
// ==========================================

if (nextActionCard) {

    nextActionCard.addEventListener(
        "click",
        () => {

            window.location.href =
                "acompanhamento.html";

        }
    );

}