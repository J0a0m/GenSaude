// =====================================
// LOGIN GENSAÚDE SUS
// =====================================



const senha = document.querySelector("#senha");

const olho = document.querySelector("#olho");





// Mostrar / esconder senha

olho.addEventListener(

"click",

()=>{


    if(senha.type === "password"){


        senha.type = "text";


        olho.src =

        "../../assets/icones/olho-aberto.png";


    }


    else{


        senha.type = "password";


        olho.src =

        "../../assets/icones/olho-fechado.png";


    }



});








// Formulário

document

.querySelector("#form-login")

.addEventListener(

"submit",

(e)=>{


e.preventDefault();





const identificador =

document.querySelector("#email").value.trim();




const senhaDigitada =

senha.value.trim();






// Validar campo vazio

if(!identificador || !senhaDigitada){


    alert(

    "Preencha todos os campos."

    );


    return;


}






// Validar email ou CPF

if(!validarEmailOuCPF(identificador)){


    alert(

    "Digite um e-mail ou CPF válido."

    );


    return;


}







// Validar senha

if(!validarSenha(senhaDigitada)){


    alert(

    "A senha deve possuir pelo menos 6 caracteres."

    );


    return;


}








// Buscar usuário cadastrado

const usuario = pegarUsuario();





if(!usuario){


    alert(

    "Usuário não encontrado. Crie uma conta primeiro."

    );


    return;


}







// Conferir dados

if(

(usuario.email !== identificador)

&&

(usuario.cpf !== identificador)

){


    alert(

    "Usuário não encontrado."

    );


    return;


}








if(usuario.senha !== senhaDigitada){


    alert(

    "Senha incorreta."

    );


    return;


}







// Criar sessão

fazerLogin(usuario);






window.location.href =

"../inicio/inicio.html";



});