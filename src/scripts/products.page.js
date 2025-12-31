import { fetchProducts } from "../modules/products/product.api.js";
import ProductList from "../modules/products/product-list.js";

export async function initProductsPage() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    const products = await fetchProducts();
    grid.appendChild(ProductList(products));
}
