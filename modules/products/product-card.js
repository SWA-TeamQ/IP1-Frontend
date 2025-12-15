import { escapeHtml, formatPrice } from "../../utils/formatters.js";

const iconCartUrl = new URL("../../assets/icons/cart.svg", import.meta.url);
const iconHeartUrl = new URL("../../assets/icons/heart.svg", import.meta.url);

export default function ProductCard(product) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.productId = product?.id || "";

    const stars = product.getRatingStars?.() ?? "";

    const badgeClass = product?.details?.badge
        ? String(product.details.badge).toLowerCase()
        : "";

    const productImageUrl = new URL(`../../${product.image}`, import.meta.url);

    card.innerHTML = `
            <div class="card-image-container">
              <img class="card-image" src="${productImageUrl}" alt="${escapeHtml(
        product.name
    )}" loading="lazy" aria-hidden="true">
              ${
                  product?.details?.badge
                      ? `<div class="card-badge ${badgeClass}">${escapeHtml(
                            product.details.badge
                        )}</div>`
                      : ""
              }
              <button class="btn btn-icon ${
                  product.isFavorite ? "favorited" : ""
              } top-fav" title="Add to favorites" aria-pressed="${
        product.isFavorite
    }" data-fav="${product.id}">
                <img class="icon icon-heart" src="${iconHeartUrl}" alt="" aria-hidden="true">
              </button>
            </div>


            <div class="card-content">
              <div>
                <h3 class="card-title">${escapeHtml(product.name)}</h3>
                <product class="card-subtitle">
                  ${escapeHtml(product.details?.category || "")} • ${escapeHtml(
        product.details?.color || ""
    )}
                </product> 
              </div>
              <div class="rating">
                <span class="stars" aria-label="Rating: ${
                    product?.details?.rating || 0
                } out of 5 stars">${stars}</span>
                <span class="rating-count">(${
                    product?.details?.reviewCount || 0
                })</span>
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
              <div class="card-actions">
                <button class="btn btn-cart-icon" data-id="${
                    product.id
                }" aria-label="Add to cart">
                  <img class="icon icon-cart" src="${iconCartUrl}" alt="" aria-hidden="true">
                </button>
                <button class="btn btn-fav" data-fav="${
                    product.id
                }" aria-label="Add to favorites" aria-pressed="${
        product.isFavorite
    }">
                  <img class="icon icon-heart-sm" src="${iconHeartUrl}" alt="" aria-hidden="true">
                  <span>${
                      product.isFavorite ? "Favorited" : "Add to favorites"
                  }</span>
                </button>
              </div>
            </div>
          `;

    const addBtn = card.querySelector("[data-id]");
    addBtn?.addEventListener("click", () => {
        if (typeof window.addToCart === "function") {
            window.addToCart(product.id);
        }
    });

    const favBtn = card.querySelector("[data-fav]");
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
