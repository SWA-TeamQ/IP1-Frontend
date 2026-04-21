import {
    storageGetJson,
    storageSetJson,
    sessionGetJson,
    sessionSetJson,
} from "./storage.js";

const USERS_KEY = "users";
const SESSION_KEY = "loggedInUser";

export function getUsers() {
    return storageGetJson(USERS_KEY, []);
}

export function saveUsers(users) {
    storageSetJson(USERS_KEY, users);
}

export function getSession() {
    return sessionGetJson(SESSION_KEY, null);
}

export function saveSession(user) {
    sessionSetJson(SESSION_KEY, user);
}

export function clearSession() {
    sessionSetJson(SESSION_KEY, null);
}

export function hashPassword(password) {
    return btoa(password) + "_" + password.length;
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}
