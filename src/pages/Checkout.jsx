import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../services/products.js";
import { formatPrice } from "../utils/formatters.js";
import { printReceipt } from "../utils/receipt.js";
import { apiClient } from "../services/api.js";

const TAX_RATE = 15;

function CheckoutPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shipping, setShipping] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  useEffect(() => {
    let mounted = true;
    fetchProducts().then((list) => {
      if (mounted) setProducts(list);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const cartItems = useMemo(() => {
    return Object.values(items || {})
      .map((item) => {
        const product = products.find((p) => String(p.id) === String(item.productId));
        if (!product) return null;
        const unitPrice = product.salePrice ?? product.price ?? 0;
        return { ...item, product, unitPrice };
      })
      .filter(Boolean);
  }, [items, products]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const tax = subtotal * (TAX_RATE / 100);
  const shippingCost = 0; // Free shipping
  const total = subtotal + tax + shippingCost;

  const handlePlaceOrder = async () => {
    if (!user) {
      setError("Please login to place an order.");
      return;
    }

    if (!shipping.address || !shipping.city || !shipping.postalCode) {
      setError("Please fill in all shipping information.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPriceCents: Math.round(item.unitPrice * 100)
        })),
        shippingAddress: shipping,
        subtotal: subtotal,
        tax: tax,
        shipping: shippingCost,
        total: total,
        paymentDetails: payment
      };

      const res = await apiClient.post("/orders", payload);
      
      if (res.data.status === "success") {
        alert("Order placed successfully! Thank you for your purchase.");
        clearCart();
        navigate("/profile");
      }
    } catch (err) {
      console.error("Order failed:", err);
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Checkout</h1>
          <p className="mt-2 text-sm text-slate-600">
            Confirm your items and provide shipping information.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600 border border-rose-200">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Shipping Information
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">First Name</label>
              <input
                type="text"
                value={shipping.firstName}
                onChange={(e) => setShipping({...shipping, firstName: e.target.value})}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Last Name</label>
              <input
                type="text"
                value={shipping.lastName}
                onChange={(e) => setShipping({...shipping, lastName: e.target.value})}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Address</label>
              <input
                type="text"
                value={shipping.address}
                onChange={(e) => setShipping({...shipping, address: e.target.value})}
                placeholder="123 Main St"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">City</label>
              <input
                type="text"
                value={shipping.city}
                onChange={(e) => setShipping({...shipping, city: e.target.value})}
                placeholder="New York"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Postal Code</label>
              <input
                type="text"
                value={shipping.postalCode}
                onChange={(e) => setShipping({...shipping, postalCode: e.target.value})}
                placeholder="10001"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Payment Details
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Card Number
              </label>
              <input
                type="text"
                value={payment.cardNumber}
                onChange={(e) => setPayment({...payment, cardNumber: e.target.value})}
                placeholder="0000 0000 0000 0000"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Expiry
              </label>
              <input
                type="text"
                value={payment.expiry}
                onChange={(e) => setPayment({...payment, expiry: e.target.value})}
                placeholder="MM/YY"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">CVC</label>
              <input
                type="text"
                value={payment.cvc}
                onChange={(e) => setPayment({...payment, cvc: e.target.value})}
                placeholder="123"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">Your cart is empty.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-start gap-4 border-b border-slate-100 pb-4"
                >
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">
                      {item.product.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      ${formatPrice(item.unitPrice)}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.productId, e.target.value)
                        }
                        className="w-16 rounded-md border border-slate-200 px-2 py-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-xs font-semibold text-rose-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    ${formatPrice(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({TAX_RATE}%)</span>
                  <span>${formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span>${formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    printReceipt({
                      items: cartItems,
                      subtotal,
                      taxRate: TAX_RATE,
                      tax,
                      total,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default CheckoutPage;
