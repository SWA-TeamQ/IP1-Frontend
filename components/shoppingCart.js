// Elements
const checkoutBtn = document.querySelector(".btn-checkout");
const checkoutModal = document.getElementById("checkoutModal");
const closeModalBtn = document.getElementById("closeModal");
const confirmPaymentBtn = document.getElementById("confirmPayment");
const cancelCheckoutBtn = document.getElementById("cancelCheckout");
const printReceiptBtn = document.getElementById("printReceipt");
const closeCheckoutBtn = document.getElementById("closeCheckout");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");

// Helper: Close modal and reset to step 1
function closeModal() {
  checkoutModal.classList.remove("active");
  checkoutModal.setAttribute("aria-hidden", "true");
  // Reset to step 1 after modal closes
  setTimeout(() => {
    step1.style.display = "block";
    step2.style.display = "none";
  }, 300);
}

// Open modal when "Proceed to Checkout" is clicked
checkoutBtn.addEventListener("click", () => {
  checkoutModal.classList.add("active");
  checkoutModal.setAttribute("aria-hidden", "false");
});

// Close modal with X button
closeModalBtn.addEventListener("click", closeModal);

// Cancel button closes modal
cancelCheckoutBtn.addEventListener("click", closeModal);

// Complete Purchase -> Go to Step 2
confirmPaymentBtn.addEventListener("click", () => {
  step1.style.display = "none";
  step2.style.display = "block";
});

// Download Receipt
printReceiptBtn.addEventListener("click", () => {
  alert("Receipt downloaded!");
  // You can add actual download logic here
});

// Close button on step 2
closeCheckoutBtn.addEventListener("click", closeModal);

// Close modal when clicking outside (on backdrop)
checkoutModal.addEventListener("click", (e) => {
  if (e.target === checkoutModal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && checkoutModal.classList.contains("active")) {
    closeModal();
  }
});


