function getRatingStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
        "★".repeat(full) +
        (half ? "½" : "") +
        "☆".repeat(empty)
    );
}

export const PRODUCTS = [
    {
        id: "p0",
        name: "Minimalist Watch",
        description: "Sleek stainless steel watch with leather strap.",
        price: 129.0,
        salePrice: null,
        image: "../assets/images/image (5).jpg",
        details: {
            category: "accessories",
            rating: 4.6,
            badge: "New",
            color: "Silver",
            reviewCount: 120
        },
        getRatingStars() { return getRatingStars(this.details.rating); },
        getPrice() { return this.price; },
        isFavorite: false,
    },
    {
        id: "p1",
        name: "Minimalist Watch",
        description: "Sleek stainless steel watch with leather strap.",
        price: 129.0,
        salePrice: null,
        image: "assets/images/product-watch.jpg",
        details: {
            category: "accessories",
            rating: 4.6,
            badge: "New",
            color: "Silver",
            reviewCount: 120
        },
        getRatingStars() { return getRatingStars(this.details.rating); },
        getPrice() { return this.price; },
        isFavorite: false,
    },
    {
        id: "p2",
        name: "Cozy Knit Sweater",
        description: "Comfortable knit sweater in neutral tones.",
        price: 89.0,
        salePrice: 69.0,
        image: "assets/images/product-sweater.jpg",
        details: {
            category: "apparel",
            rating: 4.5,
            badge: null,
            color: "Beige",
            reviewCount: 80
        },
        getRatingStars() { return getRatingStars(this.details.rating); },
        getPrice() { return this.price; },
        isFavorite: false,
    },
    {
        id: "p3",
        name: "Noise-Cancelling Headphones",
        description: "Immersive sound with long battery life.",
        price: 199.0,
        salePrice: 179.0,
        image: "assets/images/product-headphones.jpg",
        details: {
            category: "electronics",
            rating: 4.7,
            badge: "Sale",
            color: "Black",
            reviewCount: 200
        },
        getRatingStars() { return getRatingStars(this.details.rating); },
        getPrice() { return this.price; },
        isFavorite: false,
    },
    {
        id: "p4",
        name: "Ceramic Coffee Mug",
        description: "Hand-finished mug, 350ml.",
        price: 18.0,
        salePrice: null,
        image: "assets/images/product-mug.jpg",
        details: {
            category: "home",
            rating: 4.3,
            badge: null,
            color: "White",
            reviewCount: 45
        },
        getRatingStars() { return getRatingStars(this.details.rating); },
        getPrice() { return this.price; },
        isFavorite: false,
    },
    {
        id: "p5",
        name: "Running Sneakers",
        description: "Lightweight, breathable running sneakers.",
        price: 119.0,
        salePrice: 99.0,
        image: "assets/images/product-sneakers.jpg",
        details: {
            category: "footwear",
            rating: 4.4,
            badge: "Popular",
            color: "Gray",
            reviewCount: 60
        },
        getRatingStars() { return getRatingStars(this.details.rating); },
        getPrice() { return this.price; },
        isFavorite: false,
    },
    {
        id: "p6",
        name: "Wooden Desk Lamp",
        description: "Minimal lamp with dimmable LED.",
        price: 79.0,
        salePrice: null,
        image: "assets/images/product-lamp.jpg",
        details: {
            category: "home",
            rating: 4.2,
            badge: null,
            color: "Wood",
            reviewCount: 30
        },
        getRatingStars() { return getRatingStars(this.details.rating); },
        getPrice() { return this.price; },
        isFavorite: false,
    },
    {
        id: "p7",
        name: "Organic Cotton Tee",
        description: "Breathable everyday tee.",
        price: 29.0,
        salePrice: 24.0,
        image: "assets/images/product-tee.jpg",
        details: {
            category: "apparel",
            rating: 4.1,
            badge: null,
            color: "White",
            reviewCount: 25
        },
        getRatingStars() { return getRatingStars(this.details.rating); },
        getPrice() { return this.price; },
        isFavorite: false,
    },
    {
        id: "p8",
        name: "Portable Charger",
        description: "10000mAh USB-C power bank.",
        price: 39.0,
        salePrice: 34.0,
        image: "assets/images/product-powerbank.jpg",
        details: {
            category: "electronics",
            rating: 4.5,
            badge: "Deal",
            color: "Black",
            reviewCount: 90
        },
        getRatingStars() { return getRatingStars(this.details.rating); },
        getPrice() { return this.price; },
        isFavorite: false,
    },
];


export function extractProductsCategories() {
    return Array.from(
        new Set(PRODUCTS.map((p) => p.details?.category).filter(Boolean))
    );
}

export function getProduct(id) {
    return PRODUCTS.find((p) => p.id === id);
}
