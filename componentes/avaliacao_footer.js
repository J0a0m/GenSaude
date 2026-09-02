// ==========================================
// GENSAÚDE SUS
// COMPONENTE FOOTER AVALIAÇÃO PREVENTIVA
// ==========================================


document.addEventListener(
    "DOMContentLoaded",
    ()=>{


        const footer =
            document.getElementById(
                "avaliacao-footer"
            );


        if(!footer){

            return;

        }



        footer.innerHTML = `

        <div class="avaliacao-footer">


            <button 
                class="btn-avaliacao-voltar"
                type="button">

                ← Voltar

            </button>





            <div class="avaliacao-aviso">


                <img 
                src="../imagens/icone_seguranca.png"
                alt="Segurança">


                <p>

                Seus dados são utilizados exclusivamente
                para sua avaliação preventiva em saúde.

                </p>


            </div>





            <button 
                class="btn-avaliacao-continuar"
                type="button">

                Continuar →

            </button>



        </div>

        `;



        const voltar =
            document.querySelector(
                ".btn-avaliacao-voltar"
            );



        const continuar =
            document.querySelector(
                ".btn-avaliacao-continuar"
            );




        if(voltar){


            voltar.addEventListener(
                "click",
                ()=>{


                    history.back();


                }
            );


        }





        if(continuar){


            continuar.addEventListener(
                "click",
                ()=>{


                    const proximaTela =
                        footer.dataset.next;



                    if(proximaTela){


                        window.location.href =
                            proximaTela;


                    }


                }
            );


        }



    }

);