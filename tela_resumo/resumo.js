// ==========================================
// ELEMENTOS
// ==========================================


const backButton =
    document.querySelector(".back-button");


const finishButton =
    document.querySelector(".finish-button");


const editButtons =
    document.querySelectorAll(
        ".box-title button"
    );



// ==========================================
// VOLTAR
// ==========================================


if (backButton) {

    backButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "../tela_sintomas_condicoes/sintomas.html";

        }
    );

}



// ==========================================
// EDITAR INFORMAÇÕES
// ==========================================


editButtons.forEach(
    (button, index) => {


        button.addEventListener(
            "click",
            () => {


                switch(index){


                    case 0:

                        window.location.href =
                            "../tela_prevencao/prevencao.html";

                    break;



                    case 1:

                        window.location.href =
                            "../tela_estilo_vida/estilo_vida.html";

                    break;



                    case 2:

                        window.location.href =
                            "../tela_sintomas_condicoes/sintomas.html";

                    break;


                }


            }
        );


    }
);



// ==========================================
// FINALIZAR AVALIAÇÃO
// ==========================================


if (finishButton) {


    finishButton.addEventListener(
        "click",
        () => {


            /*
                FUTURAMENTE:

                Aqui será enviado:
                
                - dados pessoais
                - histórico familiar
                - estilo de vida
                - sintomas

                para o banco de dados.

            */


            alert(
                "Avaliação preventiva finalizada com sucesso!"
            );



            window.location.href =
                "../tela_inicio_logado/inicio_logado.html";


        }
    );


}