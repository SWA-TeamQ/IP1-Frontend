export function storageGetJson(key, fallback = null) {
    try {
        const stored_data = localStorage.getItem(key);
        if (stored_data == null){
            return fallback;
        }
        return JSON.parse(stored_data);
    } catch {
        return fallback;
    }
}

export function storageSetJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

export function storageRemove(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}
