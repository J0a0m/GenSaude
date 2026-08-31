// =========================================
// ELEMENTOS DA PÁGINA
// =========================================


const profileButton =
    document.getElementById("profileButton");


const evaluationButton =
    document.getElementById("evaluationButton");




// =========================================
// DADOS DO USUÁRIO
// =========================================


/*
    FUTURAMENTE ESSES DADOS VIRÃO
    DO BANCO DE DADOS ATRAVÉS DA API.

    Exemplo:

    const usuario = await fetch(
        "/api/usuario"
    );

*/


const usuario = {

    nome:
        "João Silva",

    primeiroNome:
        "João"

};








// =========================================
// CARREGAR DADOS DO USUÁRIO
// =========================================


function carregarUsuario(){


    const nomeUsuario =
        document.querySelector(
            ".profile-button span"
        );


    const saudacao =
        document.querySelector(
            ".welcome h1 span"
        );



    if(nomeUsuario){

        nomeUsuario.textContent =
            usuario.nome;

    }



    if(saudacao){

        saudacao.textContent =
            usuario.primeiroNome;

    }



}







// Executa ao abrir a página

carregarUsuario();









// =========================================
// BOTÃO PERFIL
// =========================================


profileButton.addEventListener(
    "click",
    ()=>{


        /*
            Futuramente:
            abrir página do perfil
        */


        window.location.href =
            "../perfil/perfil.html";


    }
);









// =========================================
// BOTÃO INICIAR AVALIAÇÃO
// =========================================


evaluationButton.addEventListener(
    "click",
    ()=>{


        /*
            Futuramente:
            página onde o usuário
            responde o questionário
            preventivo
        */


        window.location.href =
            "../avaliacao/avaliacao.html";


    }
);









// =========================================
// CARDS DE ACESSO RÁPIDO
// =========================================



const quickCards =
    document.querySelectorAll(
        ".quick-card"
    );



quickCards.forEach(
    (card,index)=>{


        card.addEventListener(
            "click",
            ()=>{


                switch(index){



                    // Histórico Familiar

                    case 0:


                        window.location.href =
                            "../historico/historico.html";


                    break;






                    // UBS ou UPA

                    case 1:


                        window.location.href =
                            "../ubs-upa/ubs-upa.html";


                    break;






                    // Unidades Próximas

                    case 2:


                        window.location.href =
                            "../unidades/unidades.html";


                    break;






                    // Educação

                    case 3:


                        window.location.href =
                            "../educacao/educacao.html";


                    break;



                }



            }
        );


    }
);









// =========================================
// CARDS DE ACOMPANHAMENTO
// =========================================


const trackingCards =
    document.querySelectorAll(
        ".tracking-card"
    );



trackingCards.forEach(
    (card,index)=>{


        card.addEventListener(
            "click",
            ()=>{


                switch(index){



                    // Última avaliação

                    case 0:


                        window.location.href =
                            "../avaliacao/resultado.html";


                    break;






                    // UBS referência

                    case 1:


                        window.location.href =
                            "../unidades/detalhes.html";


                    break;






                    // Próxima ação

                    case 2:


                        window.location.href =
                            "../acompanhamento/acompanhamento.html";


                    break;



                }



            }
        );


    }
);









// =========================================
// FUTURA INTEGRAÇÃO API
// =========================================


/*

Exemplo futuro:


async function buscarUsuario(){


    const resposta =
        await fetch(
            "http://localhost:3000/api/usuario"
        );


    const dados =
        await resposta.json();



    usuario.nome =
        dados.nome;


    carregarUsuario();


}



buscarUsuario();



*/