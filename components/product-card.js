import { escapeHtml, formatPrice } from "../js/lib/utils.js";
// import { openQuickViewModal } from "./quick-view-model.js";

export default function ProductCard(product) {
    const card = document.createElement("div");
    card.className = "card";

    const stars = product.getRatingStars();

    // Badge class based on badge text
    const badgeClass = product.details.badge
        ? product.details.badge.toLowerCase()
        : "";

    card.innerHTML = `
            <div class="card-image-container">
              <img class="card-image" src="${product.image}" alt="${escapeHtml(
        product.name
    )}" loading="lazy" aria-hidden="true">
              ${
                  product.details.badge
                      ? `<div class="card-badge ${badgeClass}">${escapeHtml(
                            product.details.badge
                        )}</div>`
                      : ""
              }
              <button class="quick-view-btn" data-quickview="${
                  product.id
              }" aria-label="Quick view ${escapeHtml(
        product.name
    )}" title="Quick view">
                <img class="icon icon-search" src="assets/icons/search.svg" alt="Quick view icon" aria-hidden="true">
              </button>

              <button class="btn btn-icon ${
                  product.isFavorite ? "favorited" : ""
              } top-fav" title="Add to favorites" aria-pressed="${
        product.isFavorite
    }" data-fav="${product.id}">
                <img class="icon icon-heart" src="assets/icons/heart.svg" alt="Favorite">
              </button>
            </div>


            <div class="card-content">
              <div>
                <h3 class="card-title">${product.name}</h3>
                <product class="card-subtitle">
                  ${product.details.category} • ${product.details.color}
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
                    product.details.salePrice || product.getPrice()
                )}</span>
                ${
                    product.details.salePrice
                        ? `<span class="price-original">$${formatPrice(
                              product.getPrice()
                          )}</span>`
                        : ""
                }
              </div>
              <div class="card-actions">
                <button class="btn btn-cart-icon" data-id="${
                    product.id
                }" aria-label="Add to cart">
                  <img class="icon icon-cart" src="assets/icons/cart.svg" alt="Add to cart">
                </button>
                <button class="btn btn-fav" data-fav="${
                    product.id
                }" aria-label="Add to favorites" aria-pressed="${
        product.isFavorite
    }">
                  <img class="icon icon-heart-sm" src="assets/icons/heart.svg" alt="Favorite">
                  <span>${
                      product.isFavorite ? "Favorited" : "Add to favorites"
                  }</span>
                </button>
              </div>
            </div>
          `;

    // Event Listeners
    // attach listeners
    // card.querySelector(".btn-primary").addEventListener("click", () => {
    //   addToCart(product.id);
    // });

    const favBtn = card.querySelector("[data-fav]");
    if (favBtn) {
        favBtn.addEventListener("click", () => {
            if (typeof window.toggleFav === "function") {
                window.toggleFav(product.id, favBtn);
                favBtn.classList.toggle("favorited", product.isFavorite);
                if (typeof window.onFilterChange === "function")
                    window.onFilterChange();
            }
        });
    }

    const quickViewBtn = card.querySelector("[data-quickview]");
    if (quickViewBtn) {
        quickViewBtn.addEventListener("click", () => {
            if (typeof window.openQuickViewModal === "function") {
                window.openQuickViewModal(product.id);
            } else {
                alert("Quick view modal is not implemented.");
            }
        });
    }

    return card;
}
