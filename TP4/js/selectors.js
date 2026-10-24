// js/selectors.js

/**
 * 1. Retrouve un client par son ID avec find()
 */
export function getCustomerById(customers, customerId) {
  return customers.find(c => c.id === customerId);
}

/**
 * 2. Retrouve un produit par son ID avec find()
 */
export function getProductById(products, productId) {
  return products.find(p => p.id === productId);
}

/**
 * 3. Reconstruit les détails d'une commande avec map() et find()
 * Calcule le montant de chaque ligne (prix x quantité)
 */
export function getOrderDetails(order, customers, products) {
  const customer = getCustomerById(customers, order.customerId);

  const items = order.items.map(item => {
    const product = getProductById(products, item.productId);
    const price = product ? product.price : 0;
    const name = product ? product.name : "Produit inconnu";
    const category = product ? product.category : "N/A";
    const lineTotal = price * item.quantity;

    return {
      ...item,
      productName: name,
      category: category,
      price: price,
      lineTotal: lineTotal
    };
  });

  // Calcul du total de la commande avec forEach()
  let totalAmount = 0;
  items.forEach(item => {
    totalAmount += item.lineTotal;
  });

  return {
    ...order,
    customerName: customer ? customer.name : "Client inconnu",
    customerCity: customer ? customer.city : "Ville inconnue",
    items: items,
    totalAmount: totalAmount
  };
}

/**
 * 4. Filtre les commandes selon les critères (Recherche client, Statut, Catégorie)
 * Utilise filter()
 */
export function getFilteredOrders(orders, customers, products, filters) {
  const { searchQuery, selectedStatus, selectedCategory } = filters;

  return orders.filter(order => {
    const customer = getCustomerById(customers, order.customerId);

    // Filtre 1 : Recherche par nom de client
    if (searchQuery) {
      const nameMatch = customer && customer.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!nameMatch) return false;
    }

    // Filtre 2 : Statut de la commande
    if (selectedStatus && order.status !== selectedStatus) {
      return false;
    }

    // Filtre 3 : Catégorie de produit contenu dans la commande
    if (selectedCategory) {
      const hasCategory = order.items.some(item => {
        const product = getProductById(products, item.productId);
        return product && product.category === selectedCategory;
      });
      if (!hasCategory) return false;
    }

    return true;
  });
}

/**
 * 5. Calcule les 4 indicateurs clés (KPIs)
 * Utilise forEach() pour cumuler le montant total
 */
export function calculateKPIs(customers, products, orders) {
  let totalRevenue = 0;

  orders.forEach(order => {
    order.items.forEach(item => {
      const product = getProductById(products, item.productId);
      if (product) {
        totalRevenue += product.price * item.quantity;
      }
    });
  });

  return {
    totalCustomers: customers.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: totalRevenue
  };
}

/**
 * 6. Extrait la liste des catégories uniques disponibles pour le filtre
 */
export function getCategories(products) {
  const categories = products.map(p => p.category);
  return [...new Set(categories)]; // Supprime les doublons
}