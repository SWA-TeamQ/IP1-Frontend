import { $ } from "/src/utils/dom.js";
import { initApp } from "./scripts/initApp.js";
import { initHomePage } from "./scripts/home.page.js";
import { initProductsPage } from "./scripts/products.page.js";
import { initProductDetailPage } from "./scripts/product-detail.page.js";
import { initCheckout } from "./scripts/checkout.page.js";

initApp();
initHomePage();
initProductsPage();
initProductDetailPage();
initCheckout();

function changeImage(el) {
    const mainImg = $(".main-image");
    document
        .querySelectorAll(".thumbnail-gallery img")
        .forEach((i) => i.classList.remove("active"));
    el.classList.add("active");
    mainImg.style.opacity = 0;
    setTimeout(() => {
        mainImg.src = el.src;
        mainImg.style.transform = "scale(1.02)";
        mainImg.style.opacity = 1;
        setTimeout(() => (mainImg.style.transform = "scale(1)"), 200);
    }, 200);
}

window.changeImage = changeImage;
