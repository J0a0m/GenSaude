// ==========================================
// GENSAÚDE SUS
// PREVENÇÃO - ETAPA 1 - LOCALIZAÇÃO
// ==========================================

(function () {
    "use strict";

    const ASSESSMENT_KEY =
        "gensaude_avaliacao_preventiva";

    const LOGIN_DESTINATION_KEY =
        "gensaude_destino_apos_login";

    const CEP_LOCATION_CACHE_KEY =
        "gensaude_localizacao_cep";

    const ADDRESS_LOCATION_CACHE_KEY =
        "gensaude_localizacao_endereco";

    const LOGIN_PAGE =
        "../tela_login/login.html";

    const NEXT_PAGE =
        "../tela_historico_familiar/historico.html";

    const HOME_PAGE =
        "../tela_inicio_logado/inicio_logado.html";

    const form =
        document.getElementById(
            "personalDataForm"
        );

    const cepInput =
        document.getElementById(
            "cep"
        );

    const logradouroInput =
        document.getElementById(
            "logradouro"
        );

    const numeroInput =
        document.getElementById(
            "numero"
        );

    const complementoInput =
        document.getElementById(
            "complemento"
        );

    const bairroInput =
        document.getElementById(
            "bairro"
        );

    const cidadeInput =
        document.getElementById(
            "cidade"
        );

    const estadoSelect =
        document.getElementById(
            "estado"
        );

    const formMessage =
        document.getElementById(
            "formMessage"
        );

    let sessao = null;

    let usuarioAtual = null;

    let avaliacaoAtual = {};

    let ultimoCepConsultado = "";

    let consultandoCep = false;


    iniciar();


    // ==========================================
    // INICIAR
    // ==========================================

    function iniciar() {

        if (
            typeof getSessao ===
            "function"
        ) {

            sessao =
                getSessao();

        }


        if (!sessao) {

            localStorage.setItem(
                LOGIN_DESTINATION_KEY,
                "../tela_prevencao/prevencao.html"
            );


            window.location.href =
                LOGIN_PAGE;

            return;

        }


        if (
            typeof getUsuarioAtual ===
            "function"
        ) {

            usuarioAtual =
                getUsuarioAtual();

        }


        if (!usuarioAtual) {

            usuarioAtual = {

                id:
                    sessao.id || null,

                nome:
                    sessao.nome || "",

                cpf:
                    sessao.cpf || "",

                email:
                    sessao.email || "",

                telefone:
                    "",

                dataNascimento:
                    "",

                sexo:
                    "",

                cep:
                    "",

                logradouro:
                    "",

                numero:
                    "",

                complemento:
                    "",

                bairro:
                    "",

                cidade:
                    "",

                estado:
                    ""

            };

        }


        avaliacaoAtual =
            carregarAvaliacao();


        preencherEnderecoSalvo();

        configurarEventos();

    }


    // ==========================================
    // CARREGAR AVALIAÇÃO
    // ==========================================

    function carregarAvaliacao() {

        const dados =
            localStorage.getItem(
                ASSESSMENT_KEY
            );


        if (!dados) {

            return {};

        }


        try {

            const avaliacao =
                JSON.parse(dados);


            if (
                avaliacao.usuarioId &&
                String(
                    avaliacao.usuarioId
                ) !==
                String(
                    sessao.id
                )
            ) {

                return {};

            }


            return avaliacao;

        } catch (erro) {

            console.error(
                "Erro ao carregar avaliação:",
                erro
            );


            return {};

        }

    }


    // ==========================================
    // PREENCHER ENDEREÇO SALVO
    // ==========================================

    function preencherEnderecoSalvo() {

        const dadosAvaliacao =
            avaliacaoAtual
                .dadosPessoais || {};


        const dados = {

            ...usuarioAtual,

            ...dadosAvaliacao

        };


        cepInput.value =
            formatarCEP(
                dados.cep || ""
            );


        logradouroInput.value =
            dados.logradouro ||
            dados.rua ||
            "";


        numeroInput.value =
            dados.numero || "";


        complementoInput.value =
            dados.complemento || "";


        bairroInput.value =
            dados.bairro || "";


        cidadeInput.value =
            dados.cidade || "";


        estadoSelect.value =
            dados.estado || "";


        const cep =
            obterSomenteNumeros(
                dados.cep
            );


        if (
            cep.length === 8
        ) {

            ultimoCepConsultado =
                cep;


            const enderecoIncompleto =

                !logradouroInput.value ||

                !bairroInput.value ||

                !cidadeInput.value ||

                !estadoSelect.value;


            if (
                enderecoIncompleto
            ) {

                ultimoCepConsultado =
                    "";


                consultarCep(
                    cep
                );

            }

        }

    }


    // ==========================================
    // EVENTOS
    // ==========================================

    function configurarEventos() {

        cepInput.addEventListener(
            "input",
            tratarDigitacaoDoCep
        );


        if (form) {

            form.addEventListener(
                "submit",
                (event) => {

                    event.preventDefault();

                    validarESalvar();

                }
            );

        }


        document.addEventListener(
            "avaliacao:voltar",
            (event) => {

                event.preventDefault();


                window.location.href =
                    HOME_PAGE;

            }
        );


        document.addEventListener(
            "avaliacao:continuar",
            (event) => {

                event.preventDefault();

                validarESalvar();

            }
        );

    }


    // ==========================================
    // DIGITAÇÃO DO CEP
    // ==========================================

    function tratarDigitacaoDoCep() {

        cepInput.value =
            formatarCEP(
                cepInput.value
            );


        const cep =
            obterSomenteNumeros(
                cepInput.value
            );


        if (
            cep.length < 8
        ) {

            ultimoCepConsultado =
                "";

            return;

        }


        if (
            cep !==
                ultimoCepConsultado &&
            !consultandoCep
        ) {

            consultarCep(
                cep
            );

        }

    }


    // ==========================================
    // FORMATAR CEP
    // ==========================================

    function formatarCEP(valor) {

        const numeros =
            obterSomenteNumeros(
                valor
            ).substring(
                0,
                8
            );


        if (
            numeros.length <= 5
        ) {

            return numeros;

        }


        return numeros.replace(
            /(\d{5})(\d{1,3})/,
            "$1-$2"
        );

    }


    function obterSomenteNumeros(
        valor
    ) {

        return String(
            valor || ""
        ).replace(
            /\D/g,
            ""
        );

    }


    // ==========================================
    // CONSULTAR CEP
    // ==========================================

    async function consultarCep(
        cep
    ) {

        if (
            consultandoCep ||
            cep.length !== 8
        ) {

            return;

        }


        consultandoCep =
            true;


        ultimoCepConsultado =
            cep;


        definirCarregamentoDoEndereco(
            true
        );


        mostrarMensagem(
            "Buscando endereço...",
            ""
        );


        try {

            const resposta =
                await fetch(
                    `https://viacep.com.br/ws/${cep}/json/`
                );


            if (!resposta.ok) {

                throw new Error(
                    `A consulta retornou ${resposta.status}.`
                );

            }


            const dados =
                await resposta.json();


            if (dados.erro) {

                throw new Error(
                    "CEP não encontrado."
                );

            }


            logradouroInput.value =
                dados.logradouro || "";


            bairroInput.value =
                dados.bairro || "";


            cidadeInput.value =
                dados.localidade || "";


            estadoSelect.value =
                dados.uf || "";


            limparMensagem();


            if (
                logradouroInput.value
            ) {

                numeroInput.focus();

            } else {

                logradouroInput.focus();

            }

        } catch (erro) {

            console.error(
                "Erro ao consultar CEP:",
                erro
            );


            ultimoCepConsultado =
                "";


            mostrarMensagem(
                "Não foi possível completar o endereço. Preencha os campos manualmente.",
                "error"
            );

        } finally {

            consultandoCep =
                false;


            definirCarregamentoDoEndereco(
                false
            );

        }

    }


    // ==========================================
    // CARREGAMENTO DO ENDEREÇO
    // ==========================================

    function definirCarregamentoDoEndereco(
        carregando
    ) {

        logradouroInput.disabled =
            carregando;


        bairroInput.disabled =
            carregando;


        cidadeInput.disabled =
            carregando;


        estadoSelect.disabled =
            carregando;


        if (
            typeof definirAvaliacaoFooterCarregando ===
            "function"
        ) {

            definirAvaliacaoFooterCarregando(
                carregando
            );

        }

    }


    // ==========================================
    // VALIDAR E SALVAR
    // ==========================================

    function validarESalvar() {

        limparMensagem();


        const cep =
            obterSomenteNumeros(
                cepInput.value
            );


        const logradouro =
            logradouroInput.value
                .trim();


        const numero =
            numeroInput.value
                .trim();


        const complemento =
            complementoInput.value
                .trim();


        const bairro =
            bairroInput.value
                .trim();


        const cidade =
            cidadeInput.value
                .trim();


        const estado =
            estadoSelect.value;


        // CEP

        if (
            cep.length !== 8
        ) {

            erroCampo(
                "Digite um CEP válido.",
                cepInput
            );

            return;

        }


        // RUA

        if (
            logradouro.length < 3
        ) {

            erroCampo(
                "Informe o nome da rua ou avenida.",
                logradouroInput
            );

            return;

        }


        // NÚMERO

        if (!numero) {

            erroCampo(
                "Informe o número do endereço ou digite S/N.",
                numeroInput
            );

            return;

        }


        // BAIRRO

        if (
            bairro.length < 2
        ) {

            erroCampo(
                "Informe seu bairro.",
                bairroInput
            );

            return;

        }


        // CIDADE

        if (
            cidade.length < 2
        ) {

            erroCampo(
                "Informe sua cidade.",
                cidadeInput
            );

            return;

        }


        // ESTADO

        if (!estado) {

            erroCampo(
                "Selecione seu estado.",
                estadoSelect
            );

            return;

        }


        // ======================================
        // ENDEREÇO COMPLETO
        // ======================================

        const enderecoCompleto = [

            `${logradouro}, ${numero}`,

            complemento,

            bairro,

            `${cidade} - ${estado}`,

            cep

        ]
            .filter(Boolean)
            .join(", ");


        // ======================================
        // DADOS ANTERIORES
        // ======================================

        const dadosAnteriores =
            avaliacaoAtual
                .dadosPessoais || {};


        /*
            Os dados que já existem na conta
            continuam salvos, mesmo não aparecendo
            novamente no formulário.
        */

        const dadosPessoais = {

            ...dadosAnteriores,


            nome:

                usuarioAtual.nome ||

                dadosAnteriores.nome ||

                sessao.nome ||

                "",


            dataNascimento:

                usuarioAtual
                    .dataNascimento ||

                dadosAnteriores
                    .dataNascimento ||

                "",


            sexo:

                usuarioAtual.sexo ||

                dadosAnteriores.sexo ||

                "",


            cpf:

                usuarioAtual.cpf ||

                dadosAnteriores.cpf ||

                sessao.cpf ||

                "",


            email:

                usuarioAtual.email ||

                dadosAnteriores.email ||

                sessao.email ||

                "",


            telefone:

                usuarioAtual.telefone ||

                dadosAnteriores.telefone ||

                "",


            cep:
                cep,


            logradouro:
                logradouro,


            rua:
                logradouro,


            numero:
                numero,


            complemento:
                complemento,


            bairro:
                bairro,


            cidade:
                cidade,


            estado:
                estado,


            enderecoCompleto:
                enderecoCompleto

        };


        // ======================================
        // ENDEREÇO DA CONTA
        // ======================================

        const enderecoDaConta = {

            cep:
                cep,

            logradouro:
                logradouro,

            rua:
                logradouro,

            numero:
                numero,

            complemento:
                complemento,

            bairro:
                bairro,

            cidade:
                cidade,

            estado:
                estado,

            enderecoCompleto:
                enderecoCompleto

        };


        atualizarEnderecoDaConta(
            enderecoDaConta
        );


        salvarEtapaAvaliacao(
            dadosPessoais
        );


        limparCachesDeLocalizacao();


        mostrarMensagem(
            "Endereço salvo com sucesso.",
            "success"
        );


        if (
            typeof definirAvaliacaoFooterCarregando ===
            "function"
        ) {

            definirAvaliacaoFooterCarregando(
                true
            );

        }


        window.setTimeout(
            () => {

                window.location.href =
                    NEXT_PAGE;

            },
            350
        );

    }


    // ==========================================
    // ATUALIZAR ENDEREÇO DA CONTA
    // ==========================================

    function atualizarEnderecoDaConta(
        endereco
    ) {

        if (
            typeof getUsuarios !==
                "function" ||
            typeof salvarUsuarios !==
                "function"
        ) {

            return;

        }


        const usuarios =
            getUsuarios();


        const indice =
            usuarios.findIndex(
                (usuario) =>

                    String(
                        usuario.id
                    ) ===

                    String(
                        sessao.id
                    )
            );


        if (
            indice === -1
        ) {

            return;

        }


        usuarios[indice] = {

            ...usuarios[indice],

            ...endereco

        };


        salvarUsuarios(
            usuarios
        );


        usuarioAtual =
            usuarios[indice];

    }


    // ==========================================
    // SALVAR ETAPA
    // ==========================================

    function salvarEtapaAvaliacao(
        dadosPessoais
    ) {

        const agora =
            new Date()
                .toISOString();


        avaliacaoAtual = {

            ...avaliacaoAtual,


            usuarioId:
                sessao.id,


            etapaAtual:
                2,


            iniciadaEm:

                avaliacaoAtual
                    .iniciadaEm ||

                agora,


            atualizadoEm:
                agora,


            dadosPessoais:
                dadosPessoais,


            historicoFamiliar:

                avaliacaoAtual
                    .historicoFamiliar ||

                {},


            estiloDeVida:

                avaliacaoAtual
                    .estiloDeVida ||

                {},


            sintomasCondicoes:

                avaliacaoAtual
                    .sintomasCondicoes ||

                {},


            resumo:

                avaliacaoAtual
                    .resumo ||

                {}

        };


        localStorage.setItem(
            ASSESSMENT_KEY,
            JSON.stringify(
                avaliacaoAtual
            )
        );

    }


    // ==========================================
    // LIMPAR CACHE DA LOCALIZAÇÃO ANTIGA
    // ==========================================

    function limparCachesDeLocalizacao() {

        localStorage.removeItem(
            CEP_LOCATION_CACHE_KEY
        );


        localStorage.removeItem(
            ADDRESS_LOCATION_CACHE_KEY
        );

    }


    // ==========================================
    // MENSAGENS
    // ==========================================

    function erroCampo(
        mensagem,
        campo
    ) {

        mostrarMensagem(
            mensagem,
            "error"
        );


        campo.focus();

    }


    function mostrarMensagem(
        mensagem,
        tipo
    ) {

        if (!formMessage) {

            return;

        }


        formMessage.textContent =
            mensagem;


        formMessage.className =
            "form-message";


        if (tipo) {

            formMessage.classList.add(
                tipo
            );

        }

    }


    function limparMensagem() {

        mostrarMensagem(
            "",
            ""
        );

    }

})();