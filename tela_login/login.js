// ================================
// ELEMENTOS
// ================================

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


// ================================
// MOSTRAR / ESCONDER SENHA
// ================================

passwordToggle.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

    } else {

        passwordInput.type = "password";

    }

});


// ================================
// LOGIN
// ================================

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const usuario =
        emailInput.value.trim();

    const senha =
        passwordInput.value.trim();


    removerMensagem();


    // EMAIL / CPF VAZIO

    if (usuario === "") {

        mostrarMensagem(
            "Digite seu e-mail ou CPF.",
            "error"
        );

        emailInput.focus();

        return;
    }


    // SENHA VAZIA

    if (senha === "") {

        mostrarMensagem(
            "Digite sua senha.",
            "error"
        );

        passwordInput.focus();

        return;
    }


    // SENHA CURTA

    if (senha.length < 6) {

        mostrarMensagem(
            "A senha deve possuir pelo menos 6 caracteres.",
            "error"
        );

        passwordInput.focus();

        return;
    }


    // ================================
    // LEMBRAR USUÁRIO
    // ================================

    if (rememberCheckbox.checked) {

        localStorage.setItem(
            "gensaude_usuario",
            usuario
        );

    } else {

        localStorage.removeItem(
            "gensaude_usuario"
        );

    }


    // ================================
    // FUTURAMENTE:
    // CONECTAR COM O BACK-END
    // ================================

    /*
    fetch("http://localhost:3000/api/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            usuario: usuario,
            senha: senha

        })

    })

    .then(response => response.json())

    .then(data => {

        if (data.sucesso) {

            window.location.href =
                "inicio.html";

        } else {

            mostrarMensagem(
                data.mensagem,
                "error"
            );

        }

    })

    .catch(error => {

        console.error(error);

        mostrarMensagem(
            "Erro ao conectar com o servidor.",
            "error"
        );

    });
    */


    mostrarMensagem(
        "Dados preenchidos corretamente.",
        "success"
    );

});


// ================================
// CARREGAR USUÁRIO SALVO
// ================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const usuarioSalvo =
            localStorage.getItem(
                "gensaude_usuario"
            );


        if (usuarioSalvo) {

            emailInput.value =
                usuarioSalvo;

            rememberCheckbox.checked =
                true;
        }

    }
);


// ================================
// CRIAR CONTA
// ================================

createAccountButton.addEventListener(
    "click",
    () => {
        window.location.href = "../tela_cadastro/cadastro.html";
    }
);


// ================================
// ESQUECI A SENHA
// ================================

forgotPassword.addEventListener(
    "click",
    (event) => {

        event.preventDefault();


        alert(
            "A recuperação de senha será implementada posteriormente."
        );

    }
);


// ================================
// MOSTRAR MENSAGEM
// ================================

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


// ================================
// REMOVER MENSAGEM
// ================================

function removerMensagem() {

    const mensagemAnterior =
        document.querySelector(
            ".form-message"
        );


    if (mensagemAnterior) {

        mensagemAnterior.remove();

    }

}