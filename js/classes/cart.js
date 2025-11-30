// Cart and CartItem classes

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
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            const price = product.details.salePrice || product.getPrice();
            this.#total += price * quantity;
        } else {
            this.items.set(product.id, new CartItem(product.id, quantity));
            const price = product.details.salePrice || product.getPrice();
            this.#total += price * quantity;
        }
        this.save();
    }

    remove(product) {
        const price = product.details.salePrice || product.getPrice();
        this.#total -= price * this.items.get(product.id).quantity;
        this.items.delete(product.id);
        this.save();
    }

    updateQuantity(productId, quantity) {
        const cartItem = this.items.get(productId);
        cartItem.quantity = Math.max(1, quantity);
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
            this.#total = parsedCart ? parsedCart.total : 0;
        } catch (e) {
            this.items = new Map();
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
        const count = Array.from(window.shoppingCart.items.values()).reduce(
            (acc, item) => {
                acc += item.quantity;
                return acc;
            },
            0
        );
        return count;
    }
}

export { Cart, CartItem };
