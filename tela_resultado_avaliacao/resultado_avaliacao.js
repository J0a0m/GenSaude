// =========================================================
// GENSAÚDE SUS - RESULTADO DA AVALIAÇÃO PREVENTIVA
// =========================================================

(function () {
    "use strict";

    const ASSESSMENT_KEY = "gensaude_avaliacao_preventiva";
    const LOGIN_DESTINATION_KEY = "gensaude_destino_apos_login";
    const CEP_LOCATION_CACHE_KEY = "gensaude_localizacao_cep";

    const LOGIN_PAGE = "../tela_login/login.html";
    const FIRST_PAGE = "../tela_prevencao/prevencao.html";
    const UNITS_PAGE = "../tela_unidades/unidades.html";

    const OVERPASS_ENDPOINTS = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter"
    ];

    const SEARCH_RADII_METERS = [
        5000,
        10000,
        20000
    ];

    const MAX_SEARCH_RADIUS_KM =
        SEARCH_RADII_METERS[
            SEARCH_RADII_METERS.length - 1
        ] / 1000;

    // Apenas os três fatores mais importantes aparecem.
    const MAX_VISIBLE_FACTORS = 3;

    const elements = {
        card: document.getElementById(
            "healthResultCard"
        ),

        image: document.querySelector(
            ".result-status-image img"
        ),

        title: document.getElementById(
            "resultStatusTitle"
        ),

        description: document.getElementById(
            "resultStatusDescription"
        ),

        factorsList: document.getElementById(
            "identifiedFactorsList"
        ),

        noFactors: document.getElementById(
            "noFactorsMessage"
        ),

        guidance: document.getElementById(
            "careGuidanceText"
        ),

        retakeButton: document.getElementById(
            "retakeAssessmentButton"
        ),

        findUnitButton: document.getElementById(
            "findReferenceUnitButton"
        ),

        viewUnitsButton: document.getElementById(
            "viewAllUnitsButton"
        ),

        map: document.getElementById(
            "nearbyUnitsMap"
        ),

        mapStatus: document.getElementById(
            "mapStatus"
        ),

        mapStatusText: document.getElementById(
            "mapStatusText"
        ),

        mapLoader: document.getElementById(
            "mapLoader"
        ),

        unitsList: document.getElementById(
            "nearbyUnitsList"
        )
    };

    let sessao = null;
    let avaliacao = null;

    let mapa = null;
    let camadaDeUnidades = null;
    let marcadorUsuario = null;
    let circuloPrecisao = null;

    let unidadesProximas = [];
    let marcadorUbsMaisProxima = null;

    iniciarPagina();

    // =====================================================
    // INICIALIZAÇÃO
    // =====================================================

    function iniciarPagina() {
        if (typeof getSessao === "function") {
            sessao = getSessao();
        }

        if (!sessao) {
            localStorage.setItem(
                LOGIN_DESTINATION_KEY,
                "../tela_resultado_avaliacao/resultado_avaliacao.html"
            );

            window.location.href = LOGIN_PAGE;
            return;
        }

        avaliacao = carregarAvaliacao();

        const avaliacaoValida =
            avaliacao &&
            String(avaliacao.usuarioId) ===
                String(sessao.id) &&
            avaliacao.finalizada === true;

        if (!avaliacaoValida) {
            window.location.href = FIRST_PAGE;
            return;
        }

        const resultado = calcularResultado();

        exibirResultado(resultado);
        salvarResultado(resultado);
        configurarEventos();
        iniciarMapa();
    }

    function carregarAvaliacao() {
        const dados = localStorage.getItem(
            ASSESSMENT_KEY
        );

        if (!dados) {
            return null;
        }

        try {
            return JSON.parse(dados);
        } catch (erro) {
            console.error(
                "Erro ao carregar avaliação:",
                erro
            );

            return null;
        }
    }

    // =====================================================
    // CÁLCULO DO RESULTADO
    // =====================================================

    function calcularResultado() {
        const fatores = [];

        const historico =
            avaliacao.historicoFamiliar || {};

        const estilo =
            avaliacao.estiloDeVida || {};

        const saude =
            avaliacao.sintomasCondicoes || {};

        adicionarHistorico(
            fatores,
            historico
        );

        adicionarEstiloDeVida(
            fatores,
            estilo
        );

        adicionarCondicoes(
            fatores,
            saude
        );

        adicionarSintomas(
            fatores,
            saude
        );

        fatores.sort(
            (a, b) =>
                b.prioridade -
                a.prioridade
        );

        const possuiSinalPrioritario =
            fatores.some(
                (fator) =>
                    fator.urgente === true
            );

        let nivel = "healthy";

        if (possuiSinalPrioritario) {
            nivel = "priority";
        } else if (fatores.length > 0) {
            nivel = "attention";
        }

        return {
            nivel: nivel,

            todosFatores: fatores.map(
                (fator) =>
                    fator.texto
            ),

            fatoresPrincipais: fatores
                .slice(
                    0,
                    MAX_VISIBLE_FACTORS
                )
                .map(
                    (fator) =>
                        fator.texto
                ),

            possuiSinalPrioritario:
                possuiSinalPrioritario
        };
    }

    function adicionarHistorico(
        fatores,
        historico
    ) {
        const familiares = [
            historico.mae || {},
            historico.pai || {},
            historico.avos || {}
        ];

        const regrasFamiliares = [
            [
                "diabetes",
                "Histórico familiar de diabetes",
                25
            ],
            [
                "hipertensao",
                "Histórico familiar de hipertensão",
                25
            ],
            [
                "cardiaca",
                "Histórico familiar de doença cardíaca",
                30
            ]
        ];

        regrasFamiliares.forEach(
            (regra) => {
                const propriedade =
                    regra[0];

                const texto =
                    regra[1];

                const prioridade =
                    regra[2];

                const possuiCondicao =
                    familiares.some(
                        (familiar) =>
                            familiar[
                                propriedade
                            ] === "sim"
                    );

                if (possuiCondicao) {
                    adicionarFator(
                        fatores,
                        texto,
                        prioridade
                    );
                }
            }
        );

        const extras =
            historico.complementares || {};

        const regrasExtras = [
            [
                "avc",
                "Histórico familiar de AVC",
                30
            ],
            [
                "cancer",
                "Histórico familiar de câncer",
                28
            ],
            [
                "doencaRenal",
                "Histórico familiar de doença renal",
                28
            ],
            [
                "hereditaria",
                "Doença hereditária conhecida na família",
                28
            ]
        ];

        regrasExtras.forEach(
            (regra) => {
                if (
                    extras[regra[0]] ===
                    "sim"
                ) {
                    adicionarFator(
                        fatores,
                        regra[1],
                        regra[2]
                    );
                }
            }
        );
    }

    function adicionarEstiloDeVida(
        fatores,
        estilo
    ) {
        const regras = [
            [
                estilo.fuma === "sim" ||
                    estilo.fuma ===
                        "as_vezes",

                "Uso de tabaco informado",
                75
            ],

            [
                estilo.alcool ===
                    "frequente",

                "Consumo frequente de bebida alcoólica",
                55
            ],

            [
                estilo.atividadeFisica ===
                    "nunca",

                "Baixa frequência de atividade física",
                50
            ],

            [
                estilo.sonoHoras ===
                    "menos_5" ||
                    estilo.sonoHoras ===
                        "5_6",

                "Quantidade de sono abaixo do recomendado",
                45
            ],

            [
                estilo.alimentacao ===
                    "precisa_melhorar",

                "Alimentação que precisa de atenção",
                40
            ]
        ];

        regras.forEach(
            (regra) => {
                if (regra[0]) {
                    adicionarFator(
                        fatores,
                        regra[1],
                        regra[2]
                    );
                }
            }
        );
    }

    function adicionarCondicoes(
        fatores,
        saude
    ) {
        const condicoes = obterLista(
            saude.condicoesDiagnosticadas ||
            saude.condicoes ||
            saude.condicoesSelecionadas
        );

        const informacoes = {
            diabetes: [
                "Diabetes informado",
                85
            ],

            hipertensao: [
                "Hipertensão informada",
                80
            ],

            asma: [
                "Asma informada",
                70
            ],

            obesidade: [
                "Obesidade informada",
                65
            ],

            colesterol_alto: [
                "Colesterol alto informado",
                60
            ]
        };

        condicoes.forEach(
            (condicao) => {
                const dados =
                    informacoes[condicao];

                if (dados) {
                    adicionarFator(
                        fatores,
                        dados[0],
                        dados[1]
                    );
                }
            }
        );
    }

    function adicionarSintomas(
        fatores,
        saude
    ) {
        const sintomas = obterLista(
            saude.sintomasRecentes ||
            saude.sintomas ||
            saude.sintomasSelecionados
        );

        const informacoes = {
            dor_peito: [
                "Dor no peito recente",
                100,
                true
            ],

            falta_ar: [
                "Falta de ar recente",
                95,
                true
            ],

            febre: [
                "Febre recente",
                58,
                false
            ],

            tontura: [
                "Tontura recente",
                52,
                false
            ],

            cansaco: [
                "Cansaço recente",
                36,
                false
            ],

            dor_cabeca: [
                "Dor de cabeça recente",
                32,
                false
            ]
        };

        sintomas.forEach(
            (sintoma) => {
                const dados =
                    informacoes[sintoma];

                if (dados) {
                    adicionarFator(
                        fatores,
                        dados[0],
                        dados[1],
                        dados[2]
                    );
                }
            }
        );
    }

    function adicionarFator(
        fatores,
        texto,
        prioridade,
        urgente = false
    ) {
        const jaExiste =
            fatores.some(
                (fator) =>
                    fator.texto === texto
            );

        if (!jaExiste) {
            fatores.push({
                texto: texto,
                prioridade: prioridade,
                urgente: urgente
            });
        }
    }

    function obterLista(valor) {
        return Array.isArray(valor)
            ? valor
            : [];
    }

    // =====================================================
    // EXIBIÇÃO DO RESULTADO
    // =====================================================

    function exibirResultado(resultado) {
        if (!elements.card) {
            return;
        }

        elements.card.classList.remove(
            "healthy",
            "attention",
            "priority"
        );

        elements.card.classList.add(
            resultado.nivel
        );

        const configuracoes = {
            healthy: {
                titulo:
                    "Cuidados em dia",

                descricao:
                    "Nenhum fator de atenção foi identificado.",

                orientacao:
                    "Continue com o acompanhamento preventivo periódico na sua UBS.",

                imagem:
                    "../imagens/prevencao.png"
            },

            attention: {
                titulo:
                    "Atenção recomendada",

                descricao:
                    "Algumas respostas indicam a importância de acompanhamento preventivo.",

                orientacao:
                    "Para prevenção e acompanhamento, procure uma UBS.",

                imagem:
                    "../imagens/atencao_recomendada.png"
            },

            priority: {
                titulo:
                    "Procure atendimento",

                descricao:
                    "Você informou sintomas que merecem avaliação profissional.",

                orientacao:
                    "Se os sintomas forem intensos ou estiverem piorando, procure uma UPA ou outro serviço de urgência.",

                imagem:
                    "../imagens/atencao_recomendada.png"
            }
        };

        const configuracao =
            configuracoes[
                resultado.nivel
            ];

        elements.title.textContent =
            configuracao.titulo;

        elements.description.textContent =
            configuracao.descricao;

        elements.guidance.textContent =
            configuracao.orientacao;

        elements.image.src =
            configuracao.imagem;

        preencherFatores(
            resultado.fatoresPrincipais
        );
    }

    function preencherFatores(fatores) {
        elements.factorsList.innerHTML =
            "";

        if (fatores.length === 0) {
            elements.factorsList.hidden =
                true;

            elements.noFactors.hidden =
                false;

            return;
        }

        elements.factorsList.hidden =
            false;

        elements.noFactors.hidden =
            true;

        fatores.forEach(
            (fator) => {
                const item =
                    document.createElement(
                        "li"
                    );

                const icon =
                    document.createElement(
                        "span"
                    );

                const texto =
                    document.createElement(
                        "span"
                    );

                icon.className =
                    "factor-icon";

                icon.textContent =
                    "!";

                icon.setAttribute(
                    "aria-hidden",
                    "true"
                );

                texto.textContent =
                    fator;

                item.append(
                    icon,
                    texto
                );

                elements.factorsList
                    .appendChild(item);
            }
        );
    }

    // =====================================================
    // LOCALSTORAGE E BOTÕES
    // =====================================================

    function salvarResultado(resultado) {
        avaliacao.resultado = {
            nivel:
                resultado.nivel,

            fatores:
                resultado.todosFatores,

            fatoresPrincipais:
                resultado.fatoresPrincipais,

            possuiSinalPrioritario:
                resultado.possuiSinalPrioritario,

            calculadoEm:
                new Date().toISOString()
        };

        localStorage.setItem(
            ASSESSMENT_KEY,
            JSON.stringify(avaliacao)
        );
    }

    function configurarEventos() {
        if (elements.retakeButton) {
            elements.retakeButton
                .addEventListener(
                    "click",
                    refazerAvaliacao
                );
        }

        if (elements.findUnitButton) {
            elements.findUnitButton
                .addEventListener(
                    "click",
                    localizarUbsMaisProxima
                );
        }

        if (elements.viewUnitsButton) {
            elements.viewUnitsButton
                .addEventListener(
                    "click",
                    abrirTodasUnidades
                );
        }
    }

    function abrirTodasUnidades() {
        window.location.href =
            UNITS_PAGE;
    }

    // =====================================================
    // MAPA
    // =====================================================

    function iniciarMapa() {
        if (!elements.map) {
            return;
        }

        if (typeof L === "undefined") {
            exibirErroDoMapa(
                "Não foi possível carregar o mapa. Verifique sua internet."
            );

            return;
        }

        mapa = L.map(
            elements.map,
            {
                zoomControl: true
            }
        ).setView(
            [
                -14.235,
                -51.9253
            ],
            4
        );

        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,

                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
        ).addTo(mapa);

        camadaDeUnidades =
            L.layerGroup()
                .addTo(mapa);

        localizarPorCepOuDispositivo();
    }

    // =====================================================
    // LOCALIZAÇÃO PELO CEP
    // =====================================================

    async function localizarPorCepOuDispositivo() {
        const cep =
            obterCepDaAvaliacao();

        if (cep) {
            mostrarCarregamentoDasUnidades();

            atualizarEstadoDoMapa(
                "Localizando o endereço informado na avaliação...",
                "loading"
            );

            try {
                const localizacao =
                    await buscarCoordenadasDoCep(
                        cep
                    );

                await processarLocalizacao(
                    localizacao.latitude,
                    localizacao.longitude,
                    300,
                    "Localização aproximada pelo CEP informado"
                );

                return;
            } catch (erro) {
                console.warn(
                    "Não foi possível localizar o CEP. Usando o dispositivo:",
                    erro
                );
            }
        }

        solicitarLocalizacao();
    }

    function obterCepDaAvaliacao() {
        const dadosPessoais =
            avaliacao.dadosPessoais ||
            {};

        const cep = String(
            dadosPessoais.cep || ""
        ).replace(
            /\D/g,
            ""
        );

        return cep.length === 8
            ? cep
            : "";
    }

    async function buscarCoordenadasDoCep(
        cep
    ) {
        const cache =
            carregarCacheDoCep();

        if (
            cache &&
            cache.cep === cep &&
            Number.isFinite(
                cache.latitude
            ) &&
            Number.isFinite(
                cache.longitude
            )
        ) {
            return cache;
        }

        const resposta =
            await fetch(
                `https://brasilapi.com.br/api/cep/v2/${encodeURIComponent(cep)}`
            );

        if (!resposta.ok) {
            throw new Error(
                `A consulta do CEP retornou ${resposta.status}.`
            );
        }

        const dados =
            await resposta.json();

        const coordenadas =
            dados.location
                ?.coordinates || {};

        const latitude =
            Number(
                coordenadas.latitude
            );

        const longitude =
            Number(
                coordenadas.longitude
            );

        if (
            !Number.isFinite(
                latitude
            ) ||
            !Number.isFinite(
                longitude
            )
        ) {
            throw new Error(
                "O CEP não possui coordenadas disponíveis."
            );
        }

        const localizacao = {
            cep: cep,
            latitude: latitude,
            longitude: longitude,
            atualizadoEm:
                new Date().toISOString()
        };

        localStorage.setItem(
            CEP_LOCATION_CACHE_KEY,
            JSON.stringify(
                localizacao
            )
        );

        return localizacao;
    }

    function carregarCacheDoCep() {
        const dados =
            localStorage.getItem(
                CEP_LOCATION_CACHE_KEY
            );

        if (!dados) {
            return null;
        }

        try {
            return JSON.parse(dados);
        } catch (erro) {
            return null;
        }
    }

    // =====================================================
    // LOCALIZAÇÃO PELO DISPOSITIVO
    // =====================================================

    function solicitarLocalizacao() {
        mostrarCarregamentoDasUnidades();

        atualizarEstadoDoMapa(
            "Permita o acesso à sua localização para encontrarmos as unidades próximas.",
            "loading"
        );

        if (!navigator.geolocation) {
            tratarErroDeLocalizacao({
                code: 0
            });

            return;
        }

        navigator.geolocation
            .getCurrentPosition(
                localizacaoObtida,
                tratarErroDeLocalizacao,
                {
                    enableHighAccuracy:
                        true,

                    timeout:
                        15000,

                    maximumAge:
                        300000
                }
            );
    }

    async function localizacaoObtida(
        posicao
    ) {
        await processarLocalizacao(
            posicao.coords.latitude,
            posicao.coords.longitude,
            posicao.coords.accuracy,
            "Sua localização aproximada"
        );
    }

    async function processarLocalizacao(
        latitude,
        longitude,
        precisao,
        descricaoDaLocalizacao
    ) {
        adicionarLocalizacaoDoUsuario(
            latitude,
            longitude,
            precisao,
            descricaoDaLocalizacao
        );

        atualizarEstadoDoMapa(
            "Buscando UBS e UPA próximas...",
            "loading"
        );

        try {
            const unidades =
                await buscarUnidadesDeSaude(
                    latitude,
                    longitude
                );

            unidadesProximas =
                selecionarUnidadesMaisProximas(
                    unidades,
                    latitude,
                    longitude
                );

            exibirUnidadesNoMapa(
                unidadesProximas,
                latitude,
                longitude
            );

            preencherListaDeUnidades(
                unidadesProximas
            );

            if (
                unidadesProximas.length ===
                0
            ) {
                exibirErroDoMapa(
                    `Nenhuma UBS ou UPA foi encontrada em até ${MAX_SEARCH_RADIUS_KM} km.`
                );
            } else {
                ocultarEstadoDoMapa();
            }
        } catch (erro) {
            console.error(
                "Erro ao buscar unidades:",
                erro
            );

            exibirErroDoMapa(
                "Não foi possível consultar as unidades agora. Tente novamente."
            );

            exibirEstadoVazio(
                "Não foi possível carregar as unidades próximas."
            );
        }
    }

    function adicionarLocalizacaoDoUsuario(
        latitude,
        longitude,
        precisao,
        descricaoDaLocalizacao
    ) {
        const iconeUsuario =
            L.divIcon({
                className: "",

                html:
                    '<div class="user-map-marker"></div>',

                iconSize:
                    [22, 22],

                iconAnchor:
                    [11, 11]
            });

        if (marcadorUsuario) {
            mapa.removeLayer(
                marcadorUsuario
            );
        }

        if (circuloPrecisao) {
            mapa.removeLayer(
                circuloPrecisao
            );
        }

        marcadorUsuario =
            L.marker(
                [
                    latitude,
                    longitude
                ],
                {
                    icon:
                        iconeUsuario
                }
            )
                .addTo(mapa)
                .bindPopup(
                    descricaoDaLocalizacao
                );

        circuloPrecisao =
            L.circle(
                [
                    latitude,
                    longitude
                ],
                {
                    radius:
                        Math.min(
                            precisao,
                            1000
                        ),

                    color:
                        "#1677ff",

                    fillColor:
                        "#1677ff",

                    fillOpacity:
                        0.08,

                    weight:
                        1
                }
            ).addTo(mapa);

        mapa.setView(
            [
                latitude,
                longitude
            ],
            13
        );
    }

    // =====================================================
    // PESQUISA DE UNIDADES
    // =====================================================

    async function buscarUnidadesDeSaude(
        latitude,
        longitude
    ) {
        let ultimoErro = null;
        let recebeuRespostaValida =
            false;

        const unidadesEncontradas =
            [];

        const idsAdicionados =
            new Set();

        for (
            const raio of
            SEARCH_RADII_METERS
        ) {
            atualizarEstadoDoMapa(
                `Buscando unidades em até ${raio / 1000} km...`,
                "loading"
            );

            const consulta =
                montarConsultaOverpass(
                    latitude,
                    longitude,
                    raio
                );

            let consultaDoRaioConcluida =
                false;

            for (
                const endpoint of
                OVERPASS_ENDPOINTS
            ) {
                try {
                    const resposta =
                        await fetch(
                            endpoint,
                            {
                                method:
                                    "POST",

                                headers: {
                                    "Content-Type":
                                        "application/x-www-form-urlencoded;charset=UTF-8"
                                },

                                body:
                                    `data=${encodeURIComponent(consulta)}`
                            }
                        );

                    if (!resposta.ok) {
                        throw new Error(
                            `A consulta retornou ${resposta.status}.`
                        );
                    }

                    const dados =
                        await resposta.json();

                    if (dados.remark) {
                        throw new Error(
                            dados.remark
                        );
                    }

                    recebeuRespostaValida =
                        true;

                    consultaDoRaioConcluida =
                        true;

                    const unidadesDoRaio =
                        normalizarUnidades(
                            dados.elements ||
                            []
                        );

                    unidadesDoRaio.forEach(
                        (unidade) => {
                            if (
                                idsAdicionados
                                    .has(
                                        unidade.id
                                    )
                            ) {
                                return;
                            }

                            idsAdicionados
                                .add(
                                    unidade.id
                                );

                            unidadesEncontradas
                                .push(
                                    unidade
                                );
                        }
                    );

                    break;
                } catch (erro) {
                    ultimoErro =
                        erro;

                    console.warn(
                        `Falha na consulta de ${raio / 1000} km:`,
                        erro
                    );
                }
            }

            if (
                consultaDoRaioConcluida &&
                possuiAtencaoBasicaEUrgencia(
                    unidadesEncontradas
                )
            ) {
                return unidadesEncontradas;
            }
        }

        if (
            unidadesEncontradas.length >
                0 ||
            recebeuRespostaValida
        ) {
            return unidadesEncontradas;
        }

        throw (
            ultimoErro ||
            new Error(
                "Não foi possível consultar as unidades."
            )
        );
    }

    function montarConsultaOverpass(
        latitude,
        longitude,
        raio
    ) {
        return `
            [out:json][timeout:25];

            (
                nwr(
                    around:${raio},
                    ${latitude},
                    ${longitude}
                )
                [
                    "name"~
                    "Unidade Básica|Unidade Basica|Posto de Saúde|Posto de Saude|Centro de Saúde|Centro de Saude|Pronto Atendimento|Pronto Socorro",
                    i
                ];

                nwr(
                    around:${raio},
                    ${latitude},
                    ${longitude}
                )
                [
                    "name"~
                    "(^|[^A-Za-z])(UBS|USF|ESF|UPA|AMA)([^A-Za-z]|$)",
                    i
                ];

                nwr(
                    around:${raio},
                    ${latitude},
                    ${longitude}
                )
                [
                    "short_name"~
                    "^(UBS|USF|ESF|UPA|AMA)( |$)",
                    i
                ];

                nwr(
                    around:${raio},
                    ${latitude},
                    ${longitude}
                )
                [
                    "amenity"~
                    "clinic|doctors|health_post"
                ];

                nwr(
                    around:${raio},
                    ${latitude},
                    ${longitude}
                )
                [
                    "healthcare"~
                    "clinic|doctor|centre|health_post"
                ];

                nwr(
                    around:${raio},
                    ${latitude},
                    ${longitude}
                )
                [
                    "emergency"="yes"
                ];
            );

            out center tags;
        `;
    }

    function possuiAtencaoBasicaEUrgencia(
        unidades
    ) {
        const possuiAtencaoBasica =
            unidades.some(
                (unidade) =>
                    unidade.tipo ===
                        "ubs" ||
                    unidade.tipo ===
                        "unidade"
            );

        const possuiUrgencia =
            unidades.some(
                (unidade) =>
                    unidade.tipo ===
                        "upa" ||
                    unidade.tipo ===
                        "urgencia"
            );

        return (
            possuiAtencaoBasica &&
            possuiUrgencia
        );
    }

    // =====================================================
    // NORMALIZAÇÃO DOS RESULTADOS
    // =====================================================

    function normalizarUnidades(
        elementos
    ) {
        const unidades = [];
        const chavesAdicionadas =
            new Set();

        elementos.forEach(
            (elemento) => {
                const latitude =
                    elemento.lat ||
                    elemento.center?.lat;

                const longitude =
                    elemento.lon ||
                    elemento.center?.lon;

                const tags =
                    elemento.tags || {};

                const nome =
                    tags.name ||
                    tags.official_name ||
                    tags.short_name ||
                    "Unidade de saúde";

                const tipo =
                    identificarTipoDaUnidade(
                        nome,
                        tags
                    );

                if (
                    !latitude ||
                    !longitude ||
                    !tipo
                ) {
                    return;
                }

                const chave = [
                    normalizarTexto(nome),

                    Number(latitude)
                        .toFixed(4),

                    Number(longitude)
                        .toFixed(4)
                ].join("-");

                if (
                    chavesAdicionadas.has(
                        chave
                    )
                ) {
                    return;
                }

                chavesAdicionadas.add(
                    chave
                );

                unidades.push({
                    id:
                        `${elemento.type}-${elemento.id}`,

                    nome:
                        nome,

                    tipo:
                        tipo,

                    latitude:
                        Number(latitude),

                    longitude:
                        Number(longitude),

                    endereco:
                        montarEndereco(
                            tags
                        )
                });
            }
        );

        return unidades;
    }

    function identificarTipoDaUnidade(
        nome,
        tags
    ) {
        const ehPontoDeTransporte =
            Boolean(
                tags.highway
            ) ||
            Boolean(
                tags.public_transport
            ) ||
            Boolean(
                tags.railway
            );

        if (ehPontoDeTransporte) {
            return null;
        }

        const referencia =
            normalizarTexto(
                [
                    nome,
                    tags.short_name ||
                        "",
                    tags.official_name ||
                        ""
                ].join(" ")
            );

        const ehUpa =
            /(^|\s)upa(\s|$)/
                .test(referencia) ||

            referencia.includes(
                "unidade de pronto atendimento"
            );

        if (ehUpa) {
            return "upa";
        }

        const ehUbs =
            /(^|\s)ubs(\s|$)/
                .test(referencia) ||

            /(^|\s)usf(\s|$)/
                .test(referencia) ||

            /(^|\s)esf(\s|$)/
                .test(referencia) ||

            referencia.includes(
                "unidade basica de saude"
            ) ||

            referencia.includes(
                "unidade de saude da familia"
            ) ||

            referencia.includes(
                "estrategia saude da familia"
            ) ||

            referencia.includes(
                "unidade municipal de saude"
            ) ||

            referencia.includes(
                "posto de saude"
            ) ||

            referencia.includes(
                "centro de saude"
            );

        if (ehUbs) {
            return "ubs";
        }

        const ehUrgencia =
            tags.emergency === "yes" ||

            referencia.includes(
                "pronto atendimento"
            ) ||

            referencia.includes(
                "pronto socorro"
            );

        if (ehUrgencia) {
            return "urgencia";
        }

        const ehUnidadeDeSaude =
            tags.amenity ===
                "clinic" ||

            tags.amenity ===
                "doctors" ||

            tags.amenity ===
                "health_post" ||

            tags.healthcare ===
                "clinic" ||

            tags.healthcare ===
                "doctor" ||

            tags.healthcare ===
                "centre" ||

            tags.healthcare ===
                "health_post";

        if (ehUnidadeDeSaude) {
            return "unidade";
        }

        return null;
    }

    function montarEndereco(tags) {
        const primeiraLinha = [
            tags["addr:street"],
            tags["addr:housenumber"]
        ]
            .filter(Boolean)
            .join(", ");

        const segundaLinha = [
            tags["addr:suburb"],
            tags["addr:city"]
        ]
            .filter(Boolean)
            .join(" - ");

        return [
            primeiraLinha,
            segundaLinha
        ]
            .filter(Boolean)
            .join(" • ") ||
            "Toque para abrir a rota";
    }

    // =====================================================
    // DISTÂNCIA E SELEÇÃO
    // =====================================================

    function selecionarUnidadesMaisProximas(
        unidades,
        latitude,
        longitude
    ) {
        const ordenadas =
            unidades
                .map(
                    (unidade) => ({
                        ...unidade,

                        distancia:
                            calcularDistancia(
                                latitude,
                                longitude,
                                unidade.latitude,
                                unidade.longitude
                            )
                    })
                )
                .sort(
                    (a, b) =>
                        a.distancia -
                        b.distancia
                );

        const ubsExata =
            ordenadas.find(
                (unidade) =>
                    unidade.tipo ===
                    "ubs"
            );

        const unidadeAlternativa =
            ordenadas.find(
                (unidade) =>
                    unidade.tipo ===
                    "unidade"
            );

        const upaExata =
            ordenadas.find(
                (unidade) =>
                    unidade.tipo ===
                    "upa"
            );

        const urgenciaAlternativa =
            ordenadas.find(
                (unidade) =>
                    unidade.tipo ===
                    "urgencia"
            );

        return [
            ubsExata ||
                unidadeAlternativa,

            upaExata ||
                urgenciaAlternativa
        ].filter(Boolean);
    }

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
                Math.sqrt(calculo),

                Math.sqrt(
                    1 - calculo
                )
            );

        return (
            raioDaTerra *
            angulo
        );
    }

    function grausParaRadianos(
        graus
    ) {
        return (
            graus *
            (Math.PI / 180)
        );
    }

    // =====================================================
    // MARCADORES DO MAPA
    // =====================================================

    function exibirUnidadesNoMapa(
        unidades,
        latitudeUsuario,
        longitudeUsuario
    ) {
        camadaDeUnidades.clearLayers();

        marcadorUbsMaisProxima =
            null;

        const limites = [
            [
                latitudeUsuario,
                longitudeUsuario
            ]
        ];

        unidades.forEach(
            (unidade) => {
                const icone =
                    criarIconeDaUnidade(
                        unidade.tipo
                    );

                const marcador =
                    L.marker(
                        [
                            unidade.latitude,
                            unidade.longitude
                        ],
                        {
                            icon: icone
                        }
                    ).addTo(
                        camadaDeUnidades
                    );

                marcador.bindPopup(
                    criarConteudoDoPopup(
                        unidade
                    )
                );

                if (
                    unidade.tipo ===
                        "ubs" ||
                    unidade.tipo ===
                        "unidade"
                ) {
                    marcadorUbsMaisProxima =
                        marcador;
                }

                limites.push(
                    [
                        unidade.latitude,
                        unidade.longitude
                    ]
                );
            }
        );

        if (limites.length > 1) {
            mapa.fitBounds(
                limites,
                {
                    padding:
                        [35, 35],

                    maxZoom:
                        14
                }
            );
        }
    }

    function criarIconeDaUnidade(
        tipo
    ) {
        const ehAtencaoBasica =
            tipo === "ubs" ||
            tipo === "unidade";

        const classe =
            ehAtencaoBasica
                ? "ubs"
                : "upa";

        const textos = {
            ubs:
                "UBS",

            unidade:
                "US",

            upa:
                "UPA",

            urgencia:
                "SOS"
        };

        const texto =
            textos[tipo] ||
            "US";

        return L.divIcon({
            className: "",

            html:
                `<div class="health-map-marker ${classe}">` +
                    `<span>${texto}</span>` +
                "</div>",

            iconSize:
                [36, 36],

            iconAnchor:
                [18, 36],

            popupAnchor:
                [0, -33]
        });
    }

    function criarConteudoDoPopup(
        unidade
    ) {
        const conteudo =
            document.createElement(
                "div"
            );

        const nome =
            document.createElement(
                "strong"
            );

        const distancia =
            document.createElement(
                "div"
            );

        nome.textContent =
            unidade.nome;

        distancia.textContent =
            `${formatarDistancia(unidade.distancia)} da sua localização`;

        conteudo.append(
            nome,
            distancia
        );

        return conteudo;
    }

    // =====================================================
    // LISTA DE UNIDADES
    // =====================================================

    function preencherListaDeUnidades(
        unidades
    ) {
        elements.unitsList.innerHTML =
            "";

        if (unidades.length === 0) {
            exibirEstadoVazio(
                "Nenhuma UBS ou UPA foi encontrada nas proximidades."
            );

            return;
        }

        unidades.forEach(
            (unidade) => {
                const botao =
                    criarBotaoDaUnidade(
                        unidade
                    );

                elements.unitsList
                    .appendChild(
                        botao
                    );
            }
        );

        const possuiAtencaoBasica =
            unidades.some(
                (unidade) =>
                    unidade.tipo ===
                        "ubs" ||
                    unidade.tipo ===
                        "unidade"
            );

        const possuiUrgencia =
            unidades.some(
                (unidade) =>
                    unidade.tipo ===
                        "upa" ||
                    unidade.tipo ===
                        "urgencia"
            );

        if (!possuiAtencaoBasica) {
            adicionarAvisoDeUnidadeNaoEncontrada(
                "unidade de atenção básica"
            );
        }

        if (!possuiUrgencia) {
            adicionarAvisoDeUnidadeNaoEncontrada(
                "unidade de urgência"
            );
        }
    }

    function criarBotaoDaUnidade(
        unidade
    ) {
        const botao =
            document.createElement(
                "button"
            );

        const imagem =
            document.createElement(
                "img"
            );

        const informacao =
            document.createElement(
                "span"
            );

        const tipo =
            document.createElement(
                "span"
            );

        const nome =
            document.createElement(
                "strong"
            );

        const distancia =
            document.createElement(
                "small"
            );

        const endereco =
            document.createElement(
                "small"
            );

        const seta =
            document.createElement(
                "img"
            );

        botao.type =
            "button";

        botao.className =
            "unit-item";

        const ehAtencaoBasica =
            unidade.tipo === "ubs" ||
            unidade.tipo === "unidade";

        imagem.src =
            ehAtencaoBasica
                ? "../imagens/localizacao_card.png"
                : "../imagens/localizacao.png";

        imagem.alt =
            "";

        imagem.className =
            "unit-marker";

        imagem.setAttribute(
            "aria-hidden",
            "true"
        );

        informacao.className =
            "unit-information";

        tipo.className =
            `unit-type-badge ${
                ehAtencaoBasica
                    ? "ubs"
                    : "upa"
            }`;

        tipo.textContent =
            obterRotuloTipo(
                unidade.tipo
            );

        nome.textContent =
            unidade.nome;

        distancia.textContent =
            `${formatarDistancia(unidade.distancia)} de distância`;

        endereco.className =
            "unit-address";

        endereco.textContent =
            unidade.endereco;

        seta.src =
            "../imagens/seta.png";

        seta.alt =
            "";

        seta.className =
            "unit-arrow";

        seta.setAttribute(
            "aria-hidden",
            "true"
        );

        informacao.append(
            tipo,
            nome,
            distancia,
            endereco
        );

        botao.append(
            imagem,
            informacao,
            seta
        );

        botao.addEventListener(
            "click",
            () => {
                abrirRotaParaUnidade(
                    unidade
                );
            }
        );

        return botao;
    }

    function adicionarAvisoDeUnidadeNaoEncontrada(
        tipo
    ) {
        const aviso =
            document.createElement(
                "div"
            );

        aviso.className =
            "units-empty-state";

        aviso.textContent =
            `Nenhuma ${tipo} foi encontrada em até ${MAX_SEARCH_RADIUS_KM} km.`;

        elements.unitsList
            .appendChild(aviso);
    }

    // =====================================================
    // ROTAS E BOTÕES
    // =====================================================

    function abrirRotaParaUnidade(
        unidade
    ) {
        const destino =
            `${unidade.latitude},${unidade.longitude}`;

        const url =
            "https://www.google.com/maps/dir/?api=1" +
            `&destination=${encodeURIComponent(destino)}`;

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    }

    function localizarUbsMaisProxima() {
        const ubs =
            unidadesProximas.find(
                (unidade) =>
                    unidade.tipo ===
                        "ubs" ||
                    unidade.tipo ===
                        "unidade"
            );

        if (
            mapa &&
            ubs &&
            marcadorUbsMaisProxima
        ) {
            mapa.setView(
                [
                    ubs.latitude,
                    ubs.longitude
                ],
                16
            );

            marcadorUbsMaisProxima
                .openPopup();

            elements.map
                .scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "center"
                });

            return;
        }

        localizarPorCepOuDispositivo();
    }

    function obterRotuloTipo(
        tipo
    ) {
        const rotulos = {
            ubs:
                "UBS",

            unidade:
                "UNIDADE DE SAÚDE",

            upa:
                "UPA",

            urgencia:
                "URGÊNCIA"
        };

        return (
            rotulos[tipo] ||
            "UNIDADE"
        );
    }

    function formatarDistancia(
        distanciaEmKm
    ) {
        if (distanciaEmKm < 1) {
            return (
                `${Math.round(
                    distanciaEmKm *
                    1000
                )} m`
            );
        }

        return (
            `${distanciaEmKm
                .toFixed(1)
                .replace(".", ",")} km`
        );
    }

    function normalizarTexto(
        texto
    ) {
        return String(texto)
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim();
    }

    // =====================================================
    // ERROS E CARREGAMENTO
    // =====================================================

    function tratarErroDeLocalizacao(
        erro
    ) {
        let mensagem =
            "Não foi possível obter sua localização.";

        if (erro.code === 1) {
            mensagem =
                "A permissão de localização foi negada. Libere o acesso no navegador e tente novamente.";
        } else if (
            erro.code === 2
        ) {
            mensagem =
                "Sua localização não está disponível neste momento.";
        } else if (
            erro.code === 3
        ) {
            mensagem =
                "A localização demorou para responder. Tente novamente.";
        }

        exibirErroDoMapa(
            mensagem
        );

        exibirEstadoVazio(
            mensagem
        );
    }

    function atualizarEstadoDoMapa(
        mensagem,
        tipo
    ) {
        elements.mapStatus
            .classList.remove(
                "hidden",
                "error"
            );

        elements.mapLoader
            .classList.remove(
                "hidden"
            );

        elements.mapStatusText
            .textContent =
                mensagem;

        if (tipo === "error") {
            elements.mapStatus
                .classList.add(
                    "error"
                );

            elements.mapLoader
                .classList.add(
                    "hidden"
                );
        }
    }

    function ocultarEstadoDoMapa() {
        elements.mapStatus
            .classList.add(
                "hidden"
            );
    }

    function exibirErroDoMapa(
        mensagem
    ) {
        atualizarEstadoDoMapa(
            mensagem,
            "error"
        );
    }

    function mostrarCarregamentoDasUnidades() {
        elements.unitsList.innerHTML = `
            <div class="unit-loading-placeholder">
                <span
                    class="unit-loading-line unit-loading-title">
                </span>

                <span
                    class="unit-loading-line unit-loading-distance">
                </span>
            </div>

            <div class="unit-loading-placeholder">
                <span
                    class="unit-loading-line unit-loading-title">
                </span>

                <span
                    class="unit-loading-line unit-loading-distance">
                </span>
            </div>
        `;
    }

    function exibirEstadoVazio(
        mensagem
    ) {
        elements.unitsList.innerHTML =
            "";

        const estado =
            document.createElement(
                "div"
            );

        const texto =
            document.createElement(
                "p"
            );

        const botao =
            document.createElement(
                "button"
            );

        estado.className =
            "units-empty-state";

        texto.textContent =
            mensagem;

        botao.type =
            "button";

        botao.className =
            "retry-location-button";

        botao.textContent =
            "Tentar novamente";

        botao.addEventListener(
            "click",
            localizarPorCepOuDispositivo
        );

        estado.append(
            texto,
            botao
        );

        elements.unitsList
            .appendChild(
                estado
            );
    }

    // =====================================================
    // REFAZER AVALIAÇÃO
    // =====================================================

    function refazerAvaliacao() {
        const confirmou =
            window.confirm(
                "Deseja refazer a avaliação? As respostas atuais serão substituídas."
            );

        if (!confirmou) {
            return;
        }

        // Remove somente a avaliação.
        // A sessão do usuário continua funcionando.
        localStorage.removeItem(
            ASSESSMENT_KEY
        );

        window.location.href =
            FIRST_PAGE;
    }
})();