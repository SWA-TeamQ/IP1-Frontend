import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { formatPrice } from "../utils/formatters.js";

function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!product) return null;

  const image = product.images?.[0] || "";
  const currentPrice = product.salePrice ?? product.price ?? 0;
  const originalPrice = product.price ?? currentPrice;
  const onSale = originalPrice > currentPrice;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <img
            src={image}
            alt={product.name}
            className="h-44 w-full rounded-xl object-cover"
            loading="lazy"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
            isFavorite(product.id)
              ? "bg-rose-500 text-white"
              : "bg-white/90 text-slate-700"
          }`}
        >
          {isFavorite(product.id) ? "♥" : "♡"}
        </button>
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white">
            {product.category}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-base font-semibold text-slate-900">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-slate-600">{product.description}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-slate-900">
            ${formatPrice(currentPrice)}
          </span>
          {onSale && (
            <span className="text-sm text-slate-400 line-through">
              ${formatPrice(originalPrice)}
            </span>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            View Details
          </Link>
          <button
            type="button"
            className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
            onClick={() => addItem(product.id, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;