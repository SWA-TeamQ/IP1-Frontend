import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 space-y-2">
        <Link
          to="/admin"
          className="block px-4 py-2 rounded-lg hover:bg-slate-100 font-semibold text-slate-700"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/products"
          className="block px-4 py-2 rounded-lg hover:bg-slate-100 font-semibold text-slate-700"
        >
          Manage Products
        </Link>
        <Link
          to="/admin/orders"
          className="block px-4 py-2 rounded-lg hover:bg-slate-100 font-semibold text-slate-700"
        >
          All Orders
        </Link>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
