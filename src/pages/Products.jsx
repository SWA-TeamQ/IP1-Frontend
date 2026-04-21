import { useEffect, useMemo, useState } from "react";
import ProductList from "../components/ProductList.jsx";
import {
  fetchProducts,
  filterProductsByCategory,
  getCategories,
  searchProducts,
  sortProducts,
} from "../services/products.js";
import { useFavorites } from "../context/FavoritesContext.jsx";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const { list } = useFavorites();

  useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then((items) => {
        if (mounted) setProducts(items);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(
    () => ["all", "favorites", ...getCategories(products)],
    [products]
  );

  const filtered = useMemo(() => {
    let result = products;

    if (category === "favorites") {
      result = result.filter((p) => list.includes(p.id));
    } else if (category !== "all") {
      result = filterProductsByCategory(result, category);
    }

    if (searchTerm.trim()) {
      result = searchProducts(result, searchTerm);
    }

    result = sortProducts(result, sortBy, sortOrder);
    return result;
  }, [products, category, list, searchTerm, sortBy, sortOrder]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
          <p className="mt-2 text-sm text-slate-600">
            Browse curated essentials for everyday life.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === item
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1.5fr_0.8fr_0.8fr]">
        <input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="name">Sort by name</option>
          <option value="price">Sort by price</option>
          <option value="rating">Sort by rating</option>
        </select>
        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div
              key={idx}
              className="h-56 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      ) : (
        <ProductList products={filtered} />
      )}
    </div>
  );
}

export default ProductsPage;