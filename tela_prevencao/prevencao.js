// ==========================================
// PREVENÇÃO - ETAPA 1
// DADOS PESSOAIS
// GENSAÚDE SUS
// ==========================================


// ==========================================
// ELEMENTOS
// ==========================================

const personalDataForm =
    document.getElementById(
        "personalDataForm"
    );


const nomeInput =
    document.getElementById(
        "nome"
    );


const dataNascimentoInput =
    document.getElementById(
        "dataNascimento"
    );


const sexoSelect =
    document.getElementById(
        "sexo"
    );


const cpfInput =
    document.getElementById(
        "cpf"
    );


const emailInput =
    document.getElementById(
        "email"
    );


const telefoneInput =
    document.getElementById(
        "telefone"
    );


const cepInput =
    document.getElementById(
        "cep"
    );


const cidadeInput =
    document.getElementById(
        "cidade"
    );


const estadoSelect =
    document.getElementById(
        "estado"
    );


const formMessage =
    document.getElementById(
        "formMessage"
    );


// ==========================================
// CHAVES DO LOCALSTORAGE
// ==========================================

const ASSESSMENT_KEY =
    "gensaude_avaliacao_preventiva";


const SESSION_KEY =
    "gensaude_sessao";


// ==========================================
// CONTROLE DO CEP
// ==========================================

let ultimoCepConsultado =
    "";


let consultandoCep =
    false;


// ==========================================
// SESSÃO E USUÁRIO
// ==========================================

let sessao =
    null;


let usuarioAtual =
    null;


if (
    typeof getSessao ===
    "function"
) {

    sessao =
        getSessao();

}


// ==========================================
// PROTEGER A PÁGINA
// ==========================================

if (!sessao) {

    localStorage.setItem(
        "gensaude_destino_apos_login",
        "../tela_prevencao/prevencao.html"
    );


    window.location.href =
        "../tela_login/login.html";

} else {

    iniciarPagina();

}


// ==========================================
// INICIAR PÁGINA
// ==========================================

function iniciarPagina() {

    // ======================================
    // PEGAR USUÁRIO COMPLETO
    // ======================================

    if (
        typeof getUsuarioAtual ===
        "function"
    ) {

        usuarioAtual =
            getUsuarioAtual();

    }


    // ======================================
    // USUÁRIO ALTERNATIVO
    // ======================================

    if (!usuarioAtual) {

        usuarioAtual = {

            id:
                sessao.id || null,

            nome:
                sessao.nome || "",

            cpf:
                sessao.cpf || "",

            email:
                sessao.email || "",

            telefone:
                "",

            cep:
                "",

            cidade:
                "",

            estado:
                "",

            dataNascimento:
                "",

            sexo:
                ""

        };

    }


    configurarDataNascimento();

    preencherDadosUsuario();

}


// ==========================================
// CONFIGURAR DATA DE NASCIMENTO
// ==========================================

function configurarDataNascimento() {

    if (!dataNascimentoInput) {

        return;

    }


    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            hoje.getDate()
        ).padStart(
            2,
            "0"
        );


    dataNascimentoInput.max =
        `${ano}-${mes}-${dia}`;

}


// ==========================================
// PREENCHER DADOS DA CONTA
// ==========================================

function preencherDadosUsuario() {

    if (
        !nomeInput ||
        !dataNascimentoInput ||
        !sexoSelect ||
        !cpfInput ||
        !emailInput ||
        !telefoneInput ||
        !cepInput ||
        !cidadeInput ||
        !estadoSelect
    ) {

        return;

    }


    nomeInput.value =
        usuarioAtual.nome || "";


    dataNascimentoInput.value =
        usuarioAtual.dataNascimento || "";


    sexoSelect.value =
        usuarioAtual.sexo || "";


    cpfInput.value =
        formatarCPF(
            usuarioAtual.cpf || ""
        );


    emailInput.value =
        usuarioAtual.email || "";


    telefoneInput.value =
        formatarTelefone(
            usuarioAtual.telefone || ""
        );


    cepInput.value =
        formatarCEP(
            usuarioAtual.cep || ""
        );


    cidadeInput.value =
        usuarioAtual.cidade || "";


    estadoSelect.value =
        usuarioAtual.estado || "";


    if (usuarioAtual.cep) {

        ultimoCepConsultado =
            String(
                usuarioAtual.cep
            ).replace(
                /\D/g,
                ""
            );

    }

}


// ==========================================
// MÁSCARA DO CPF
// ==========================================

if (cpfInput) {

    cpfInput.addEventListener(
        "input",
        () => {

            cpfInput.value =
                formatarCPF(
                    cpfInput.value
                );

        }
    );

}


function formatarCPF(
    valor
) {

    let numeros =
        String(
            valor
        )
            .replace(
                /\D/g,
                ""
            )
            .substring(
                0,
                11
            );


    if (
        numeros.length > 9
    ) {

        numeros =
            numeros.replace(
                /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
                "$1.$2.$3-$4"
            );

    } else if (
        numeros.length > 6
    ) {

        numeros =
            numeros.replace(
                /(\d{3})(\d{3})(\d{1,3})/,
                "$1.$2.$3"
            );

    } else if (
        numeros.length > 3
    ) {

        numeros =
            numeros.replace(
                /(\d{3})(\d{1,3})/,
                "$1.$2"
            );

    }


    return numeros;

}


// ==========================================
// MÁSCARA DO TELEFONE
// ==========================================

if (telefoneInput) {

    telefoneInput.addEventListener(
        "input",
        () => {

            telefoneInput.value =
                formatarTelefone(
                    telefoneInput.value
                );

        }
    );

}


function formatarTelefone(
    valor
) {

    let numeros =
        String(
            valor
        )
            .replace(
                /\D/g,
                ""
            )
            .substring(
                0,
                11
            );


    if (
        numeros.length <= 10
    ) {

        numeros =
            numeros.replace(
                /(\d{2})(\d{4})(\d{0,4})/,
                "($1) $2-$3"
            );

    } else {

        numeros =
            numeros.replace(
                /(\d{2})(\d{5})(\d{0,4})/,
                "($1) $2-$3"
            );

    }


    return numeros.replace(
        /-$/,
        ""
    );

}


// ==========================================
// MÁSCARA DO CEP
// ==========================================

if (cepInput) {

    cepInput.addEventListener(
        "input",
        () => {

            cepInput.value =
                formatarCEP(
                    cepInput.value
                );


            const cepNumeros =
                cepInput.value.replace(
                    /\D/g,
                    ""
                );


            if (
                cepNumeros.length < 8
            ) {

                ultimoCepConsultado =
                    "";

                return;

            }


            if (
                cepNumeros !==
                ultimoCepConsultado
            ) {

                consultarCep(
                    cepNumeros
                );

            }

        }
    );

}


function formatarCEP(
    valor
) {

    let numeros =
        String(
            valor
        )
            .replace(
                /\D/g,
                ""
            )
            .substring(
                0,
                8
            );


    if (
        numeros.length > 5
    ) {

        numeros =
            numeros.replace(
                /(\d{5})(\d{1,3})/,
                "$1-$2"
            );

    }


    return numeros;

}


// ==========================================
// CONSULTAR CEP
// ==========================================

async function consultarCep(
    cep
) {

    if (consultandoCep) {

        return;

    }


    consultandoCep =
        true;


    ultimoCepConsultado =
        cep;


    cidadeInput.value =
        "Buscando...";


    cidadeInput.disabled =
        true;


    estadoSelect.disabled =
        true;


    try {

        const resposta =
            await fetch(
                `https://viacep.com.br/ws/${cep}/json/`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar CEP."
            );

        }


        const dados =
            await resposta.json();


        if (dados.erro) {

            cidadeInput.value =
                "";


            estadoSelect.value =
                "";


            ultimoCepConsultado =
                "";


            mostrarMensagem(
                "CEP não encontrado.",
                "error"
            );


            cepInput.focus();

            return;

        }


        cidadeInput.value =
            dados.localidade || "";


        estadoSelect.value =
            dados.uf || "";


        limparMensagem();


    } catch (erro) {

        console.error(
            "Erro ao consultar CEP:",
            erro
        );


        cidadeInput.value =
            "";


        estadoSelect.value =
            "";


        ultimoCepConsultado =
            "";


        mostrarMensagem(
            "Não foi possível consultar o CEP. Preencha cidade e estado manualmente.",
            "error"
        );


    } finally {

        cidadeInput.disabled =
            false;


        estadoSelect.disabled =
            false;


        consultandoCep =
            false;

    }

}


// ==========================================
// EVENTO DO FOOTER - VOLTAR
// ==========================================

document.addEventListener(
    "avaliacao:voltar",
    (event) => {

        event.preventDefault();


        window.location.href =
            "../tela_inicio_logado/inicio_logado.html";

    }
);


// ==========================================
// EVENTO DO FOOTER - CONTINUAR
// ==========================================

document.addEventListener(
    "avaliacao:continuar",
    (event) => {

        event.preventDefault();


        validarESalvar();

    }
);


// ==========================================
// ENVIAR FORMULÁRIO PELO ENTER
// ==========================================

if (personalDataForm) {

    personalDataForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            validarESalvar();

        }
    );

}


// ==========================================
// VALIDAR E SALVAR
// ==========================================

function validarESalvar() {

    limparMensagem();


    // ======================================
    // PEGAR DADOS
    // ======================================

    const nome =
        nomeInput.value.trim();


    const dataNascimento =
        dataNascimentoInput.value;


    const sexo =
        sexoSelect.value;


    const cpf =
        cpfInput.value.replace(
            /\D/g,
            ""
        );


    const email =
        emailInput.value
            .trim()
            .toLowerCase();


    const telefone =
        telefoneInput.value.replace(
            /\D/g,
            ""
        );


    const cep =
        cepInput.value.replace(
            /\D/g,
            ""
        );


    const cidade =
        cidadeInput.value.trim();


    const estado =
        estadoSelect.value;


    // ======================================
    // VALIDAR NOME
    // ======================================

    if (
        nome.length < 3
    ) {

        erroCampo(
            "Digite seu nome completo.",
            nomeInput
        );

        return;

    }


    // ======================================
    // VALIDAR DATA
    // ======================================

    if (!dataNascimento) {

        erroCampo(
            "Selecione sua data de nascimento.",
            dataNascimentoInput
        );

        return;

    }


    const nascimento =
        new Date(
            `${dataNascimento}T00:00:00`
        );


    const hoje =
        new Date();


    hoje.setHours(
        0,
        0,
        0,
        0
    );


    if (
        Number.isNaN(
            nascimento.getTime()
        ) ||
        nascimento > hoje
    ) {

        erroCampo(
            "Selecione uma data de nascimento válida.",
            dataNascimentoInput
        );

        return;

    }


    // ======================================
    // VALIDAR SEXO
    // ======================================

    if (!sexo) {

        erroCampo(
            "Selecione uma opção no campo sexo.",
            sexoSelect
        );

        return;

    }


    // ======================================
    // VALIDAR CPF
    // ======================================

    if (
        cpf.length !== 11
    ) {

        erroCampo(
            "Digite um CPF válido.",
            cpfInput
        );

        return;

    }


    // ======================================
    // VALIDAR E-MAIL
    // ======================================

    if (
        !validarEmail(
            email
        )
    ) {

        erroCampo(
            "Digite um e-mail válido.",
            emailInput
        );

        return;

    }


    // ======================================
    // VALIDAR TELEFONE
    // ======================================

    if (
        telefone.length < 10
    ) {

        erroCampo(
            "Digite um celular válido.",
            telefoneInput
        );

        return;

    }


    // ======================================
    // VALIDAR CEP
    // ======================================

    if (
        cep.length !== 8
    ) {

        erroCampo(
            "Digite um CEP válido.",
            cepInput
        );

        return;

    }


    // ======================================
    // VALIDAR CIDADE
    // ======================================

    if (
        cidade === "" ||
        cidade === "Buscando..."
    ) {

        erroCampo(
            "Informe sua cidade.",
            cidadeInput
        );

        return;

    }


    // ======================================
    // VALIDAR ESTADO
    // ======================================

    if (!estado) {

        erroCampo(
            "Selecione seu estado.",
            estadoSelect
        );

        return;

    }


    // ======================================
    // OBJETO DOS DADOS PESSOAIS
    // ======================================

    const dadosPessoais = {

        nome:
            nome,

        dataNascimento:
            dataNascimento,

        sexo:
            sexo,

        cpf:
            cpf,

        email:
            email,

        telefone:
            telefone,

        cep:
            cep,

        cidade:
            cidade,

        estado:
            estado

    };


    // ======================================
    // ATUALIZAR CONTA LOCAL
    // ======================================

    atualizarContaLocal(
        dadosPessoais
    );


    // ======================================
    // SALVAR ETAPA DA AVALIAÇÃO
    // ======================================

    salvarEtapaAvaliacao(
        dadosPessoais
    );


    // ======================================
    // MOSTRAR SUCESSO
    // ======================================

    mostrarMensagem(
        "Dados salvos com sucesso.",
        "success"
    );


    // ======================================
    // DESATIVAR BOTÃO TEMPORARIAMENTE
    // ======================================

    if (
        typeof definirAvaliacaoFooterCarregando ===
        "function"
    ) {

        definirAvaliacaoFooterCarregando(
            true
        );

    }


    // ======================================
    // PRÓXIMA ETAPA
    // ======================================

    setTimeout(
        () => {

            window.location.href =
                "../tela_historico_familiar/historico.html";

        },
        400
    );

}


// ==========================================
// ATUALIZAR CONTA LOCAL
// ==========================================

function atualizarContaLocal(
    novosDados
) {

    /*
        O auth.js possui as funções utilizadas
        para acessar e salvar a lista de usuários.
    */

    if (
        typeof getUsuarios !==
            "function" ||
        typeof salvarUsuarios !==
            "function"
    ) {

        console.warn(
            "Não foi possível atualizar os dados da conta."
        );

        return;

    }


    const usuarios =
        getUsuarios();


    const indice =
        usuarios.findIndex(
            (usuario) =>
                usuario.id ===
                sessao.id
        );


    if (
        indice === -1
    ) {

        return;

    }


    usuarios[indice] = {

        ...usuarios[indice],

        ...novosDados

    };


    salvarUsuarios(
        usuarios
    );


    usuarioAtual =
        usuarios[indice];


    // ======================================
    // ATUALIZAR SESSÃO
    // ======================================

    const sessaoAtualizada = {

        ...sessao,

        nome:
            novosDados.nome,

        email:
            novosDados.email,

        cpf:
            novosDados.cpf

    };


    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(
            sessaoAtualizada
        )
    );


    sessao =
        sessaoAtualizada;

}


// ==========================================
// SALVAR AVALIAÇÃO NO LOCALSTORAGE
// ==========================================

function salvarEtapaAvaliacao(
    dadosPessoais
) {

    let avaliacao =
        {};


    const dadosSalvos =
        localStorage.getItem(
            ASSESSMENT_KEY
        );


    if (dadosSalvos) {

        try {

            avaliacao =
                JSON.parse(
                    dadosSalvos
                );

        } catch (erro) {

            console.error(
                "Erro ao carregar avaliação salva:",
                erro
            );


            avaliacao =
                {};

        }

    }


    // ======================================
    // NÃO MISTURAR DADOS DE OUTRO USUÁRIO
    // ======================================

    if (
        avaliacao.usuarioId &&
        avaliacao.usuarioId !==
            sessao.id
    ) {

        avaliacao =
            {};

    }


    const agora =
        new Date()
            .toISOString();


    /*
        O espalhamento mantém as informações
        que já existiam no localStorage.

        Apenas a etapa de dados pessoais será
        atualizada neste momento.
    */

    avaliacao = {

        ...avaliacao,

        usuarioId:
            sessao.id,

        etapaAtual:
            2,

        iniciadaEm:
            avaliacao.iniciadaEm ||
            agora,

        atualizadoEm:
            agora,

        dadosPessoais:
            dadosPessoais,

        historicoFamiliar:
            avaliacao.historicoFamiliar ||
            {},

        estiloDeVida:
            avaliacao.estiloDeVida ||
            {},

        sintomasCondicoes:
            avaliacao.sintomasCondicoes ||
            {},

        resumo:
            avaliacao.resumo ||
            {}

    };


    localStorage.setItem(
        ASSESSMENT_KEY,
        JSON.stringify(
            avaliacao
        )
    );

}


// ==========================================
// VALIDAR E-MAIL
// ==========================================

function validarEmail(
    email
) {

    const expressao =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return expressao.test(
        email
    );

}


// ==========================================
// ERRO DE CAMPO
// ==========================================

function erroCampo(
    mensagem,
    campo
) {

    mostrarMensagem(
        mensagem,
        "error"
    );


    if (campo) {

        campo.focus();

    }

}


// ==========================================
// MOSTRAR MENSAGEM
// ==========================================

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


// ==========================================
// LIMPAR MENSAGEM
// ==========================================

function limparMensagem() {

    if (!formMessage) {

        return;

    }


    formMessage.textContent =
        "";


    formMessage.className =
        "form-message";

}