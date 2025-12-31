import { fetchProduct } from "../modules/products/product.api.js";
import ProductDetail from "../modules/products/product-detail.js";

export async function initProductDetailPage() {
    const root = document.getElementById("productDetailRoot");
    if (!root) return;

    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    if (!id) {
        root.innerHTML = `
            <div class="product-detail-shell">
              <p class="muted">Missing product id.</p>
              <a class="btn btn-secondary" href="../product/index.html">Back to products</a>
            </div>
        `;
        return;
    }

    const product = await fetchProduct(id);
    if (!product) {
        root.innerHTML = `
            <div class="product-detail-shell">
              <p class="muted">Product not found.</p>
              <a class="btn btn-secondary" href="../product/index.html">Back to products</a>
            </div>
        `;
        return;
    }

    root.innerHTML = "";
    root.appendChild(ProductDetail(product));
}
