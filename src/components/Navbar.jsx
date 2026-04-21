import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass =
  "text-sm font-semibold text-slate-700 transition hover:text-slate-900";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalQuantity } = useCart();
  const { user, logout } = useAuth();
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SL";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link to="/" className="text-lg font-bold text-slate-900">
          ShopLight
        </Link>

        <nav
          className={`${
            open ? "block" : "hidden"
          } absolute left-0 top-full w-full border-b border-slate-200 bg-white px-4 py-4 sm:static sm:block sm:w-auto sm:border-0 sm:p-0`}
        >
          <ul className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <li>
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={navLinkClass}>
                Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={navLinkClass}>
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/checkout"
            className="relative inline-flex items-center rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            Cart
            <span className="ml-2 rounded-full bg-slate-900 px-2 py-0.5 text-xs text-white">
              {totalQuantity}
            </span>
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {initials}
                </span>
                Profile
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                }}
                className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 sm:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className="text-xl">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;