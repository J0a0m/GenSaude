// ==========================================
// GENSAÚDE SUS
// TELA UBS OU UPA
// ==========================================

(function () {
    "use strict";

    const ASSESSMENT_KEY =
        "gensaude_avaliacao_preventiva";

    const findUbsButton =
        document.getElementById("findUbsButton");

    const findUpaButton =
        document.getElementById("findUpaButton");

    iniciar();

    function iniciar() {
        if (findUbsButton) {
            findUbsButton.addEventListener(
                "click",
                function () {
                    abrirBuscaNoMapa("UBS");
                }
            );
        }

        if (findUpaButton) {
            findUpaButton.addEventListener(
                "click",
                function () {
                    abrirBuscaNoMapa("UPA");
                }
            );
        }
    }

    function abrirBuscaNoMapa(tipoDeUnidade) {
        const endereco = obterEnderecoSalvo();

        if (!endereco) {
            alert(
                "Não encontramos um endereço salvo. " +
                "Preencha seu endereço completo na avaliação preventiva " +
                "para localizar unidades próximas."
            );

            return;
        }

        const busca =
            `${tipoDeUnidade} próxima de ${endereco}`;

        const url =
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(busca);

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    }

    function obterEnderecoSalvo() {
        const avaliacao = carregarAvaliacao();

        if (!avaliacao) {
            return "";
        }

        if (!avaliacaoPertenceAoUsuarioAtual(avaliacao)) {
            return "";
        }

        const dados =
            avaliacao.dadosPessoais || {};

        const logradouro = limparTexto(
            dados.logradouro || dados.rua
        );

        const numero = limparTexto(dados.numero);
        const complemento = limparTexto(dados.complemento);
        const bairro = limparTexto(dados.bairro);
        const cidade = limparTexto(dados.cidade);
        const estado = limparTexto(dados.estado);
        const cep = formatarCep(dados.cep);

        const partes = [];

        if (logradouro) {
            partes.push(
                numero
                    ? `${logradouro}, ${numero}`
                    : logradouro
            );
        }

        if (complemento) {
            partes.push(complemento);
        }

        if (bairro) {
            partes.push(bairro);
        }

        if (cidade && estado) {
            partes.push(`${cidade} - ${estado}`);
        } else if (cidade) {
            partes.push(cidade);
        } else if (estado) {
            partes.push(estado);
        }

        if (cep) {
            partes.push(`CEP ${cep}`);
        }

        return partes.join(", ");
    }

    function carregarAvaliacao() {
        const dadosSalvos =
            localStorage.getItem(ASSESSMENT_KEY);

        if (!dadosSalvos) {
            return null;
        }

        try {
            return JSON.parse(dadosSalvos);
        } catch (erro) {
            console.error(
                "Não foi possível carregar a avaliação:",
                erro
            );

            return null;
        }
    }

    function avaliacaoPertenceAoUsuarioAtual(avaliacao) {
        if (typeof getSessao !== "function") {
            return true;
        }

        const sessao = getSessao();

        if (!sessao || !avaliacao.usuarioId) {
            return true;
        }

        return String(avaliacao.usuarioId) ===
            String(sessao.id);
    }

    function limparTexto(valor) {
        return String(valor || "").trim();
    }

    function formatarCep(valor) {
        const numeros = String(valor || "")
            .replace(/\D/g, "")
            .substring(0, 8);

        if (numeros.length !== 8) {
            return numeros;
        }

        return numeros.replace(
            /(\d{5})(\d{3})/,
            "$1-$2"
        );
    }
})();