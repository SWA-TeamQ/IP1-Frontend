import { getFavorites } from "../products/favorites.store.js";
import { escapeHtml, formatPrice } from "../../utils/formatters.js";

export default function ProductCard(product, onFav) {
    const { id, name, description, price, salePrice, images, image, details } = product || {};
    const isFav = (getFavorites() || []).includes(id);
    
    const imgSrc = images?.[0] || image || "";
    const currentPrice = salePrice || details?.salePrice || price || 0;
    const isSale = price > currentPrice;
    const href = `/src/pages/product-detail.html?id=${id}`;

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
        <div class="card-image-container">
            <a href="${href}"><img class="card-image" src="${imgSrc}" alt="${name}" loading="lazy" /></a>
            <button class="btn-icon-base top-fav ${isFav ? "favorited" : ""}" type="button">
                <img class="icon" src="/src/assets/icons/heart.svg" alt="Favorite" />
            </button>
            ${details?.category ? `<span class="card-badge">${details.category}</span>` : ""}
        </div>
        <div class="card-content">
            <h3 class="card-title">${escapeHtml(name)}</h3>
            <p class="card-subtitle">${escapeHtml(description)}</p>
            <div class="price-row">
                <span class="price-current">$${formatPrice(currentPrice)}</span>
                ${isSale ? `<span class="price-original">$${formatPrice(price)}</span>` : ""}
            </div>
        </div>
        <div class="card-actions">
            <a class="btn-secondary" href="${href}">View Details</a>
            <button class="btn-icon-base btn-cart-icon" type="button">
                <img class="icon" src="/src/assets/icons/cart.svg" alt="Add to cart" />
            </button>
        </div>`;

    div.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        
        e.preventDefault();
        if (btn.classList.contains("top-fav")) onFav?.();
        if (btn.classList.contains("btn-cart-icon")) window.addToCart?.(id);
    });

    return div;
}