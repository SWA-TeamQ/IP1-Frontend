import { escapeHtml, formatPrice } from "../../utils/formatters.js";

export default function ProductDetail(product) {
    const details = document.createElement("div");
    details.className = "product-details";

    details.innerHTML = `
        <div class="product-details-grid">
          <div>
            <img src="../../${product.image}" alt="${escapeHtml(
        product.name
    )}" class="product-details-image" />
          </div>
          <div class="product-details-content">
            <h1>${escapeHtml(product.name)}</h1>
            <p>${escapeHtml(product.description || "")}</p>
            <p class="price">
              <strong>$${formatPrice(product.getPrice?.() || 0)}</strong>
              ${
                  product?.details?.salePrice
                      ? `<span class="sale-price">$${formatPrice(
                            product.details.salePrice
                        )}</span>`
                      : ""
              }
            </p>
            <p>Category: ${escapeHtml(product.details?.category || "—")}</p>
            <button class="btn btn-primary" data-id="${
                product.id
            }">Add to Cart</button>
            <a href="../index.html" class="back-link">Back to home</a>
          </div>
        </div>
    `;

    details.querySelector(".btn-primary")?.addEventListener("click", () => {
        if (typeof window.addToCart === "function") {
            window.addToCart(product.id);
        }
    });

    return details;
}
