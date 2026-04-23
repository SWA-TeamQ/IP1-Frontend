import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../services/products.js";
import ProductList from "../../components/ProductList.jsx";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then((list) => {
        if (mounted) setProducts(list.slice(0, 4));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-16">
      <section className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              ShopLight
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900 sm:text-5xl">
              Thoughtfully chosen goods for modern living.
            </h1>
            <p className="mt-4 text-base text-slate-600">
              Curated essentials designed to elevate daily routines with style,
              comfort, and performance.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Shop collection
              </Link>
              <Link
                to="/about"
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Learn our story
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["4.8★", "Average rating"],
                ["48h", "Fast delivery"],
                ["1k+", "Happy shoppers"],
              ].map(([stat, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center"
                >
                  <div className="text-lg font-semibold text-slate-900">
                    {stat}
                  </div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-slate-900/5 blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
              alt="Premium red athletic shoe"
              className="relative w-full rounded-3xl object-cover shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Our promise",
            body: "Transparent pricing, verified quality, and ethically sourced goods.",
            link: "/about",
            cta: "About us",
          },
          {
            title: "Premium services",
            body: "Concierge support, secure checkout, and fast delivery.",
            link: "/services",
            cta: "Explore services",
          },
          {
            title: "Need help?",
            body: "Our team is ready to guide your next purchase.",
            link: "/contact",
            cta: "Contact support",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{item.body}</p>
            <Link
              to={item.link}
              className="mt-4 inline-flex text-sm font-semibold text-slate-900"
            >
              {item.cta} →
            </Link>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Popular, highly rated, and on sale.
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            View all products →
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : (
          <ProductList products={products} />
        )}
      </section>
    </div>
  );
}

export default HomePage;