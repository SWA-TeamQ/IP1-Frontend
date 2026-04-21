import {
    sessionGetJson,
    sessionSetJson,
} from "./storage.js";

const SESSION_KEY = "loggedInUser";

export function getSession() {
    return sessionGetJson(SESSION_KEY, null);
}

export function saveSession(user) {
    sessionSetJson(SESSION_KEY, user);
}

export function clearSession() {
    sessionSetJson(SESSION_KEY, null);
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}
