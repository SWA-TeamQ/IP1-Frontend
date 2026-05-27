import { storageGetJson, storageSetJson } from "./storage.js";

const SESSION_KEY = "loggedInUser";
const USERS_KEY = "shoplight_users";

export function getSession() {
  return storageGetJson(SESSION_KEY, null);
}

export function saveSession(sessionData) {
  // sessionData should be { user, token } or similar from the backend
  storageSetJson(SESSION_KEY, sessionData);
}

export function clearSession() {
  storageSetJson(SESSION_KEY, null);
}

export function getUsers() {
  return storageGetJson(USERS_KEY, []);
}

export function saveUsers(users) {
  storageSetJson(USERS_KEY, users);
}

export function hashPassword(password) {
  // Simple simulation for frontend-only flows (like Forgot Password)
  return btoa(password);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}
