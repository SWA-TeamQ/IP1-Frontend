import { escapeHtml, formatPrice } from "../js/lib/utils.js";
import { onConfirmPayment } from "./Cart/CartSystem.js";
import { addToCart } from "./Cart/CartSystem.js";

export default function ProductDetails(product) {
    const details = document.createElement("div");
    details.className = "product-details";

    const imgSrc = product.image.startsWith("assets/")
        ? "../" + product.image
        : product.image;

    details.innerHTML = `
        <div class="product-details-grid">
          <div>
            <img src="${imgSrc}" alt="${escapeHtml(
        product.name
    )}" class="product-details-image" />
          </div>
          <div class="product-details-content">
            <h1>${escapeHtml(product.name)}</h1>
            <p>${escapeHtml(product.description || "")}</p>
            <p class="price">
              <strong>$${formatPrice(product.getPrice())}</strong>
              ${
                  product.details.salePrice
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
            <a href="./home.html" class="back-link">Back to home</a>
          </div>
        </div>
    `;

    details.querySelector(".btn-primary").addEventListener("click", () => {
        addToCart(product.id);
    });

    return details;
}
