import ProductCard from "./product-card.js";

export default function ProductList(products) {
    const children = document.createDocumentFragment();
    for (const product of products || []) {
        children.appendChild(ProductCard(product));
    }
    return children;
}
