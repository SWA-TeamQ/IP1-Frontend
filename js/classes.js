class ProductDetails {
    constructor(kwargs) {
        this.category = kwargs?.category;
        this.size = kwargs?.size;
        this.badge = kwargs?.badge;
        this.rating = kwargs?.rating;
        this.reviewCount = kwargs?.reviewCount;
        this.salePrice = kwargs?.salePrice;
        this.color = kwargs?.color;
    }
}

class Product {
    #price;
    constructor(id, name, price, image, description = "", details = {}) {
        this.id = id;
        this.name = name;
        this.#price = price;
        this.image = image;
        this.description = description;
        this.details = new ProductDetails(details);
        this.isFavorite = false;
    }

    getPrice() {
        return this.#price;
    }

    getRatingStars() {
        const fullStars = Math.floor(this.details.rating || 0);
        const hasHalfStar = (this.details.rating || 0) % 1 >= 0.5;
        return (
            "★".repeat(fullStars) +
            (hasHalfStar ? "☆" : "") +
            "☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))
        );
    }
}

class Favorites {
    STORAGE_FAVS = "shop_favs_v1";
    constructor() {
        this.items = new Set();
        this.load();
    }

    toggle(product_id) {
        if (this.items.has(product_id)) {
            this.items.delete(product_id);
        } else {
            this.items.add(product_id);
        }
        this.save();
    }

    save() {
        try {
            const keys = Array.from(this.items.keys());
            localStorage.setItem(STORAGE_FAVS, JSON.stringify(keys));
        } catch (e) {
            console.warn("Failed to save favorites", e);
        }
    }
    load() {
        try {
            const items = localStorage.getItem(STORAGE_FAVS);
            this.items = items ? new Set(JSON.parse(items)) : new Set();
        } catch (e) {
            this.items = new Set();
        }
    }
}

class CartItem {
    constructor(productId, quantity, price) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }
}

class Cart {
    STORAGE_CART = "shop_cart_v1";

    #total;
    constructor() {
        this.items = new Map();
        this.#total = 0;
        this.load();
    }

    add(product, quantity = 1) {
        const price = product.details?.salePrice ?? product.getPrice();
        const existingCartItem = this.items.get(product.id);
        if (existingCartItem) {
            if (existingCartItem.price == null) existingCartItem.price = price;
            existingCartItem.quantity += quantity;
            this.#total += price * quantity;
        } else {
            this.items.set(product.id, new CartItem(product.id, quantity, price));
            this.#total += price * quantity;
        }
        this.save();
    }

    remove(product) {
        const existing = this.items.get(product.id);
        if (!existing) return;
        const price = existing.price ?? product.details?.salePrice ?? product.getPrice();
        this.#total -= price * existing.quantity;
        this.items.delete(product.id);
        this.save();
    }

    updateQuantity(productId, quantity) {
        const cartItem = this.items.get(productId);
        if (!cartItem) return;

        const price = cartItem.price ?? this.#resolvePrice(productId);

        const newQty = Math.max(1, quantity);
        const diff = newQty - cartItem.quantity;

        cartItem.quantity = newQty;
        this.#total += price * diff;
        this.save();
    }

    save() {
        const toStore = JSON.stringify({
            items: [...this.items],
            total: this.#total,
        });
        try {
            localStorage.setItem(this.STORAGE_CART, toStore);
        } catch (e) {
            console.warn("Failed to save cart", e);
        }
    }

    load() {
        try {
            const cart = localStorage.getItem(this.STORAGE_CART);
            const parsedCart = cart ? JSON.parse(cart) : null;

            this.items = parsedCart ? new Map(parsedCart.items) : new Map();
            this.#rehydrateItemPrices();
            this.#total = parsedCart?.total ?? this.#computeTotalFromItems();
        } catch (e) {
            this.items = new Map();
            this.#total = 0;
        }
    }

    clear() {
        this.items = new Map();
        this.#total = 0;
        this.save();
    }

    getTotal() {
        return this.#total;
    }

    getTotalQuantity() {
        return Array.from(this.items.values()).reduce(
            (acc, item) => acc + item.quantity,
            0
        );
    }

    #computeTotalFromItems() {
        return Array.from(this.items.values()).reduce((acc, item) => {
            const price = item.price ?? this.#resolvePrice(item.productId);
            return acc + price * item.quantity;
        }, 0);
    }

    #rehydrateItemPrices() {
        // Backward compatibility: ensure all items carry a price
        this.items.forEach((item) => {
            if (item.price == null) {
                item.price = this.#resolvePrice(item.productId);
            }
        });
    }

    #resolvePrice(productId) {
        const product = (window.PRODUCTS || []).find((p) => p.id == productId);
        return product ? product.details?.salePrice ?? product.getPrice?.() ?? 0 : 0;
    }
}

class Order {
    constructor(userId, cartId) {
        this.userId = userId;
        this.cartId = cartId;
        this.orderDate = new Date();
    }
}

class OrderQueue {
    orders = [];
    enqueue(orderId) {
        this.orders.push(orderId);
    }
    dequeue() {
        return this.orders.shift();
    }
}

class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
        this.cart = new Cart();
    }
}

class Admin extends User {
    constructor(username, email) {
        super(username, email);
    }
    manageProducts() {
        // Admin-specific product management logic
    }
}

export { Product, CartItem, Cart, Favorites, Order, OrderQueue, User, Admin };

window.shoppingCart = new Cart();
window.shoppingCart.load();
window.favorites = new Favorites();
