import { initCart } from "/src/modules/cart/cart.store.js";
import { initFavorites } from "../modules/products/favorites.store.js";
import { fetchProducts, fetchProduct, toggleFavorite } from "../modules/products/product.api.js";

export async function initApp() {
    // Initialize global stores
    const favorites = initFavorites();

    // Fetch products (API or fallback)
    const products = await fetchProducts();

    // Sync favorites
    for (const p of products) {
        p.isFavorite = favorites?.has?.(p.id) ?? false;
    }

    // Global toggle for favorites
    window.toggleFav = (productId) => {
        toggleFavorite(productId); // updated
        const product = products.find(p => p.id === productId);
        if (product) {
            product.isFavorite = favorites?.has?.(productId) ?? false;
        }
    };

    // Initialize cart
    initCart();
}
