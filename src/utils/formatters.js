export function formatPrice(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "0.00";
    return n.toFixed(2);
}

export function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function formatDateTime(value) {
    try {
        return new Date(value).toLocaleString();
    } catch {
        return "";
    }
}
