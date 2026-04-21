import axios from "axios";

const DEFAULT_API_BASE_URL =
    "http://localhost/IP2-Backend/Ecomerece_Web_Backend/public";
const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.response.use((response) => {
    const body = response?.data;
    if (body && typeof body === "object" && "success" in body) {
        if (body.success === false) {
            const error = new Error(
                body?.error?.message || "Request failed. Please try again.",
            );
            error.response = {
                ...response,
                data: body,
            };
            throw error;
        }
    }
    return response;
});

export function extractPayload(responseData) {
    if (!responseData) return null;
    if (responseData.success === true && "data" in responseData) {
        return responseData.data;
    }
    if (responseData.data != null) return responseData.data;
    return responseData;
}

export function extractItems(responseData) {
    const payload = extractPayload(responseData);
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(responseData?.items)) return responseData.items;
    if (Array.isArray(payload)) return payload;
    return [];
}

export function extractItem(responseData) {
    const payload = extractPayload(responseData);
    return payload?.item ?? payload ?? null;
}

export function extractUser(responseData) {
    const payload = extractPayload(responseData);
    return payload?.user ?? payload ?? null;
}

export function extractToken(responseData) {
    const payload = extractPayload(responseData);
    return payload?.token ?? responseData?.token ?? null;
}

export function isEndpointUnsupported(error) {
    const status = error?.response?.status;
    return status === 404 || status === 405 || status === 501;
}
