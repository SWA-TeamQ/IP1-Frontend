import { fetchProducts } from "../modules/products/product.api.js";
import ProductList from "../modules/products/product-list.js";
import { renderSkeletons } from "/src/components/skeleton.js";

export async function initHomePage() {
    const grid = document.getElementById("featuredGrid");
    if (!grid) return;
    
    renderSkeletons(grid, 4);
    const products = await fetchProducts();
    grid.innerHTML = "";
    const featured = products.slice(0, 4);
    grid.appendChild(ProductList(featured));
}
