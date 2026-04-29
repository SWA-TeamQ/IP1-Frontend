import { useEffect, useState } from "react";
import { apiClient } from "../../api/api.js";
import { formatPrice, getImageUrl } from "../../utils/formatters.js";
import ProductForm from "../../components/admin/ProductForm.jsx";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const productsData = await apiClient.get("/products");
      setProducts(productsData || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiClient.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Manage Products</h1>
        <button
          onClick={handleAdd}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          + Add New Product
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Stock</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <img
                          src={getImageUrl(product.images?.[0])}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{product.name}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    ${formatPrice(product.price_cents / 100)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {product.stock_quantity || 0}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-sm font-semibold text-rose-600 hover:text-rose-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default ProductManagement;
