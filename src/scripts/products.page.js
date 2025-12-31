import { fetchProducts } from "../modules/products/product.api.js";
import ProductList from "../modules/products/product-list.js";

export async function initProductsPage() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    renderSkeletons(grid, 20); // Show 20 skeletons while loading
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate loading delay
    const products = await fetchProducts();
    grid.innerHTML = ""; // Clear skeletons
    grid.appendChild(ProductList(products));
}


export function renderSkeletons(container, count = 8) {
    const skeletonHTML = `
        <div class="skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-price"></div>
            <div class="skeleton skeleton-button"></div>
        </div>
    `;
    
    // Inject the repeated skeleton HTML
    container.innerHTML = new Array(count).fill(skeletonHTML).join('');
}