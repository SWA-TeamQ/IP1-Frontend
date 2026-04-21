export function storageGetJson(key, fallback = null) {
    try {
        const stored = localStorage.getItem(key);
        if (stored == null) return fallback;
        return JSON.parse(stored);
    } catch {
        return fallback;
    }
}

export function sessionGetJson(key, fallback = null) {
    try {
        const stored = sessionStorage.getItem(key);
        if (stored == null) return fallback;
        return JSON.parse(stored);
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

export function sessionSetJson(key, value) {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
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

export function sessionRemove(key) {
    try {
        sessionStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}
