import { escapeHtml, formatPrice } from "../js/lib/utils.js";
import { openQuickViewModal } from "./quick-view-model.js";
import { addToCart } from "./Cart/CartSystem.js";

// Check if product is in cart
function isInCart(productId) {
  return window.shoppingCart.items.has(productId);
}

export default function ProductCard(product, onFilterChange) {
  const card = document.createElement("div");
  card.className = "card";

  const stars = product.getRatingStars();
  const inCart = isInCart(product.id);

  // Badge class based on badge text
  const badgeClass = product.details.badge
    ? product.details.badge.toLowerCase()
    : "";

  card.innerHTML = `
            <div class="card-image-container">
              <img class="card-image" src="${product.image}" alt="${escapeHtml(
    product.name
  )}" loading="lazy" aria-hidden="true">
              ${product.details.badge
      ? `<div class="card-badge ${badgeClass}">${escapeHtml(
        product.details.badge
      )}</div>`
      : ""
    }
              <button class="quick-view-btn" data-quickview="${product.id
    }" aria-label="Quick view ${escapeHtml(
      product.name
    )}" title="Quick view">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>

              <button class="btn btn-icon ${product.isFavorite ? "favorited" : ""
    }" title="Add to favorites" aria-pressed="${product.isFavorite}" data-fav="${product.id
    }">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
            </div>


            <div class="card-content">
              <div>
                <h3 class="card-title">${product.name}</h3>
                <p class="card-subtitle">
                  ${product.details.category} • ${product.details.color}
                </p>
              </div>
              <div class="rating">
                <span class="stars" aria-label="Rating: ${product?.details?.rating || 0
    } out of 5 stars">${stars}</span>
                <span class="rating-count">(${product?.details?.reviewCount || 0
    })</span>
              </div>
              <div class="price-row">
                <span class="price-current">$${formatPrice(
      product.details.salePrice || product.getPrice()
    )}</span>
                ${product.details.salePrice
      ? `<span class="price-original">$${formatPrice(
        product.getPrice()
      )}</span>`
      : ""
    }
              </div>
              <div class="card-actions">
                <button class="btn btn-primary add-to-cart-btn ${inCart ? 'added' : ''}" data-id="${product.id}">
                  ${inCart ? '✓ Added' : 'Add to cart'}
                </button>
              </div>
            </div>
          `;

  // DOM references
  const addToCartBtn = card.querySelector(".add-to-cart-btn");

  // Add to Cart click
  addToCartBtn.addEventListener("click", () => {
    if (!isInCart(product.id)) {
      addToCart(product.id);
      addToCartBtn.textContent = "✓ Added";
      addToCartBtn.classList.add("added");
    }
  });

  const favBtn = card.querySelector("[data-fav]");
  favBtn.addEventListener("click", () => {
    window.favorites.toggle(product.id);
    product.isFavorite = !product.isFavorite;
    favBtn.classList.toggle("favorited", product.isFavorite);
    if (onFilterChange) onFilterChange();
  });

  const quickViewBtn = card.querySelector("[data-quickview]");
  quickViewBtn.addEventListener("click", () => {
    openQuickViewModal(product.id);
  });

  return card;
}
