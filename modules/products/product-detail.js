import { escapeHtml, formatPrice } from "../../utils/formatters.js";

export default function ProductDetail(product) {
    const details = document.createElement("div");
    details.className = "product-details";

  const imageUrl = (String(product.image || "").startsWith("/") ? product.image : "/" + String(product.image || ""));
  const ratingStars = product.getRatingStars?.() ?? "";
  const rating = product?.details?.rating || 0;
  const reviews = product?.details?.reviewCount || 0;
  const category = product?.details?.category || "—";
  const color = product?.details?.color || "—";
  const current = product?.details?.salePrice || product.getPrice?.() || 0;
  const original = product.getPrice?.() || 0;

    details.innerHTML = `
        <div class="product-details-grid">
          <div class="product-details-media">
            <img
              src="${imageUrl}"
              alt="${escapeHtml(product.name)}"
              class="product-details-image"
              loading="lazy"
            />
          </div>

          <div class="product-details-body">
            <div>
              <h1 class="product-details-title">${escapeHtml(product.name)}</h1>
              <div class="product-details-sub">
                <span class="pill" aria-label="Rating ${escapeHtml(
                    String(rating)
                )} out of 5">${ratingStars}</span>
                <span class="pill">${Number(reviews).toLocaleString()} reviews</span>
                <span class="pill">${escapeHtml(category)}</span>
                <span class="pill">Color: ${escapeHtml(color)}</span>
              </div>
            </div>

            <div class="product-details-price">
              <span class="current">$${formatPrice(current)}</span>
              ${
                  product?.details?.salePrice
                      ? `<span class="original">$${formatPrice(original)}</span>`
                      : ""
              }
            </div>

            <p class="product-details-desc">${escapeHtml(product.description || "")}</p>

            <div class="product-details-actions">
              <button class="btn btn-primary" data-id="${escapeHtml(product.id)}">
                Add to cart
              </button>
              <button
                class="btn btn-secondary"
                data-fav="${escapeHtml(product.id)}"
                aria-pressed="${product.isFavorite}"
              >
                <span>${product.isFavorite ? "Favorited" : "Add to favorites"}</span>
              </button>
            </div>

            <div class="product-details-kv" aria-label="Product details">
              <div class="kv">
                <div class="k">Category</div>
                <div class="v">${escapeHtml(category)}</div>
              </div>
              <div class="kv">
                <div class="k">Color</div>
                <div class="v">${escapeHtml(color)}</div>
              </div>
              <div class="kv">
                <div class="k">Rating</div>
                <div class="v">${escapeHtml(String(rating))} / 5</div>
              </div>
              <div class="kv">
                <div class="k">Reviews</div>
                <div class="v">${Number(reviews).toLocaleString()}</div>
              </div>
            </div>

            <a href="../product/index.html" class="filter-select">Back to products</a>
          </div>
        </div>
    `;

    details.querySelector("[data-id]")?.addEventListener("click", () => {
        if (typeof window.addToCart === "function") {
            window.addToCart(product.id);
        }
    });

    const favBtn = details.querySelector("[data-fav]");
    favBtn?.addEventListener("click", () => {
      if (typeof window.toggleFav === "function") {
        window.toggleFav(product.id);
        const isFav = !!product.isFavorite;
        favBtn.setAttribute("aria-pressed", String(isFav));
        const label = favBtn.querySelector("span");
        if (label) label.textContent = isFav ? "Favorited" : "Add to favorites";
      }
    });

    return details;
}
