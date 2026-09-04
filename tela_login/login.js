// ==========================================
// LOGIN.JS - GENSAÚDE
// ==========================================


// ==========================================
// CONFIGURAÇÕES
// ==========================================

const LOGIN_DESTINATION_KEY =
    "gensaude_destino_apos_login";

const LOGGED_HOME_PAGE =
    "../tela_inicio_logado/inicio_logado.html";


// ==========================================
// DESTINOS PERMITIDOS APÓS O LOGIN
// ==========================================

const ALLOWED_LOGIN_DESTINATIONS = [

    "../tela_prevencao/prevencao.html",

    "../tela_historico_familiar/historico.html",

    "../tela_estilo_vida/estilo_vida.html",

    "../tela_sintomas_condicoes/sintomas_condicoes.html",

    "../tela_resumo/resumo.html",

    "../tela_resultado_avaliacao/resultado_avaliacao.html"

];


// ==========================================
// ELEMENTOS
// ==========================================

const loginForm =
    document.getElementById(
        "loginForm"
    );

const emailInput =
    document.getElementById(
        "email"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const passwordToggle =
    document.getElementById(
        "passwordToggle"
    );

const rememberCheckbox =
    document.getElementById(
        "remember"
    );

const createAccountButton =
    document.getElementById(
        "createAccount"
    );

const forgotPassword =
    document.querySelector(
        ".forgot-password"
    );


// ==========================================
// MOSTRAR / ESCONDER SENHA
// ==========================================

if (
    passwordToggle &&
    passwordInput
) {

    passwordToggle.addEventListener(
        "click",
        () => {

            const senhaEstaVisivel =
                passwordInput.type ===
                "text";


            passwordInput.type =
                senhaEstaVisivel
                    ? "password"
                    : "text";


            passwordToggle.setAttribute(
                "aria-label",

                senhaEstaVisivel
                    ? "Mostrar senha"
                    : "Ocultar senha"
            );


            passwordToggle.setAttribute(
                "aria-pressed",
                String(
                    !senhaEstaVisivel
                )
            );

        }
    );

}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const usuario =
                emailInput
                    .value
                    .trim();


            const senha =
                passwordInput.value;


            removerMensagem();


            // ==================================
            // E-MAIL OU CPF VAZIO
            // ==================================

            if (usuario === "") {

                mostrarMensagem(
                    "Digite seu e-mail ou CPF.",
                    "error"
                );


                emailInput.focus();

                return;

            }


            // ==================================
            // SENHA VAZIA
            // ==================================

            if (
                senha.trim() === ""
            ) {

                mostrarMensagem(
                    "Digite sua senha.",
                    "error"
                );


                passwordInput.focus();

                return;

            }


            // ==================================
            // SENHA CURTA
            // ==================================

            if (
                senha.length < 6
            ) {

                mostrarMensagem(
                    "A senha deve possuir pelo menos 6 caracteres.",
                    "error"
                );


                passwordInput.focus();

                return;

            }


            // ==================================
            // VERIFICAR AUTH.JS
            // ==================================

            if (
                typeof fazerLogin !==
                "function"
            ) {

                console.error(
                    "auth.js não foi carregado corretamente."
                );


                mostrarMensagem(
                    "Erro interno no sistema de login.",
                    "error"
                );


                return;

            }


            // ==================================
            // REALIZAR LOGIN
            // ==================================

            const lembrar =
                Boolean(
                    rememberCheckbox
                        ?.checked
                );


            const resultado =
                fazerLogin(
                    usuario,
                    senha,
                    lembrar
                );


            // ==================================
            // LOGIN INVÁLIDO
            // ==================================

            if (
                !resultado.sucesso
            ) {

                mostrarMensagem(
                    resultado.mensagem,
                    "error"
                );


                return;

            }


            // ==================================
            // LOGIN REALIZADO
            // ==================================

            mostrarMensagem(
                "Login realizado com sucesso!",
                "success"
            );


            bloquearFormulario();


            // ==================================
            // REDIRECIONAR
            // ==================================

            window.setTimeout(
                () => {

                    redirecionarDepoisDoLogin();

                },
                600
            );

        }
    );

}


// ==========================================
// CARREGAR PÁGINA
// ==========================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        // ======================================
        // USUÁRIO JÁ ESTÁ LOGADO
        // ======================================

        if (
            typeof estaLogado ===
                "function" &&

            estaLogado()
        ) {

            redirecionarDepoisDoLogin();

            return;

        }


        // ======================================
        // CARREGAR USUÁRIO LEMBRADO
        // ======================================

        const usuarioSalvo =
            localStorage.getItem(
                "gensaude_usuario_lembrado"
            );


        if (
            usuarioSalvo &&
            emailInput &&
            rememberCheckbox
        ) {

            emailInput.value =
                usuarioSalvo;


            rememberCheckbox.checked =
                true;

        }

    }
);


// ==========================================
// REDIRECIONAR DEPOIS DO LOGIN
// ==========================================

function redirecionarDepoisDoLogin() {

    const destino =
        obterDestinoDepoisDoLogin();


    window.location.href =
        destino;

}


// ==========================================
// OBTER DESTINO SALVO
// ==========================================

function obterDestinoDepoisDoLogin() {

    const destinoSalvo =
        localStorage.getItem(
            LOGIN_DESTINATION_KEY
        );


    /*
        O destino é removido após ser lido para
        não interferir nos próximos logins.
    */

    localStorage.removeItem(
        LOGIN_DESTINATION_KEY
    );


    if (!destinoSalvo) {

        return LOGGED_HOME_PAGE;

    }


    const destinoPermitido =
        ALLOWED_LOGIN_DESTINATIONS.includes(
            destinoSalvo
        );


    if (!destinoPermitido) {

        console.warn(
            "Destino após login não permitido:",
            destinoSalvo
        );


        return LOGGED_HOME_PAGE;

    }


    return destinoSalvo;

}


// ==========================================
// BLOQUEAR FORMULÁRIO
// ==========================================

function bloquearFormulario() {

    if (!loginForm) {

        return;

    }


    const botaoEntrar =
        loginForm.querySelector(
            'button[type="submit"]'
        );


    if (botaoEntrar) {

        botaoEntrar.disabled =
            true;

    }


    if (emailInput) {

        emailInput.disabled =
            true;

    }


    if (passwordInput) {

        passwordInput.disabled =
            true;

    }


    if (rememberCheckbox) {

        rememberCheckbox.disabled =
            true;

    }

}


// ==========================================
// CRIAR CONTA
// ==========================================

if (createAccountButton) {

    createAccountButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "../tela_cadastro/cadastro.html";

        }
    );

}


// ==========================================
// ESQUECI A SENHA
// ==========================================

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            alert(
                "A recuperação de senha será implementada posteriormente."
            );

        }
    );

}


// ==========================================
// MOSTRAR MENSAGEM
// ==========================================

function mostrarMensagem(
    texto,
    tipo
) {

    removerMensagem();


    if (!loginForm) {

        return;

    }


    const mensagem =
        document.createElement(
            "p"
        );


    mensagem.classList.add(
        "form-message",
        tipo
    );


    mensagem.textContent =
        texto;


    mensagem.setAttribute(
        "role",
        tipo === "error"
            ? "alert"
            : "status"
    );


    loginForm.appendChild(
        mensagem
    );

}


// ==========================================
// REMOVER MENSAGEM
// ==========================================

function removerMensagem() {

    const mensagemAnterior =
        document.querySelector(
            ".form-message"
        );


    if (mensagemAnterior) {

        mensagemAnterior.remove();

    }

}