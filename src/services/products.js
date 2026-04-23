import { apiClient } from "../api/api.js";
import { PRODUCTS } from "../data/products.js";

const PRODUCTS_API_ENDPOINT = "/products";

let cache = [];

function normalizeProduct(p) {
  return {
    ...p,
    images: p.images ?? (p.image ? [p.image] : []),
    name: p.name ?? "",
    description: p.description ?? "",
    id: p.id ?? "",
    category: p.category ?? "",
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    attributes: p.attributes ?? {},
  };
}

export async function fetchProducts({ fresh = false } = {}) {
  if (cache.length > 0 && !fresh) return cache;
  try {
    const res = await apiClient.get(PRODUCTS_API_ENDPOINT);
    cache = (res.data || []).map(normalizeProduct);
  } catch (err) {
    console.warn("fetchProducts failed, using local fallback:", err);
    cache = PRODUCTS.map(normalizeProduct);
  }
  return cache;
}

export async function getProductById(id) {
  const list = await fetchProducts();
  return list.find((p) => p.id === id);
}

export function getCategories(products) {
  const set = new Set();
  (products || []).forEach((p) => {
    if (p.category) set.add(p.category);
  });
  return Array.from(set);
}

export function filterProductsByCategory(products, category) {
  return (products || []).filter((p) => p.category === category);
}

export function searchProducts(products, value) {
  const val = String(value || "").toLowerCase();
  return (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(val) ||
      p.description.toLowerCase().includes(val)
  );
}

export function sortProducts(products, by, order = "asc") {
  const sorted = [...(products || [])];
  sorted.sort((a, b) => {
    const valA = a[by];
    const valB = b[by];

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
}
