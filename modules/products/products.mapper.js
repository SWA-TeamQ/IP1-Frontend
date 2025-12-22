function getRatingStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

export function mapApiProduct(p) {
  return {
    id: String(p.id),
    name: p.title,
    description: p.description,
    price: p.price,
    salePrice: null,
    image: p.image,
    details: {
      category: p.category,
      rating: p.rating?.rate || 0,
      badge: null,
      color: "Standard",
      reviewCount: p.rating?.count || 0,
    },
    getRatingStars() {
      return getRatingStars(this.details.rating);
    },
    getPrice() {
      return this.price;
    },
    isFavorite: false,
  };
}
