// ==========================================
// CADASTRO.JS - GENSAÚDE
// ==========================================


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
    document.getElementById(
        "dataNascimento"
    );

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
    document.getElementById(
        "confirmarSenha"
    );

const termosInput =
    document.getElementById("termos");

const toggleSenha =
    document.getElementById("toggleSenha");

const toggleConfirmarSenha =
    document.getElementById(
        "toggleConfirmarSenha"
    );

const formMessage =
    document.getElementById("formMessage");


// ==========================================
// DATA DE NASCIMENTO
// ==========================================

if (dataNascimentoInput) {

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
// MOSTRAR / ESCONDER SENHA
// ==========================================

if (
    toggleSenha &&
    senhaInput
) {

    toggleSenha.addEventListener(
        "click",
        () => {

            const mostrandoSenha =
                senhaInput.type === "text";


            senhaInput.type =
                mostrandoSenha
                    ? "password"
                    : "text";


            toggleSenha.setAttribute(
                "aria-label",
                mostrandoSenha
                    ? "Mostrar senha"
                    : "Ocultar senha"
            );

        }
    );

}


// ==========================================
// MOSTRAR / ESCONDER CONFIRMAÇÃO
// ==========================================

if (
    toggleConfirmarSenha &&
    confirmarSenhaInput
) {

    toggleConfirmarSenha.addEventListener(
        "click",
        () => {

            const mostrandoSenha =
                confirmarSenhaInput.type ===
                "text";


            confirmarSenhaInput.type =
                mostrandoSenha
                    ? "password"
                    : "text";


            toggleConfirmarSenha.setAttribute(
                "aria-label",
                mostrandoSenha
                    ? "Mostrar senha"
                    : "Ocultar senha"
            );

        }
    );

}


// ==========================================
// MÁSCARA CPF
// ==========================================

if (cpfInput) {

    cpfInput.addEventListener(
        "input",
        () => {

            let valor =
                cpfInput.value
                    .replace(/\D/g, "")
                    .substring(0, 11);


            if (valor.length > 9) {

                valor =
                    valor.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
                        "$1.$2.$3-$4"
                    );

            } else if (
                valor.length > 6
            ) {

                valor =
                    valor.replace(
                        /(\d{3})(\d{3})(\d{1,3})/,
                        "$1.$2.$3"
                    );

            } else if (
                valor.length > 3
            ) {

                valor =
                    valor.replace(
                        /(\d{3})(\d{1,3})/,
                        "$1.$2"
                    );

            }


            cpfInput.value =
                valor;

        }
    );

}


// ==========================================
// MÁSCARA TELEFONE
// ==========================================

if (telefoneInput) {

    telefoneInput.addEventListener(
        "input",
        () => {

            let valor =
                telefoneInput.value
                    .replace(/\D/g, "")
                    .substring(0, 11);


            if (
                valor.length <= 10
            ) {

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

}


// ==========================================
// CEP
// ==========================================

let ultimoCepConsultado = "";

let consultandoCep = false;


// ==========================================
// MÁSCARA + CONSULTA AUTOMÁTICA
// ==========================================

if (cepInput) {

    cepInput.addEventListener(
        "input",
        () => {

            let valor =
                cepInput.value
                    .replace(/\D/g, "")
                    .substring(0, 8);


            if (
                valor.length > 5
            ) {

                valor =
                    valor.replace(
                        /(\d{5})(\d{1,3})/,
                        "$1-$2"
                    );

            }


            cepInput.value =
                valor;


            const cepNumeros =
                valor.replace(
                    /\D/g,
                    ""
                );


            // CEP ainda incompleto

            if (
                cepNumeros.length < 8
            ) {

                if (
                    ultimoCepConsultado !== ""
                ) {

                    cidadeInput.value =
                        "";

                    estadoSelect.value =
                        "";

                    ultimoCepConsultado =
                        "";

                }


                return;

            }


            // Evita consultar o mesmo CEP
            // várias vezes

            if (
                cepNumeros ===
                ultimoCepConsultado
            ) {

                return;

            }


            consultarCep(
                cepNumeros
            );

        }
    );

}


// ==========================================
// CONSULTAR CEP
// ==========================================

async function consultarCep(cep) {

    if (consultandoCep) {
        return;
    }


    consultandoCep =
        true;


    ultimoCepConsultado =
        cep;


    // Feedback visual

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


        // ==================================
        // CEP NÃO ENCONTRADO
        // ==================================

        if (dados.erro) {

            cidadeInput.value =
                "";

            estadoSelect.value =
                "";

            ultimoCepConsultado =
                "";


            mostrarMensagem(
                "CEP não encontrado. Verifique e tente novamente.",
                "error"
            );


            cepInput.focus();

            return;

        }


        // ==================================
        // PREENCHER AUTOMATICAMENTE
        // ==================================

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
            "Não foi possível consultar o CEP. Você pode preencher cidade e estado manualmente.",
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
// ENVIO DO FORMULÁRIO
// ==========================================

if (cadastroForm) {

    cadastroForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            limparMensagem();


            // ==================================
            // PEGAR VALORES
            // ==================================

            const nome =
                nomeInput.value.trim();

            const cpf =
                cpfInput.value.trim();

            const dataNascimento =
                dataNascimentoInput.value;

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

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

            if (
                nome.length < 3
            ) {

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
                cpf.replace(
                    /\D/g,
                    ""
                );


            if (
                cpfNumeros.length !== 11
            ) {

                mostrarMensagem(
                    "Digite um CPF válido.",
                    "error"
                );

                cpfInput.focus();

                return;

            }



            // ==================================
            // DATA DE NASCIMENTO
            // ==================================

            if (!dataNascimento) {

                mostrarMensagem(
                    "Selecione sua data de nascimento.",
                    "error"
                );

                dataNascimentoInput.focus();

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
                )
            ) {

                mostrarMensagem(
                    "Selecione uma data de nascimento válida.",
                    "error"
                );

                dataNascimentoInput.focus();

                return;

            }


            if (
                nascimento > hoje
            ) {

                mostrarMensagem(
                    "A data de nascimento não pode estar no futuro.",
                    "error"
                );

                dataNascimentoInput.focus();

                return;

            }



            // ==================================
            // EMAIL
            // ==================================

            if (
                !validarEmail(email)
            ) {

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
                telefone.replace(
                    /\D/g,
                    ""
                );


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
                cep.replace(
                    /\D/g,
                    ""
                );


            if (
                cepNumeros.length !== 8
            ) {

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

            if (
                cidade === "" ||
                cidade === "Buscando..."
            ) {

                mostrarMensagem(
                    "Informe uma cidade válida.",
                    "error"
                );

                cidadeInput.focus();

                return;

            }



            // ==================================
            // ESTADO
            // ==================================

            if (
                estado === ""
            ) {

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

            if (
                senha.length < 6
            ) {

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
                senha !==
                confirmarSenha
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

            if (
                !termosInput.checked
            ) {

                mostrarMensagem(
                    "Você precisa aceitar os Termos de Uso e a Política de Privacidade.",
                    "error"
                );

                return;

            }



            // ==================================
            // VERIFICAR AUTH.JS
            // ==================================

            if (
                typeof cadastrarUsuario !==
                "function"
            ) {

                console.error(
                    "auth.js não foi carregado."
                );


                mostrarMensagem(
                    "Erro interno ao criar a conta.",
                    "error"
                );


                return;

            }



            // ==================================
            // DADOS DO CADASTRO
            // ==================================

            const dadosCadastro = {

                nome:
                    nome,

                cpf:
                    cpfNumeros,

                dataNascimento:
                    dataNascimento,

                email:
                    email,

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
            // CADASTRAR LOCALMENTE
            // ==================================

            const resultado =
                cadastrarUsuario(
                    dadosCadastro
                );



            // ==================================
            // ERRO NO CADASTRO
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
            // SUCESSO
            // ==================================

            mostrarMensagem(
                "Conta criada com sucesso! Redirecionando para o login...",
                "success"
            );


            // Impede clique duplicado

            const botaoCadastrar =
                cadastroForm.querySelector(
                    ".register-button"
                );


            if (botaoCadastrar) {

                botaoCadastrar.disabled =
                    true;

            }



            // ==================================
            // REDIRECIONAR PARA LOGIN
            // ==================================

            setTimeout(
                () => {

                    window.location.href =
                        "../tela_login/login.html";

                },
                1000
            );

        }
    );

}


// ==========================================
// VALIDAR EMAIL
// ==========================================

function validarEmail(email) {

    const expressao =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return expressao.test(
        email
    );

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