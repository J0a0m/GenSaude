// ==========================================
// GENSAÚDE SUS
// TELA DE RESUMO DA AVALIAÇÃO
// ==========================================


// ==========================================
// CONFIGURAÇÕES
// ==========================================

const ASSESSMENT_KEY =
    "gensaude_avaliacao_preventiva";


const dadosSalvos =
    localStorage.getItem(
        ASSESSMENT_KEY
    );


let avaliacao =
    null;


// ==========================================
// CARREGAR AVALIAÇÃO
// ==========================================

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

function preencherResumo() {

    if (!avaliacao) {

        return;

    }


    // ======================================
    // DADOS PESSOAIS
    // ======================================

    const dadosPessoais =
        avaliacao.dadosPessoais ||
        {};


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
        traduzirSexo(
            dadosPessoais.sexo
        )
    );


    preencherCampo(
        "resumoLocalizacao",
        `${dadosPessoais.cidade || "-"} - ${dadosPessoais.estado || "-"}`
    );


    // ======================================
    // HISTÓRICO FAMILIAR
    // ======================================

    const historico =
        avaliacao.historicoFamiliar ||
        {};


    preencherCampo(
        "resumoHistorico",
        montarHistorico(
            historico
        )
    );


    // ======================================
    // ESTILO DE VIDA
    // ======================================

    const estilo =
        avaliacao.estiloDeVida ||
        {};


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
        avaliacao.sintomasCondicoes ||
        {};


    /*
        Primeiro tenta carregar os nomes usados
        atualmente pelo formulário.

        As opções seguintes mantêm compatibilidade
        com versões antigas do localStorage.
    */

    preencherCampo(
        "resumoCondicoes",
        formatarLista(
            sintomas.condicoesDiagnosticadas ||
            sintomas.condicoes ||
            sintomas.condicoesSelecionadas
        )
    );


    preencherCampo(
        "resumoSintomas",
        formatarLista(
            sintomas.sintomasRecentes ||
            sintomas.sintomas ||
            sintomas.sintomasSelecionados
        )
    );

}


// ==========================================
// MONTAR HISTÓRICO FAMILIAR
// ==========================================

function montarHistorico(
    historico
) {

    const resultado =
        [];


    adicionarFamiliar(
        "Mãe",
        historico.mae,
        resultado
    );


    adicionarFamiliar(
        "Pai",
        historico.pai,
        resultado
    );


    adicionarFamiliar(
        "Avós",
        historico.avos,
        resultado
    );


    const complementares =
        historico.complementares ||
        {};


    if (
        complementares.cancer ===
        "sim"
    ) {

        resultado.push(
            "Histórico familiar de câncer"
        );

    }


    if (
        complementares.avc ===
        "sim"
    ) {

        resultado.push(
            "Histórico familiar de AVC"
        );

    }


    if (
        complementares.doencaRenal ===
        "sim"
    ) {

        resultado.push(
            "Histórico familiar de doença renal"
        );

    }


    if (
        complementares.hereditaria ===
        "sim"
    ) {

        resultado.push(
            "Doença hereditária conhecida"
        );

    }


    return resultado.length > 0
        ? resultado.join("\n\n")
        : "Nenhuma condição informada";

}


// ==========================================
// ADICIONAR CONDIÇÕES DO FAMILIAR
// ==========================================

function adicionarFamiliar(
    nome,
    dados,
    lista
) {

    if (!dados) {

        return;

    }


    const condicoes =
        [];


    if (
        dados.diabetes ===
        "sim"
    ) {

        condicoes.push(
            "Diabetes"
        );

    }


    if (
        dados.hipertensao ===
        "sim"
    ) {

        condicoes.push(
            "Hipertensão"
        );

    }


    if (
        dados.cardiaca ===
        "sim"
    ) {

        condicoes.push(
            "Doença cardíaca"
        );

    }


    if (
        condicoes.length > 0
    ) {

        lista.push(
            `${nome}: ${condicoes.join(", ")}`
        );

    }

}


// ==========================================
// PREENCHER ELEMENTO
// ==========================================

function preencherCampo(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.textContent =
            valor || "-";

    }

}


// ==========================================
// FORMATAR LISTAS
// ==========================================

function formatarLista(
    lista
) {

    const traducoes = {

        diabetes:
            "Diabetes",

        hipertensao:
            "Hipertensão",

        colesterol_alto:
            "Colesterol alto",

        asma:
            "Asma",

        obesidade:
            "Obesidade",

        nenhuma:
            "Nenhuma",

        dor_cabeca:
            "Dor de cabeça",

        cansaco:
            "Cansaço",

        falta_ar:
            "Falta de ar",

        tontura:
            "Tontura",

        dor_peito:
            "Dor no peito",

        febre:
            "Febre"

    };


    if (!lista) {

        return "Nenhum informado";

    }


    if (
        Array.isArray(
            lista
        )
    ) {

        if (
            lista.length === 0
        ) {

            return "Nenhum informado";

        }


        return lista
            .map(
                (item) =>
                    traducoes[item] ||
                    item
            )
            .join(
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
) {

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

        "5_6":
            "5 a 6 horas por noite",

        "5_7":
            "5 a 7 horas por noite",

        "7_8":
            "7 a 8 horas por noite",

        "mais_8":
            "Mais de 8 horas por noite",

        "sim":
            "Sim",

        "nao":
            "Não",

        "as_vezes":
            "Às vezes",

        "socialmente":
            "Socialmente",

        "frequente":
            "Frequente"

    };


    return traducoes[valor] ||
        valor ||
        "-";

}


// ==========================================
// TRADUZIR SEXO
// ==========================================

function traduzirSexo(
    sexo
) {

    const valores = {

        masculino:
            "Masculino",

        feminino:
            "Feminino",

        outro:
            "Outro",

        nao_informar:
            "Prefiro não informar"

    };


    return valores[sexo] ||
        sexo ||
        "-";

}


// ==========================================
// CALCULAR IDADE
// ==========================================

function calcularIdade(
    data
) {

    if (!data) {

        return "-";

    }


    const partes =
        data.split("-");


    if (
        partes.length !== 3
    ) {

        return "-";

    }


    const anoNascimento =
        Number(
            partes[0]
        );


    const mesNascimento =
        Number(
            partes[1]
        ) - 1;


    const diaNascimento =
        Number(
            partes[2]
        );


    const nascimento =
        new Date(
            anoNascimento,
            mesNascimento,
            diaNascimento
        );


    if (
        Number.isNaN(
            nascimento.getTime()
        )
    ) {

        return "-";

    }


    const hoje =
        new Date();


    let idade =
        hoje.getFullYear() -
        nascimento.getFullYear();


    const diferencaMes =
        hoje.getMonth() -
        nascimento.getMonth();


    if (
        diferencaMes < 0 ||
        (
            diferencaMes === 0 &&
            hoje.getDate() <
                nascimento.getDate()
        )
    ) {

        idade--;

    }


    return `${idade} anos`;

}


// ==========================================
// EVENTO DO FOOTER - VOLTAR
// ==========================================

document.addEventListener(
    "avaliacao:voltar",
    (event) => {

        event.preventDefault();


        window.location.href =
            "../tela_sintomas_condicoes/sintomas_condicoes.html";

    }
);


// ==========================================
// BOTÕES DE EDIÇÃO
// ==========================================

const editButtons =
    document.querySelectorAll(
        ".box-title button"
    );


editButtons.forEach(
    (
        button,
        index
    ) => {

        button.addEventListener(
            "click",
            () => {

                const paginas = [

                    "../tela_prevencao/prevencao.html",

                    "../tela_historico_familiar/historico.html",

                    "../tela_estilo_vida/estilo_vida.html",

                    "../tela_sintomas_condicoes/sintomas_condicoes.html"

                ];


                const pagina =
                    paginas[index];


                if (pagina) {

                    window.location.href =
                        pagina;

                }

            }
        );

    }
);


// ==========================================
// EVENTO DO FOOTER - FINALIZAR
// ==========================================

document.addEventListener(
    "avaliacao:continuar",
    (event) => {

        event.preventDefault();


        finalizarAvaliacao();

    }
);


// ==========================================
// FINALIZAR AVALIAÇÃO
// ==========================================

function finalizarAvaliacao() {

    /*
        Nenhuma resposta é apagada.

        O objeto completo é mantido e recebe
        apenas os dados de finalização.
    */

    if (avaliacao) {

        const agora =
            new Date()
                .toISOString();


        avaliacao = {

            ...avaliacao,

            etapaAtual:
                5,

            finalizada:
                true,

            finalizadaEm:
                agora,

            atualizadoEm:
                agora

        };


        localStorage.setItem(
            ASSESSMENT_KEY,
            JSON.stringify(
                avaliacao
            )
        );

    }


    if (
        typeof definirAvaliacaoFooterCarregando ===
        "function"
    ) {

        definirAvaliacaoFooterCarregando(
            true
        );

    }


    alert(
        "Avaliação preventiva finalizada com sucesso!"
    );


    window.location.href =
        "../tela_inicio_logado/inicio_logado.html";

}


// ==========================================
// EXECUTAR
// ==========================================

preencherResumo();