import { useState, useEffect } from "react";
import { fetchProducts } from "../../services/products.js";
import { apiClient } from "../../services/api.js";
import { useToast } from "../../context/ToastContext.jsx";

function AdminProducts() {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts({ fresh: true });
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiClient.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      addToast("Product deleted successfully", "success");
    } catch (err) {
      addToast("Failed to delete product", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price_cents: Math.round(parseFloat(formData.get("price")) * 100),
      category: formData.get("category"),
      stock_quantity: parseInt(formData.get("stock_quantity")),
      images: [formData.get("image")],
    };

    try {
      if (editingProduct) {
        await apiClient.patch(`/products/${editingProduct.id}`, productData);
        addToast("Product updated successfully", "success");
      } else {
        await apiClient.post("/products", productData);
        addToast("Product created successfully", "success");
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      addToast("Failed to save product", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Add Product
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">{p.details.category}</td>
                <td className="p-4">${p.price.toFixed(2)}</td>
                <td className="p-4">{p.stock_quantity || 0}</td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold">Name</label>
                <input
                  name="name"
                  defaultValue={editingProduct?.name}
                  required
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">Price ($)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.price}
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Stock</label>
                  <input
                    name="stock_quantity"
                    type="number"
                    defaultValue={editingProduct?.stock_quantity}
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold">Category</label>
                <input
                  name="category"
                  defaultValue={editingProduct?.details.category}
                  required
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Image URL</label>
                <input
                  name="image"
                  defaultValue={editingProduct?.images[0]}
                  required
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingProduct?.description}
                  required
                  className="w-full border rounded-lg px-3 py-2 mt-1 h-24"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
