import { fetchProducts } from "../modules/products/product.api.js";
import ProductList from "../modules/products/product-list.js";
import { renderSkeletons } from "/src/components/skeleton.js";

export async function initProductsPage() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    renderSkeletons(grid, 20);
    
    const products = await fetchProducts();
    grid.innerHTML = ""; // Clear skeletons
    grid.appendChild(ProductList(products));
}


