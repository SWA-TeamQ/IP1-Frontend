import {
    apiClient,
    extractPayload,
    extractToken,
    extractUser,
    isEndpointUnsupported,
} from "./api.js";
import { storageGetJson, storageSetJson } from "../utils/storage.js";

const AUTH_BASE = "/api/auth";
const MOCK_USERS_KEY = "mock_api_users_v1";

function delay(ms = 250) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function getMockUsers() {
    return storageGetJson(MOCK_USERS_KEY, []);
}

function saveMockUsers(users) {
    storageSetJson(MOCK_USERS_KEY, users);
}

function buildMockUser(payload) {
    return {
        id: String(Date.now()),
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone || "",
        role: "customer",
    };
}

function readErrorMessage(error) {
    const message = error?.response?.data?.error?.message;
    return message || "Something went wrong. Please try again.";
}

export async function loginUser({ email, password }) {
    try {
        const res = await apiClient.post(`${AUTH_BASE}/login`, {
            email,
            password,
        });
        return {
            ok: true,
            data: {
                token: extractToken(res.data),
                user: extractUser(res.data),
            },
        };
    } catch (error) {
        if (!error?.response || isEndpointUnsupported(error)) {
            await delay();
            const found = getMockUsers().find((user) => user.email === email);
            if (!found) {
                return { ok: false, message: "Invalid email or password." };
            }
            return {
                ok: true,
                data: {
                    token: `mock-token-${found.id}`,
                    user: found,
                },
            };
        }
        return { ok: false, message: readErrorMessage(error) };
    }
}

export async function registerUser({ fullName, email, password, phone }) {
    try {
        const res = await apiClient.post(`${AUTH_BASE}/register`, {
            fullName,
            email,
            password,
            phone,
        });
        return {
            ok: true,
            data: {
                token: extractToken(res.data),
                user: extractUser(res.data),
            },
        };
    } catch (error) {
        if (!error?.response || isEndpointUnsupported(error)) {
            await delay();
            const users = getMockUsers();
            const exists = users.some((user) => user.email === email);
            if (exists) {
                return {
                    ok: false,
                    message: "Email is already registered.",
                };
            }
            const user = buildMockUser({ fullName, email, phone });
            saveMockUsers([...users, user]);
            return {
                ok: true,
                data: {
                    token: `mock-token-${user.id}`,
                    user,
                },
            };
        }
        return { ok: false, message: readErrorMessage(error) };
    }
}

export async function fetchCurrentUser() {
    try {
        const res = await apiClient.get(`${AUTH_BASE}/me`);
        return { ok: true, data: extractUser(res.data) };
    } catch (firstError) {
        if (firstError?.response?.status === 404) {
            try {
                const res = await apiClient.get(`/api/me`);
                return { ok: true, data: extractUser(res.data) };
            } catch (secondError) {
                if (secondError?.response?.status === 404) {
                    try {
                        const res = await apiClient.get(`${AUTH_BASE}/session`);
                        return { ok: true, data: extractUser(res.data) };
                    } catch {
                        return { ok: false };
                    }
                }
            }
        }
        return { ok: false };
    }
}

export async function logoutUser() {
    try {
        const res = await apiClient.post(`${AUTH_BASE}/logout`);
        return { ok: true, data: extractPayload(res.data) };
    } catch (error) {
        return { ok: false, message: readErrorMessage(error) };
    }
}

export async function resetPassword({ email, password }) {
    try {
        await apiClient.post(`${AUTH_BASE}/reset`, {
            email,
            password,
        });
        return { ok: true };
    } catch (error) {
        if (!error?.response || isEndpointUnsupported(error)) {
            await delay();
            const users = getMockUsers();
            const index = users.findIndex((user) => user.email === email);
            if (index < 0) {
                return {
                    ok: false,
                    message: "No account found with this email.",
                };
            }
            const next = [...users];
            next[index] = { ...next[index] };
            saveMockUsers(next);
            return { ok: true };
        }
        return { ok: false, message: readErrorMessage(error) };
    }
}
