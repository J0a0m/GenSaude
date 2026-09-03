// ==========================================
// GENSAÚDE SUS
// TELA DE RESUMO DA AVALIAÇÃO
// ==========================================

(function () {
    "use strict";

    const ASSESSMENT_KEY =
        "gensaude_avaliacao_preventiva";

    const PREVENTION_PAGE =
        "../tela_prevencao/prevencao.html";

    const FAMILY_PAGE =
        "../tela_historico_familiar/historico.html";

    const LIFESTYLE_PAGE =
        "../tela_estilo_vida/estilo_vida.html";

    const SYMPTOMS_PAGE =
        "../tela_sintomas_condicoes/sintomas_condicoes.html";

    const RESULT_PAGE =
        "../tela_resultado_avaliacao/resultado_avaliacao.html";


    let avaliacao =
        carregarAvaliacao();


    preencherResumo();

    configurarEventos();


    // ==========================================
    // CARREGAR AVALIAÇÃO
    // ==========================================

    function carregarAvaliacao() {

        const dados =
            localStorage.getItem(
                ASSESSMENT_KEY
            );


        if (!dados) {

            return null;

        }


        try {

            return JSON.parse(
                dados
            );

        } catch (erro) {

            console.error(
                "Erro ao carregar avaliação:",
                erro
            );


            return null;

        }

    }


    // ==========================================
    // PREENCHER RESUMO
    // ==========================================

    function preencherResumo() {

        if (!avaliacao) {

            return;

        }


        preencherLocalizacao();

        preencherHistoricoFamiliar();

        preencherEstiloDeVida();

        preencherSintomasECondicoes();

    }


    // ==========================================
    // LOCALIZAÇÃO
    // ==========================================

    function preencherLocalizacao() {

        const dados =
            avaliacao.dadosPessoais ||
            {};


        preencherCampo(
            "resumoCep",
            formatarCep(
                dados.cep
            )
        );


        preencherCampo(
            "resumoEndereco",
            montarEndereco(
                dados
            )
        );


        preencherCampo(
            "resumoBairro",
            dados.bairro
        );


        const cidadeEstado = [

            dados.cidade,

            dados.estado

        ]
            .filter(Boolean)
            .join(" - ");


        preencherCampo(
            "resumoLocalizacao",
            cidadeEstado
        );

    }


    // ==========================================
    // HISTÓRICO FAMILIAR
    // ==========================================

    function preencherHistoricoFamiliar() {

        const historico =
            avaliacao.historicoFamiliar ||
            {};


        preencherCampo(
            "resumoHistorico",
            montarHistorico(
                historico
            )
        );

    }


    // ==========================================
    // ESTILO DE VIDA
    // ==========================================

    function preencherEstiloDeVida() {

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

    }


    // ==========================================
    // SINTOMAS E CONDIÇÕES
    // ==========================================

    function preencherSintomasECondicoes() {

        const dados =
            avaliacao.sintomasCondicoes ||
            {};


        preencherCampo(
            "resumoCondicoes",
            formatarLista(

                dados.condicoesDiagnosticadas ||

                dados.condicoes ||

                dados.condicoesSelecionadas

            )
        );


        preencherCampo(
            "resumoSintomas",
            formatarLista(

                dados.sintomasRecentes ||

                dados.sintomas ||

                dados.sintomasSelecionados

            )
        );

    }


    // ==========================================
    // FORMATAR CEP
    // ==========================================

    function formatarCep(
        cep
    ) {

        const numeros =
            String(
                cep || ""
            ).replace(
                /\D/g,
                ""
            );


        if (
            numeros.length !== 8
        ) {

            return cep || "-";

        }


        return numeros.replace(
            /(\d{5})(\d{3})/,
            "$1-$2"
        );

    }


    // ==========================================
    // MONTAR ENDEREÇO
    // ==========================================

    function montarEndereco(
        dados
    ) {

        const logradouro =

            dados.logradouro ||

            dados.rua ||

            "";


        const numero =
            dados.numero ||
            "";


        const complemento =
            dados.complemento ||
            "";


        const partes = [];


        if (logradouro) {

            partes.push(

                numero

                    ? `${logradouro}, ${numero}`

                    : logradouro

            );

        }


        if (complemento) {

            partes.push(
                complemento
            );

        }


        return partes.join(
            " - "
        ) || "-";

    }


    // ==========================================
    // MONTAR HISTÓRICO
    // ==========================================

    function montarHistorico(
        historico
    ) {

        const resultado = [];


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


        const regras = [

            [
                "cancer",
                "Histórico familiar de câncer"
            ],

            [
                "avc",
                "Histórico familiar de AVC"
            ],

            [
                "doencaRenal",
                "Histórico familiar de doença renal"
            ],

            [
                "hereditaria",
                "Doença hereditária conhecida"
            ]

        ];


        regras.forEach(
            (regra) => {

                if (
                    complementares[
                        regra[0]
                    ] === "sim"
                ) {

                    resultado.push(
                        regra[1]
                    );

                }

            }
        );


        return resultado.length

            ? resultado.join("\n\n")

            : "Nenhuma condição informada";

    }


    // ==========================================
    // ADICIONAR FAMILIAR
    // ==========================================

    function adicionarFamiliar(
        nome,
        dados,
        lista
    ) {

        if (!dados) {

            return;

        }


        const condicoes = [];


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
    // FORMATAR LISTA
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


        if (
            !Array.isArray(
                lista
            ) ||
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
            .join(", ");

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

            nunca:
                "Nunca",

            equilibrada:
                "Equilibrada",

            moderada:
                "Moderada",

            precisa_melhorar:
                "Precisa melhorar",

            menos_5:
                "Menos de 5 horas por noite",

            "5_6":
                "5 a 6 horas por noite",

            "5_7":
                "5 a 7 horas por noite",

            "7_8":
                "7 a 8 horas por noite",

            mais_8:
                "Mais de 8 horas por noite",

            sim:
                "Sim",

            nao:
                "Não",

            as_vezes:
                "Às vezes",

            socialmente:
                "Socialmente",

            frequente:
                "Frequente"

        };


        return (

            traducoes[valor] ||

            valor ||

            "-"

        );

    }


    // ==========================================
    // PREENCHER CAMPO
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
    // CONFIGURAR EVENTOS
    // ==========================================

    function configurarEventos() {

        document.addEventListener(
            "avaliacao:voltar",
            (event) => {

                event.preventDefault();


                window.location.href =
                    SYMPTOMS_PAGE;

            }
        );


        document.addEventListener(
            "avaliacao:continuar",
            (event) => {

                event.preventDefault();

                finalizarAvaliacao();

            }
        );


        const editButtons =
            document.querySelectorAll(
                ".box-title button"
            );


        const paginas = [

            PREVENTION_PAGE,

            FAMILY_PAGE,

            LIFESTYLE_PAGE,

            SYMPTOMS_PAGE

        ];


        editButtons.forEach(
            (
                button,
                index
            ) => {

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            paginas[index]
                        ) {

                            window.location.href =
                                paginas[index];

                        }

                    }
                );

            }
        );

    }


    // ==========================================
    // FINALIZAR AVALIAÇÃO
    // ==========================================

    function finalizarAvaliacao() {

        if (!avaliacao) {

            window.location.href =
                PREVENTION_PAGE;

            return;

        }


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


        if (
            typeof definirAvaliacaoFooterCarregando ===
            "function"
        ) {

            definirAvaliacaoFooterCarregando(
                true
            );

        }


        window.location.href =
            RESULT_PAGE;

    }

})();