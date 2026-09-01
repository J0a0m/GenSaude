// ==========================================
// AVISO GLOBAL - GENSAÚDE
// ==========================================

const disclaimerContainer =
    document.getElementById("global-disclaimer");


if (disclaimerContainer) {

    disclaimerContainer.innerHTML = `

        <section class="global-disclaimer">

            <div class="global-disclaimer-left">

                <img
                    src="../imagens/disclaimer.png"
                    alt=""
                    class="global-disclaimer-icon"
                >

                <p>
                    O GenSaúde SUS orienta, mas não substitui avaliação profissional.
                </p>

            </div>


            <img
                src="../imagens/efeito_disclaimer.png"
                alt=""
                class="global-disclaimer-decoration"
            >

        </section>

    `;

}