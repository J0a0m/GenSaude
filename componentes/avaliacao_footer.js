// ==========================================
// GENSAÚDE SUS
// COMPONENTE FOOTER DA AVALIAÇÃO PREVENTIVA
// ==========================================


document.addEventListener(
    "DOMContentLoaded",
    inicializarAvaliacaoFooter
);


// ==========================================
// INICIALIZAR COMPONENTE
// ==========================================

function inicializarAvaliacaoFooter() {

    const footerContainer =
        document.getElementById(
            "avaliacao-footer"
        );


    if (!footerContainer) {

        return;

    }


    // ======================================
    // CONFIGURAÇÕES DA TELA
    // ======================================

    const isFinal =
        footerContainer.dataset.final ===
        "true";


    const textoContinuar =
        isFinal
            ? "Finalizar avaliação"
            : "Continuar";


    // ======================================
    // CRIAR CONTEÚDO
    // ======================================

    footerContainer.innerHTML = `

        <div class="avaliacao-footer">


            <button
                class="btn-avaliacao-voltar"
                id="avaliacaoFooterVoltar"
                type="button"
            >

                <span
                    class="avaliacao-footer-seta"
                    aria-hidden="true"
                >
                    ←
                </span>

                <span>
                    Voltar
                </span>

            </button>



            <div class="avaliacao-aviso">

                <img
                    src="../imagens/icone_seguranca.png"
                    alt=""
                    aria-hidden="true"
                >

                <p>
                    Seus dados são utilizados exclusivamente
                    para sua avaliação preventiva em saúde.
                </p>

            </div>



            <button
                class="btn-avaliacao-continuar"
                id="avaliacaoFooterContinuar"
                type="button"
            >

                <span>
                    ${textoContinuar}
                </span>

                <span
                    class="avaliacao-footer-seta"
                    aria-hidden="true"
                >
                    →
                </span>

            </button>


        </div>

    `;


    // ======================================
    // ELEMENTOS
    // ======================================

    const botaoVoltar =
        document.getElementById(
            "avaliacaoFooterVoltar"
        );


    const botaoContinuar =
        document.getElementById(
            "avaliacaoFooterContinuar"
        );


    // ======================================
    // BOTÃO VOLTAR
    // ======================================

    if (botaoVoltar) {

        botaoVoltar.addEventListener(
            "click",
            () => {

                const eventoVoltar =
                    new CustomEvent(
                        "avaliacao:voltar",
                        {
                            bubbles: true,
                            cancelable: true,
                            detail: {
                                footer:
                                    footerContainer
                            }
                        }
                    );


                const continuarAcaoPadrao =
                    footerContainer.dispatchEvent(
                        eventoVoltar
                    );


                /*
                    Se a tela possuir uma lógica própria,
                    ela utilizará event.preventDefault().

                    Isso permite que a própria tela salve
                    os dados no localStorage antes de voltar.
                */

                if (!continuarAcaoPadrao) {

                    return;

                }


                const telaAnterior =
                    footerContainer.dataset.back;


                if (telaAnterior) {

                    window.location.href =
                        telaAnterior;

                    return;

                }


                history.back();

            }
        );

    }


    // ======================================
    // BOTÃO CONTINUAR
    // ======================================

    if (botaoContinuar) {

        botaoContinuar.addEventListener(
            "click",
            () => {

                const eventoContinuar =
                    new CustomEvent(
                        "avaliacao:continuar",
                        {
                            bubbles: true,
                            cancelable: true,
                            detail: {
                                footer:
                                    footerContainer,

                                isFinal:
                                    isFinal
                            }
                        }
                    );


                const continuarAcaoPadrao =
                    footerContainer.dispatchEvent(
                        eventoContinuar
                    );


                /*
                    Cada etapa poderá impedir a navegação
                    automática utilizando:

                    event.preventDefault();

                    Depois disso, a etapa poderá:

                    1. Validar os campos;
                    2. Salvar no localStorage;
                    3. Atualizar a etapa atual;
                    4. Navegar para a próxima página.
                */

                if (!continuarAcaoPadrao) {

                    return;

                }


                const proximaTela =
                    footerContainer.dataset.next;


                if (proximaTela) {

                    window.location.href =
                        proximaTela;

                }

            }
        );

    }


    // ======================================
    // INFORMAR QUE O COMPONENTE ESTÁ PRONTO
    // ======================================

    footerContainer.dispatchEvent(
        new CustomEvent(
            "avaliacao:footer-pronto",
            {
                bubbles: true,
                detail: {
                    botaoVoltar:
                        botaoVoltar,

                    botaoContinuar:
                        botaoContinuar,

                    isFinal:
                        isFinal
                }
            }
        )
    );

}


// ==========================================
// ATIVAR OU DESATIVAR BOTÃO CONTINUAR
// ==========================================

function definirAvaliacaoFooterCarregando(
    carregando
) {

    const botaoContinuar =
        document.getElementById(
            "avaliacaoFooterContinuar"
        );


    if (!botaoContinuar) {

        return;

    }


    botaoContinuar.disabled =
        carregando;


    botaoContinuar.setAttribute(
        "aria-busy",
        carregando
            ? "true"
            : "false"
    );

}


// ==========================================
// ALTERAR TEXTO DO BOTÃO CONTINUAR
// ==========================================

function definirTextoAvaliacaoFooter(
    texto
) {

    const botaoContinuar =
        document.getElementById(
            "avaliacaoFooterContinuar"
        );


    if (!botaoContinuar) {

        return;

    }


    const textoBotao =
        botaoContinuar.querySelector(
            "span:first-child"
        );


    if (textoBotao) {

        textoBotao.textContent =
            texto;

    }

}