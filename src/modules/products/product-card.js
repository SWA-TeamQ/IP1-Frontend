import { getRatingStars } from "/src/modules/products/product.helpers.js";
import { $ } from "/src/utils/dom.js";
import { escapeHtml, formatPrice } from "/src/utils/formatters.js";

const ICON_CART_URL = "/assets/icons/cart.svg";
const ICON_HEART_URL = "/assets/icons/heart.svg";

const CardHeader = () => {};

export default function ProductCard(product) {
    if (!product) return;

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.productId = product.id || "";

    const stars = getRatingStars(product) ?? "";

    const badgeClass = product?.details?.badge
        ? String(product.details.badge).toLowerCase()
        : "";

    console.log(product)
    const productImageUrl = product.images[0] ?? "";

    const productHref = `/pages/product-detail/index.html?id=${encodeURIComponent(
        product.id
    )}`;

    card.innerHTML = `
        <a class="card-link" href="${productHref}" aria-label="View details for ${escapeHtml(
        product.name
    )}">
          <div class="card-image-container">
            <img class="card-image" src="${productImageUrl}" alt="${escapeHtml(
        product.name
    )}" loading="lazy">
            ${
                product?.details?.badge
                    ? `<div class="card-badge ${badgeClass}">${escapeHtml(
                          product.details.badge
                      )}</div>`
                    : ""
            }
          </div>

          <div class="card-content">
            <div>
              <h3 class="card-title">${escapeHtml(product.name)}</h3>
              <p class="card-subtitle">
                ${escapeHtml(product.details?.category || "")} • ${escapeHtml(
        product.details?.color || ""
    )}
              </p>
            </div>
            <div class="rating">
              <span class="stars" aria-label="Rating: ${
                  product?.details?.rating || 0
              } out of 5 stars">${stars}</span>
              <span class="rating-count">(${(
                  product?.details?.reviewCount || 0
              ).toLocaleString()})</span>
            </div>
            <div class="price-row">
              <span class="price-current">$${formatPrice(
                  product.details?.salePrice || product.getPrice?.() || 0
              )}</span>
              ${
                  product?.details?.salePrice
                      ? `<span class="price-original">$${formatPrice(
                            product.getPrice?.() || 0
                        )}</span>`
                      : ""
              }
            </div>
          </div>
        </a>

        <button class="btn btn-icon ${
            product.isFavorite ? "favorited" : ""
        } top-fav" title="Add to favorites" aria-label="Add to favorites" aria-pressed="${
        product.isFavorite
    }" data-fav="${product.id}">
          <img class="icon icon-heart" src="${ICON_HEART_URL}" alt="" aria-hidden="true">
        </button>

        <div class="card-actions">
          <button class="btn btn-cart-icon" data-id="${
              product.id
          }" aria-label="Add to cart">
            <img class="icon icon-cart" src="${ICON_CART_URL}" alt="" aria-hidden="true">
          </button>
          <a class="btn btn-secondary" href="${productHref}">View</a>
        </div>
    `;

    const addBtn = card.querySelector("[data-id]");
    addBtn?.addEventListener("click", () => {
        if (typeof window.addToCart === "function") {
            window.addToCart(product.id);
        }
    });

    const favBtn = $(card, "[data-fav]");
    favBtn?.addEventListener("click", () => {
        if (typeof window.toggleFav === "function") {
            window.toggleFav(product.id);
            const isFav = !!product.isFavorite;
            favBtn.classList.toggle("favorited", isFav);
            favBtn.setAttribute("aria-pressed", String(isFav));
        }
    });

    return card;
}
