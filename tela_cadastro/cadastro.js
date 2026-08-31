// ==========================================
// ELEMENTOS
// ==========================================

const cadastroForm =
    document.getElementById("cadastroForm");

const nomeInput =
    document.getElementById("nome");

const cpfInput =
    document.getElementById("cpf");

const dataNascimentoInput =
    document.getElementById("dataNascimento");

const emailInput =
    document.getElementById("email");

const telefoneInput =
    document.getElementById("telefone");

const cepInput =
    document.getElementById("cep");

const cidadeInput =
    document.getElementById("cidade");

const estadoSelect =
    document.getElementById("estado");

const senhaInput =
    document.getElementById("senha");

const confirmarSenhaInput =
    document.getElementById("confirmarSenha");

const termosInput =
    document.getElementById("termos");

const toggleSenha =
    document.getElementById("toggleSenha");

const toggleConfirmarSenha =
    document.getElementById("toggleConfirmarSenha");

const formMessage =
    document.getElementById("formMessage");


// ==========================================
// MOSTRAR / ESCONDER SENHA
// ==========================================

toggleSenha.addEventListener("click", () => {

    if (senhaInput.type === "password") {

        senhaInput.type = "text";

        toggleSenha.setAttribute(
            "aria-label",
            "Ocultar senha"
        );

    } else {

        senhaInput.type = "password";

        toggleSenha.setAttribute(
            "aria-label",
            "Mostrar senha"
        );

    }

});


// ==========================================
// MOSTRAR / ESCONDER CONFIRMAR SENHA
// ==========================================

toggleConfirmarSenha.addEventListener(
    "click",
    () => {

        if (
            confirmarSenhaInput.type === "password"
        ) {

            confirmarSenhaInput.type = "text";

            toggleConfirmarSenha.setAttribute(
                "aria-label",
                "Ocultar senha"
            );

        } else {

            confirmarSenhaInput.type = "password";

            toggleConfirmarSenha.setAttribute(
                "aria-label",
                "Mostrar senha"
            );

        }

    }
);


// ==========================================
// MÁSCARA CPF
// ==========================================

cpfInput.addEventListener("input", () => {

    let valor =
        cpfInput.value.replace(/\D/g, "");


    valor =
        valor.substring(0, 11);


    if (valor.length > 9) {

        valor =
            valor.replace(
                /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
                "$1.$2.$3-$4"
            );

    } else if (valor.length > 6) {

        valor =
            valor.replace(
                /(\d{3})(\d{3})(\d{1,3})/,
                "$1.$2.$3"
            );

    } else if (valor.length > 3) {

        valor =
            valor.replace(
                /(\d{3})(\d{1,3})/,
                "$1.$2"
            );

    }


    cpfInput.value = valor;

});


// ==========================================
// MÁSCARA DATA
// ==========================================

dataNascimentoInput.addEventListener(
    "input",
    () => {

        let valor =
            dataNascimentoInput.value.replace(
                /\D/g,
                ""
            );


        valor =
            valor.substring(0, 8);


        if (valor.length > 4) {

            valor =
                valor.replace(
                    /(\d{2})(\d{2})(\d{1,4})/,
                    "$1/$2/$3"
                );

        } else if (valor.length > 2) {

            valor =
                valor.replace(
                    /(\d{2})(\d{1,2})/,
                    "$1/$2"
                );

        }


        dataNascimentoInput.value =
            valor;

    }
);


// ==========================================
// MÁSCARA TELEFONE
// ==========================================

telefoneInput.addEventListener(
    "input",
    () => {

        let valor =
            telefoneInput.value.replace(
                /\D/g,
                ""
            );


        valor =
            valor.substring(0, 11);


        if (valor.length <= 10) {

            valor =
                valor.replace(
                    /(\d{2})(\d{4})(\d{0,4})/,
                    "($1) $2-$3"
                );

        } else {

            valor =
                valor.replace(
                    /(\d{2})(\d{5})(\d{0,4})/,
                    "($1) $2-$3"
                );

        }


        telefoneInput.value =
            valor;

    }
);


// ==========================================
// MÁSCARA CEP
// ==========================================

cepInput.addEventListener("input", () => {

    let valor =
        cepInput.value.replace(/\D/g, "");


    valor =
        valor.substring(0, 8);


    if (valor.length > 5) {

        valor =
            valor.replace(
                /(\d{5})(\d{1,3})/,
                "$1-$2"
            );

    }


    cepInput.value =
        valor;

});


// ==========================================
// ENVIO DO FORMULÁRIO
// ==========================================

cadastroForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        limparMensagem();


        const nome =
            nomeInput.value.trim();

        const cpf =
            cpfInput.value.trim();

        const dataNascimento =
            dataNascimentoInput.value.trim();

        const email =
            emailInput.value.trim();

        const telefone =
            telefoneInput.value.trim();

        const cep =
            cepInput.value.trim();

        const cidade =
            cidadeInput.value.trim();

        const estado =
            estadoSelect.value;

        const senha =
            senhaInput.value;

        const confirmarSenha =
            confirmarSenhaInput.value;


        // ==================================
        // NOME
        // ==================================

        if (nome.length < 3) {

            mostrarMensagem(
                "Digite seu nome completo.",
                "error"
            );

            nomeInput.focus();

            return;

        }


        // ==================================
        // CPF
        // ==================================

        const cpfNumeros =
            cpf.replace(/\D/g, "");


        if (cpfNumeros.length !== 11) {

            mostrarMensagem(
                "Digite um CPF válido.",
                "error"
            );

            cpfInput.focus();

            return;

        }


        // ==================================
        // DATA
        // ==================================

        if (
            dataNascimento.length !== 10
        ) {

            mostrarMensagem(
                "Digite sua data de nascimento.",
                "error"
            );

            dataNascimentoInput.focus();

            return;

        }


        // ==================================
        // EMAIL
        // ==================================

        if (!validarEmail(email)) {

            mostrarMensagem(
                "Digite um e-mail válido.",
                "error"
            );

            emailInput.focus();

            return;

        }


        // ==================================
        // TELEFONE
        // ==================================

        const telefoneNumeros =
            telefone.replace(/\D/g, "");


        if (
            telefoneNumeros.length < 10
        ) {

            mostrarMensagem(
                "Digite um telefone válido.",
                "error"
            );

            telefoneInput.focus();

            return;

        }


        // ==================================
        // CEP
        // ==================================

        const cepNumeros =
            cep.replace(/\D/g, "");


        if (cepNumeros.length !== 8) {

            mostrarMensagem(
                "Digite um CEP válido.",
                "error"
            );

            cepInput.focus();

            return;

        }


        // ==================================
        // CIDADE
        // ==================================

        if (cidade === "") {

            mostrarMensagem(
                "Digite sua cidade.",
                "error"
            );

            cidadeInput.focus();

            return;

        }


        // ==================================
        // ESTADO
        // ==================================

        if (estado === "") {

            mostrarMensagem(
                "Selecione seu estado.",
                "error"
            );

            estadoSelect.focus();

            return;

        }


        // ==================================
        // SENHA
        // ==================================

        if (senha.length < 6) {

            mostrarMensagem(
                "A senha deve possuir pelo menos 6 caracteres.",
                "error"
            );

            senhaInput.focus();

            return;

        }


        // ==================================
        // CONFIRMAR SENHA
        // ==================================

        if (
            senha !== confirmarSenha
        ) {

            mostrarMensagem(
                "As senhas não são iguais.",
                "error"
            );

            confirmarSenhaInput.focus();

            return;

        }


        // ==================================
        // TERMOS
        // ==================================

        if (!termosInput.checked) {

            mostrarMensagem(
                "Você precisa aceitar os Termos de Uso e a Política de Privacidade.",
                "error"
            );

            return;

        }


        // ==================================
        // DADOS PRONTOS PARA O BACK-END
        // ==================================

        const dadosCadastro = {

            nome: nome,

            cpf: cpfNumeros,

            dataNascimento:
                dataNascimento,

            email: email,

            telefone:
                telefoneNumeros,

            cep:
                cepNumeros,

            cidade:
                cidade,

            estado:
                estado,

            senha:
                senha

        };


        console.log(
            "Dados do cadastro:",
            dadosCadastro
        );


        // ==================================
        // FUTURA INTEGRAÇÃO COM API
        // ==================================

        /*
        fetch(
            "http://localhost:3000/api/cadastro",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(
                    dadosCadastro
                )

            }
        )

        .then(response => {

            return response.json();

        })

        .then(data => {

            if (data.sucesso) {

                mostrarMensagem(
                    "Conta criada com sucesso!",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1500);

            } else {

                mostrarMensagem(
                    data.mensagem ||
                    "Não foi possível criar sua conta.",
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


        // TEMPORÁRIO

        mostrarMensagem(
            "Dados preenchidos corretamente.",
            "success"
        );

    }
);


// ==========================================
// VALIDAR EMAIL
// ==========================================

function validarEmail(email) {

    const expressao =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return expressao.test(email);

}


// ==========================================
// MOSTRAR MENSAGEM
// ==========================================

function mostrarMensagem(
    mensagem,
    tipo
) {

    formMessage.textContent =
        mensagem;


    formMessage.className =
        `form-message ${tipo}`;

}


// ==========================================
// LIMPAR MENSAGEM
// ==========================================

function limparMensagem() {

    formMessage.textContent = "";

    formMessage.className =
        "form-message";

}