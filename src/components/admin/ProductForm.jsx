import { useState } from "react";
import { apiClient } from "../../api/api.js";

function ProductForm({ product, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price_dollars: product ? (product.price_cents / 100).toString() : "",
    category: product?.category || "",
    stock_quantity: product?.stock_quantity || 0,
    attributes: product?.attributes ? JSON.stringify(product.attributes) : "",
  });
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price_cents", Math.round(parseFloat(formData.price_dollars) * 100));
      data.append("category", formData.category);
      data.append("stock_quantity", formData.stock_quantity);
      if (formData.attributes) {
        data.append("attributes", formData.attributes);
      }
      
      Array.from(images).forEach((file) => {
        data.append("images[]", file);
      });

      if (product) {
        // If contract doesn't specify PATCH, we assume it's same endpoint or PUT
        await apiClient.post(`/products/${product.id}?_method=PUT`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await apiClient.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSuccess();
    } catch (err) {
      alert("Failed to save product: " + (err.errors?.[0] || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Product Name</label>
              <input
                required
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea
                required
                rows="3"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Price ($)</label>
              <input
                required
                type="number"
                step="0.01"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={formData.price_dollars}
                onChange={(e) => setFormData({ ...formData, price_dollars: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Category</label>
              <input
                required
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Stock Quantity</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                onChange={(e) => setImages(e.target.files)}
              />
            </div>
            <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Attributes (JSON)</label>
                <input
                    placeholder='{"color": "blue", "size": "M"}'
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
                    value={formData.attributes}
                    onChange={(e) => setFormData({ ...formData, attributes: e.target.value })}
                />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
