// ==========================================
// GENSAÚDE SUS
// EDUCAÇÃO EM SAÚDE
// ==========================================

(function () {
    "use strict";

    const elements = {
        searchForm:
            document.getElementById(
                "educationSearchForm"
            ),

        searchInput:
            document.getElementById(
                "educationSearchInput"
            ),

        categoryButtons:
            Array.from(
                document.querySelectorAll(
                    ".category-button"
                )
            ),

        featuredGrid:
            document.getElementById(
                "featuredContentGrid"
            ),

        featuredCards:
            Array.from(
                document.querySelectorAll(
                    ".featured-card"
                )
            ),

        popularTopicButtons:
            Array.from(
                document.querySelectorAll(
                    ".popular-topic-card"
                )
            ),

        emptyState:
            document.getElementById(
                "educationEmptyState"
            ),

        clearButton:
            document.getElementById(
                "clearEducationFiltersButton"
            )
    };

    let selectedCategory = "";

    const popularTopicCategories = {
        "vacinação":
            "prevencao",

        "diabetes hipertensão":
            "alimentacao",

        "saúde da família":
            "prevencao",

        "bem-estar saúde mental":
            "saude-mental"
    };

    initializePage();

    function initializePage() {
        if (
            !elements.searchInput ||
            elements.featuredCards.length === 0
        ) {
            return;
        }

        configureEvents();
        filterContent();
    }

    // ======================================
    // EVENTOS
    // ======================================

    function configureEvents() {
        if (elements.searchForm) {
            elements.searchForm.addEventListener(
                "submit",
                function (event) {
                    event.preventDefault();
                    filterContent();
                }
            );
        }

        elements.searchInput.addEventListener(
            "input",
            filterContent
        );

        elements.categoryButtons.forEach(
            function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        toggleCategory(button);
                    }
                );
            }
        );

        elements.popularTopicButtons.forEach(
            function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        selectPopularTopic(button);
                    }
                );
            }
        );

        if (elements.clearButton) {
            elements.clearButton.addEventListener(
                "click",
                clearFilters
            );
        }

        document.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Escape" &&
                    filtersAreActive()
                ) {
                    clearFilters();
                    elements.searchInput.focus();
                }
            }
        );
    }

    // ======================================
    // CATEGORIAS
    // ======================================

    function toggleCategory(button) {
        const category =
            button.dataset.category || "";

        if (
            selectedCategory === category
        ) {
            selectedCategory = "";
        } else {
            selectedCategory = category;
        }

        updateCategoryButtons();
        filterContent();
    }

    function setCategory(category) {
        const categoryExists =
            elements.categoryButtons.some(
                function (button) {
                    return (
                        button.dataset.category ===
                        category
                    );
                }
            );

        selectedCategory =
            categoryExists
                ? category
                : "";

        updateCategoryButtons();
    }

    function updateCategoryButtons() {
        elements.categoryButtons.forEach(
            function (button) {
                const isActive =
                    button.dataset.category ===
                    selectedCategory;

                button.classList.toggle(
                    "active",
                    isActive
                );

                button.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            }
        );
    }

    // ======================================
    // TEMAS POPULARES
    // ======================================

    function selectPopularTopic(button) {
        const term =
            button.dataset.searchTerm || "";

        const normalizedTerm =
            normalizeText(term);

        const category =
            Object.entries(
                popularTopicCategories
            ).find(
                function (entry) {
                    return (
                        normalizeText(entry[0]) ===
                        normalizedTerm
                    );
                }
            );

        elements.searchInput.value = "";

        setCategory(
            category
                ? category[1]
                : ""
        );

        filterContent();

        if (window.innerWidth <= 900) {
            document
                .querySelector(
                    ".featured-section"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        }
    }

    // ======================================
    // PESQUISA E FILTRAGEM
    // ======================================

    function filterContent() {
        const searchTerm =
            normalizeText(
                elements.searchInput.value
            );

        let visibleContentCount = 0;

        elements.featuredCards.forEach(
            function (card) {
                const matchesSearch =
                    cardMatchesSearch(
                        card,
                        searchTerm
                    );

                const matchesCategory =
                    cardMatchesCategory(
                        card,
                        selectedCategory
                    );

                const shouldShow =
                    matchesSearch &&
                    matchesCategory;

                card.hidden = !shouldShow;

                if (shouldShow) {
                    visibleContentCount += 1;
                }
            }
        );

        updateResultsState(
            visibleContentCount
        );

        updateClearButton();
    }

    function cardMatchesSearch(
        card,
        searchTerm
    ) {
        if (!searchTerm) {
            return true;
        }

        const searchableContent =
            normalizeText(
                [
                    card.dataset.search || "",

                    card.querySelector("h3")
                        ?.textContent || "",

                    card.querySelector("p")
                        ?.textContent || ""
                ].join(" ")
            );

        const terms =
            searchTerm
                .split(/\s+/)
                .filter(Boolean);

        return terms.every(
            function (term) {
                return searchableContent.includes(
                    term
                );
            }
        );
    }

    function cardMatchesCategory(
        card,
        category
    ) {
        if (!category) {
            return true;
        }

        const cardCategories =
            String(
                card.dataset.category || ""
            )
                .split(/\s+/)
                .filter(Boolean);

        return cardCategories.includes(
            category
        );
    }

    function updateResultsState(
        visibleContentCount
    ) {
        const hasResults =
            visibleContentCount > 0;

        if (elements.featuredGrid) {
            elements.featuredGrid.hidden =
                !hasResults;
        }

        if (elements.emptyState) {
            elements.emptyState.hidden =
                hasResults;
        }
    }

    // ======================================
    // LIMPEZA DOS FILTROS
    // ======================================

    function filtersAreActive() {
        return Boolean(
            selectedCategory ||
            elements.searchInput.value.trim()
        );
    }

    function updateClearButton() {
        if (!elements.clearButton) {
            return;
        }

        elements.clearButton.hidden =
            !filtersAreActive();
    }

    function clearFilters() {
        selectedCategory = "";

        elements.searchInput.value = "";

        updateCategoryButtons();
        filterContent();
    }

    // ======================================
    // FUNÇÕES AUXILIARES
    // ======================================

    function normalizeText(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim();
    }
})();