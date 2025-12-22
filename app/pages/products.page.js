import { getProducts } from "../../modules/products/products.data.js";
import ProductList from "../../modules/products/product-list.js";

export async function initProductsPage() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    const products = await getProducts();
    grid.appendChild(ProductList(products));
}
