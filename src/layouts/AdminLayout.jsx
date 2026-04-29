import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";

function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Basic role protection - assuming 'admin' role in user object
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="p-8 text-center">Loading...</div>;

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: "📊" },
    { label: "Products", path: "/admin/products", icon: "📦" },
    { label: "Orders", path: "/admin/orders", icon: "📜" },
    { label: "Reviews", path: "/admin/reviews", icon: "⭐" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center px-6 border-b border-slate-100">
          <Link to="/" className="text-xl font-bold text-slate-900">
            ShopLight <span className="text-sm font-normal text-slate-500">Admin</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-slate-100 p-4">
          <button
            onClick={() => {
                logout();
                navigate("/login");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            {navItems.find(n => n.path === location.pathname)?.label || "Admin Panel"}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user.email}</span>
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
