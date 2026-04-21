// Favorites class

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
            localStorage.setItem(this.STORAGE_FAVS, JSON.stringify(keys));
        } catch (e) {
            console.warn("Failed to save favorites", e);
        }
    }
    load() {
        try {
            const items = localStorage.getItem(this.STORAGE_FAVS);
            this.items = items ? new Set(JSON.parse(items)) : new Set();
        } catch (e) {
            this.items = new Set();
        }
    }
}

export { Favorites };
