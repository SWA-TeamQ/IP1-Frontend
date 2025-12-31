import { $ } from "/src/utils/dom.js";
import {
    fetchProducts,
    getCategories,
    filterProducts,
    getFavoriteProducts,
    getProductsSource,
    getProductsError,
    getProductsAttempts,
} from "../modules/products/product.api.js";
import ProductList from "../modules/products/product-list.js";
import { renderSkeletons } from "/src/components/skeleton.js";

export async function initProductsPage() {
    const grid = $("productsGrid");
    if (!grid) return;

    const categoryList = $("#categoryList");

    renderSkeletons(grid, 20);
    
    const products = await fetchProducts();

    let currentCategory = "all";

    const getCurrentList = () => {
        if (currentCategory === "all") return products;
        if (currentCategory === "favorites") return getFavoriteProducts();
        return filterProducts(currentCategory);
    };

    const renderCurrent = () => {
        grid.innerHTML = "";
        const list = getCurrentList() || [];
        if (list.length === 0) {
            const source = getProductsSource?.() ?? "unknown";
            const err = getProductsError?.();
            const attempts = getProductsAttempts?.() ?? [];
            const attemptsHtml =
                Array.isArray(attempts) && attempts.length
                    ? `<div class="muted" style="margin-top: 0.75rem;">
                        <div style="margin-bottom: 0.25rem;">Tried:</div>
                        <ul style="margin: 0; padding-left: 1.25rem;">
                          ${attempts
                              .map(
                                  (a) =>
                                      `<li><code>${a.endpoint}</code> — ${a.message}</li>`
                              )
                              .join("")}
                        </ul>
                      </div>`
                    : "";
            grid.innerHTML = `
                <div class="product-detail-shell">
                  <p class="muted">No products to display.</p>
                  <p class="muted">Fetch source: ${source}</p>
                  ${err ? `<p class="muted">Error: ${err?.message ?? String(err)}</p>` : ""}
                  ${attemptsHtml}
                  <p class="muted" style="margin-top: 0.75rem;">If you see <b>“Failed to fetch”</b>, it’s usually CORS or the API isn’t reachable from the browser origin.</p>
                </div>
            `;
            return;
        }
        grid.appendChild(ProductList(list, renderCurrent));
    };

    renderCurrent();

    // Categories UI is optional; if the HTML doesn't have it, we still render the grid.
    if (categoryList) {
        categoryList.innerHTML = "";
        const categories = ["all", "favorites", ...getCategories()];

        categories.forEach((cat) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "filter-select";
            btn.textContent = cat;
            btn.onclick = () => {
                currentCategory = cat;
                renderCurrent();
            };
            categoryList.appendChild(btn);
        });
    }
}


