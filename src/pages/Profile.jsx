import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchOrders } from "../services/orders.js";
import { formatPrice } from "../utils/formatters.js";

function ProfilePage() {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        if (!user) return;
        setTimeout(() => {
            if (mounted) setLoadingOrders(true);
        }, 0);
        fetchOrders()
            .then((items) => {
                if (mounted) setOrders(items || []);
            })
            .catch(() => {
                if (mounted) setOrders([]);
            })
            .finally(() => {
                if (mounted) setLoadingOrders(false);
            });

        return () => {
            mounted = false;
        };
    }, [user]);

    if (!user) {
        return (
            <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Profile
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    Please sign in to view your profile.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                        to="/login"
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                        Register
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">
                    Profile
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    Manage your account and view saved details.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-sm text-slate-500">Full name</div>
                <div className="text-lg font-semibold text-slate-900">
                    {user.fullName || "ShopLight Member"}
                </div>
                <div className="mt-4 text-sm text-slate-500">Email</div>
                <div className="text-sm font-semibold text-slate-900">
                    {user.email}
                </div>
                {user.phone && (
                    <>
                        <div className="mt-4 text-sm text-slate-500">Phone</div>
                        <div className="text-sm font-semibold text-slate-900">
                            {user.phone}
                        </div>
                    </>
                )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Order history
                    </h2>
                    <span className="text-xs text-slate-500">
                        {orders.length} total
                    </span>
                </div>
                {loadingOrders ? (
                    <p className="mt-4 text-sm text-slate-600">
                        Loading orders...
                    </p>
                ) : orders.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-600">
                        No orders yet.
                    </p>
                ) : (
                    <ul className="mt-4 space-y-3 text-sm text-slate-700">
                        {orders.map((order) => (
                            <li
                                key={order.id}
                                className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3"
                            >
                                <div>
                                    <div className="font-semibold">
                                        Order #{order.id}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Status: {order.status || "pending"}
                                    </div>
                                </div>
                                <div className="text-sm font-semibold text-slate-900">
                                    ${formatPrice(order.total ?? 0)}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={async () => {
                        await logout();
                        navigate("/");
                    }}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                    Logout
                </button>
                <Link
                    to="/products"
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                    Shop products
                </Link>
            </div>
        </div>
    );
}

export default ProfilePage;
