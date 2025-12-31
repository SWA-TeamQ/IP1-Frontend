const KEY = "favorites";

export const getFavorites = () => {
    try {
        const raw = localStorage.getItem(KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const saveFavorites = (list) =>
    localStorage.setItem(KEY, JSON.stringify(list));

// Used by `src/scripts/initApp.js` (do not remove).
// Provides a small store-like interface for favorites while persisting to localStorage.
export const initFavorites = () => {
    const set = new Set(getFavorites());

    const persist = () => saveFavorites(Array.from(set));

    return {
        has: (id) => set.has(id),
        toggle: (id) => {
            if (!id) return false;
            if (set.has(id)) set.delete(id);
            else set.add(id);
            persist();
            return set.has(id);
        },
        list: () => Array.from(set),
    };
};
