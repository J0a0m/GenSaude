const headerContainer = document.getElementById("global-header");

if (headerContainer) {

    const activePage =
        headerContainer.dataset.active || "";

    const logged =
        headerContainer.dataset.logged === "true";

    const userName =
        headerContainer.dataset.name || "João Silva";


    /* =========================================
       DEFINE A HOME
    ========================================= */

    const homeLink = logged
        ? "../tela_inicio_logado/inicio_logado.html"
        : "../tela_inicio/inicio.html";


    /* =========================================
       ÁREA DIREITA
    ========================================= */

    const rightArea = logged
        ? `
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
                    ${userName}
                </span>

            </button>
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


    /* =========================================
       HEADER
    ========================================= */

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
                        class="${activePage === "inicio" ? "active" : ""}"
                    >
                        Início
                    </a>

                    <a
                        href="../tela_prevencao/prevencao.html"
                        class="${activePage === "prevencao" ? "active" : ""}"
                    >
                        Prevenção
                    </a>

                    <a
                        href="../tela_ubs_upa/ubs_upa.html"
                        class="${activePage === "ubs-upa" ? "active" : ""}"
                    >
                        UBS ou UPA?
                    </a>

                    <a
                        href="../tela_unidades/unidades.html"
                        class="${activePage === "unidades" ? "active" : ""}"
                    >
                        Unidades
                    </a>

                    <a
                        href="../tela_educacao/educacao.html"
                        class="${activePage === "educacao" ? "active" : ""}"
                    >
                        Educação
                    </a>

                </nav>


                <!-- LOGIN / PERFIL -->

                ${rightArea}


            </div>

        </header>

    `;

}