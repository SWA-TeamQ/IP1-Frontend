import { useEffect, useState } from "react";
import { apiClient } from "../../services/api.js";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get("/admin/stats");
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Error loading stats.</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-sm">Total Revenue</div>
          <div className="text-3xl font-bold">${(stats.summary.total_revenue / 100).toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-sm">Orders</div>
          <div className="text-3xl font-bold">{stats.summary.total_orders}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-sm">Customers</div>
          <div className="text-3xl font-bold">{stats.summary.total_customers}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSales.map((sale) => (
                  <tr key={sale.id} className="border-t border-slate-100">
                    <td className="p-3">{sale.first_name} {sale.last_name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        sale.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="p-3">${(sale.total_cents / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {stats.topProducts.map((p, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-slate-900">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.units_sold} units sold</div>
                </div>
                <div className="font-semibold">${(p.revenue / 100).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Stock Alerts */}
      {stats.stockAlerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-rose-800 mb-4">Stock Alerts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stats.stockAlerts.map((item, i) => (
              <div key={i} className="bg-white p-3 rounded-lg border border-rose-200 flex justify-between">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm font-bold text-rose-600">{item.stock_quantity} left</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
