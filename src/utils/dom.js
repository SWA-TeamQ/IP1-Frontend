export function $(selector, root = document) {
    return root.querySelector(selector);
}

export function $$(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
}

export function setText(el, text) {
    if (!el) return;
    el.textContent = text == null ? "" : String(text);
}
