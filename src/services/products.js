import { apiClient } from "../api/api.js";

const PRODUCTS_API_ENDPOINT = "/products";

let cache = [];

export async function fetchProducts({ fresh = false } = {}) {
  if (cache.length > 0 && !fresh) return cache;
  const res = await apiClient.get(PRODUCTS_API_ENDPOINT);
  // res is already the unwrapped data payload (should be an array)
  cache = Array.isArray(res) ? res : (res?.data || []);
  return cache;
}

export async function getProductById(id) {
  const res = await apiClient.get(`${PRODUCTS_API_ENDPOINT}/${id}`);
  // res is already the unwrapped data payload (should be the product object)
  return res;
}

export function getCategories(products) {
  const set = new Set();
  const list = Array.isArray(products) ? products : [];
  list.forEach((p) => {
    if (p.category) set.add(p.category);
  });
  return Array.from(set);
}

export function filterProductsByCategory(products, category) {
  const list = Array.isArray(products) ? products : [];
  return list.filter((p) => p.category === category);
}

export function searchProducts(products, value) {
  const list = Array.isArray(products) ? products : [];
  const val = String(value || "").toLowerCase();
  return list.filter(
    (p) =>
      p.name?.toLowerCase().includes(val) ||
      p.description?.toLowerCase().includes(val)
  );
}

export function sortProducts(products, by, order = "asc") {
  const list = Array.isArray(products) ? [...products] : [];
  list.sort((a, b) => {
    const valA = a[by];
    const valB = b[by];

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  return list;
}
