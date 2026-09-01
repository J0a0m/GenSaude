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
    // VERIFICAR SESSÃO AUTOMATICAMENTE
    // ======================================

    let sessao = null;


    if (typeof getSessao === "function") {

        sessao = getSessao();

    }


    const logged =
        sessao !== null;


    const userName =
        logged && sessao.nome
            ? sessao.nome
            : "";


    // ======================================
    // EVITAR HTML INSERIDO PELO USUÁRIO
    // ======================================

    function escaparHTML(texto) {

        const elemento =
            document.createElement("div");

        elemento.textContent =
            texto;

        return elemento.innerHTML;

    }


    const nomeSeguro =
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
                    >

                        <img
                            src="../imagens/icone_entrar.png"
                            alt=""
                            class="profile-icon"
                        >

                        <span>
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

                    // FALLBACK
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
    // BOTÃO DE PERFIL
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
                    "Perfil do usuário:",
                    sessao
                );

            }
        );

    }

}