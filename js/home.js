import { PRODUCTS } from "./data/products.js";
import ProductList from "../components/product-list.js";

// Featured (first 4)
const featured = PRODUCTS.slice(0, 4);
const grid = document.getElementById("featuredGrid");
grid.appendChild(ProductList(featured));

// lazy-load Spline iframe when visible
(function () {
    const wrap = document.querySelector(".spline-wrap");
    if (!wrap) return;
    const src = wrap.dataset.splineSrc;
    const supportsIO = "IntersectionObserver" in window;
    function injectIframe() {
        if (wrap.dataset.loaded) return;
        if (!src) return;
        const iframe = document.createElement("iframe");
        iframe.src = src;
        iframe.title = "3D product preview";
        iframe.loading = "lazy";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0";
        iframe.style.display = "block";
        iframe.setAttribute("allow", "fullscreen; autoplay;");
        wrap.appendChild(iframe);
        wrap.dataset.loaded = "1";
        const ph = wrap.querySelector(".spline-placeholder");
        if (ph) ph.style.opacity = "0";
    }
    if (supportsIO) {
        const io = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        injectIframe();
                        obs.disconnect();
                    }
                });
            },
            { rootMargin: "200px" }
        );
        io.observe(wrap);
    } else {
        setTimeout(injectIframe, 600);
    }
})();

document.getElementById("year").textContent =
    new Date().getFullYear();
