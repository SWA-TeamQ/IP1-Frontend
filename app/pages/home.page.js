import { getProducts } from "../../modules/products/products.data.js";
import ProductList from "../../modules/products/product-list.js";

export async function initHomePage() {
    const grid = document.getElementById("featuredGrid");
    if (!grid) return;

    const products = await getProducts();
    const featured = (products || []).slice(0, 4);
    grid.appendChild(ProductList(featured));
}
