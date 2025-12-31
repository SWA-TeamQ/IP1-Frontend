export function getRatingStars(product) {
    const rating = product?.details?.rating || 0;

    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

export function getPrice(product) {
    return product.salePrice ?? product.price ?? 0;
}

