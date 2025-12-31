import { escapeHtml, formatPrice } from "../../utils/formatters.js";

export default function ProductDetail(product) {
    const details = document.createElement("div");
    details.className = "product-details";

    // 1. Raw Data Extraction
    const rating = product?.details?.rating || 0;
    const reviews = product?.details?.reviewCount || 0;
    const category = product?.details?.category || "—";
    const color = product?.details?.color || "—";
    const current =
        product?.details?.salePrice ?? product?.salePrice ?? product?.price ?? 0;
    const original = product?.price ?? current;
    const isFavorite = !!product.isFavorite;

    // 2. Formatting and Escaping (Logic moved to top)
    const resolveSrc = (src) => {
        if (!src) return "";
        if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
        if (src.startsWith("src/")) return `/${src}`;
        return `/src/${src}`;
    };
    const imageUrl = resolveSrc(product?.images?.[0] ?? product?.image ?? "");
    const escapedName = escapeHtml(product.name || "");
    const ratingStars = product?.getRatingStars?.() ?? "";
    const escapedRating = escapeHtml(String(rating));
    const formattedReviews = Number(reviews).toLocaleString();
    const escapedCategory = escapeHtml(category);
    const escapedColor = escapeHtml(color);
    const escapedDescription = escapeHtml(product.description || "");
    const escapedId = escapeHtml(product.id || "");
    
    const formattedCurrentPrice = formatPrice(current);
    const formattedOriginalPrice = formatPrice(original);
    const favoriteText = isFavorite ? "Favorited" : "Add to favorites";

    const salePriceHtml = product?.details?.salePrice
        ? `<span class="original">$${formattedOriginalPrice}</span>`
        : "";

    // 3. Clean Template Insertion
    details.innerHTML = `
        <div class="product-details-grid">
          <div class="product-details-media">
            <img
              src="${imageUrl}"
              alt="${escapedName}"
              class="product-details-image"
              loading="lazy"
            />
          </div>

          <div class="product-details-body">
            <div>
              <h1 class="product-details-title">${escapedName}</h1>
              <div class="product-details-sub">
                <span class="pill" aria-label="Rating ${escapedRating} out of 5">${ratingStars}</span>
                <span class="pill">${formattedReviews} reviews</span>
                <span class="pill">${escapedCategory}</span>
                <span class="pill">Color: ${escapedColor}</span>
              </div>
            </div>

            <div class="product-details-price">
              <span class="current">$${formattedCurrentPrice}</span>
              ${salePriceHtml}
            </div>

            <p class="product-details-desc">${escapedDescription}</p>

            <div class="product-details-actions">
              <button class="btn btn-primary" data-id="${escapedId}">
                Add to cart
              </button>
              <button
                class="btn btn-secondary"
                data-fav="${escapedId}"
                aria-pressed="${isFavorite}"
              >
                <span>${favoriteText}</span>
              </button>
            </div>

            <div class="product-details-kv" aria-label="Product details">
              <div class="kv">
                <div class="k">Category</div>
                <div class="v">${escapedCategory}</div>
              </div>
              <div class="kv">
                <div class="k">Color</div>
                <div class="v">${escapedColor}</div>
              </div>
              <div class="kv">
                <div class="k">Rating</div>
                <div class="v">${escapedRating} / 5</div>
              </div>
              <div class="kv">
                <div class="k">Reviews</div>
                <div class="v">${formattedReviews}</div>
              </div>
            </div>

            <a href="/src/pages/product.html" class="filter-select">Back to products</a>
          </div>
        </div>
    `;

    // Event Listeners
    details.querySelector("[data-id]")?.addEventListener("click", () => {
        window.addToCart(product.id);
    });

    const favBtn = details.querySelector("[data-fav]");
    favBtn?.addEventListener("click", () => {
        if (typeof window.toggleFav === "function") {
            window.toggleFav(product.id);
            const currentFavStatus = !!product.isFavorite;
            favBtn.setAttribute("aria-pressed", String(currentFavStatus));
            const label = favBtn.querySelector("span");
            if (label) {
                label.textContent = currentFavStatus ? "Favorited" : "Add to favorites";
            }
        }
    });

    return details;
}