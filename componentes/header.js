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


    if (
        typeof getSessao === "function"
    ) {

        sessao =
            getSessao();

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


        // Apenas um nome

        if (partes.length === 1) {

            if (
                partes[0].length > 14
            ) {

                return (
                    partes[0]
                        .substring(
                            0,
                            12
                        ) +
                    "..."
                );

            }


            return partes[0];

        }


        // Nome curto

        if (nome.length <= 18) {

            return nome;

        }


        // Exemplo:
        // Vitor Oliveira Rangel
        // Vitor R.

        const primeiroNome =
            partes[0];

        const ultimoNome =
            partes[
                partes.length - 1
            ];


        return (
            primeiroNome +
            " " +
            ultimoNome
                .charAt(0)
                .toUpperCase() +
            "."
        );

    }


    const displayName =
        resumirNome(
            userName
        );


    // ======================================
    // PROTEGER TEXTO INSERIDO NO HTML
    // ======================================

    function escaparHTML(texto) {

        const elemento =
            document.createElement(
                "div"
            );


        elemento.textContent =
            texto;


        return elemento.innerHTML;

    }


    const nomeSeguro =
        escaparHTML(
            displayName
        );


    const nomeCompletoSeguro =
        escaparHTML(
            userName
        );


    // ======================================
    // DEFINE A HOME
    // ======================================

    const homeLink =
        logged
            ? "../tela_inicio_logado/inicio_logado.html"
            : "../tela_inicio/inicio.html";


    // ======================================
    // FUNÇÃO DE LINK ATIVO
    // ======================================

    function classeAtiva(
        pagina
    ) {

        return (
            activePage === pagina
                ? "active"
                : ""
        );

    }


    // ======================================
    // ÁREA DESKTOP
    // ======================================

    const desktopAccountArea =
        logged

            ? `
                <div class="profile-area desktop-account-area">

                    <button
                        type="button"
                        class="profile-button"
                        data-profile
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
                        data-logout
                    >
                        Sair
                    </button>

                </div>
            `

            : `
                <div class="desktop-account-area">

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

                </div>
            `;


    // ======================================
    // ÁREA MOBILE
    // ======================================

    const mobileAccountArea =
        logged

            ? `
                <div class="mobile-account-area">

                    <button
                        type="button"
                        class="mobile-profile-button"
                        data-profile
                        title="${nomeCompletoSeguro}"
                    >

                        <img
                            src="../imagens/icone_entrar.png"
                            alt=""
                            class="mobile-profile-icon"
                        >

                        <div class="mobile-profile-text">

                            <span class="mobile-profile-label">
                                Conta
                            </span>

                            <strong>
                                ${nomeSeguro}
                            </strong>

                        </div>

                    </button>


                    <button
                        type="button"
                        class="mobile-logout-button"
                        data-logout
                    >
                        Sair
                    </button>

                </div>
            `

            : `
                <div class="mobile-account-area">

                    <a
                        href="../tela_login/login.html"
                        class="mobile-login-button"
                    >

                        <img
                            src="../imagens/icone_entrar.png"
                            alt=""
                            class="mobile-login-icon"
                        >

                        <span>
                            Entrar
                        </span>

                    </a>

                </div>
            `;


    // ======================================
    // HEADER
    // ======================================

    headerContainer.innerHTML = `

        <header class="header">

            <div class="navbar">


                <!-- =================================
                     LOGO
                ================================== -->

                <a
                    href="${homeLink}"
                    class="logo"
                    aria-label="Ir para o início"
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



                <!-- =================================
                     MENU DESKTOP
                ================================== -->

                <nav
                    class="menu desktop-menu"
                    aria-label="Menu principal"
                >

                    <a
                        href="${homeLink}"
                        class="${classeAtiva("inicio")}"
                    >
                        Início
                    </a>


                    <a
                        href="../tela_prevencao/prevencao.html"
                        class="${classeAtiva("prevencao")}"
                    >
                        Prevenção
                    </a>


                    <a
                        href="../tela_ubs_upa/ubs_upa.html"
                        class="${classeAtiva("ubs-upa")}"
                    >
                        UBS ou UPA?
                    </a>


                    <a
                        href="../tela_unidades/unidades.html"
                        class="${classeAtiva("unidades")}"
                    >
                        Unidades
                    </a>


                    <a
                        href="../tela_educacao/educacao.html"
                        class="${classeAtiva("educacao")}"
                    >
                        Educação
                    </a>

                </nav>



                <!-- =================================
                     CONTA DESKTOP
                ================================== -->

                ${desktopAccountArea}



                <!-- =================================
                     BOTÃO MENU MOBILE
                ================================== -->

                <button
                    type="button"
                    class="mobile-menu-toggle"
                    id="mobileMenuToggle"
                    aria-label="Abrir menu"
                    aria-expanded="false"
                    aria-controls="mobileMenu"
                >

                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>

                </button>


            </div>



            <!-- =====================================
                 MENU MOBILE
            ====================================== -->

            <div
                class="mobile-menu"
                id="mobileMenu"
                aria-hidden="true"
            >

                <nav
                    class="mobile-navigation"
                    aria-label="Menu mobile"
                >

                    <a
                        href="${homeLink}"
                        class="${classeAtiva("inicio")}"
                    >
                        Início
                    </a>


                    <a
                        href="../tela_prevencao/prevencao.html"
                        class="${classeAtiva("prevencao")}"
                    >
                        Prevenção
                    </a>


                    <a
                        href="../tela_ubs_upa/ubs_upa.html"
                        class="${classeAtiva("ubs-upa")}"
                    >
                        UBS ou UPA?
                    </a>


                    <a
                        href="../tela_unidades/unidades.html"
                        class="${classeAtiva("unidades")}"
                    >
                        Unidades
                    </a>


                    <a
                        href="../tela_educacao/educacao.html"
                        class="${classeAtiva("educacao")}"
                    >
                        Educação
                    </a>

                </nav>


                <!-- CONTA MOBILE -->

                ${mobileAccountArea}

            </div>

        </header>

    `;


    // ======================================
    // ELEMENTOS DO MENU MOBILE
    // ======================================

    const mobileMenuToggle =
        document.getElementById(
            "mobileMenuToggle"
        );


    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    // ======================================
    // ABRIR MENU MOBILE
    // ======================================

    function abrirMenuMobile() {

        if (
            !mobileMenu ||
            !mobileMenuToggle
        ) {

            return;

        }


        mobileMenu.classList.add(
            "open"
        );


        mobileMenuToggle.classList.add(
            "active"
        );


        mobileMenuToggle.setAttribute(
            "aria-expanded",
            "true"
        );


        mobileMenuToggle.setAttribute(
            "aria-label",
            "Fechar menu"
        );


        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    // ======================================
    // FECHAR MENU MOBILE
    // ======================================

    function fecharMenuMobile() {

        if (
            !mobileMenu ||
            !mobileMenuToggle
        ) {

            return;

        }


        mobileMenu.classList.remove(
            "open"
        );


        mobileMenuToggle.classList.remove(
            "active"
        );


        mobileMenuToggle.setAttribute(
            "aria-expanded",
            "false"
        );


        mobileMenuToggle.setAttribute(
            "aria-label",
            "Abrir menu"
        );


        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    // ======================================
    // ALTERNAR MENU
    // ======================================

    function alternarMenuMobile() {

        if (!mobileMenu) {

            return;

        }


        const estaAberto =
            mobileMenu.classList.contains(
                "open"
            );


        if (estaAberto) {

            fecharMenuMobile();

        } else {

            abrirMenuMobile();

        }

    }


    // ======================================
    // CLIQUE NO HAMBÚRGUER
    // ======================================

    if (mobileMenuToggle) {

        mobileMenuToggle.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                alternarMenuMobile();

            }
        );

    }


    // ======================================
    // FECHAR AO CLICAR EM UM LINK MOBILE
    // ======================================

    const mobileLinks =
        document.querySelectorAll(
            ".mobile-navigation a"
        );


    mobileLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

                    fecharMenuMobile();

                }
            );

        }
    );


    // ======================================
    // FECHAR COM ESC
    // ======================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                fecharMenuMobile();

            }

        }
    );


    // ======================================
    // FECHAR AO CLICAR FORA
    // ======================================

    document.addEventListener(
        "click",
        (event) => {

            if (
                !mobileMenu ||
                !mobileMenuToggle
            ) {

                return;

            }


            const clicouNoMenu =
                mobileMenu.contains(
                    event.target
                );


            const clicouNoBotao =
                mobileMenuToggle.contains(
                    event.target
                );


            if (
                !clicouNoMenu &&
                !clicouNoBotao
            ) {

                fecharMenuMobile();

            }

        }
    );


    // ======================================
    // FECHAR AO VOLTAR PARA DESKTOP
    // ======================================

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900
            ) {

                fecharMenuMobile();

            }

        }
    );


    // ======================================
    // LOGOUT
    // ======================================

    const logoutButtons =
        document.querySelectorAll(
            "[data-logout]"
        );


    logoutButtons.forEach(
        (logoutButton) => {

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
    );


    // ======================================
    // PERFIL
    // ======================================

    const profileButtons =
        document.querySelectorAll(
            "[data-profile]"
        );


    profileButtons.forEach(
        (profileButton) => {

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
    );

}