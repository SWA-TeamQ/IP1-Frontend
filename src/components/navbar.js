import { $, $$ } from "/src/utils/dom.js";

export function renderNavbar() {
    return `
    <header class="site-header">
      <div class="container header-inner brand">
        <a href="/" class="logo">ShopLight</a>
        <nav class="main-nav">
          <ul>
            <li><a href="/src/index.html">Home</a></li>
            <li><a href="/src/pages/product.html">Products</a></li>
            <li><a href="/src/index.html#about">About</a></li>
            <li><a href="/src/index.html#services">Services</a></li>
            <li><a href="/src/index.html#contact">Contact</a></li>
          </ul>
        </nav>
        <a href"/src/pages/checkout.html">
        <button class="nav-cart-btn">
                <img src="/src/assets/icons/cart.svg" alt="Cart" />
                <span class="cart-count" id="navCartCount">0</span>
                </button>
                </a>
        <button
          class="hamburger"
          id="navHamburger"
          aria-label="Open navigation"
          aria-controls="mainNav"
        >
          <span></span>
        </button>
      </div>
    </header>`;
}

export const insertNavbar = (target = document.body) => {
    console.log("Inserting navbar", target);
    if (!target) return;
    target.insertAdjacentHTML("afterbegin", renderNavbar());

    const hamburger = $("#navHamburger", target);
    const nav = $(".main-nav", target);
    hamburger?.addEventListener("click", () => {
        nav?.classList.toggle("open");
        hamburger.setAttribute(
            "aria-expanded",
            nav?.classList.contains("open") ? "true" : "false"
        );
    });

    $$("a", nav).forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            hamburger?.setAttribute("aria-expanded", "false");
        });
    });
};
