import { storageGetJson, storageSetJson } from "/src/utils/storage.js";

const STORAGE_FAVS = "shop_favs_v1";

export function initFavorites() {
    const stored_favorites = new Set(storageGetJson(STORAGE_FAVS, []));

    const favorites = {
        items: stored_favorites,
        // toggles (insert or delete) from the favorites set
        toggle(productId) {
            if (stored_favorites.has(productId)) {
                stored_favorites.delete(productId);
            } else {
                stored_favorites.add(productId);
            }

            storageSetJson(STORAGE_FAVS, Array.from(stored_favorites));
        },
        // checks if a productId is in the favorites set
        has(productId) {
            return stored_favorites.has(productId);
        },
    };

    window.favorites = favorites;

    return favorites;
}
