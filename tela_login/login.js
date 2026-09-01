// ==========================================
// LOGIN.JS - GENSAÚDE
// ==========================================


// ==========================================
// ELEMENTOS
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const passwordToggle =
    document.getElementById("passwordToggle");

const rememberCheckbox =
    document.getElementById("remember");

const createAccountButton =
    document.getElementById("createAccount");

const forgotPassword =
    document.querySelector(".forgot-password");


// ==========================================
// MOSTRAR / ESCONDER SENHA
// ==========================================

if (passwordToggle && passwordInput) {

    passwordToggle.addEventListener(
        "click",
        () => {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

            } else {

                passwordInput.type =
                    "password";

            }

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
                emailInput.value.trim();

            const senha =
                passwordInput.value;


            removerMensagem();


            // ==================================
            // EMAIL / CPF VAZIO
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

            if (senha.trim() === "") {

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

            if (senha.length < 6) {

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
            // REALIZAR LOGIN LOCAL
            // ==================================

            const resultado =
                fazerLogin(
                    usuario,
                    senha,
                    rememberCheckbox.checked
                );


            // ==================================
            // LOGIN INVÁLIDO
            // ==================================

            if (!resultado.sucesso) {

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


            // ==================================
            // REDIRECIONAR
            // ==================================

            setTimeout(
                () => {

                    window.location.href =
                        "../tela_inicio_logado/inicio_logado.html";

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
        // USUÁRIO JÁ LOGADO
        // ======================================

        if (
            typeof estaLogado ===
            "function"
        ) {

            if (estaLogado()) {

                window.location.href =
                    "../tela_inicio_logado/inicio_logado.html";

                return;
            }

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


    const mensagem =
        document.createElement("p");


    mensagem.classList.add(
        "form-message",
        tipo
    );


    mensagem.textContent =
        texto;


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