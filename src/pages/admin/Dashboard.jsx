import { useEffect, useState } from "react";
import { apiClient } from "../../api/api.js";
import { formatPrice } from "../../utils/formatters.js";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await apiClient.get("/admin/stats");
        setStats(statsData);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading statistics...</div>;

  const summary = stats?.summary || { total_orders: 0, total_revenue: 0, total_customers: 0 };

  const cards = [
    { label: "Total Revenue", value: `$${formatPrice(summary.total_revenue / 100)}`, icon: "💰", color: "text-emerald-600" },
    { label: "Total Orders", value: summary.total_orders, icon: "📦", color: "text-blue-600" },
    { label: "Total Customers", value: summary.total_customers, icon: "👥", color: "text-violet-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{card.icon}</div>
              <div>
                <div className="text-sm font-medium text-slate-500">{card.label}</div>
                <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Sales Placeholder */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recent Sales</h3>
          <div className="mt-4 divide-y divide-slate-100">
            {(stats?.recentSales || []).length > 0 ? (
                stats.recentSales.map((sale, i) => (
                    <div key={i} className="py-3 flex justify-between items-center">
                        <div className="text-sm font-medium text-slate-900">{sale.customer}</div>
                        <div className="text-sm text-slate-500">{sale.date}</div>
                        <div className="text-sm font-bold text-slate-900">${formatPrice(sale.total / 100)}</div>
                    </div>
                ))
            ) : (
                <div className="py-4 text-sm text-slate-500 text-center">No recent sales data.</div>
            )}
          </div>
        </div>

        {/* Stock Alerts Placeholder */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Stock Alerts</h3>
          <div className="mt-4 space-y-3">
            {(stats?.stockAlerts || []).length > 0 ? (
                stats.stockAlerts.map((alert, i) => (
                    <div key={i} className="p-3 rounded-lg bg-rose-50 border border-rose-100 flex justify-between items-center text-sm">
                        <span className="font-medium text-rose-700">{alert.product}</span>
                        <span className="text-rose-600">Only {alert.stock} left</span>
                    </div>
                ))
            ) : (
                <div className="py-4 text-sm text-slate-500 text-center">All products are well stocked.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
