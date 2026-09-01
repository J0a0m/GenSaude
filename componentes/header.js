// ==========================================
// HEADER GLOBAL - GENSAÚDE
// ==========================================

const headerContainer =
    document.getElementById("global-header");


if (headerContainer) {

    // ======================================
    // PÁGINA ATIVA
    // ======================================

    const activePage =
        headerContainer.dataset.active || "";


    // ======================================
    // VERIFICAR SESSÃO
    // ======================================

    let sessao = null;


    if (typeof getSessao === "function") {

        sessao = getSessao();

    }


    const logged =
        sessao !== null;


    const userName =
        logged && sessao.nome
            ? sessao.nome.trim()
            : "";


    // ======================================
    // RESUMIR NOME
    // ======================================

    function resumirNome(nome) {

        if (!nome) {
            return "";
        }


        const partes =
            nome
                .trim()
                .split(/\s+/);


        // Exemplo:
        // "Vitor" continua "Vitor"

        if (partes.length === 1) {

            if (partes[0].length > 14) {

                return (
                    partes[0].substring(0, 12) +
                    "..."
                );

            }

            return partes[0];
        }


        const primeiroNome =
            partes[0];

        const ultimoNome =
            partes[partes.length - 1];


        // Nome pequeno pode aparecer completo

        if (nome.length <= 18) {

            return nome;

        }


        // Exemplo:
        // Vitor Oliveira Rangel
        // vira:
        // Vitor R.

        return (
            primeiroNome +
            " " +
            ultimoNome.charAt(0).toUpperCase() +
            "."
        );

    }


    const displayName =
        resumirNome(userName);


    // ======================================
    // EVITAR HTML INSERIDO NO NOME
    // ======================================

    function escaparHTML(texto) {

        const elemento =
            document.createElement("div");

        elemento.textContent =
            texto;

        return elemento.innerHTML;

    }


    const nomeSeguro =
        escaparHTML(displayName);

    const nomeCompletoSeguro =
        escaparHTML(userName);


    // ======================================
    // DEFINE A HOME
    // ======================================

    const homeLink =
        logged
            ? "../tela_inicio_logado/inicio_logado.html"
            : "../tela_inicio/inicio.html";


    // ======================================
    // ÁREA DIREITA
    // ======================================

    const rightArea =
        logged
            ? `
                <div class="profile-area">

                    <button
                        type="button"
                        class="profile-button"
                        id="profileButton"
                        title="${nomeCompletoSeguro}"
                    >

                        <img
                            src="../imagens/icone_entrar.png"
                            alt=""
                            class="profile-icon"
                        >

                        <span class="profile-name">
                            ${nomeSeguro}
                        </span>

                    </button>


                    <button
                        type="button"
                        class="logout-button"
                        id="logoutButton"
                    >
                        Sair
                    </button>

                </div>
            `
            : `
                <a
                    href="../tela_login/login.html"
                    class="header-login-btn"
                >

                    <img
                        src="../imagens/icone_entrar.png"
                        alt=""
                        class="header-login-icon"
                    >

                    <span>
                        Entrar
                    </span>

                </a>
            `;


    // ======================================
    // HEADER
    // ======================================

    headerContainer.innerHTML = `

        <header class="header">

            <div class="navbar">


                <!-- LOGO -->

                <a
                    href="${homeLink}"
                    class="logo"
                >

                    <img
                        src="../imagens/logo_gensaude_sus.png"
                        alt="Logo GenSaúde"
                        class="logo-img"
                    >

                    <span class="logo-text">

                        <strong>
                            GenSaúde
                        </strong>

                        SUS

                    </span>

                </a>


                <!-- MENU -->

                <nav class="menu">

                    <a
                        href="${homeLink}"
                        class="${
                            activePage === "inicio"
                                ? "active"
                                : ""
                        }"
                    >
                        Início
                    </a>


                    <a
                        href="../tela_prevencao/prevencao.html"
                        class="${
                            activePage === "prevencao"
                                ? "active"
                                : ""
                        }"
                    >
                        Prevenção
                    </a>


                    <a
                        href="../tela_ubs_upa/ubs_upa.html"
                        class="${
                            activePage === "ubs-upa"
                                ? "active"
                                : ""
                        }"
                    >
                        UBS ou UPA?
                    </a>


                    <a
                        href="../tela_unidades/unidades.html"
                        class="${
                            activePage === "unidades"
                                ? "active"
                                : ""
                        }"
                    >
                        Unidades
                    </a>


                    <a
                        href="../tela_educacao/educacao.html"
                        class="${
                            activePage === "educacao"
                                ? "active"
                                : ""
                        }"
                    >
                        Educação
                    </a>

                </nav>


                <!-- LOGIN / PERFIL -->

                ${rightArea}


            </div>

        </header>

    `;


    // ======================================
    // LOGOUT
    // ======================================

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                if (
                    typeof fazerLogout ===
                    "function"
                ) {

                    fazerLogout();

                } else {

                    localStorage.removeItem(
                        "gensaude_sessao"
                    );

                }


                window.location.href =
                    "../tela_inicio/inicio.html";

            }
        );

    }


    // ======================================
    // PERFIL
    // ======================================

    const profileButton =
        document.getElementById(
            "profileButton"
        );


    if (profileButton) {

        profileButton.addEventListener(
            "click",
            () => {

                /*
                FUTURAMENTE:

                window.location.href =
                    "../tela_perfil/perfil.html";
                */

                console.log(
                    "Usuário:",
                    sessao
                );

            }
        );

    }

}