import { initCart } from "/src/modules/cart/cart.store.js";
import { initFavorites } from "../modules/products/favorites.store.js";
import {
    fetchProducts,
    fetchProduct,
} from "../modules/products/product.api.js";

export async function initApp() {
    // Global stores
    const favorites = initFavorites();
    const products = await fetchProducts();

    // set the isFavorite property of each product based on the favorites list
    for (const p of products) {
        p.isFavorite = favorites?.has?.(p.id) ?? false;
    }

    // Keep favorites toggles in sync with product objects.
    window.toggleFav = (productId) => {
        favorites?.toggle?.(productId);
        const p = fetchProduct(productId);
        if (p) p.isFavorite = favorites?.has?.(p.id) ?? false;
    };

    initCart();
}
