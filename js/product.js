import { getProduct } from "./data/products.js";
import ProductDetails from "../components/product-details.js";

const params = new URLSearchParams(location.search);
const id = params.get("id");
const root = document.getElementById("productRoot");
const p = getProduct(id);

if (!p) {
    root.innerHTML =
        '<p class="muted">Product not found. <a href="./home.html">Back to home</a></p>';
} else {
    root.innerHTML = "";
    root.appendChild(ProductDetails(p));
}
