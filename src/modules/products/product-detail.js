const { $, $$ } = await import("/src/utils/dom.js");

export default function ProductDetail(products) {
    console.log(1);
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    const product = products.find((p) => p.id === id);
    const suggestions = products.filter(
        (each) =>
            each.details.category === product.details.category &&
            each.id !== product.id
    );
    const details = document.createElement("div");
    details.className = "product-details";

    if (!product) {
        details.innerHTML = "<p>Product not found</p>";
        return;
    }

    const images = Array.isArray(product.images) ? product.images : [];
    const features = Array.isArray(product.features) ? product.features : [];
    const highlights = Array.isArray(product.highlights)
        ? product.highlights
        : [];
    const reviews = Array.isArray(product.reviews) ? product.reviews : [];

    const rating = product.details?.rating ?? 0;
    const reviewCount = product.details?.reviewCount ?? reviews.length;
    const category = product.details?.category ?? "—";
    const color = product.details?.color ?? "—";

    const original = product.price ?? 0;
    const current = product.salePrice ?? original;

    details.innerHTML = `
<div class="product-container">
    <div class="product-media">

        <div class="thumbnail-gallery">
            ${images
                .map(
                    (img, i) => `
                <img src="${img}" class="${i === 0 ? "active" : ""}"
                     onclick="changeImage(this)" data-index="${i}" />
              `
                )
                .join("")}
        </div>

        <div class="main-image">
            <img src="${images[0] ?? ""}" alt="Product" />
        </div>

        <div class="product-details">
            <h2 class="product-title">${product.name}</h2>

            <div class="price">
                $${current.toFixed(2)}
                ${
                    product.salePrice
                        ? `<span class="original" style="text-decoration: line-through;text-decoration-color:black;font-size:0.8em; color:red">$${original.toFixed(
                              2
                          )}</span>`
                        : ""
                }
            </div>

            <p class="product-description">${product.description}</p>

            <!--  PRODUCT FEATURES -->
            <div class="product-meta">
                ${features.map((f) => `<span>${f}</span>`).join("")}
            </div>

           <button class="control-btn">Add to Cart</button>
        </div>
    </div>

    <!--  HIGHLIGHTS -->
    <section class="services-section">
        <h2>Why You'll Love This</h2>
        <ul>
            ${highlights.map((h) => `<li>${h}</li>`).join("")}
        </ul>
    </section>

    <!--  REVIEWS -->
    <section class="services-section">
        <h2>Ratings & Reviews</h2>
        <div id="Review-Number">
            ⭐ ${rating} (${reviewCount} reviews)
        </div>
        <ul>
            ${reviews
                .map((r) => `<li>⭐️ ${r.rating} — ${r.comment}</li>`)
                .join("")}
        </ul>
    </section>

    <section class="services-section">
                    <h2>Add Your Review</h2>
                    <form class="review-form">
                        <div class="rating-input">
                            <label>Rating:</label>
                            <div class="stars-select">
                                <input
                                    type="radio"
                                    name="userRating"
                                    id="r5"
                                /><label for="r5">⭐️</label>
                                <input
                                    type="radio"
                                    name="userRating"
                                    id="r4"
                                /><label for="r4">⭐️</label>
                                <input
                                    type="radio"
                                    name="userRating"
                                    id="r3"
                                /><label for="r3">⭐️</label>
                                <input
                                    type="radio"
                                    name="userRating"
                                    id="r2"
                                /><label for="r2">⭐️</label>
                                <input
                                    type="radio"
                                    name="userRating"
                                    id="r1"
                                /><label for="r1">⭐️</label>
                            </div>
                        </div>
                        <input type="text" placeholder="Your name" required />
                        <textarea
                            placeholder="Write your review..."
                            required
                        ></textarea>
                        <button type="submit" class="control-btn">
                            Submit Review
                        </button>
                    </form>
    </section>
    <section class="suggestions">
    <h3>You May Also Like</h3>

    <div class="suggestion-grid">
        ${
            suggestions.length > 0
                ? suggestions
                      .map(
                          (p) => `
                <div class="suggestion-card" onclick="viewProduct('${p.id}')">
                    <img 
                        src="${
                            p.images?.[0] ||
                            "/src/assets/images/placeholder.png"
                        }"
                        alt="${p.name}"
                        loading="lazy"
                    />
                    <h4>${p.name}</h4>
                    <span>$${(p.salePrice ?? p.price).toFixed(2)}</span>
                </div>
                `
                      )
                      .join("")
                : `<p>No similar products found.</p>`
        }
    </div>
</section>


</div>
`;

    $(".control-btn", details).addEventListener("click", () => {
        window.addToCart(product.id);
    });

    const favBtn = $("[data-fav]");
    favBtn?.addEventListener("click", () => {
        if (typeof window.toggleFav === "function") {
            window.toggleFav(product.id);
            const currentFavStatus = !!product.isFavorite;
            favBtn.setAttribute("aria-pressed", String(currentFavStatus));
            const label = $("span", favBtn);
            if (label) {
                label.textContent = currentFavStatus
                    ? "Favorited"
                    : "Add to favorites";
            }
        }
    });

    return details;
}

function changeImage(el) {
    const mainImg = $(".main-image > img");
    console.log(el, mainImg.src);
    $$(".thumbnail-gallery img")
    .forEach((i) => i.classList.remove("active"));

    el.classList.add("active");
    mainImg.style.opacity = 0;
    setTimeout(() => {
        mainImg.src = el.src;
        mainImg.style.transform = "scale(1.02)";
        mainImg.style.opacity = 1;
        setTimeout(() => (mainImg.style.transform = "scale(1)"), 200);
    }, 200);
}

window.changeImage = changeImage;
