import { useEffect, useState } from "react";
import { apiClient } from "../../api/api.js";

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchReviews = async () => {
    try {
      const data = await apiClient.get("/admin/reviews");
      setReviews(data || []);
    } catch (err) {
      console.error("Failed to fetch admin reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/admin/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      alert("Failed to delete review: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Review Management</h1>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Rating</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Comment</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">Loading reviews...</td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">No reviews found.</td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{review.product_name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">
                      {review.first_name} {review.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-amber-500">
                      {"⭐".repeat(review.rating)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 line-clamp-2">{review.comment}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      className="text-sm font-semibold text-rose-600 hover:text-rose-800 disabled:opacity-50"
                    >
                      {deletingId === review.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReviewManagement;
