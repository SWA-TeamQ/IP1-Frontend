
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../modules/products/product.api.js";

const form = document.getElementById("productForm");
const list = document.getElementById("productsList");

const idInput = document.getElementById("productId");
const nameInput = document.getElementById("name");
const descInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");

const logoutBtn = document.getElementById("logoutBtn");


if (localStorage.getItem("role") !== "admin") {
    window.location.href = "../pages/login.html";
}


const submitBtn = form?.querySelector('button[type="submit"]');
let isBusy = false;

function setBusy(v) {
    isBusy = v;
    if (submitBtn) submitBtn.disabled = v;
    logoutBtn && (logoutBtn.disabled = v);
    form &&
        Array.from(form.querySelectorAll("input,button")).forEach((el) => {
            if (el === logoutBtn) return;
            el.disabled = v;
        });
}

function setMode(mode) {
   
    if (!submitBtn) return;
    submitBtn.textContent = mode === "edit" ? "Update Product" : "Save Product";
}


const cancelBtn = (() => {
    if (!form) return null;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Cancel Edit";
    btn.style.display = "none";
    btn.style.marginTop = "10px";
    btn.onclick = () => resetForm();
    form.appendChild(btn);
    return btn;
})();

function resetForm() {
    form?.reset();
    if (idInput) idInput.value = "";
    setMode("create");
    if (cancelBtn) cancelBtn.style.display = "none";
}

function normalizeFormValue(v) {
    return String(v ?? "").trim();
}

function productToForm(p) {
    idInput.value = p?.id ?? "";
    nameInput.value = p?.name ?? "";
    descInput.value = p?.description ?? "";
    priceInput.value = p?.price ?? p?.details?.salePrice ?? "";
    categoryInput.value = p?.details?.category ?? "";
    imageInput.value = p?.images?.[0] ?? p?.image ?? "";
    setMode("edit");
    if (cancelBtn) cancelBtn.style.display = "inline-block";
}

function renderProductRow(p) {
    const card = document.createElement("div");
    card.dataset.productId = p?.id ?? "";

    const safeName = p?.name ?? "(no name)";
    const safeDesc = p?.description ?? "";
    const safeCat = p?.details?.category ?? "";
    const safePrice = Number(p?.details?.salePrice ?? p?.salePrice ?? p?.price ?? 0);

    card.innerHTML = `
      <h3>${escapeHtml(safeName)}</h3>
      <p class="muted">${escapeHtml(safeDesc)}</p>
      <p class="muted"><b>Category:</b> ${escapeHtml(safeCat)}</p>
      <p class="muted"><b>Price:</b> $${Number.isFinite(safePrice) ? safePrice.toFixed(2) : "0.00"}</p>
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
        <button type="button" data-edit>Edit</button>
        <button type="button" data-delete>Delete</button>
      </div>
    `;

    card.querySelector("[data-edit]")?.addEventListener("click", () => {
        productToForm(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    card.querySelector("[data-delete]")?.addEventListener("click", async () => {
        if (isBusy) return;
        const ok = confirm(`Delete "${safeName}"? This cannot be undone.`);
        if (!ok) return;

        setBusy(true);
        try {
            await deleteProduct(p.id);
            
            card.remove();
            await loadProducts();
            resetForm();
        } catch (e) {
            console.error(e);
            alert("Delete failed. Check Console for details.");
        } finally {
            setBusy(false);
        }
    });

    return card;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


logoutBtn?.addEventListener("click", () => {
   
    const users = localStorage.getItem("users");
    localStorage.clear();
    if (users) localStorage.setItem("users", users);

    window.location.href = "../pages/login.html";
});

// --- Load products ---
async function loadProducts() {
    if (!list) return;
    setBusy(true);
    try {
        const products = (await fetchProducts(true)) || [];
        list.innerHTML = "";

        if (!products.length) {
            list.innerHTML = `<p class="muted">No products found.</p>`;
            return;
        }

        for (const p of products) {
            list.appendChild(renderProductRow(p));
        }
    } catch (e) {
        console.error(e);
        list.innerHTML = `<p class="muted">Failed to load products. Check Console.</p>`;
    } finally {
        setBusy(false);
    }
}

// --- Create / Update ---
form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isBusy) return;

    const name = normalizeFormValue(nameInput.value);
    const description = normalizeFormValue(descInput.value);
    const category = normalizeFormValue(categoryInput.value);
    const image = normalizeFormValue(imageInput.value);
    const price = Number(priceInput.value);

    if (!name || !description || !category || !image || !Number.isFinite(price)) {
        alert("Please fill all fields with valid values.");
        return;
    }

    const data = {
        name,
        description,
        price,
        images: [image],
        details: { category },
    };

    setBusy(true);
    try {
        if (idInput.value) {
            await updateProduct(idInput.value, data);
        } else {
            await createProduct(data);
        }

        resetForm();
        await loadProducts();
    } catch (err) {
        console.error(err);
        alert("Save failed. Check Console for details.");
    } finally {
        setBusy(false);
    }
});

setMode("create");
loadProducts();