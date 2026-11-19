
// Récupérer les boutons de navigation
const navButtons = document.querySelectorAll(".nav-button");

// Récupérer les boutons des actions rapides
const actionButtons = document.querySelectorAll(".action-card");

// Récupérer toutes les sections
const sections = document.querySelectorAll(".page-section");

// Fonction pour changer de section
function showSection(sectionId) {

    // Masquer toutes les sections
    sections.forEach(section => {
        section.classList.remove("active");
    });

    // Désactiver tous les boutons du menu
    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    // Afficher la section sélectionnée
    const selectedSection = document.getElementById(sectionId);

    if (!selectedSection) return;

    selectedSection.classList.add("active");

    // Activer le bouton correspondant
    const selectedButton = document.querySelector(
        `.nav-button[data-section="${sectionId}"]`
    );

    if (selectedButton) {
        selectedButton.classList.add("active");
    }
}

// Navigation principale
navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const sectionId = button.dataset.section;

        showSection(sectionId);

    });

});

// Navigation depuis les actions rapides
actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const sectionId = button.dataset.section;

        showSection(sectionId);

    });

});
