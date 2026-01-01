import { $ } from "/src/utils/dom.js";

import { fetchProduct } from "../modules/products/product.api.js";
import ProductDetail from "../modules/products/product-detail.js";
import { renderSkeletons } from "/src/components/skeleton.js";

export async function initProductDetailPage() {
    const root = $("#productDetailRoot");
    if (!root) return;
    renderSkeletons(root, 1);

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

    const product = await fetchProduct();
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
