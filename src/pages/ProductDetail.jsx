import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts, getProductById } from "../services/products.js";
import { formatPrice } from "../utils/formatters.js";
import { useCart } from "../context/CartContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";

function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const prod = await getProductById(id);
      const all = await fetchProducts();
      if (!mounted) return;
      setProduct(prod);
      if (prod?.images?.length) setActiveImage(prod.images[0]);
      const related = all.filter(
        (p) => p.details?.category === prod?.details?.category && p.id !== prod?.id
      );
      setSuggestions(related);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const details = useMemo(() => product?.details ?? {}, [product]);
  const currentPrice = product?.salePrice ?? details?.salePrice ?? product?.price ?? 0;
  const originalPrice = product?.price ?? currentPrice;
  const rating = details?.rating ?? 0;
  const reviewCount = details?.reviewCount ?? product?.reviews?.length ?? 0;

  if (!product) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">Product not found.</p>
        <Link
          to="/products"
          className="mt-4 inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <img
              src={activeImage || product.images?.[0]}
              alt={product.name}
              className="h-80 w-full rounded-xl object-cover"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {(product.images || []).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border ${
                  activeImage === img ? "border-slate-900" : "border-slate-200"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {details?.category ?? "Category"}
            </span>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              {product.name}
            </h1>
            <p className="mt-3 text-slate-600">{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-semibold text-slate-900">
              ${formatPrice(currentPrice)}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-base text-slate-400 line-through">
                ${formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <div className="text-sm text-slate-600">
            ⭐ {rating} ({reviewCount} reviews)
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addItem(product.id, 1)}
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              className={`rounded-lg border px-5 py-3 text-sm font-semibold ${
                isFavorite(product.id)
                  ? "border-rose-400 text-rose-500"
                  : "border-slate-200 text-slate-700"
              }`}
            >
              {isFavorite(product.id) ? "Favorited" : "Add to favorites"}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Features</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
              {(product.features || []).map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-slate-200 px-3 py-1"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Why you'll love this
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {(product.highlights || []).map((item) => (
            <li
              key={item}
              className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Ratings & Reviews
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-sm text-slate-600">
            ⭐ {rating} ({reviewCount} reviews)
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {(product.reviews || []).map((review) => (
              <li key={review.id} className="border-b border-slate-100 pb-3">
                <div className="font-semibold">{review.user}</div>
                <div>⭐ {review.rating}</div>
                <p className="text-slate-600">{review.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Add Your Review</h2>
        <form
          className="rounded-2xl border border-slate-200 bg-white p-6"
          onSubmit={(event) => {
            event.preventDefault();
            alert("Review submitted (simulation).");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Rating
              </label>
              <select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Great</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Your name
              </label>
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Review
              </label>
              <textarea
                rows="4"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Submit Review
          </button>
        </form>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            You may also like
          </h2>
          <Link
            to="/products"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            Browse all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.length > 0 ? (
            suggestions.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
              >
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="h-40 w-full rounded-xl object-cover"
                />
                <div className="mt-3 font-semibold">{item.name}</div>
                <div className="text-slate-500">
                  ${formatPrice(item.salePrice ?? item.price)}
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
              No similar products found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductDetailPage;