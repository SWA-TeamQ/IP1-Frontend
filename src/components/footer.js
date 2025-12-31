import { $ } from "/src/utils/dom.js";

export function renderFooter() {
    return `
    <footer class="site-footer">
      <div class="container footer-content">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="logo footer-logo" href="/">ShopLight</a>
            <p class="muted">
              Curated modern goods — thoughtful design, ethical sourcing.
            </p>
          </div>
          <div class="footer-links">
            <h4>Shop</h4>
            <ul>
              <li><a href="/src/pages/product.html">All products</a></li>
              <li><a href="/src/index.html#featured">Featured</a></li>
              <li><a href="/src/index.html#services">Services</a></li>
            </ul>
          </div>
          <div class="footer-links">
            <h4>Support</h4>
            <ul>
              <li><a href="/src/pages/checkout.html">Checkout</a></li>
              <li><a href="/src/pages/contact.html">Contact</a></li>
              <li><a href="/src/pages/login.html">Sign in</a></li>
            </ul>
          </div>
          <div class="footer-newsletter">
            <h4>Join our newsletter</h4>
            <form class="newsletter-form" action="#" onsubmit="event.preventDefault();">
              <input type="email" placeholder="you@example.com" aria-label="Email address" required />
              <button class="btn" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-text">
            &copy; <span id="year"></span> ShopLight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>`;
}

export function insertFooter(target = document.body) {
    if (!target) return;
    target.insertAdjacentHTML("beforeend", renderFooter());
    const yearEl = $("#year", target);
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }
}
