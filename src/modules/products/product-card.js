import { getRatingStars, getPrice } from "/src/modules/products/product.helpers.js";
import { $ } from "/src/utils/dom.js";
import { escapeHtml, formatPrice } from "/src/utils/formatters.js";

const ICON_CART_URL = "/src/assets/icons/cart.svg";
const ICON_HEART_URL = "/src/assets/icons/heart.svg";

export default function ProductCard(product) {
    if (!product) return;

    // 1. Raw Data Extraction & Calculations
    const productId = product.id || "";
    const isFavorite = !!product.isFavorite;
    const ratingValue = product?.details?.rating || 0;
    const reviewCount = product?.details?.reviewCount || 0;
    const rawCurrentPrice = getPrice(product) || 0;
    const rawOriginalPrice = product.price || 0;
    const hasSale = !!product?.details?.salePrice;

    // 2. Formatting and Escaping (View Model)
    const escapedName = escapeHtml(product.name || "");
    const escapedId = escapeHtml(productId);
    const escapedCategory = escapeHtml(product.details?.category || "");
    const escapedColor = escapeHtml(product.details?.color || "");
    const productImageUrl = product.images?.[0] ?? "";
    const ratingStarsHtml = getRatingStars(product) ?? "";
    
    const formattedReviewCount = reviewCount.toLocaleString();
    const formattedCurrentPrice = formatPrice(rawCurrentPrice);
    const formattedOriginalPrice = formatPrice(rawOriginalPrice);
    
    const productHref = `/src/pages/product-detail.html?id=${encodeURIComponent(productId)}`;

    // Badge Logic
    const badgeText = product?.details?.badge ? String(product.details.badge) : "";
    const badgeClass = badgeText.toLowerCase();
    const escapedBadge = escapeHtml(badgeText);
    const badgeHtml = badgeText 
        ? `<div class="card-badge ${badgeClass}">${escapedBadge}</div>` 
        : "";

    // Favorite Button State
    const favClass = isFavorite ? "favorited" : "";
    const ariaPressed = String(isFavorite);

    // Sale Price Logic
    const originalPriceHtml = hasSale 
        ? `<span class="price-original">$${formattedOriginalPrice}</span>` 
        : "";

    // 3. Clean Template
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.productId = productId;

    card.innerHTML = `
        <a class="card-link" href="${productHref}" aria-label="View details for ${escapedName}">
          <div class="card-image-container">
            <img class="card-image" src="${productImageUrl}" alt="${escapedName}" loading="lazy">
            ${badgeHtml}
          </div>

          <div class="card-content">
            <div>
              <h3 class="card-title">${escapedName}</h3>
              <p class="card-subtitle">
                ${escapedCategory} • ${escapedColor}
              </p>
            </div>
            <div class="rating">
              <span class="stars" aria-label="Rating: ${ratingValue} out of 5 stars">${ratingStarsHtml}</span>
              <span class="rating-count">(${formattedReviewCount})</span>
            </div>
            <div class="price-row">
              <span class="price-current">$${formattedCurrentPrice}</span>
              ${originalPriceHtml}
            </div>
          </div>
        </a>

        <button class="btn btn-icon ${favClass} top-fav" title="Add to favorites" aria-label="Add to favorites" aria-pressed="${ariaPressed}" data-fav="${escapedId}">
          <img class="icon icon-heart" src="${ICON_HEART_URL}" alt="" aria-hidden="true">
        </button>

        <div class="card-actions">
          <button class="btn btn-cart-icon" data-id="${escapedId}" aria-label="Add to cart">
            <img class="icon icon-cart" src="${ICON_CART_URL}" alt="" aria-hidden="true">
          </button>
          <a class="btn btn-secondary" href="${productHref}">View</a>
        </div>
    `;

    // Event Listeners
    card.querySelector("[data-id]")?.addEventListener("click", () => {
        if (typeof window.addToCart === "function") {
            window.addToCart(productId);
        }
    });

    const favBtn = $("[data-fav]", card);
    favBtn?.addEventListener("click", () => {
        if (typeof window.toggleFav === "function") {
            window.toggleFav(productId);
            const currentFavStatus = !!product.isFavorite;
            favBtn.classList.toggle("favorited", currentFavStatus);
            favBtn.setAttribute("aria-pressed", String(currentFavStatus));
        }
    });

    return card;
}