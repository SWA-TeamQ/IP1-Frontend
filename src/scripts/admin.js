import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../scripts/product.api.js";

const form = document.getElementById("productForm");
const list = document.getElementById("productsList");

const idInput = document.getElementById("productId");
const nameInput = document.getElementById("name");
const descInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "../auth/login.html";
};

/* ===============================
   LOAD PRODUCTS
================================ */
async function loadProducts() {
    const products = await fetchProducts(true);
    list.innerHTML = "";

    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "product-card";

        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p><strong>${p.details?.category || ""}</strong></p>
            <button data-edit>Edit</button>
            <button data-delete>Delete</button>
        `;

        div.querySelector("[data-edit]").onclick = () => fillForm(p);
        div.querySelector("[data-delete]").onclick = async () => {
            await deleteProduct(p.id);
            loadProducts();
        };

        list.appendChild(div);
    });
}

/* ===============================
   FILL FORM FOR UPDATE
================================ */
function fillForm(p) {
    idInput.value = p.id;
    nameInput.value = p.name;
    descInput.value = p.description;
    priceInput.value = p.price || "";
    categoryInput.value = p.details?.category || "";
    imageInput.value = p.images?.[0] || "";
}

/* ===============================
   CREATE / UPDATE
================================ */
form.addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
        name: nameInput.value,
        description: descInput.value,
        price: Number(priceInput.value),
        images: [imageInput.value],
        details: { category: categoryInput.value }
    };

    if (idInput.value) {
        await updateProduct(idInput.value, data);
    } else {
        await createProduct(data);
    }

    form.reset();
    idInput.value = "";
    loadProducts();
});

loadProducts();
