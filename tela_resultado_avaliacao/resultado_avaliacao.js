// =========================================================
// GENSAÚDE SUS - RESULTADO DA AVALIAÇÃO PREVENTIVA
// =========================================================

(function () {
    "use strict";

    const ASSESSMENT_KEY = "gensaude_avaliacao_preventiva";
    const LOGIN_DESTINATION_KEY = "gensaude_destino_apos_login";

    const LOGIN_PAGE = "../tela_login/login.html";
    const FIRST_PAGE = "../tela_prevencao/prevencao.html";
    const UNITS_PAGE = "../tela_unidades/unidades.html";

    // Apenas os três fatores mais importantes aparecem.
    const MAX_VISIBLE_FACTORS = 3;

    const elements = {
        card: document.getElementById("healthResultCard"),
        image: document.querySelector(".result-status-image img"),
        title: document.getElementById("resultStatusTitle"),
        description: document.getElementById("resultStatusDescription"),
        factorsList: document.getElementById("identifiedFactorsList"),
        noFactors: document.getElementById("noFactorsMessage"),
        guidance: document.getElementById("careGuidanceText"),
        retakeButton: document.getElementById("retakeAssessmentButton"),
        findUnitButton: document.getElementById("findReferenceUnitButton"),
        viewUnitsButton: document.getElementById("viewAllUnitsButton")
    };

    let sessao = null;
    let avaliacao = null;

    iniciarPagina();

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
            String(avaliacao.usuarioId) === String(sessao.id) &&
            avaliacao.finalizada === true;

        if (!avaliacaoValida) {
            window.location.href = FIRST_PAGE;
            return;
        }

        const resultado = calcularResultado();

        exibirResultado(resultado);
        salvarResultado(resultado);
        configurarEventos();
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
    // CÁLCULO E PRIORIZAÇÃO DOS FATORES
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

            todosFatores:
                fatores.map(
                    (fator) =>
                        fator.texto
                ),

            fatoresPrincipais:
                fatores
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

    // =====================================================
    // HISTÓRICO FAMILIAR
    // =====================================================

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
                const propriedade = regra[0];
                const texto = regra[1];
                const prioridade = regra[2];

                const possuiCondicao =
                    familiares.some(
                        (familiar) =>
                            familiar[propriedade] ===
                            "sim"
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

    // =====================================================
    // ESTILO DE VIDA
    // =====================================================

    function adicionarEstiloDeVida(
        fatores,
        estilo
    ) {
        const regras = [
            [
                estilo.fuma === "sim" ||
                estilo.fuma === "as_vezes",

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

    // =====================================================
    // CONDIÇÕES DIAGNOSTICADAS
    // =====================================================

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

    // =====================================================
    // SINTOMAS RECENTES
    // =====================================================

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

    // =====================================================
    // ADICIONAR FATOR
    // =====================================================

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
            configuracoes[resultado.nivel];

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

                elements
                    .factorsList
                    .appendChild(item);
            }
        );
    }

    // =====================================================
    // SALVAR RESULTADO
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

    // =====================================================
    // EVENTOS
    // =====================================================

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
                    abrirTodasUnidades
                );
        }

        if (elements.viewUnitsButton) {
            elements.viewUnitsButton
                .addEventListener(
                    "click",
                    abrirTodasUnidades
                );
        }

        document
            .querySelectorAll(
                ".unit-item[data-unit]"
            )
            .forEach(
                (button) => {
                    button.addEventListener(
                        "click",
                        () => {
                            const unidade =
                                button.dataset.unit;

                            window.location.href =
                                `${UNITS_PAGE}?unidade=${encodeURIComponent(unidade)}`;
                        }
                    );
                }
            );
    }

    // =====================================================
    // NAVEGAÇÃO PARA UNIDADES
    // =====================================================

    function abrirTodasUnidades() {
        window.location.href =
            UNITS_PAGE;
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

        // Remove apenas a avaliação.
        // A sessão do usuário permanece ativa.
        localStorage.removeItem(
            ASSESSMENT_KEY
        );

        window.location.href =
            FIRST_PAGE;
    }

})();