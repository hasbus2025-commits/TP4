// js/app.js
import { state } from "./state.js";
import { loadAllData } from "./dataService.js";
import { render, renderError, renderModalDetail } from "./view.js";

/**
 * Attache les écouteurs d'événements pour les filtres et la recherche
 */
function setupEventListeners() {
  const searchInput = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");
  const categoryFilter = document.getElementById("category-filter");
  const ordersContainer = document.getElementById("orders-container");

  // Recherche textuelle par nom de client
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      render(state);
    });
  }

  // Filtre par statut
  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      state.selectedStatus = e.target.value;
      render(state);
    });
  }

  // Filtre par catégorie de produit
  if (categoryFilter) {
    categoryFilter.addEventListener("change", (e) => {
      state.selectedCategory = e.target.value;
      render(state);
    });
  }

  // Clic sur le bouton "Voir détails" d'une commande (Délégation d'événements)
  if (ordersContainer) {
    ordersContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-detail");
      if (btn) {
        const orderId = btn.getAttribute("data-id");
        renderModalDetail(orderId, state);
      }
    });
  }
}

/**
 * Initialisation principale de l'application
 */
async function init() {
  try {
    // 1. Chargement des trois fichiers JSON
    const data = await loadAllData();

    // 2. Hydratation du state central
    state.customers = data.customers;
    state.products = data.products;
    state.orders = data.orders;

    // 3. Configuration des événements utilisateur
    setupEventListeners();

    // 4. Premier rendu complet de l'interface
    render(state);
  } catch (error) {
    renderError("Impossible de charger les données de l'application. Veuillez vérifier vos fichiers JSON.");
  }
}

// Lancement au chargement du DOM
document.addEventListener("DOMContentLoaded", init);