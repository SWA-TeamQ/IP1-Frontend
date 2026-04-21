import {
    apiClient,
    extractPayload,
    extractToken,
    extractUser,
} from "./api.js";

const AUTH_BASE = "/api/auth";

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
        return { ok: false, message: readErrorMessage(error) };
    }
}
