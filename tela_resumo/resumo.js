// ==========================================
// GENSAÚDE SUS
// TELA DE RESUMO DA AVALIAÇÃO
// ==========================================


// ==========================================
// CARREGAR AVALIAÇÃO
// ==========================================

const ASSESSMENT_KEY =
    "gensaude_avaliacao_preventiva";


const dadosSalvos =
    localStorage.getItem(
        ASSESSMENT_KEY
    );


let avaliacao = null;



if (dadosSalvos) {

    try {

        avaliacao =
            JSON.parse(
                dadosSalvos
            );


    } catch (erro) {

        console.error(
            "Erro ao carregar avaliação:",
            erro
        );

    }

}





// ==========================================
// PREENCHER RESUMO
// ==========================================

function preencherResumo(){


    if(!avaliacao){

        return;

    }




    // ======================================
    // DADOS PESSOAIS
    // ======================================


    const dadosPessoais =
        avaliacao.dadosPessoais || {};



    preencherCampo(
        "resumoNome",
        dadosPessoais.nome
    );



    preencherCampo(
        "resumoIdade",
        calcularIdade(
            dadosPessoais.dataNascimento
        )
    );



    preencherCampo(
        "resumoSexo",
        dadosPessoais.sexo
    );



    preencherCampo(
        "resumoLocalizacao",
        `${dadosPessoais.cidade || "-"} - ${dadosPessoais.estado || "-"}`
    );







    // ======================================
    // HISTÓRICO FAMILIAR
    // ======================================


    const historico =
        avaliacao.historicoFamiliar || {};



    let historicoTexto = [];



    adicionarHistorico(
        "Mãe",
        historico.mae,
        historicoTexto
    );


    adicionarHistorico(
        "Pai",
        historico.pai,
        historicoTexto
    );


    adicionarHistorico(
        "Avós",
        historico.avos,
        historicoTexto
    );



    const complementares =
        historico.complementares || {};



    if(
        complementares.cancer === "sim"
    ){

        historicoTexto.push(
            "Histórico familiar de câncer"
        );

    }



    if(
        complementares.avc === "sim"
    ){

        historicoTexto.push(
            "Histórico familiar de AVC"
        );

    }



    if(
        complementares.doencaRenal === "sim"
    ){

        historicoTexto.push(
            "Histórico familiar de doença renal"
        );

    }



    if(
        complementares.hereditaria === "sim"
    ){

        historicoTexto.push(
            "Doença hereditária conhecida na família"
        );

    }



    preencherCampo(
        "resumoHistorico",
        historicoTexto.length
        ?
        historicoTexto.join("\n")
        :
        "Nenhuma condição informada"
    );







    // ======================================
    // ESTILO DE VIDA
    // ======================================


    const estilo =
        avaliacao.estiloDeVida || {};



    preencherCampo(
        "resumoAtividade",
        traduzirValor(
            estilo.atividadeFisica
        )
    );



    preencherCampo(
        "resumoAlimentacao",
        traduzirValor(
            estilo.alimentacao
        )
    );



    preencherCampo(
        "resumoSono",
        traduzirValor(
            estilo.sonoHoras
        )
    );



    preencherCampo(
        "resumoTabagismo",
        traduzirValor(
            estilo.fuma
        )
    );








    // ======================================
    // SINTOMAS E CONDIÇÕES
    // ======================================


    const sintomas =
        avaliacao.sintomasCondicoes || {};



    preencherCampo(
        "resumoCondicoes",
        formatarLista(
            sintomas.condicoes ||
            sintomas.condicoesSelecionadas
        )
    );



    preencherCampo(
        "resumoSintomas",
        formatarLista(
            sintomas.sintomas ||
            sintomas.sintomasSelecionados
        )
    );



}








// ==========================================
// HISTÓRICO FAMILIAR
// ==========================================


function adicionarHistorico(
    familiar,
    dados,
    lista
){


    if(!dados){

        return;

    }



    let condicoes = [];



    if(
        dados.diabetes === "sim"
    ){

        condicoes.push(
            "Diabetes"
        );

    }



    if(
        dados.hipertensao === "sim"
    ){

        condicoes.push(
            "Hipertensão"
        );

    }



    if(
        dados.cardiaca === "sim"
    ){

        condicoes.push(
            "Doença cardíaca"
        );

    }



    if(
        condicoes.length > 0
    ){

        lista.push(
            `${familiar}: ${condicoes.join(", ")}`
        );

    }


}








// ==========================================
// PREENCHER ELEMENTOS
// ==========================================


function preencherCampo(
    id,
    valor
){


    const elemento =
        document.getElementById(
            id
        );



    if(elemento){


        elemento.textContent =
            valor || "-";


    }


}








// ==========================================
// FORMATAR LISTAS
// ==========================================


function formatarLista(
    lista
){


    if(
        !lista
    ){

        return "Nenhum informado";

    }



    if(
        Array.isArray(lista)
    ){

        return lista.join(
            ", "
        );

    }



    return lista;


}








// ==========================================
// TRADUZIR VALORES
// ==========================================


function traduzirValor(
    valor
){


    const traducoes = {


        "3_mais_semana":
        "+3 vezes por semana",


        "1_2_semana":
        "1 a 2 vezes por semana",


        "nunca":
        "Nunca",


        "equilibrada":
        "Equilibrada",


        "moderada":
        "Moderada",


        "precisa_melhorar":
        "Precisa melhorar",


        "menos_5":
        "Menos de 5 horas por noite",


        "5_7":
        "5 a 7 horas por noite",


        "7_8":
        "7 a 8 horas por noite",


        "sim":
        "Sim",


        "nao":
        "Não",


        "as_vezes":
        "Às vezes"

    };



    return traducoes[valor]
        ||
        valor
        ||
        "-";


}








// ==========================================
// CALCULAR IDADE
// ==========================================


function calcularIdade(
    data
){


    if(!data){

        return "-";

    }



    const nascimento =
        new Date(data);



    const hoje =
        new Date();



    let idade =
        hoje.getFullYear()
        -
        nascimento.getFullYear();



    const mes =
        hoje.getMonth()
        -
        nascimento.getMonth();



    if(
        mes < 0 ||
        (
            mes === 0 &&
            hoje.getDate()
            <
            nascimento.getDate()
        )
    ){

        idade--;

    }



    return idade + " anos";


}








// ==========================================
// BOTÃO VOLTAR
// ==========================================


const backButton =
    document.querySelector(
        ".back-button"
    );



if(backButton){


    backButton.addEventListener(
        "click",
        ()=>{


            window.location.href =
            "../tela_sintomas_condicoes/sintomas_condicoes.html";


        }
    );


}








// ==========================================
// BOTÕES EDITAR
// ==========================================


const editButtons =
    document.querySelectorAll(
        ".box-title button"
    );



editButtons.forEach(
    (
        button,
        index
    )=>{


        button.addEventListener(
            "click",
            ()=>{


                const paginas = [

                    "../tela_prevencao/prevencao.html",

                    "../tela_historico_familiar/historico.html",

                    "../tela_estilo_vida/estilo_vida.html",

                    "../tela_sintomas_condicoes/sintomas_condicoes.html"

                ];



                window.location.href =
                    paginas[index];


            }
        );


    }
);








// ==========================================
// FINALIZAR
// ==========================================


const finishButton =
    document.querySelector(
        ".finish-button"
    );



if(finishButton){


    finishButton.addEventListener(
        "click",
        ()=>{


            alert(
                "Avaliação preventiva finalizada com sucesso!"
            );


            window.location.href =
            "../tela_inicio_logado/inicio_logado.html";


        }
    );


}








// ==========================================
// EXECUÇÃO
// ==========================================


preencherResumo();