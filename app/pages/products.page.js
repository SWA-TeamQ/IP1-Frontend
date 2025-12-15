import { PRODUCTS, getProduct } from "../../modules/products/products.data.js";
import ProductList from "../../modules/products/product-list.js";
import ProductDetail from "../../modules/products/product-detail.js";

function getProductDetailHref(productId) {
    return `/pages/product/index.html?id=${encodeURIComponent(productId)}`;
}

export function initProductsPage() {
    const root = document.getElementById("productRoot");
    if (!root) return;

    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    if (!id) {
        root.innerHTML = `
            <div class="section-header">
                <h1 class="section-title">Products</h1>
                <a href="../index.html" class="filter-select">Back to home</a>
            </div>
            <div id="productsGrid" class="product-grid" role="list"></div>
        `;

        const grid = document.getElementById("productsGrid");
        if (!grid) return;

        grid.appendChild(ProductList(PRODUCTS));

        grid.addEventListener("click", (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            if (target.closest("button")) return;

            const card = target.closest(".card");
            const productId = card?.getAttribute("data-product-id") || "";
            if (!productId) return;

            location.href = getProductDetailHref(productId);
        });

        return;
    }

    const p = getProduct(id);
    if (!p) {
        root.innerHTML =
            '<p class="muted">Product not found. <a href="../index.html">Back to home</a></p>';
        return;
    }

    root.innerHTML = "";
    root.appendChild(ProductDetail(p));
}
