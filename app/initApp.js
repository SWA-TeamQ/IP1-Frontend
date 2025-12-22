import { setText } from "../utils/dom.js";
import { initCart } from "../modules/cart/cart.store.js";
import { initFavorites } from "../modules/products/favorites.store.js";
import { PRODUCTS, getProduct, getProducts } from "../modules/products/products.data.js";

export async function initApp() {
    setText(document.getElementById("year"), new Date().getFullYear());

    // Global stores
    const favorites = initFavorites();

    // Ensure products are loaded so we can sync favorites with product objects.
    await getProducts();
    for (const p of PRODUCTS) {
        p.isFavorite = favorites?.has?.(p.id) ?? false;
    }

    // Keep favorites toggles in sync with product objects.
    window.toggleFav = (productId) => {
        favorites?.toggle?.(productId);
        const p = getProduct(productId);
        if (p) p.isFavorite = favorites?.has?.(p.id) ?? false;
    };

    initCart();
}
