import { storageGetJson, storageSetJson } from "../../utils/storage.js";

const STORAGE_FAVS = "shop_favs_v1";

export function initFavorites() {
    const stored = new Set(storageGetJson(STORAGE_FAVS, []));

    const favorites = {
        items: stored,
        toggle(productId) {
            if (stored.has(productId)) {
                stored.delete(productId);
            } else {
                stored.add(productId);
            }

            storageSetJson(STORAGE_FAVS, Array.from(stored));
        },
        has(productId) {
            return stored.has(productId);
        },
    };

    window.favorites = favorites;
    window.toggleFav = (productId) => {
        favorites.toggle(productId);
    };

    return favorites;
}
