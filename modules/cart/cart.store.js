import { storageGetJson, storageSetJson } from "../../core/utils/storage.js";

class CartItem {
    constructor(productId, quantity) {
        this.productId = productId;
        this.quantity = quantity;
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
        const existingCartItem = this.items.get(product.id);
        const unit = product?.details?.salePrice || product.getPrice?.() || 0;

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            this.items.set(product.id, new CartItem(product.id, quantity));
        }

        this.#total += unit * quantity;
        this.save();
    }

    remove(product) {
        const item = this.items.get(product.id);
        if (!item) return;
        const unit = product?.details?.salePrice || product.getPrice?.() || 0;
        this.#total -= unit * item.quantity;
        this.items.delete(product.id);
        this.save();
    }

    updateQuantity(productId, quantity) {
        const cartItem = this.items.get(productId);
        if (!cartItem) return;
        cartItem.quantity = Math.max(1, Number(quantity) || 1);
        this.save();
    }

    save() {
        storageSetJson(this.STORAGE_CART, {
            items: [...this.items],
            total: this.#total,
        });
    }

    load() {
        const parsed = storageGetJson(this.STORAGE_CART, null);
        this.items = parsed?.items ? new Map(parsed.items) : new Map();
        this.#total = parsed?.total || 0;
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
            (acc, item) => acc + (item.quantity || 0),
            0
        );
    }
}

export function initCart() {
    const cart = new Cart();
    window.shoppingCart = cart;

    window.addToCart = async (productId) => {
        const { getProduct } = await import("../products/products.data.js");
        const product = getProduct(productId);
        if (!product) return;
        cart.add(product);
        const navCartCount = document.getElementById("navCartCount");
        if (navCartCount)
            navCartCount.textContent = String(cart.getTotalQuantity());
    };

    const navCartCount = document.getElementById("navCartCount");
    if (navCartCount)
        navCartCount.textContent = String(cart.getTotalQuantity());

    return cart;
}
