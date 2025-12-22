import { fetchProducts, fetchProductById } from "./products.api.js";
import { mapApiProduct } from "./products.mapper.js";

// Exported a mutable array so existing code can import `PRODUCTS` synchronously.
// `getProducts()` will populate this array when the API is fetched.
export const PRODUCTS = [];

export async function getProducts() {
  if (PRODUCTS.length === 0) {
    const apiProducts = await fetchProducts();
    const mapped = apiProducts.map(mapApiProduct);
    PRODUCTS.splice(0, PRODUCTS.length, ...mapped);
  }
  return PRODUCTS;
}

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === String(id)) || null;
}

export async function extractProductsCategories() {
  const products = await getProducts();
  return [...new Set(products.map((p) => p.details.category))];
}
