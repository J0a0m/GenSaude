// ==========================================
// AUTENTICAÇÃO LOCAL - GENSAÚDE
// Uso temporário enquanto não há backend
// ==========================================

const AUTH_USERS_KEY = "gensaude_usuarios";
const AUTH_SESSION_KEY = "gensaude_sessao";


// ==========================================
// PEGAR TODOS OS USUÁRIOS
// ==========================================

function getUsuarios() {

    const usuarios =
        localStorage.getItem(AUTH_USERS_KEY);

    if (!usuarios) {
        return [];
    }

    try {

        return JSON.parse(usuarios);

    } catch (erro) {

        console.error(
            "Erro ao carregar usuários:",
            erro
        );

        return [];
    }

}


// ==========================================
// SALVAR LISTA DE USUÁRIOS
// ==========================================

function salvarUsuarios(usuarios) {

    localStorage.setItem(
        AUTH_USERS_KEY,
        JSON.stringify(usuarios)
    );

}


// ==========================================
// CADASTRAR USUÁRIO
// ==========================================

function cadastrarUsuario(usuario) {

    const usuarios =
        getUsuarios();


    const emailNormalizado =
        usuario.email
            .trim()
            .toLowerCase();


    const cpfNormalizado =
        usuario.cpf
            .replace(/\D/g, "");


    const usuarioExistente =
        usuarios.find((item) => {

            return (
                item.email === emailNormalizado ||
                item.cpf === cpfNormalizado
            );

        });


    if (usuarioExistente) {

        return {
            sucesso: false,
            mensagem:
                "Já existe uma conta com este e-mail ou CPF."
        };

    }


    const novoUsuario = {

        id: Date.now(),

        nome:
            usuario.nome,

        cpf:
            cpfNormalizado,

        dataNascimento:
            usuario.dataNascimento,

        email:
            emailNormalizado,

        telefone:
            usuario.telefone,

        cep:
            usuario.cep,

        cidade:
            usuario.cidade,

        estado:
            usuario.estado,

        // TEMPORÁRIO PARA O PROTÓTIPO
        senha:
            usuario.senha,

        criadoEm:
            new Date().toISOString()

    };


    usuarios.push(novoUsuario);

    salvarUsuarios(usuarios);


    return {

        sucesso: true,

        usuario: novoUsuario

    };

}


// ==========================================
// LOGIN
// ==========================================

function fazerLogin(
    identificador,
    senha,
    lembrar = false
) {

    const usuarios =
        getUsuarios();


    const identificadorNormalizado =
        identificador
            .trim()
            .toLowerCase();


    const cpfDigitado =
        identificador
            .replace(/\D/g, "");


    const usuario =
        usuarios.find((item) => {

            return (
                item.email ===
                    identificadorNormalizado ||

                item.cpf ===
                    cpfDigitado
            );

        });


    if (!usuario) {

        return {
            sucesso: false,
            mensagem:
                "Usuário não encontrado."
        };

    }


    if (usuario.senha !== senha) {

        return {
            sucesso: false,
            mensagem:
                "Senha incorreta."
        };

    }


    const sessao = {

        id:
            usuario.id,

        nome:
            usuario.nome,

        email:
            usuario.email,

        cpf:
            usuario.cpf,

        lembrar:
            lembrar,

        loginEm:
            new Date().toISOString()

    };


    localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify(sessao)
    );


    if (lembrar) {

        localStorage.setItem(
            "gensaude_usuario_lembrado",
            usuario.email
        );

    } else {

        localStorage.removeItem(
            "gensaude_usuario_lembrado"
        );

    }


    return {

        sucesso: true,

        usuario:
            usuario

    };

}


// ==========================================
// PEGAR SESSÃO
// ==========================================

function getSessao() {

    const sessao =
        localStorage.getItem(
            AUTH_SESSION_KEY
        );


    if (!sessao) {
        return null;
    }


    try {

        return JSON.parse(sessao);

    } catch (erro) {

        return null;
    }

}


// ==========================================
// VERIFICAR LOGIN
// ==========================================

function estaLogado() {

    return getSessao() !== null;

}


// ==========================================
// PEGAR USUÁRIO ATUAL
// ==========================================

function getUsuarioAtual() {

    const sessao =
        getSessao();


    if (!sessao) {
        return null;
    }


    const usuarios =
        getUsuarios();


    return (
        usuarios.find(
            usuario =>
                usuario.id === sessao.id
        ) || null
    );

}


// ==========================================
// LOGOUT
// ==========================================

function fazerLogout() {

    localStorage.removeItem(
        AUTH_SESSION_KEY
    );

}


// ==========================================
// PROTEGER PÁGINA
// ==========================================

function exigirLogin() {

    if (!estaLogado()) {

        window.location.href =
            "../tela_login/login.html";

        return false;
    }


    return true;

}