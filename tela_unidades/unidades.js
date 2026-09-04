// =========================================================
// GENSAÚDE SUS - UNIDADES PRÓXIMAS
// =========================================================

(function () {
    "use strict";

    const ASSESSMENT_KEY =
        "gensaude_avaliacao_preventiva";

    const ADDRESS_LOCATION_CACHE_KEY =
        "gensaude_localizacao_endereco";

    const CEP_LOCATION_CACHE_KEY =
        "gensaude_localizacao_cep";

    const PREVENTION_PAGE =
        "../tela_prevencao/prevencao.html";

    const DEFAULT_LOCATION = {
        latitude: -23.6261,
        longitude: -46.7915,
        zoom: 13
    };

    const OVERPASS_ENDPOINTS = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter"
    ];

    // Unidades oficiais de Taboão da Serra.
    // Elas aparecem imediatamente, sem esperar a consulta externa.
    const UNIDADES_OFICIAIS_TABOAO = [
        {
            id: "taboao-ubs-margaridas",
            nome: "UBS Jardim das Margaridas",
            tipo: "ubs",
            latitude: -23.627157990647,
            longitude: -46.809801024762,
            endereco:
                "Rua Paulo Augusto de Andrade, 400 • Jardim das Margaridas",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-record",
            nome: "UBS Jardim Record/Ponte Alta",
            tipo: "ubs",
            latitude: -23.625943997701,
            longitude: -46.791471981812,
            endereco:
                "Rua Imaruí, 47 • Jardim Record",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-parque-pinheiros",
            nome: "UBS Parque Pinheiros/CSU",
            tipo: "ubs",
            latitude: -23.631478987463,
            longitude: -46.782866030365,
            endereco:
                "Avenida Laurita Ortega Mari, 2131 • Parque Pinheiros",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-maria-jose",
            nome: "UBS Dra. Maria José de Albuquerque",
            tipo: "ubs",
            latitude: -23.606005000698,
            longitude: -46.762500017305,
            endereco:
                "Rua José Mari, 13 • Parque Assunção",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-oliveiras",
            nome: "UBS Oliveiras/Marabá",
            tipo: "ubs",
            latitude: -23.624749995593,
            longitude: -46.774671965639,
            endereco:
                "Rua Maria Inês, 34 • Jardim das Oliveiras",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-santo-onofre",
            nome: "UBS Santo Onofre",
            tipo: "ubs",
            latitude: -23.638920692559,
            longitude: -46.804707761297,
            endereco:
                "Rua Marechal Artur da Costa e Silva, 85 • Pirajuçara",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-silvio-sampaio",
            nome: "UBS Sílvio Sampaio",
            tipo: "ubs",
            latitude: -23.643916771819,
            longitude: -46.790302735687,
            endereco:
                "Rua Enaura Maria da Conceição, 276 • Jardim Sílvio Sampaio",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-santa-cecilia",
            nome: "UBS Santa Cecília",
            tipo: "ubs",
            latitude: -23.623368993226,
            longitude: -46.787188996927,
            endereco:
                "Rua Henrique de Moraes Camargo, 143 • Jardim Santa Cecília",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-suina",
            nome: "UBS Jardim Suiná",
            tipo: "ubs",
            latitude: -23.639271783704,
            longitude: -46.79216090443,
            endereco:
                "Rua Albano Leite da Fonseca, 111 • Jardim Suiná",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-salete",
            nome: "UBS Jardim Salete",
            tipo: "ubs",
            latitude: -23.626140008506,
            longitude: -46.80133999642,
            endereco:
                "Rua Constantino Dias Lopes, 181 • Jardim Salete",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-panorama",
            nome: "UBS Panorama",
            tipo: "ubs",
            latitude: -23.636496981437,
            longitude: -46.806650015901,
            endereco:
                "Rua Miguel Carlos Silva, 380 • Jardim Panorama",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-tania-regina",
            nome: "UBS Dra. Tânia Regina dos Santos Andrade",
            tipo: "ubs",
            latitude: -23.608206239163,
            longitude: -46.775906602679,
            endereco:
                "Rua Uruguai, 73 • Jardim América",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-clementino",
            nome: "UBS Jardim Clementino",
            tipo: "ubs",
            latitude: -23.635075997391,
            longitude: -46.785781004832,
            endereco:
                "Rua Tsuruki Tsuno, 104 • Jardim Clementino",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-ubs-laguna",
            nome: "UBS Parque Laguna",
            tipo: "ubs",
            latitude: -23.61358299554,
            longitude: -46.796156962773,
            endereco:
                "Rua Ida Romissi Gasparineti, 381 • Parque Laguna",
            horario: "Seg. a sex.: 7h às 17h"
        },
        {
            id: "taboao-upa-akira-tada",
            nome: "UPA Doutor Akira Tada",
            tipo: "upa",
            latitude: -23.6153798,
            longitude: -46.7780465,
            endereco:
                "Estrada São Francisco, 2532 • Vila Sônia do Taboão",
            horario: "Atendimento 24 horas"
        }
    ];

    const elements = {
        searchForm:
            document.getElementById("unitsSearchForm"),

        searchInput:
            document.getElementById("unitsSearchInput"),

        filtersButton:
            document.getElementById("filtersButton"),

        filtersPanel:
            document.getElementById("filtersPanel"),

        distanceFilter:
            document.getElementById("distanceFilter"),

        openUnitsOnly:
            document.getElementById("openUnitsOnly"),

        typeButtons:
            Array.from(
                document.querySelectorAll(
                    "[data-unit-type]"
                )
            ),

        resultCount:
            document.getElementById(
                "unitsResultCount"
            ),

        unitsList:
            document.getElementById("unitsList"),

        unitTemplate:
            document.getElementById(
                "unitCardTemplate"
            ),

        mapContainer:
            document.getElementById("unitsMap"),

        mapMessage:
            document.getElementById("mapMessage"),

        mapMessageText:
            document.getElementById(
                "mapMessageText"
            ),

        useSavedAddressButton:
            document.getElementById(
                "useSavedAddressButton"
            ),

        savedAddressText:
            document.getElementById(
                "savedAddressText"
            )
    };

    let mapa = null;
    let camadaDeUnidades = null;
    let marcadorDoUsuario = null;
    let circuloDoUsuario = null;

    let enderecoSalvo = null;
    let localizacaoAtual = null;

    let unidades = [];
    let unidadesFiltradas = [];

    let tipoSelecionado = "all";
    let unidadeSelecionadaId = null;

    const marcadores = new Map();

    iniciarPagina();

    function iniciarPagina() {
        if (
            !elements.unitsList ||
            !elements.mapContainer
        ) {
            return;
        }

        configurarEventos();
        iniciarMapa();

        enderecoSalvo =
            obterEnderecoSalvo();

        atualizarCartaoDoEndereco();
        carregarUnidades();
    }

    // =====================================================
    // EVENTOS
    // =====================================================

    function configurarEventos() {
        if (elements.searchForm) {
            elements.searchForm.addEventListener(
                "submit",
                function (event) {
                    event.preventDefault();
                    aplicarFiltros();
                }
            );
        }

        if (elements.searchInput) {
            elements.searchInput.addEventListener(
                "input",
                aplicarFiltros
            );
        }

        if (elements.filtersButton) {
            elements.filtersButton.addEventListener(
                "click",
                alternarPainelDeFiltros
            );
        }

        if (elements.distanceFilter) {
            elements.distanceFilter.addEventListener(
                "change",
                aplicarFiltros
            );
        }

        if (elements.openUnitsOnly) {
            elements.openUnitsOnly.addEventListener(
                "change",
                aplicarFiltros
            );
        }

        elements.typeButtons.forEach(
            function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        selecionarTipo(
                            button.dataset.unitType ||
                            "all"
                        );
                    }
                );
            }
        );

        if (elements.useSavedAddressButton) {
            elements.useSavedAddressButton
                .addEventListener(
                    "click",
                    usarEnderecoSalvo
                );
        }

        document.addEventListener(
            "click",
            fecharFiltrosAoClicarFora
        );

        document.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Escape") {
                    fecharPainelDeFiltros();
                }
            }
        );
    }

    function alternarPainelDeFiltros() {
        const estaAberto =
            elements.filtersButton
                .getAttribute("aria-expanded") ===
            "true";

        elements.filtersButton.setAttribute(
            "aria-expanded",
            String(!estaAberto)
        );

        elements.filtersPanel.hidden =
            estaAberto;
    }

    function fecharPainelDeFiltros() {
        if (
            !elements.filtersButton ||
            !elements.filtersPanel
        ) {
            return;
        }

        elements.filtersButton.setAttribute(
            "aria-expanded",
            "false"
        );

        elements.filtersPanel.hidden = true;
    }

    function fecharFiltrosAoClicarFora(event) {
        if (
            !elements.filtersPanel ||
            elements.filtersPanel.hidden
        ) {
            return;
        }

        const clicouNoPainel =
            elements.filtersPanel.contains(
                event.target
            );

        const clicouNoBotao =
            elements.filtersButton.contains(
                event.target
            );

        if (
            !clicouNoPainel &&
            !clicouNoBotao
        ) {
            fecharPainelDeFiltros();
        }
    }

    function selecionarTipo(tipo) {
        tipoSelecionado = tipo;

        elements.typeButtons.forEach(
            function (button) {
                const estaAtivo =
                    button.dataset.unitType ===
                    tipo;

                button.classList.toggle(
                    "active",
                    estaAtivo
                );

                button.setAttribute(
                    "aria-pressed",
                    String(estaAtivo)
                );
            }
        );

        aplicarFiltros();
    }

    async function usarEnderecoSalvo() {
        enderecoSalvo =
            obterEnderecoSalvo();

        if (!enderecoSalvo) {
            window.location.href =
                PREVENTION_PAGE;

            return;
        }

        atualizarCartaoDoEndereco();

        await carregarUnidades(true);
    }

    // =====================================================
    // MAPA
    // =====================================================

    function iniciarMapa() {
        if (typeof L === "undefined") {
            mostrarMensagemDoMapa(
                "Não foi possível carregar o mapa. Verifique sua conexão.",
                false
            );

            return;
        }

        mapa = L.map(
            elements.mapContainer,
            {
                zoomControl: true
            }
        ).setView(
            [
                DEFAULT_LOCATION.latitude,
                DEFAULT_LOCATION.longitude
            ],
            DEFAULT_LOCATION.zoom
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
            L.layerGroup().addTo(mapa);
    }

    function adicionarLocalizacaoDoUsuario(
        localizacao
    ) {
        if (
            !mapa ||
            typeof L === "undefined"
        ) {
            return;
        }

        if (marcadorDoUsuario) {
            mapa.removeLayer(
                marcadorDoUsuario
            );
        }

        if (circuloDoUsuario) {
            mapa.removeLayer(
                circuloDoUsuario
            );
        }

        const icone = L.divIcon({
            className: "",

            html:
                '<div class="user-map-marker"></div>',

            iconSize: [22, 22],

            iconAnchor: [11, 11]
        });

        marcadorDoUsuario = L.marker(
            [
                localizacao.latitude,
                localizacao.longitude
            ],
            {
                icon: icone
            }
        )
            .addTo(mapa)
            .bindPopup(
                "Seu endereço aproximado"
            );

        circuloDoUsuario = L.circle(
            [
                localizacao.latitude,
                localizacao.longitude
            ],
            {
                radius:
                    localizacao.precisao || 80,

                color: "#2885f6",

                fillColor: "#2885f6",

                fillOpacity: 0.08,

                weight: 1
            }
        ).addTo(mapa);
    }

    function renderizarMarcadores(lista) {
        if (
            !mapa ||
            !camadaDeUnidades
        ) {
            return;
        }

        camadaDeUnidades.clearLayers();
        marcadores.clear();

        const limites = [];

        if (localizacaoAtual) {
            limites.push([
                localizacaoAtual.latitude,
                localizacaoAtual.longitude
            ]);
        }

        lista.forEach(
            function (unidade) {
                const marcador = L.marker(
                    [
                        unidade.latitude,
                        unidade.longitude
                    ],
                    {
                        icon:
                            criarIconeDaUnidade(
                                unidade.tipo
                            )
                    }
                ).addTo(
                    camadaDeUnidades
                );

                marcador.bindPopup(
                    criarConteudoDoPopup(
                        unidade
                    )
                );

                marcador.on(
                    "click",
                    function () {
                        selecionarUnidade(
                            unidade.id,
                            false
                        );
                    }
                );

                marcadores.set(
                    unidade.id,
                    marcador
                );

                limites.push([
                    unidade.latitude,
                    unidade.longitude
                ]);
            }
        );

        if (limites.length > 0) {
            mapa.fitBounds(
                limites,
                {
                    padding: [38, 38],
                    maxZoom: 14
                }
            );
        } else if (localizacaoAtual) {
            mapa.setView(
                [
                    localizacaoAtual.latitude,
                    localizacaoAtual.longitude
                ],
                14
            );
        }

        window.setTimeout(
            function () {
                mapa.invalidateSize();
            },
            100
        );
    }

    function criarIconeDaUnidade(tipo) {
        const classe =
            tipo === "upa"
                ? "upa"
                : "ubs";

        return L.divIcon({
            className:
                "unit-map-marker",

            html:
                `<div class="unit-marker-pin ${classe}">` +
                    "<span>+</span>" +
                "</div>",

            iconSize: [42, 50],

            iconAnchor: [21, 48],

            popupAnchor: [0, -45]
        });
    }

    function criarConteudoDoPopup(
        unidade
    ) {
        const distancia =
            formatarDistancia(
                unidade.distancia
            );

        const rota =
            criarLinkDeRota(
                unidade
            );

        return (
            `<strong>${escaparHtml(unidade.nome)}</strong>` +

            `<span>${escaparHtml(unidade.endereco)}</span>` +

            (
                distancia
                    ? `<br><span>${escaparHtml(distancia)} de distância</span>`
                    : ""
            ) +

            `<br><a href="${rota}" target="_blank" rel="noopener noreferrer">` +
                "Abrir rota" +
            "</a>"
        );
    }

    function mostrarMensagemDoMapa(
        texto,
        carregando
    ) {
        if (!elements.mapMessage) {
            return;
        }

        const loader =
            elements.mapMessage.querySelector(
                ".map-message-loader"
            );

        elements.mapMessage.hidden =
            false;

        elements.mapMessageText.textContent =
            texto;

        if (loader) {
            loader.hidden =
                !carregando;
        }
    }

    function ocultarMensagemDoMapa() {
        if (elements.mapMessage) {
            elements.mapMessage.hidden =
                true;
        }
    }

    // =====================================================
    // CARREGAMENTO DAS UNIDADES
    // =====================================================

    async function carregarUnidades(
        ignorarCache = false
    ) {
        mostrarEstadoDeCarregamento();

        const unidadesOficiais =
            obterUnidadesOficiais(
                enderecoSalvo
            );

        unidades =
            unidadesOficiais;

        if (unidades.length > 0) {
            aplicarFiltros();
        }

        // Sem endereço salvo, mostra as unidades
        // cadastradas, mas sem calcular distância.
        if (!enderecoSalvo) {
            unidades =
                UNIDADES_OFICIAIS_TABOAO.map(
                    function (unidade) {
                        return {
                            ...unidade,
                            oficial: true
                        };
                    }
                );

            localizacaoAtual = null;

            aplicarFiltros();
            ocultarMensagemDoMapa();

            return;
        }

        mostrarMensagemDoMapa(
            "Localizando o endereço salvo...",
            true
        );

        try {
            localizacaoAtual =
                await localizarEndereco(
                    enderecoSalvo,
                    ignorarCache
                );

            adicionarLocalizacaoDoUsuario(
                localizacaoAtual
            );

            unidades =
                adicionarDistancias(
                    unidades,
                    localizacaoAtual
                );

            aplicarFiltros();

            // Em Taboão da Serra a lista oficial
            // já contém UBS e UPA.
            if (!possuiUbsEUpa(unidades)) {
                mostrarMensagemDoMapa(
                    "Consultando unidades próximas...",
                    true
                );

                try {
                    const unidadesDoMapa =
                        await buscarUnidadesNoOpenStreetMap(
                            localizacaoAtual.latitude,
                            localizacaoAtual.longitude,
                            Number(
                                elements
                                    .distanceFilter
                                    ?.value || 20
                            )
                        );

                    unidades =
                        mesclarUnidades(
                            unidades,
                            unidadesDoMapa
                        );

                    unidades =
                        adicionarDistancias(
                            unidades,
                            localizacaoAtual
                        );
                } catch (erro) {
                    console.warn(
                        "A consulta complementar de unidades falhou:",
                        erro
                    );
                }
            }

            aplicarFiltros();
            ocultarMensagemDoMapa();
        } catch (erro) {
            console.error(
                "Não foi possível localizar o endereço:",
                erro
            );

            if (unidades.length === 0) {
                unidades =
                    UNIDADES_OFICIAIS_TABOAO.map(
                        function (unidade) {
                            return {
                                ...unidade,
                                oficial: true
                            };
                        }
                    );
            }

            localizacaoAtual = null;

            aplicarFiltros();

            mostrarMensagemDoMapa(
                "Não foi possível calcular sua posição. As unidades continuam disponíveis para consulta.",
                false
            );
        }
    }

    function obterUnidadesOficiais(
        endereco
    ) {
        if (!endereco) {
            return [];
        }

        const cidade =
            normalizarTexto(
                endereco.cidade
            );

        const estado =
            normalizarTexto(
                endereco.estado
            );

        const cidadeCompativel =
            cidade ===
            "taboao da serra";

        const estadoCompativel =
            !estado ||
            estado === "sp" ||
            estado === "sao paulo";

        if (
            !cidadeCompativel ||
            !estadoCompativel
        ) {
            return [];
        }

        return UNIDADES_OFICIAIS_TABOAO.map(
            function (unidade) {
                return {
                    ...unidade,
                    oficial: true
                };
            }
        );
    }

    function possuiUbsEUpa(lista) {
        const possuiUbs =
            lista.some(
                function (unidade) {
                    return unidade.tipo ===
                        "ubs";
                }
            );

        const possuiUpa =
            lista.some(
                function (unidade) {
                    return unidade.tipo ===
                        "upa";
                }
            );

        return (
            possuiUbs &&
            possuiUpa
        );
    }

    function adicionarDistancias(
        lista,
        localizacao
    ) {
        return lista
            .map(
                function (unidade) {
                    return {
                        ...unidade,

                        distancia:
                            calcularDistancia(
                                localizacao.latitude,
                                localizacao.longitude,
                                unidade.latitude,
                                unidade.longitude
                            )
                    };
                }
            )
            .sort(
                function (a, b) {
                    return (
                        a.distancia -
                        b.distancia
                    );
                }
            );
    }

    function mesclarUnidades(
        primeiraLista,
        segundaLista
    ) {
        const resultado = [];
        const chaves = new Set();

        [
            ...primeiraLista,
            ...segundaLista
        ].forEach(
            function (unidade) {
                const chave = [
                    normalizarTexto(
                        unidade.nome
                    ),

                    Number(
                        unidade.latitude
                    ).toFixed(4),

                    Number(
                        unidade.longitude
                    ).toFixed(4)
                ].join("|");

                if (chaves.has(chave)) {
                    return;
                }

                chaves.add(chave);
                resultado.push(unidade);
            }
        );

        return resultado;
    }

    // =====================================================
    // FILTROS E CARDS
    // =====================================================

    function aplicarFiltros() {
        const busca =
            normalizarTexto(
                elements.searchInput
                    ?.value || ""
            );

        const distanciaMaxima =
            Number(
                elements.distanceFilter
                    ?.value || 20
            );

        const somenteAbertas =
            Boolean(
                elements.openUnitsOnly
                    ?.checked
            );

        unidadesFiltradas =
            unidades
                .filter(
                    function (unidade) {
                        if (
                            tipoSelecionado !==
                                "all" &&

                            unidade.tipo !==
                                tipoSelecionado
                        ) {
                            return false;
                        }

                        if (busca) {
                            const conteudo =
                                normalizarTexto(
                                    `${unidade.nome} ${unidade.endereco}`
                                );

                            if (
                                !conteudo.includes(
                                    busca
                                )
                            ) {
                                return false;
                            }
                        }

                        if (
                            Number.isFinite(
                                unidade.distancia
                            ) &&

                            unidade.distancia >
                                distanciaMaxima
                        ) {
                            return false;
                        }

                        if (somenteAbertas) {
                            const situacao =
                                obterSituacaoDaUnidade(
                                    unidade
                                );

                            if (!situacao.aberta) {
                                return false;
                            }
                        }

                        return true;
                    }
                )
                .sort(
                    function (a, b) {
                        if (
                            Number.isFinite(
                                a.distancia
                            ) &&

                            Number.isFinite(
                                b.distancia
                            )
                        ) {
                            return (
                                a.distancia -
                                b.distancia
                            );
                        }

                        return a.nome.localeCompare(
                            b.nome,
                            "pt-BR"
                        );
                    }
                );

        renderizarLista();

        renderizarMarcadores(
            unidadesFiltradas
        );
    }

    function renderizarLista() {
        elements.unitsList.innerHTML =
            "";

        elements.unitsList.setAttribute(
            "aria-busy",
            "false"
        );

        atualizarQuantidadeDeResultados();

        if (
            unidadesFiltradas.length === 0
        ) {
            mostrarEstadoVazio();
            return;
        }

        unidadesFiltradas.forEach(
            function (unidade) {
                const card =
                    criarCardDaUnidade(
                        unidade
                    );

                elements.unitsList.appendChild(
                    card
                );
            }
        );
    }

    function criarCardDaUnidade(
        unidade
    ) {
        const fragmento =
            elements.unitTemplate.content
                .cloneNode(true);

        const card =
            fragmento.querySelector(
                ".unit-card"
            );

        const nome =
            fragmento.querySelector(
                ".unit-card-name"
            );

        const status =
            fragmento.querySelector(
                ".unit-card-status"
            );

        const endereco =
            fragmento.querySelector(
                ".unit-card-address span"
            );

        const horario =
            fragmento.querySelector(
                ".unit-card-hours span:last-child"
            );

        const distancia =
            fragmento.querySelector(
                ".unit-card-distance"
            );

        const link =
            fragmento.querySelector(
                ".unit-details-link"
            );

        const situacao =
            obterSituacaoDaUnidade(
                unidade
            );

        card.classList.add(
            unidade.tipo
        );

        card.dataset.unitId =
            unidade.id;

        card.tabIndex = 0;

        if (
            unidadeSelecionadaId ===
            unidade.id
        ) {
            card.classList.add(
                "selected"
            );
        }

        nome.textContent =
            unidade.nome;

        status.textContent =
            situacao.texto;

        status.classList.toggle(
            "closed",
            !situacao.aberta
        );

        endereco.textContent =
            unidade.endereco;

        horario.textContent =
            unidade.horario ||
            "Horário não informado";

        distancia.textContent =
            Number.isFinite(
                unidade.distancia
            )
                ? `${formatarDistancia(
                    unidade.distancia
                )} de distância`
                : "";

        link.href =
            criarLinkDeRota(
                unidade
            );

        card.addEventListener(
            "click",
            function (event) {
                if (
                    event.target.closest("a")
                ) {
                    return;
                }

                selecionarUnidade(
                    unidade.id,
                    true
                );
            }
        );

        card.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();

                    selecionarUnidade(
                        unidade.id,
                        true
                    );
                }
            }
        );

        return fragmento;
    }

    function selecionarUnidade(
        unidadeId,
        abrirPopup
    ) {
        unidadeSelecionadaId =
            unidadeId;

        document
            .querySelectorAll(
                ".unit-card"
            )
            .forEach(
                function (card) {
                    card.classList.toggle(
                        "selected",

                        card.dataset.unitId ===
                            unidadeId
                    );
                }
            );

        const unidade =
            unidades.find(
                function (item) {
                    return (
                        item.id ===
                        unidadeId
                    );
                }
            );

        const marcador =
            marcadores.get(
                unidadeId
            );

        if (
            mapa &&
            unidade
        ) {
            mapa.setView(
                [
                    unidade.latitude,
                    unidade.longitude
                ],
                16,
                {
                    animate: true
                }
            );
        }

        if (
            abrirPopup &&
            marcador
        ) {
            marcador.openPopup();
        }
    }

    function atualizarQuantidadeDeResultados() {
        const quantidade =
            unidadesFiltradas.length;

        if (quantidade === 0) {
            elements.resultCount.textContent =
                "Nenhuma unidade corresponde aos filtros.";

            return;
        }

        elements.resultCount.textContent =
            quantidade === 1
                ? "1 unidade encontrada"
                : `${quantidade} unidades encontradas`;
    }

    function mostrarEstadoDeCarregamento() {
        elements.unitsList.setAttribute(
            "aria-busy",
            "true"
        );

        elements.unitsList.innerHTML = `
            <div class="units-loading-state">

                <span
                    class="units-loader"
                    aria-hidden="true"
                ></span>

                <p>
                    Localizando UBS e UPA próximas do seu endereço...
                </p>

            </div>
        `;

        elements.resultCount.textContent =
            "Buscando unidades próximas...";
    }

    function mostrarEstadoVazio() {
        const estado =
            document.createElement("div");

        const mensagem =
            document.createElement("p");

        estado.className =
            "units-empty-state";

        mensagem.textContent =
            "Nenhuma unidade foi encontrada com os filtros selecionados.";

        estado.appendChild(
            mensagem
        );

        elements.unitsList.appendChild(
            estado
        );
    }

    function obterSituacaoDaUnidade(
        unidade
    ) {
        if (unidade.tipo === "upa") {
            return {
                texto: "24h",
                aberta: true
            };
        }

        if (
            unidade.funcionamento24h
        ) {
            return {
                texto: "24h",
                aberta: true
            };
        }

        if (
            !unidade.oficial &&
            unidade.aberta === undefined
        ) {
            return {
                texto: "Confira",
                aberta: false
            };
        }

        const agora = new Date();
        const dia = agora.getDay();
        const hora = agora.getHours();

        const aberta =
            dia >= 1 &&
            dia <= 5 &&
            hora >= 7 &&
            hora < 17;

        return {
            texto:
                aberta
                    ? "Aberto"
                    : "Fechado",

            aberta: aberta
        };
    }

    function criarLinkDeRota(
        unidade
    ) {
        const destino =
            `${unidade.latitude},${unidade.longitude}`;

        return (
            "https://www.google.com/maps/dir/?api=1&destination=" +
            encodeURIComponent(destino)
        );
    }

    // =====================================================
    // ENDEREÇO E LOCALIZAÇÃO
    // =====================================================

    function obterEnderecoSalvo() {
        const avaliacao =
            carregarAvaliacao();

        if (
            !avaliacao ||
            !avaliacaoPertenceAoUsuario(
                avaliacao
            )
        ) {
            return null;
        }

        const dados =
            avaliacao.dadosPessoais || {};

        const endereco = {
            logradouro:
                limparTexto(
                    dados.logradouro ||
                    dados.rua
                ),

            numero:
                limparTexto(
                    dados.numero
                ),

            complemento:
                limparTexto(
                    dados.complemento
                ),

            bairro:
                limparTexto(
                    dados.bairro
                ),

            cidade:
                limparTexto(
                    dados.cidade
                ),

            estado:
                limparTexto(
                    dados.estado
                ),

            cep:
                String(
                    dados.cep || ""
                ).replace(/\D/g, "")
        };

        if (
            !endereco.cidade ||
            !endereco.estado
        ) {
            return null;
        }

        endereco.texto =
            montarTextoDoEndereco(
                endereco
            );

        endereco.chave = [
            endereco.logradouro,
            endereco.numero,
            endereco.bairro,
            endereco.cidade,
            endereco.estado,
            endereco.cep
        ]
            .join("|")
            .toLowerCase();

        return endereco;
    }

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
                "Erro ao carregar a avaliação:",
                erro
            );

            return null;
        }
    }

    function avaliacaoPertenceAoUsuario(
        avaliacao
    ) {
        if (
            typeof getSessao !==
            "function"
        ) {
            return true;
        }

        const sessao =
            getSessao();

        if (
            !sessao ||
            !avaliacao.usuarioId
        ) {
            return true;
        }

        return (
            String(sessao.id) ===
            String(avaliacao.usuarioId)
        );
    }

    function montarTextoDoEndereco(
        endereco
    ) {
        const partes = [];

        if (endereco.logradouro) {
            partes.push(
                endereco.numero
                    ? `${endereco.logradouro}, ${endereco.numero}`
                    : endereco.logradouro
            );
        }

        if (endereco.bairro) {
            partes.push(
                endereco.bairro
            );
        }

        partes.push(
            `${endereco.cidade} - ${endereco.estado}`
        );

        if (
            endereco.cep.length === 8
        ) {
            partes.push(
                `CEP ${endereco.cep.replace(
                    /(\d{5})(\d{3})/,
                    "$1-$2"
                )}`
            );
        }

        return partes.join(", ");
    }

    function atualizarCartaoDoEndereco() {
        if (!elements.savedAddressText) {
            return;
        }

        if (!enderecoSalvo) {
            elements.savedAddressText
                .textContent =
                "Preencha seu endereço na avaliação preventiva.";

            return;
        }

        elements.savedAddressText
            .textContent =
            enderecoSalvo.texto;
    }

    async function localizarEndereco(
        endereco,
        ignorarCache
    ) {
        if (!ignorarCache) {
            const cache =
                carregarCache(
                    ADDRESS_LOCATION_CACHE_KEY
                );

            if (
                cache &&
                cache.chave ===
                    endereco.chave &&
                Number.isFinite(
                    cache.latitude
                ) &&
                Number.isFinite(
                    cache.longitude
                )
            ) {
                return {
                    latitude:
                        cache.latitude,

                    longitude:
                        cache.longitude,

                    precisao: 80
                };
            }
        }

        try {
            const localizacao =
                await buscarEnderecoNoNominatim(
                    endereco
                );

            localStorage.setItem(
                ADDRESS_LOCATION_CACHE_KEY,

                JSON.stringify({
                    chave:
                        endereco.chave,

                    latitude:
                        localizacao.latitude,

                    longitude:
                        localizacao.longitude,

                    atualizadoEm:
                        new Date()
                            .toISOString()
                })
            );

            return localizacao;
        } catch (erro) {
            console.warn(
                "A busca pelo endereço completo falhou. Tentando o CEP:",
                erro
            );
        }

        if (
            endereco.cep.length === 8
        ) {
            return buscarLocalizacaoPeloCep(
                endereco.cep,
                ignorarCache
            );
        }

        throw new Error(
            "Endereço sem coordenadas disponíveis."
        );
    }

    async function buscarEnderecoNoNominatim(
        endereco
    ) {
        const parametros =
            new URLSearchParams({
                format: "jsonv2",

                limit: "1",

                countrycodes: "br",

                addressdetails: "1",

                q:
                    `${endereco.texto}, Brasil`
            });

        const resposta =
            await fetchComTempoLimite(
                `https://nominatim.openstreetmap.org/search?${parametros.toString()}`,

                {
                    headers: {
                        "Accept-Language":
                            "pt-BR,pt;q=0.9"
                    }
                },

                8000
            );

        if (!resposta.ok) {
            throw new Error(
                `A consulta retornou ${resposta.status}.`
            );
        }

        const resultados =
            await resposta.json();

        const resultado =
            resultados[0];

        if (!resultado) {
            throw new Error(
                "Endereço não encontrado."
            );
        }

        const latitude =
            Number(resultado.lat);

        const longitude =
            Number(resultado.lon);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            throw new Error(
                "Coordenadas inválidas."
            );
        }

        return {
            latitude: latitude,
            longitude: longitude,
            precisao: 80
        };
    }

    async function buscarLocalizacaoPeloCep(
        cep,
        ignorarCache
    ) {
        if (!ignorarCache) {
            const cache =
                carregarCache(
                    CEP_LOCATION_CACHE_KEY
                );

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
                return {
                    latitude:
                        cache.latitude,

                    longitude:
                        cache.longitude,

                    precisao: 400
                };
            }
        }

        const resposta =
            await fetchComTempoLimite(
                `https://brasilapi.com.br/api/cep/v2/${encodeURIComponent(cep)}`,

                {},

                7000
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
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            throw new Error(
                "O CEP não possui coordenadas."
            );
        }

        localStorage.setItem(
            CEP_LOCATION_CACHE_KEY,

            JSON.stringify({
                cep: cep,

                latitude:
                    latitude,

                longitude:
                    longitude,

                atualizadoEm:
                    new Date()
                        .toISOString()
            })
        );

        return {
            latitude: latitude,
            longitude: longitude,
            precisao: 400
        };
    }

    function carregarCache(chave) {
        const dados =
            localStorage.getItem(
                chave
            );

        if (!dados) {
            return null;
        }

        try {
            return JSON.parse(
                dados
            );
        } catch (erro) {
            return null;
        }
    }

    // =====================================================
    // OPENSTREETMAP / OVERPASS
    // =====================================================

    async function buscarUnidadesNoOpenStreetMap(
        latitude,
        longitude,
        distanciaKm
    ) {
        const raio =
            Math.min(
                Math.max(
                    distanciaKm,
                    5
                ),
                30
            ) * 1000;

        const consulta =
            montarConsultaOverpass(
                latitude,
                longitude,
                raio
            );

        let ultimoErro = null;

        for (
            const endpoint
            of OVERPASS_ENDPOINTS
        ) {
            try {
                const resposta =
                    await fetchComTempoLimite(
                        endpoint,

                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded;charset=UTF-8"
                            },

                            body:
                                `data=${encodeURIComponent(consulta)}`
                        },

                        10000
                    );

                if (!resposta.ok) {
                    throw new Error(
                        `A consulta retornou ${resposta.status}.`
                    );
                }

                const dados =
                    await resposta.json();

                return normalizarUnidadesDoMapa(
                    dados.elements || []
                );
            } catch (erro) {
                ultimoErro = erro;
            }
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
            [out:json][timeout:12];

            (
                nwr(around:${raio},${latitude},${longitude})
                    ["name"~"(^|[^A-Za-z])(UBS|USF|ESF|UPA|AMA)([^A-Za-z]|$)",i];

                nwr(around:${raio},${latitude},${longitude})
                    ["name"~"Unidade Básica de Saúde|Unidade Basica de Saude|Unidade de Pronto Atendimento",i];
            );

            out center tags;
        `;
    }

    function normalizarUnidadesDoMapa(
        elementos
    ) {
        const resultado = [];
        const chaves = new Set();

        elementos.forEach(
            function (elemento) {
                const latitude =
                    Number(
                        elemento.lat ||
                        elemento.center?.lat
                    );

                const longitude =
                    Number(
                        elemento.lon ||
                        elemento.center?.lon
                    );

                const tags =
                    elemento.tags || {};

                const nome =
                    tags.name ||
                    tags.official_name ||
                    tags.short_name ||
                    "Unidade de saúde";

                const tipo =
                    identificarTipoDaUnidade(
                        nome
                    );

                if (
                    !Number.isFinite(
                        latitude
                    ) ||

                    !Number.isFinite(
                        longitude
                    ) ||

                    !tipo
                ) {
                    return;
                }

                const chave = [
                    normalizarTexto(nome),
                    latitude.toFixed(4),
                    longitude.toFixed(4)
                ].join("|");

                if (chaves.has(chave)) {
                    return;
                }

                chaves.add(chave);

                resultado.push({
                    id:
                        `${elemento.type}-${elemento.id}`,

                    nome: nome,

                    tipo: tipo,

                    latitude:
                        latitude,

                    longitude:
                        longitude,

                    endereco:
                        montarEnderecoDasTags(
                            tags
                        ),

                    horario:
                        tags.opening_hours ||
                        "Consulte o horário antes de ir",

                    funcionamento24h:
                        tags.opening_hours ===
                        "24/7",

                    oficial: false
                });
            }
        );

        return resultado;
    }

    function identificarTipoDaUnidade(
        nome
    ) {
        const referencia =
            normalizarTexto(nome);

        if (
            /(^|\s)upa(\s|$)/
                .test(referencia) ||

            referencia.includes(
                "unidade de pronto atendimento"
            )
        ) {
            return "upa";
        }

        if (
            /(^|\s)ubs(\s|$)/
                .test(referencia) ||

            /(^|\s)usf(\s|$)/
                .test(referencia) ||

            /(^|\s)esf(\s|$)/
                .test(referencia) ||

            referencia.includes(
                "unidade basica de saude"
            )
        ) {
            return "ubs";
        }

        return null;
    }

    function montarEnderecoDasTags(
        tags
    ) {
        const rua = [
            tags["addr:street"],
            tags["addr:housenumber"]
        ]
            .filter(Boolean)
            .join(", ");

        const local = [
            tags["addr:suburb"],
            tags["addr:city"]
        ]
            .filter(Boolean)
            .join(" • ");

        return (
            [rua, local]
                .filter(Boolean)
                .join(" • ") ||

            "Endereço disponível ao abrir a rota"
        );
    }

    // =====================================================
    // FUNÇÕES AUXILIARES
    // =====================================================

    async function fetchComTempoLimite(
        url,
        options,
        tempo
    ) {
        const controller =
            new AbortController();

        const temporizador =
            window.setTimeout(
                function () {
                    controller.abort();
                },
                tempo
            );

        try {
            return await fetch(
                url,
                {
                    ...options,
                    signal:
                        controller.signal
                }
            );
        } finally {
            window.clearTimeout(
                temporizador
            );
        }
    }

    function calcularDistancia(
        latitudeInicial,
        longitudeInicial,
        latitudeFinal,
        longitudeFinal
    ) {
        const raioDaTerra = 6371;

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
            2 * Math.atan2(
                Math.sqrt(calculo),
                Math.sqrt(1 - calculo)
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

        if (distancia < 1) {
            return (
                `${Math.round(
                    distancia * 1000
                )} m`
            );
        }

        return (
            `${distancia
                .toFixed(1)
                .replace(".", ",")} km`
        );
    }

    function normalizarTexto(
        valor
    ) {
        return String(
            valor || ""
        )
            .normalize("NFD")

            .replace(
                /[\u0300-\u036f]/g,
                ""
            )

            .toLowerCase()

            .trim();
    }

    function limparTexto(valor) {
        return String(
            valor || ""
        ).trim();
    }

    function escaparHtml(valor) {
        return String(
            valor || ""
        )
            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );
    }
})();