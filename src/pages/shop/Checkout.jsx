import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { fetchProducts } from "../../services/products.js";
import { formatPrice, getImageUrl } from "../../utils/formatters.js";
import { printReceipt } from "../../utils/receipt.js";
import { apiClient } from "../../api/api.js";
import { useNavigate } from "react-router-dom";

const TAX = 15;

function CheckoutPage() {
    const { items, updateQuantity, removeItem, clearCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [shippingInfo, setShippingInfo] = useState({
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        city: "New York",
        postalCode: "10001",
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
        return Object.values(items || {}).map(item => ({
            ...item,
            unitPrice: item.price
        }));
    }, [items]);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
    );
    const shipping = subtotal > 0 ? 5 : 0;
    const tax = subtotal * (TAX / 100);
    const total = subtotal + tax + shipping;

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const payload = {
                items: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: Math.round(item.unitPrice * 100) // Sent as cents
                })),
                shippingAddress: {
                    fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                    addressLine1: shippingInfo.address,
                    city: shippingInfo.city,
                    postalCode: shippingInfo.postalCode,
                    country: "USA" // Default
                },
                subtotal: Number(subtotal.toFixed(2)),
                tax: Number(tax.toFixed(2)),
                shipping: Number(shipping.toFixed(2)),
                total: Number(total.toFixed(2))
            };

            await apiClient.post("/orders", payload);
            alert("Order placed successfully!");
            clearCart();
            navigate("/");
        } catch (err) {
            alert("Failed to place order: " + err.message);
        } finally {
            setLoading(false);
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
                            ["firstName", "First Name", "John"],
                            ["lastName", "Last Name", "Doe"],
                            ["address", "Address", "123 Main St"],
                            ["city", "City", "New York"],
                            ["postalCode", "Postal Code", "10001"],
                        ].map(([field, label, placeholder], idx) => (
                            <div
                                key={idx}
                                className={field === "address" ? "sm:col-span-2" : ""}
                            >
                                <label className="text-sm font-semibold text-slate-700">
                                    {label}
                                </label>
                                <input
                                    type="text"
                                    value={shippingInfo[field]}
                                    onChange={(e) => setShippingInfo({ ...shippingInfo, [field]: e.target.value })}
                                    placeholder={placeholder}
                                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>
... (rest of the file)

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
                                        src={getImageUrl(item.image)}
                                        alt={item.name}
                                        className="h-16 w-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-slate-900">
                                            {item.name}
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
                                    <span>{subtotal > 0 ? "$5.00" : "$0.00"}</span>
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
                                    disabled={loading}
                                    onClick={handlePlaceOrder}
                                    className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-400"
                                >
                                    {loading ? "Placing Order..." : "Place Order"}
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
