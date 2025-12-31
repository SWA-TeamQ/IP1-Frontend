import { setText } from "../utils/dom.js";
import { initCart } from "../modules/cart/cart.store.js";
import { initFavorites } from "../modules/products/favorites.store.js";
import { fetchProducts, getProduct } from "/src/modules/products/product.api.js";
import { insertNavBar } from "/src/components/navbar.js";

export async function initApp() {
    const yearEl = $("#year");
    console.log("i hate your")
    setText(yearEl, new Date().getFullYear());
    
    
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
        const p = getProduct(productId);
        if (p) p.isFavorite = favorites?.has?.(p.id) ?? false;
    };

    initCart();
}
