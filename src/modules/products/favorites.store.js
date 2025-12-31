import { storageGetJson, storageSetJson} from "/src/utils/storage.js";
const KEY = "favorites";

export const getFavorites = () => {
    return storageGetJson(KEY, []);
};

export const saveFavorites = (list)=>{
    storageSetJson(KEY, list);
}

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
