// ==========================================
// GENSAÚDE SUS
// PÁGINA INICIAL LOGADA
// ==========================================

(function () {

    "use strict";


    // ======================================
    // CHAVES DO LOCALSTORAGE
    // ======================================

    const ASSESSMENT_KEY =
        "gensaude_avaliacao_preventiva";

    const ADDRESS_LOCATION_CACHE_KEY =
        "gensaude_localizacao_endereco";

    const CEP_LOCATION_CACHE_KEY =
        "gensaude_localizacao_cep";


    // ======================================
    // CONFIGURAÇÕES
    // ======================================

    const MESES_PARA_PROXIMA_AVALIACAO = 3;


    // ======================================
    // ROTAS
    // ======================================

    const LOGIN_PAGE =
        "../tela_login/login.html";

    const PREVENTION_PAGE =
        "../tela_prevencao/prevencao.html";

    const FAMILY_HISTORY_PAGE =
        "../tela_historico_familiar/historico.html";

    const LIFESTYLE_PAGE =
        "../tela_estilo_vida/estilo_vida.html";

    const SYMPTOMS_PAGE =
        "../tela_sintomas_condicoes/sintomas_condicoes.html";

    const SUMMARY_PAGE =
        "../tela_resumo/resumo.html";

    const RESULT_PAGE =
        "../tela_resultado_avaliacao/resultado_avaliacao.html";

    const UBS_UPA_PAGE =
        "../tela_ubs_upa/ubs_upa.html";

    const UNITS_PAGE =
        "../tela_unidades/unidades.html";

    const EDUCATION_PAGE =
        "../tela_educacao/educacao.html";


    // ======================================
    // UBS DE TABOÃO DA SERRA
    // ======================================

    const UBS_TABOAO_DA_SERRA = [

        {
            id: "ubs-margaridas",

            nome:
                "UBS Jardim das Margaridas",

            latitude:
                -23.627157990647,

            longitude:
                -46.809801024762,

            endereco:
                "Rua Paulo Augusto de Andrade, 400 - Jardim das Margaridas"
        },

        {
            id: "ubs-record",

            nome:
                "UBS Jardim Record/Ponte Alta",

            latitude:
                -23.625943997701,

            longitude:
                -46.791471981812,

            endereco:
                "Rua Imaruí, 47 - Jardim Record"
        },

        {
            id: "ubs-parque-pinheiros",

            nome:
                "UBS Parque Pinheiros/CSU",

            latitude:
                -23.631478987463,

            longitude:
                -46.782866030365,

            endereco:
                "Avenida Laurita Ortega Mari, 2131 - Parque Pinheiros"
        },

        {
            id: "ubs-maria-jose",

            nome:
                "UBS Dra. Maria José de Albuquerque",

            latitude:
                -23.606005000698,

            longitude:
                -46.762500017305,

            endereco:
                "Rua José Mari, 13 - Parque Assunção"
        },

        {
            id: "ubs-oliveiras",

            nome:
                "UBS Oliveiras/Marabá",

            latitude:
                -23.624749995593,

            longitude:
                -46.774671965639,

            endereco:
                "Rua Maria Inês, 34 - Jardim das Oliveiras"
        },

        {
            id: "ubs-santo-onofre",

            nome:
                "UBS Santo Onofre",

            latitude:
                -23.638920692559,

            longitude:
                -46.804707761297,

            endereco:
                "Rua Marechal Artur da Costa e Silva, 85 - Pirajuçara"
        },

        {
            id: "ubs-silvio-sampaio",

            nome:
                "UBS Sílvio Sampaio",

            latitude:
                -23.643916771819,

            longitude:
                -46.790302735687,

            endereco:
                "Rua Enaura Maria da Conceição, 276 - Jardim Sílvio Sampaio"
        },

        {
            id: "ubs-santa-cecilia",

            nome:
                "UBS Santa Cecília",

            latitude:
                -23.623368993226,

            longitude:
                -46.787188996927,

            endereco:
                "Rua Henrique de Moraes Camargo, 143 - Jardim Santa Cecília"
        },

        {
            id: "ubs-suina",

            nome:
                "UBS Jardim Suiná",

            latitude:
                -23.639271783704,

            longitude:
                -46.79216090443,

            endereco:
                "Rua Albano Leite da Fonseca, 111 - Jardim Suiná"
        },

        {
            id: "ubs-salete",

            nome:
                "UBS Jardim Salete",

            latitude:
                -23.626140008506,

            longitude:
                -46.80133999642,

            endereco:
                "Rua Constantino Dias Lopes, 181 - Jardim Salete"
        },

        {
            id: "ubs-panorama",

            nome:
                "UBS Panorama",

            latitude:
                -23.636496981437,

            longitude:
                -46.806650015901,

            endereco:
                "Rua Miguel Carlos Silva, 380 - Jardim Panorama"
        },

        {
            id: "ubs-tania-regina",

            nome:
                "UBS Dra. Tânia Regina dos Santos Andrade",

            latitude:
                -23.608206239163,

            longitude:
                -46.775906602679,

            endereco:
                "Rua Uruguai, 73 - Jardim América"
        },

        {
            id: "ubs-clementino",

            nome:
                "UBS Jardim Clementino",

            latitude:
                -23.635075997391,

            longitude:
                -46.785781004832,

            endereco:
                "Rua Tsuruki Tsuno, 104 - Jardim Clementino"
        },

        {
            id: "ubs-laguna",

            nome:
                "UBS Parque Laguna",

            latitude:
                -23.61358299554,

            longitude:
                -46.796156962773,

            endereco:
                "Rua Ida Romissi Gasparineti, 381 - Parque Laguna"
        }

    ];


    // ======================================
    // ELEMENTOS
    // ======================================

    const firstName =
        document.getElementById(
            "firstName"
        );

    const assessmentButton =
        document.getElementById(
            "assessmentButton"
        );

    const historyCard =
        document.getElementById(
            "historyCard"
        );

    const ubsCard =
        document.getElementById(
            "ubsCard"
        );

    const unitsCard =
        document.getElementById(
            "unitsCard"
        );

    const educationCard =
        document.getElementById(
            "educationCard"
        );

    const lastAssessmentCard =
        document.getElementById(
            "lastAssessmentCard"
        );

    const referenceUnitCard =
        document.getElementById(
            "referenceUnitCard"
        );

    const nextActionCard =
        document.getElementById(
            "nextActionCard"
        );


    // ======================================
    // VARIÁVEIS
    // ======================================

    let sessao = null;

    let avaliacaoAtual = null;

    let ubsMaisProxima = null;


    iniciarPagina();


    // ======================================
    // INICIAR PÁGINA
    // ======================================

    function iniciarPagina() {

        if (
            typeof getSessao ===
            "function"
        ) {

            sessao =
                getSessao();

        }


        if (!sessao) {

            window.location.href =
                LOGIN_PAGE;

            return;

        }


        avaliacaoAtual =
            carregarAvaliacao();


        carregarNomeDoUsuario();

        atualizarBotaoDaAvaliacao();

        atualizarUltimaAvaliacao();

        atualizarUbsMaisProxima();

        atualizarProximaAvaliacao();

        configurarEventos();

    }


    // ======================================
    // CARREGAR NOME
    // ======================================

    function carregarNomeDoUsuario() {

        const nomeCompleto =
            String(
                sessao.nome ||
                "Usuário"
            ).trim();


        const primeiroNome =
            nomeCompleto
                .split(/\s+/)[0];


        if (firstName) {

            firstName.textContent =
                primeiroNome;

        }

    }


    // ======================================
    // CARREGAR AVALIAÇÃO
    // ======================================

    function carregarAvaliacao() {

        const dadosSalvos =
            localStorage.getItem(
                ASSESSMENT_KEY
            );


        if (!dadosSalvos) {

            return null;

        }


        try {

            const avaliacao =
                JSON.parse(
                    dadosSalvos
                );


            if (
                avaliacao.usuarioId &&

                String(
                    avaliacao.usuarioId
                ) !==
                String(
                    sessao.id
                )
            ) {

                return null;

            }


            return avaliacao;

        } catch (erro) {

            console.error(
                "Não foi possível carregar a avaliação:",
                erro
            );


            return null;

        }

    }


    // ======================================
    // AVALIAÇÃO FINALIZADA
    // ======================================

    function avaliacaoEstaFinalizada() {

        return Boolean(

            avaliacaoAtual &&

            avaliacaoAtual.finalizada ===
                true

        );

    }


    // ======================================
    // BOTÃO DA AVALIAÇÃO
    // ======================================

    function atualizarBotaoDaAvaliacao() {

        if (!assessmentButton) {

            return;

        }


        const texto =
            assessmentButton.querySelector(
                "span"
            );


        if (!texto) {

            return;

        }


        if (
            avaliacaoEstaFinalizada()
        ) {

            texto.textContent =
                "Ver resultado";

            return;

        }


        if (avaliacaoAtual) {

            texto.textContent =
                "Continuar avaliação";

            return;

        }


        texto.textContent =
            "Iniciar avaliação";

    }


    // ======================================
    // ÚLTIMA AVALIAÇÃO
    // ======================================

    function atualizarUltimaAvaliacao() {

        if (!lastAssessmentCard) {

            return;

        }


        const resultado =
            lastAssessmentCard.querySelector(
                ".tracking-content strong"
            );

        const detalhe =
            lastAssessmentCard.querySelector(
                ".tracking-detail"
            );


        if (
            !resultado ||
            !detalhe
        ) {

            return;

        }


        resultado.classList.remove(
            "tracking-danger",
            "tracking-primary",
            "tracking-success"
        );


        if (
            !avaliacaoEstaFinalizada()
        ) {

            resultado.textContent =
                "Nenhuma avaliação concluída";

            resultado.classList.add(
                "tracking-primary"
            );

            detalhe.textContent =
                "Realize sua primeira avaliação";

            return;

        }


        const nivel =
            avaliacaoAtual
                .resultado
                ?.nivel || "attention";


        const configuracoes = {

            healthy: {

                texto:
                    "Cuidados em dia",

                classe:
                    "tracking-success"

            },

            attention: {

                texto:
                    "Atenção recomendada",

                classe:
                    "tracking-danger"

            },

            priority: {

                texto:
                    "Procure atendimento",

                classe:
                    "tracking-danger"

            }

        };


        const configuracao =
            configuracoes[nivel] ||
            configuracoes.attention;


        resultado.textContent =
            configuracao.texto;

        resultado.classList.add(
            configuracao.classe
        );


        const dataDaAvaliacao =
            avaliacaoAtual.finalizadaEm ||
            avaliacaoAtual.atualizadoEm;


        detalhe.textContent =
            dataDaAvaliacao
                ? `Realizada em ${formatarData(
                    dataDaAvaliacao
                )}`
                : "Avaliação concluída";

    }


    // ======================================
    // UBS MAIS PRÓXIMA
    // ======================================

    function atualizarUbsMaisProxima() {

        if (!referenceUnitCard) {

            return;

        }


        const rotulo =
            referenceUnitCard.querySelector(
                ".tracking-label"
            );

        const nome =
            referenceUnitCard.querySelector(
                ".tracking-content strong"
            );

        const detalhe =
            referenceUnitCard.querySelector(
                ".tracking-detail"
            );


        if (rotulo) {

            rotulo.textContent =
                "UBS mais próxima";

        }


        if (
            !nome ||
            !detalhe
        ) {

            return;

        }


        ubsMaisProxima =
            encontrarUbsMaisProxima();


        if (!ubsMaisProxima) {

            nome.textContent =
                "Localize uma UBS";

            detalhe.textContent =
                "Consulte as unidades próximas";

            return;

        }


        nome.textContent =
            ubsMaisProxima.nome;


        detalhe.textContent =
            `${ubsMaisProxima.endereco} • ` +
            `${formatarDistancia(
                ubsMaisProxima.distancia
            )} em linha reta`;

    }


    // ======================================
    // ENCONTRAR UBS MAIS PRÓXIMA
    // ======================================

    function encontrarUbsMaisProxima() {

        if (!avaliacaoAtual) {

            return null;

        }


        const dadosPessoais =
            avaliacaoAtual
                .dadosPessoais || {};


        const cidade =
            normalizarTexto(
                dadosPessoais.cidade
            );


        if (
            cidade !==
            "taboao da serra"
        ) {

            return null;

        }


        const localizacao =
            obterLocalizacaoSalva(
                dadosPessoais
            );


        if (!localizacao) {

            return null;

        }


        const unidadesComDistancia =
            UBS_TABOAO_DA_SERRA.map(
                (ubs) => {

                    return {

                        ...ubs,

                        distancia:
                            calcularDistancia(
                                localizacao.latitude,
                                localizacao.longitude,
                                ubs.latitude,
                                ubs.longitude
                            )

                    };

                }
            );


        unidadesComDistancia.sort(
            (primeira, segunda) => {

                return (

                    primeira.distancia -
                    segunda.distancia

                );

            }
        );


        return (
            unidadesComDistancia[0] ||
            null
        );

    }


    // ======================================
    // OBTER LOCALIZAÇÃO SALVA
    // ======================================

    function obterLocalizacaoSalva(
        dadosPessoais
    ) {

        const enderecoCache =
            lerObjetoLocalStorage(
                ADDRESS_LOCATION_CACHE_KEY
            );


        const chaveDoEndereco =
            montarChaveDoEndereco(
                dadosPessoais
            );


        if (
            enderecoCache &&

            Number.isFinite(
                Number(
                    enderecoCache.latitude
                )
            ) &&

            Number.isFinite(
                Number(
                    enderecoCache.longitude
                )
            ) &&

            (
                !enderecoCache.chave ||
                enderecoCache.chave ===
                    chaveDoEndereco
            )
        ) {

            return {

                latitude:
                    Number(
                        enderecoCache.latitude
                    ),

                longitude:
                    Number(
                        enderecoCache.longitude
                    )

            };

        }


        const cep =
            String(
                dadosPessoais.cep || ""
            ).replace(
                /\D/g,
                ""
            );


        const cepCache =
            lerObjetoLocalStorage(
                CEP_LOCATION_CACHE_KEY
            );


        if (
            cepCache &&

            String(
                cepCache.cep || ""
            ) === cep &&

            Number.isFinite(
                Number(
                    cepCache.latitude
                )
            ) &&

            Number.isFinite(
                Number(
                    cepCache.longitude
                )
            )
        ) {

            return {

                latitude:
                    Number(
                        cepCache.latitude
                    ),

                longitude:
                    Number(
                        cepCache.longitude
                    )

            };

        }


        return null;

    }


    // ======================================
    // MONTAR CHAVE DO ENDEREÇO
    // ======================================

    function montarChaveDoEndereco(
        dados
    ) {

        return [

            dados.logradouro ||
            dados.rua ||
            "",

            dados.numero ||
            "",

            dados.bairro ||
            "",

            dados.cidade ||
            "",

            dados.estado ||
            "",

            String(
                dados.cep || ""
            ).replace(
                /\D/g,
                ""
            )

        ]
            .map(
                (valor) => {

                    return String(
                        valor
                    ).trim();

                }
            )
            .join("|")
            .toLowerCase();

    }


    // ======================================
    // PRÓXIMA AVALIAÇÃO
    // ======================================

    function atualizarProximaAvaliacao() {

        if (!nextActionCard) {

            return;

        }


        const rotulo =
            nextActionCard.querySelector(
                ".tracking-label"
            );

        const titulo =
            nextActionCard.querySelector(
                ".tracking-content strong"
            );

        const detalhe =
            nextActionCard.querySelector(
                ".tracking-detail"
            );


        if (rotulo) {

            rotulo.textContent =
                "Próxima avaliação";

        }


        if (
            !titulo ||
            !detalhe
        ) {

            return;

        }


        if (
            !avaliacaoEstaFinalizada()
        ) {

            titulo.textContent =
                "Concluir avaliação";

            detalhe.textContent =
                "A recomendação aparecerá após a conclusão";

            return;

        }


        const dataBase =
            avaliacaoAtual.finalizadaEm ||
            avaliacaoAtual.atualizadoEm;


        const proximaData =
            calcularProximaData(
                dataBase
            );


        titulo.textContent =
            "Reavaliação preventiva";


        detalhe.textContent =
            proximaData
                ? `Recomendada para ${formatarData(
                    proximaData
                )}`
                : "Recomendada em três meses";

    }


    // ======================================
    // CALCULAR PRÓXIMA DATA
    // ======================================

    function calcularProximaData(
        dataOriginal
    ) {

        const data =
            new Date(
                dataOriginal
            );


        if (
            Number.isNaN(
                data.getTime()
            )
        ) {

            return null;

        }


        const diaOriginal =
            data.getDate();


        data.setDate(1);


        data.setMonth(

            data.getMonth() +
            MESES_PARA_PROXIMA_AVALIACAO

        );


        const ultimoDiaDoMes =
            new Date(

                data.getFullYear(),

                data.getMonth() + 1,

                0

            ).getDate();


        data.setDate(

            Math.min(
                diaOriginal,
                ultimoDiaDoMes
            )

        );


        return data;

    }


    // ======================================
    // ROTA DA AVALIAÇÃO
    // ======================================

    function obterRotaDaAvaliacao() {

        if (
            avaliacaoEstaFinalizada()
        ) {

            return RESULT_PAGE;

        }


        if (!avaliacaoAtual) {

            return PREVENTION_PAGE;

        }


        const etapaAtual =
            Number(
                avaliacaoAtual.etapaAtual ||
                1
            );


        const rotasPorEtapa = {

            1:
                PREVENTION_PAGE,

            2:
                FAMILY_HISTORY_PAGE,

            3:
                LIFESTYLE_PAGE,

            4:
                SYMPTOMS_PAGE,

            5:
                SUMMARY_PAGE

        };


        return (

            rotasPorEtapa[etapaAtual] ||
            PREVENTION_PAGE

        );

    }


    // ======================================
    // CONFIGURAR EVENTOS
    // ======================================

    function configurarEventos() {

        if (assessmentButton) {

            assessmentButton.addEventListener(
                "click",
                () => {

                    window.location.href =
                        obterRotaDaAvaliacao();

                }
            );

        }


        if (historyCard) {

            historyCard.addEventListener(
                "click",
                () => {

                    window.location.href =
                        avaliacaoAtual
                            ? FAMILY_HISTORY_PAGE
                            : PREVENTION_PAGE;

                }
            );

        }


        if (ubsCard) {

            ubsCard.addEventListener(
                "click",
                () => {

                    window.location.href =
                        UBS_UPA_PAGE;

                }
            );

        }


        if (unitsCard) {

            unitsCard.addEventListener(
                "click",
                () => {

                    window.location.href =
                        UNITS_PAGE;

                }
            );

        }


        if (educationCard) {

            educationCard.addEventListener(
                "click",
                () => {

                    window.location.href =
                        EDUCATION_PAGE;

                }
            );

        }


        if (lastAssessmentCard) {

            lastAssessmentCard.addEventListener(
                "click",
                () => {

                    window.location.href =
                        avaliacaoEstaFinalizada()
                            ? RESULT_PAGE
                            : obterRotaDaAvaliacao();

                }
            );

        }


        if (referenceUnitCard) {

            referenceUnitCard.addEventListener(
                "click",
                () => {

                    window.location.href =
                        UNITS_PAGE;

                }
            );

        }


        if (nextActionCard) {

            nextActionCard.addEventListener(
                "click",
                () => {

                    window.location.href =
                        avaliacaoEstaFinalizada()
                            ? RESULT_PAGE
                            : obterRotaDaAvaliacao();

                }
            );

        }

    }


    // ======================================
    // LER OBJETO DO LOCALSTORAGE
    // ======================================

    function lerObjetoLocalStorage(
        chave
    ) {

        const valor =
            localStorage.getItem(
                chave
            );


        if (!valor) {

            return null;

        }


        try {

            return JSON.parse(
                valor
            );

        } catch (erro) {

            return null;

        }

    }


    // ======================================
    // FORMATAR DATA
    // ======================================

    function formatarData(
        valor
    ) {

        const data =
            valor instanceof Date
                ? valor
                : new Date(valor);


        if (
            Number.isNaN(
                data.getTime()
            )
        ) {

            return "-";

        }


        return data.toLocaleDateString(
            "pt-BR",
            {

                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric"

            }
        );

    }


    // ======================================
    // CALCULAR DISTÂNCIA
    // ======================================

    function calcularDistancia(

        latitudeInicial,

        longitudeInicial,

        latitudeFinal,

        longitudeFinal

    ) {

        const raioDaTerra =
            6371;


        const diferencaLatitude =
            grausParaRadianos(

                latitudeFinal -
                latitudeInicial

            );


        const diferencaLongitude =
            grausParaRadianos(

                longitudeFinal -
                longitudeInicial

            );


        const calculo =

            Math.sin(
                diferencaLatitude / 2
            ) ** 2 +

            Math.cos(
                grausParaRadianos(
                    latitudeInicial
                )
            ) *

            Math.cos(
                grausParaRadianos(
                    latitudeFinal
                )
            ) *

            Math.sin(
                diferencaLongitude / 2
            ) ** 2;


        const angulo =

            2 *

            Math.atan2(

                Math.sqrt(
                    calculo
                ),

                Math.sqrt(
                    1 - calculo
                )

            );


        return (
            raioDaTerra *
            angulo
        );

    }


    // ======================================
    // GRAUS PARA RADIANOS
    // ======================================

    function grausParaRadianos(
        graus
    ) {

        return (

            graus *
            Math.PI /
            180

        );

    }


    // ======================================
    // FORMATAR DISTÂNCIA
    // ======================================

    function formatarDistancia(
        distancia
    ) {

        if (
            !Number.isFinite(
                distancia
            )
        ) {

            return "";

        }


        if (
            distancia < 1
        ) {

            return (

                Math.round(
                    distancia * 1000
                ) +
                " m"

            );

        }


        return (

            distancia
                .toFixed(1)
                .replace(
                    ".",
                    ","
                ) +
            " km"

        );

    }


    // ======================================
    // NORMALIZAR TEXTO
    // ======================================

    function normalizarTexto(
        valor
    ) {

        return String(
            valor || ""
        )
            .normalize(
                "NFD"
            )
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim();

    }

})();