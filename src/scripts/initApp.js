import { $, setText } from "/src/utils/dom.js";
import { initCart } from "/src/modules/cart/cart.store.js";
import { initFavorites } from "/src/modules/products/favorites.store.js";
import { fetchProducts, fetchProduct } from "/src/modules/products/product.api.js";

export async function initApp() {
   
    const favorites = initFavorites();

    initCart();
    const products = await fetchProducts();

    
    for (const p of products) {
        p.isFavorite = favorites?.has(p.id) ?? false;
    }

   
    window.toggleFav = async (productId) => {
        favorites?.toggle?.(productId);
        const p = await fetchProduct(productId);
        if (p) p.isFavorite = favorites?.has?.(p.id) ?? false;
    };

}
