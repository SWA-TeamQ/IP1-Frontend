import { getFavorites } from "../products/favorites.store.js";
import { escapeHtml, formatPrice } from "../../utils/formatters.js";

export default function ProductCard(product, onFav) {
    const div = document.createElement("div");
    div.className = "card";

    const safeProduct = product ?? {};
    const favs = getFavorites();
    const isFav = (Array.isArray(favs) ? favs : []).includes(safeProduct.id);

    const resolveSrc = (src) => {
        if (!src) return "";
        // absolute / remote
        if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
        // project-relative
        if (src.startsWith("src/")) return `/${src}`;
        return `/src/${src}`;
    };
    const rawImg = safeProduct?.images?.[0] ?? safeProduct?.image ?? "";
    const imgSrc = resolveSrc(rawImg);

    const id = safeProduct?.id ?? "";
    const name = escapeHtml(safeProduct?.name ?? "");
    const desc = escapeHtml(safeProduct?.description ?? "");
    const category = escapeHtml(safeProduct?.details?.category ?? "");

    const priceCurrent =
        safeProduct?.details?.salePrice ??
        safeProduct?.salePrice ??
        safeProduct?.price ??
        0;
    const priceOriginal = safeProduct?.price ?? priceCurrent;
    const hasSale =
        Number(safeProduct?.salePrice ?? safeProduct?.details?.salePrice) > 0 &&
        Number(priceOriginal) > Number(priceCurrent);

    const href = id ? `/src/pages/product-detail.html?id=${encodeURIComponent(id)}` : "#";

    div.innerHTML = `
        <div class="card-image-container">
          <a class="card-link" href="${href}" aria-label="${name}">
            <img class="card-image" src="${imgSrc}" alt="${name}" loading="lazy" />
          </a>
          <button class="btn btn-icon top-fav ${isFav ? "favorited" : ""}" type="button" aria-label="Favorite">
            <img class="icon icon-heart" src="/src/assets/icons/heart.svg" alt="" />
          </button>
          ${category ? `<span class="card-badge">${category}</span>` : ""}
        </div>

        <div class="card-content">
          <h3 class="card-title">${name}</h3>
          <p class="card-subtitle">${desc}</p>

          <div class="price-row">
            <span class="price-current">$${formatPrice(priceCurrent)}</span>
            ${hasSale ? `<span class="price-original">$${formatPrice(priceOriginal)}</span>` : ""}
          </div>
        </div>

        <div class="card-actions">
          <a class="btn btn-secondary" href="${href}">View</a>
          <button class="btn btn-cart-icon" type="button" aria-label="Add to cart">
            <img class="icon icon-cart" src="/src/assets/icons/cart.svg" alt="" />
          </button>
        </div>
    `;

    // Favorite toggle (uses existing callback chain: ProductList -> product.api -> refresh)
    const favBtn = div.querySelector(".top-fav");
    if (favBtn && typeof onFav === "function") {
        favBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            onFav();
        });
    }

    // Cart
    const cartBtn = div.querySelector(".btn-cart-icon");
    cartBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.addToCart === "function" && id) window.addToCart(id);
    });

    return div;
}
