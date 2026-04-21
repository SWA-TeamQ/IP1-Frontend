import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchProducts } from "../services/products.js";
import { createOrder } from "../services/orders.js";
import { formatPrice } from "../utils/formatters.js";
import { printReceipt } from "../utils/receipt.js";

const TAX = 15;

function CheckoutPage() {
    const { items, updateQuantity, removeItem, clearCart } = useCart();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [placing, setPlacing] = useState(false);
    const [form, setForm] = useState({
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        city: "New York",
        postalCode: "10001",
        cardNumber: "",
        expiry: "",
        cvc: "",
    });

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

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
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                const unitPrice = product.salePrice ?? product.price ?? 0;
                return { ...item, product, unitPrice };
            })
            .filter(Boolean);
    }, [items, products]);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
    );
    const tax = subtotal * (TAX / 100);
    const total = subtotal + tax;

    const placeOrder = async () => {
        setMessage({ type: "", text: "" });
        if (!user) {
            setMessage({
                type: "error",
                text: "Please sign in to place an order.",
            });
            return;
        }
        if (cartItems.length === 0) {
            setMessage({ type: "error", text: "Your cart is empty." });
            return;
        }
        if (!form.firstName || !form.lastName || !form.address || !form.city) {
            setMessage({
                type: "error",
                text: "Please complete shipping information.",
            });
            return;
        }

        setPlacing(true);
        try {
            await createOrder({
                shipping: 0,
                tax,
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            });
            setMessage({
                type: "success",
                text: "Order placed successfully.",
            });
            clearCart();
        } catch {
            setMessage({
                type: "error",
                text: "Unable to place order right now. Please try again.",
            });
        } finally {
            setPlacing(false);
        }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900">
                        Checkout
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Confirm your items and provide shipping information.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Shipping Information
                    </h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {[
                            ["First Name", "John"],
                            ["Last Name", "Doe"],
                            ["Address", "123 Main St"],
                            ["City", "New York"],
                            ["Postal Code", "10001"],
                        ].map(([label, placeholder], idx) => {
                            const fieldKey =
                                label === "First Name"
                                    ? "firstName"
                                    : label === "Last Name"
                                      ? "lastName"
                                      : label === "Address"
                                        ? "address"
                                        : label === "City"
                                          ? "city"
                                          : "postalCode";
                            return (
                                <div
                                    key={idx}
                                    className={idx === 2 ? "sm:col-span-2" : ""}
                                >
                                    <label className="text-sm font-semibold text-slate-700">
                                        {label}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={placeholder}
                                        value={form[fieldKey]}
                                        onChange={(event) =>
                                            updateField(
                                                fieldKey,
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </div>
                            );
                        })}
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
                                placeholder="0000 0000 0000 0000"
                                value={form.cardNumber}
                                onChange={(event) =>
                                    updateField(
                                        "cardNumber",
                                        event.target.value,
                                    )
                                }
                                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Expiry
                            </label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={form.expiry}
                                onChange={(event) =>
                                    updateField("expiry", event.target.value)
                                }
                                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                CVC
                            </label>
                            <input
                                type="text"
                                placeholder="123"
                                value={form.cvc}
                                onChange={(event) =>
                                    updateField("cvc", event.target.value)
                                }
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

                    {message.text && (
                        <div
                            className={`mt-4 rounded-lg px-4 py-2 text-sm ${
                                message.type === "error"
                                    ? "bg-rose-50 text-rose-600"
                                    : "bg-emerald-50 text-emerald-600"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    {cartItems.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-600">
                            Your cart is empty.
                        </p>
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
                                                    updateQuantity(
                                                        item.productId,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-16 rounded-md border border-slate-200 px-2 py-1 text-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(item.productId)
                                                }
                                                className="text-xs font-semibold text-rose-500"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900">
                                        $
                                        {formatPrice(
                                            item.unitPrice * item.quantity,
                                        )}
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
                                    <span>Tax ({TAX}%)</span>
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
                                    onClick={placeOrder}
                                    className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                                    disabled={placing}
                                >
                                    {placing ? "Placing..." : "Place Order"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        printReceipt({
                                            items: cartItems,
                                            subtotal,
                                            taxRate: TAX,
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
