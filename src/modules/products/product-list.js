import ProductCard from "./product-card.js";
import { toggleFavorite } from "./product.api.js";

export default function ProductList(products = [], refresh = () => {}) {
    const fragment = document.createDocumentFragment();

    (products || []).forEach((p) => {
        fragment.appendChild(
            ProductCard(p, () => {
                toggleFavorite(p.id);
                refresh();
            })
        );
    });

    return fragment;
}
