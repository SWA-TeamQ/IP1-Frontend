import { $, setText } from "/src/utils/dom.js";
import { initCart } from "/src/modules/cart/cart.store.js";
import { initFavorites } from "/src/modules/products/favorites.store.js";
import { fetchProducts, fetchProduct } from "/src/modules/products/product.api.js";

export async function initApp() {
    const yearEl = $("#year");
    setText(yearEl, new Date().getFullYear());

    // Global stores
    const favorites = initFavorites();
    const products = await fetchProducts();

    // set the isFavorite property of each product based on the favorites list
    for (const p of products) {
        p.isFavorite = favorites?.has(p.id) ?? false;
    }

    // Keep favorites toggles in sync with product objects.
    window.toggleFav = async (productId) => {
        favorites?.toggle?.(productId);
        const p = await fetchProduct(productId);
        if (p) p.isFavorite = favorites?.has?.(p.id) ?? false;
    };

    initCart();
}
