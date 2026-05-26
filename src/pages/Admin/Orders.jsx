import { useEffect, useState } from "react";
import { apiClient } from "../../services/api.js";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get("/orders/all");
      setOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await apiClient.patch(`/orders/${id}/status`, { status });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Orders</h1>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer ID</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="p-4 font-mono text-xs">{order.id}</td>
                <td className="p-4 font-mono text-xs">{order.user_id}</td>
                <td className="p-4 font-semibold">${(order.total_cents / 100).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                    order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
