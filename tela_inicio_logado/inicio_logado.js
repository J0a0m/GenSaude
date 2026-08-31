// ==========================================
// ELEMENTOS
// ==========================================

const profileButton =
    document.getElementById("profileButton");

const profileName =
    document.getElementById("profileName");

const firstName =
    document.getElementById("firstName");

const assessmentButton =
    document.getElementById("assessmentButton");

const historyCard =
    document.getElementById("historyCard");

const ubsCard =
    document.getElementById("ubsCard");

const unitsCard =
    document.getElementById("unitsCard");

const educationCard =
    document.getElementById("educationCard");

const lastAssessmentCard =
    document.getElementById("lastAssessmentCard");

const referenceUnitCard =
    document.getElementById("referenceUnitCard");

const nextActionCard =
    document.getElementById("nextActionCard");


// ==========================================
// DADOS DO USUÁRIO
// ==========================================

/*
    FUTURAMENTE ESSES DADOS PODERÃO VIR
    DO BANCO DE DADOS / API.

    POR ENQUANTO ESTÁ JOÃO SILVA
    PARA FICAR IGUAL AO PROTÓTIPO.
*/

const usuario = {

    nomeCompleto:
        "João Silva"

};


// ==========================================
// CARREGAR NOME
// ==========================================

function carregarUsuario() {

    const nomeCompleto =
        usuario.nomeCompleto;


    const primeiroNome =
        nomeCompleto.split(" ")[0];


    profileName.textContent =
        nomeCompleto;


    firstName.textContent =
        primeiroNome;

}


carregarUsuario();


// ==========================================
// PERFIL
// ==========================================

profileButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "perfil.html";

    }
);


// ==========================================
// INICIAR AVALIAÇÃO
// ==========================================

assessmentButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "avaliacao.html";

    }
);


// ==========================================
// HISTÓRICO FAMILIAR
// ==========================================

historyCard.addEventListener(
    "click",
    () => {

        window.location.href =
            "historico-familiar.html";

    }
);


// ==========================================
// UBS OU UPA
// ==========================================

ubsCard.addEventListener(
    "click",
    () => {

        window.location.href =
            "ubs-ou-upa.html";

    }
);


// ==========================================
// UNIDADES PRÓXIMAS
// ==========================================

unitsCard.addEventListener(
    "click",
    () => {

        window.location.href =
            "unidades.html";

    }
);


// ==========================================
// EDUCAÇÃO
// ==========================================

educationCard.addEventListener(
    "click",
    () => {

        window.location.href =
            "educacao.html";

    }
);


// ==========================================
// ÚLTIMA AVALIAÇÃO
// ==========================================

lastAssessmentCard.addEventListener(
    "click",
    () => {

        window.location.href =
            "resultado-avaliacao.html";

    }
);


// ==========================================
// UBS DE REFERÊNCIA
// ==========================================

referenceUnitCard.addEventListener(
    "click",
    () => {

        window.location.href =
            "ubs-referencia.html";

    }
);


// ==========================================
// PRÓXIMA AÇÃO
// ==========================================

nextActionCard.addEventListener(
    "click",
    () => {

        window.location.href =
            "acompanhamento.html";

    }
);