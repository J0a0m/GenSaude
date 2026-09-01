// =====================================
// GENSAÚDE SUS
// CONTROLE GLOBAL DE USUÁRIO
// =====================================



// Salvar usuário cadastrado

function salvarUsuario(dados){


    localStorage.setItem(

        "usuario",

        JSON.stringify(dados)

    );


}




// Buscar usuário cadastrado

function pegarUsuario(){


    return JSON.parse(

        localStorage.getItem("usuario")

    );


}




// Criar sessão de login

function fazerLogin(usuario){


    sessionStorage.setItem(

        "usuarioAtual",

        JSON.stringify(usuario)

    );


    sessionStorage.setItem(

        "logado",

        "true"

    );


}




// Verificar se está logado

function estaLogado(){


    return sessionStorage.getItem(

        "logado"

    ) === "true";


}




// Encerrar sessão

function logout(){


    sessionStorage.clear();


    window.location.href =

    "../login/login.html";


}







// =====================================
// VALIDAÇÕES
// =====================================



// Validar e-mail

function validarEmail(email){


    const regex =

    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return regex.test(email);


}





// Validar CPF

function validarCPF(cpf){


    cpf = cpf.replace(/\D/g,'');



    if(cpf.length !== 11){

        return false;

    }



    if(
        cpf === "00000000000" ||
        cpf === "11111111111" ||
        cpf === "22222222222" ||
        cpf === "33333333333" ||
        cpf === "44444444444" ||
        cpf === "55555555555" ||
        cpf === "66666666666" ||
        cpf === "77777777777" ||
        cpf === "88888888888" ||
        cpf === "99999999999"
    ){

        return false;

    }



    return true;


}





// Verifica se é email ou CPF

function validarEmailOuCPF(valor){


    if(valor.includes("@")){


        return validarEmail(valor);


    }


    else{


        return validarCPF(valor);


    }


}




// Validar senha

function validarSenha(senha){


    return senha.length >= 6;


}