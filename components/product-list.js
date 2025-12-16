import ProductCard from "./product-card.js";

export default function ProductList(list, onFilterChange) {
    const frag = document.createDocumentFragment();

    list.forEach((product) => {
        const card = ProductCard(product, onFilterChange);
        frag.appendChild(card);
    });

    return frag;
}
