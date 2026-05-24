import { storageGetJson, storageSetJson } from "./storage.js";

const SESSION_KEY = "loggedInUser";

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

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}
