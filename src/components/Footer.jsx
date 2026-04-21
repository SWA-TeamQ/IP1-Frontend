import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="text-lg font-semibold text-slate-900">ShopLight</div>
            <p className="mt-2 text-sm text-slate-600">
              Curated modern goods — thoughtful design, ethical sourcing.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/products" className="hover:text-slate-900">
                  All products
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-slate-900">
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-slate-900">
                  Services
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/checkout" className="hover:text-slate-900">
                  Checkout
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-slate-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-slate-900">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Join our newsletter
            </h4>
            <form className="mt-3 flex flex-col gap-3">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
          © {year} ShopLight. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;