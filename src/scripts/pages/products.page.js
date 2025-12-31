import { PRODUCTS } from "../../modules/products/products.data.js";
import ProductList from "../../components/product-list.js";

export function initProductsPage() {
    const grid = document.getElementById("productsGrid");
    grid.appendChild(ProductList(PRODUCTS));
}
