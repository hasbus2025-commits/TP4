// js/view.js
import { getOrderDetails, calculateKPIs, getFilteredOrders, getCategories } from "./selectors.js";

/**
 * Affiche un message d'erreur clair dans l'interface
 */
export function renderError(message) {
  const errorContainer = document.getElementById("error-container");
  if (errorContainer) {
    errorContainer.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Erreur :</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
      </div>
    `;
  }
}

/**
 * Rempli le menu déroulant des catégories avec les catégories uniques
 */
export function renderCategoryOptions(categories) {
  const categoryFilter = document.getElementById("category-filter");
  if (!categoryFilter) return;

  const currentSelection = categoryFilter.value;
  let html = '<option value="">Toutes les catégories</option>';

  categories.forEach(cat => {
    html += `<option value="${cat}">${cat}</option>`;
  });

  categoryFilter.innerHTML = html;
  categoryFilter.value = currentSelection;
}

/**
 * Met à jour les 4 indicateurs principaux (KPIs)
 */
export function renderKPIs(state) {
  const kpis = calculateKPIs(state.customers, state.products, state.orders);

  document.getElementById("kpi-customers").textContent = kpis.totalCustomers;
  document.getElementById("kpi-products").textContent = kpis.totalProducts;
  document.getElementById("kpi-orders").textContent = kpis.totalOrders;
  document.getElementById("kpi-revenue").textContent = `${kpis.totalRevenue.toLocaleString()} MAD`;
}

/**
 * Génère le badge Bootstrap correspondant au statut de la commande
 */
function getStatusBadge(status) {
  switch (status) {
    case "Livree":
      return '<span class="badge bg-success">Livrée</span>';
    case "En attente":
      return '<span class="badge bg-warning text-dark">En attente</span>';
    case "Annulee":
      return '<span class="badge bg-danger">Annulée</span>';
    default:
      return `<span class="badge bg-secondary">${status}</span>`;
  }
}

/**
 * Affiche la liste filtrée des commandes
 */
export function renderOrders(state) {
  const container = document.getElementById("orders-container");
  if (!container) return;

  const filteredOrders = getFilteredOrders(
    state.orders,
    state.customers,
    state.products,
    {
      searchQuery: state.searchQuery,
      selectedStatus: state.selectedStatus,
      selectedCategory: state.selectedCategory
    }
  );

  if (filteredOrders.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted fs-5">Aucune commande ne correspond aux critères de recherche.</p>
      </div>
    `;
    return;
  }

  let html = "";
  filteredOrders.forEach(order => {
    const details = getOrderDetails(order, state.customers, state.products);

    html += `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">Commande #${details.id}</h5>
              ${getStatusBadge(details.status)}
            </div>
            <p class="card-text text-muted mb-1">
              <strong>Client :</strong> ${details.customerName} (${details.customerCity})
            </p>
            <p class="card-text text-muted mb-2">
              <strong>Date :</strong> ${details.date}
            </p>
            <hr>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="fw-bold fs-5">${details.totalAmount.toLocaleString()} MAD</span>
              <button class="btn btn-outline-primary btn-sm btn-detail" data-id="${details.id}">
                Voir détails
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Construit et affiche le contenu de la fenêtre modale de détail d'une commande
 */
export function renderModalDetail(orderId, state) {
  const order = state.orders.find(o => o.id === Number(orderId));
  if (!order) return;

  const details = getOrderDetails(order, state.customers, state.products);
  const modalTitle = document.getElementById("orderModalTitle");
  const modalBody = document.getElementById("orderModalBody");

  modalTitle.textContent = `Détail de la Commande #${details.id}`;

  let itemsHtml = "";
  details.items.forEach(item => {
    itemsHtml += `
      <tr>
        <td>${item.productName}</td>
        <td><span class="badge bg-info text-dark">${item.category}</span></td>
        <td>${item.price.toLocaleString()} MAD</td>
        <td>${item.quantity}</td>
        <td class="text-end fw-bold">${item.lineTotal.toLocaleString()} MAD</td>
      </tr>
    `;
  });

  modalBody.innerHTML = `
    <div class="row mb-3">
      <div class="col-md-6">
        <p class="mb-1"><strong>Client :</strong> ${details.customerName}</p>
        <p class="mb-1"><strong>Ville :</strong> ${details.customerCity}</p>
      </div>
      <div class="col-md-6 text-md-end">
        <p class="mb-1"><strong>Date :</strong> ${details.date}</p>
        <p class="mb-1"><strong>Statut :</strong> ${getStatusBadge(details.status)}</p>
      </div>
    </div>
    
    <table class="table table-striped align-middle mb-3">
      <thead>
        <tr>
          <th>Produit</th>
          <th>Catégorie</th>
          <th>Prix Unitaire</th>
          <th>Quantité</th>
          <th class="text-end">Montant Ligne</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" class="text-end fw-bold fs-5">Total Commande :</td>
          <td class="text-end fw-bold fs-5 text-primary">${details.totalAmount.toLocaleString()} MAD</td>
        </tr>
      </tfoot>
    </table>
  `;

  const modalElement = document.getElementById("orderModal");
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
}

/**
 * Fonction de rendu principal de l'application
 */
export function render(state) {
  renderKPIs(state);
  renderCategoryOptions(getCategories(state.products));
  renderOrders(state);
}