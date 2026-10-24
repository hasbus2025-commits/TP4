// js/dataService.js

/**
 * Charge un fichier JSON à partir de son chemin.
 * Vérifie si la réponse HTTP est correcte (response.ok).
 */
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur HTTP lors du chargement de ${url} (Statut: ${response.status})`);
  }
  return await response.json();
}

/**
 * Charge simultanément les 3 fichiers JSON du projet.
 * Retourne un objet contenant customers, products et orders.
 */
export async function loadAllData() {
  try {
    const [customers, products, orders] = await Promise.all([
      fetchJson("data/customers.json"),
      fetchJson("data/products.json"),
      fetchJson("data/orders.json")
    ]);

    return { customers, products, orders };
  } catch (error) {
    console.error("Erreur dans dataService :", error);
    throw error; // On propage l'erreur pour pouvoir l'afficher dans l'interface
  }
}