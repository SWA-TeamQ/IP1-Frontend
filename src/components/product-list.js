import ProductCard from "./product-card.js";

export default function ProductList(products = []) {
    const fragment = document.createDocumentFragment();
    for (const product of products) {
        fragment.appendChild(ProductCard(product));
    }
    return fragment;
}
