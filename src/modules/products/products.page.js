import {
    fetchProducts,
    getCategories,
    filterProducts
} from "../products/product.api.js";

import ProductList from "../products/product-list.js";
import { getFavorites } from "../products/favorites.store.js";

export async function initProductsPage() {
    const grid = document.getElementById("productsGrid");
    const categoryList = document.getElementById("categoryList");

    if (!grid || !categoryList) return;

    const products = await fetchProducts();

    const render = (list) => {
        grid.innerHTML = "";
        grid.appendChild(ProductList(list));
    };

    // Show all products first
    render(products);

    const categories = ["all", "favorites", ...getCategories()];

    categories.forEach((cat) => {
        const btn = document.createElement("button");
        btn.textContent = cat;

        btn.onclick = () => {
            if (cat === "all") {
                render(products);
            } else if (cat === "favorites") {
                const favIds = getFavorites();
                render(products.filter(p => favIds.includes(p.id)));
            } else {
                render(filterProducts(cat));
            }
        };

        categoryList.appendChild(btn);
    });
}
