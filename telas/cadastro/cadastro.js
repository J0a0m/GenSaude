// =====================================
// GENSAÚDE SUS - CADASTRO
// =====================================

const campoCpf = document.querySelector("#cpf");
const campoTelefone = document.querySelector("#telefone");
const campoCep = document.querySelector("#cep");

const campoSenha = document.querySelector("#senha");
const campoConfirmarSenha = document.querySelector("#confirmarSenha");

const olhoSenha = document.querySelector("#olhoSenha");
const olhoConfirmarSenha = document.querySelector("#olhoConfirmarSenha");

const formCadastro = document.querySelector("#form-cadastro");


// =====================================
// FUNÇÕES AUXILIARES
// =====================================

function somenteNumeros(valor) {
    return valor.replace(/\D/g, "");
}

function formatarCPF(valor) {
    valor = somenteNumeros(valor).slice(0, 11);

    valor = valor.replace(/^(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1-$2");

    return valor;
}

function formatarTelefone(valor) {
    valor = somenteNumeros(valor).slice(0, 11);

    if (valor.length <= 10) {
        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return valor;
}

function formatarCEP(valor) {
    valor = somenteNumeros(valor).slice(0, 8);
    valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
    return valor;
}

function alternarSenha(campo, olho) {
    if (campo.type === "password") {
        campo.type = "text";
        olho.src = "../../assets/icones/olho-aberto.png";
    } else {
        campo.type = "password";
        olho.src = "../../assets/icones/olho-fechado.png";
    }
}


// =====================================
// MÁSCARAS
// =====================================

campoCpf.addEventListener("input", () => {
    campoCpf.value = formatarCPF(campoCpf.value);
});

campoTelefone.addEventListener("input", () => {
    campoTelefone.value = formatarTelefone(campoTelefone.value);
});

campoCep.addEventListener("input", () => {
    campoCep.value = formatarCEP(campoCep.value);
});


// =====================================
// OLHOS DAS SENHAS
// =====================================

olhoSenha.addEventListener("click", () => {
    alternarSenha(campoSenha, olhoSenha);
});

olhoConfirmarSenha.addEventListener("click", () => {
    alternarSenha(campoConfirmarSenha, olhoConfirmarSenha);
});


// =====================================
// SUBMIT
// =====================================

formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const cpf = document.querySelector("#cpf").value.trim();
    const dataNascimento = document.querySelector("#dataNascimento").value;
    const email = document.querySelector("#email").value.trim();
    const telefone = document.querySelector("#telefone").value.trim();
    const cep = document.querySelector("#cep").value.trim();
    const cidade = document.querySelector("#cidade").value.trim();
    const estado = document.querySelector("#estado").value;
    const senha = document.querySelector("#senha").value;
    const confirmarSenha = document.querySelector("#confirmarSenha").value;
    const aceiteTermos = document.querySelector("#aceiteTermos").checked;

    if (
        !nome ||
        !cpf ||
        !dataNascimento ||
        !email ||
        !telefone ||
        !cep ||
        !cidade ||
        !estado ||
        !senha ||
        !confirmarSenha
    ) {
        alert("Preencha todos os campos.");
        return;
    }

    if (!validarCPF(cpf)) {
        alert("Digite um CPF válido.");
        return;
    }

    if (!validarEmail(email)) {
        alert("Digite um e-mail válido.");
        return;
    }

    if (somenteNumeros(telefone).length < 10) {
        alert("Digite um telefone válido.");
        return;
    }

    if (somenteNumeros(cep).length !== 8) {
        alert("Digite um CEP válido.");
        return;
    }

    if (!validarSenha(senha)) {
        alert("A senha deve possuir pelo menos 6 caracteres.");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    if (!aceiteTermos) {
        alert("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");
        return;
    }

    const usuario = {
        nome: nome,
        cpf: cpf,
        dataNascimento: dataNascimento,
        email: email,
        telefone: telefone,
        cep: cep,
        cidade: cidade,
        estado: estado,
        senha: senha
    };

    salvarUsuario(usuario);

    alert("Conta criada com sucesso!");

    window.location.href = "../login/login.html";
});