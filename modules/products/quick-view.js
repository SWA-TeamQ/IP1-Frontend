import { getProduct } from "./products.data.js";
import { escapeHtml, formatPrice } from "../../core/utils/formatters.js";

export function initQuickView() {
    const quickViewModal = document.getElementById("quickViewModal");
    const quickViewTitle = document.getElementById("quickViewTitle");
    const quickViewBody = document.getElementById("quickViewBody");
    const quickViewClose = document.getElementById("quickViewClose");
    if (
        !quickViewModal ||
        !quickViewTitle ||
        !quickViewBody ||
        !quickViewClose
    ) {
        return;
    }

    function handleQuickViewEsc(e) {
        if (e.key === "Escape") closeQuickViewModal();
    }

    function openQuickViewModal(productId) {
        const product = getProduct(productId);
        if (!product) return;

        quickViewTitle.textContent = product.name;
        const stars = product.getRatingStars?.() ?? "";
        const productImageUrl = new URL(
            `../../${product.image}`,
            import.meta.url
        );

        quickViewBody.innerHTML = `
      <div class="quick-view-content">
        <div class="quick-view-image-container">
          <img class="quick-view-image" src="${productImageUrl}" alt="${escapeHtml(
            product.name
        )}">
          ${
              product?.details?.badge
                  ? `<div class="quick-view-badge">${escapeHtml(
                        product.details.badge
                    )}</div>`
                  : ""
          }
        </div>
        <div class="quick-view-meta">
          <p class="quick-view-subtitle">${escapeHtml(
              product.details?.category || ""
          )} • ${escapeHtml(product.details?.color || "")}</p>
          <div class="quick-view-rating">
            <span class="stars">${stars}</span> (${
            product.details?.reviewCount || 0
        } reviews)
          </div>
          <div class="quick-view-price-row">
            <span class="quick-view-price-current">$${formatPrice(
                product.details?.salePrice || product.getPrice?.() || 0
            )}</span>
            ${
                product?.details?.salePrice
                    ? `<span class="quick-view-price-original">$${formatPrice(
                          product.getPrice?.() || 0
                      )}</span>`
                    : ""
            }
          </div>
          <div class="quick-view-description">
            ${escapeHtml(product.description || "No description available.")}
          </div>
          <div class="quick-view-cart-section">
            <button class="btn quick-view-fav-btn ${
                product.isFavorite ? "favorited" : ""
            }" data-fav="${productId}">
              ${product.isFavorite ? "♥" : "♡"}
            </button>
            <button class="btn quick-view-add-btn" data-cart="${productId}">Add to Cart</button>
          </div>
        </div>
      </div>
    `;

        quickViewModal.style.display = "";
        quickViewModal.classList.add("active");
        document.addEventListener("keydown", handleQuickViewEsc);
    }

    function closeQuickViewModal() {
        quickViewModal.classList.remove("active");
        setTimeout(() => {
            quickViewModal.style.display = "none";
        }, 300);
        document.removeEventListener("keydown", handleQuickViewEsc);
    }

    quickViewClose.addEventListener("click", closeQuickViewModal);
    quickViewModal.addEventListener("click", (e) => {
        if (e.target === quickViewModal) closeQuickViewModal();
    });

    quickViewModal.addEventListener("click", (e) => {
        const fav = e.target?.closest?.("[data-fav]")?.getAttribute("data-fav");
        if (fav && typeof window.toggleFav === "function") {
            window.toggleFav(fav);
        }
        const cart = e.target
            ?.closest?.("[data-cart]")
            ?.getAttribute("data-cart");
        if (cart && typeof window.addToCart === "function") {
            window.addToCart(cart);
        }
    });

    window.openQuickViewModal = openQuickViewModal;
    window.closeQuickViewModal = closeQuickViewModal;
}
