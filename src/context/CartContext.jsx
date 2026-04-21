/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storageGetJson, storageSetJson } from "../utils/storage.js";
import { getProductById } from "../services/products.js";
import {
    clearCart as clearServerCart,
    fetchCart,
    removeCartItem,
    updateCartItemQuantity,
    upsertCartItem,
} from "../services/cart.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);
const STORAGE_KEY = "shop_cart_v1";

function loadCart() {
    return storageGetJson(STORAGE_KEY, { items: {}, total: 0 });
}

function saveCart(cart) {
    storageSetJson(STORAGE_KEY, cart);
}

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState(loadCart());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        if (!user) {
            setTimeout(() => {
                if (mounted) setCart(loadCart());
            }, 0);
            return () => {
                mounted = false;
            };
        }

        setTimeout(() => {
            if (mounted) setLoading(true);
        }, 0);
        fetchCart()
            .then((serverCart) => {
                if (!mounted) return;
                const next = { items: serverCart.items || {}, total: 0 };
                setCart(next);
                saveCart(next);
            })
            .catch(() => {
                if (!mounted) return;
                setCart(loadCart());
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [user]);

    const totalQuantity = useMemo(() => {
        return Object.values(cart.items).reduce(
            (sum, item) => sum + (item.quantity || 0),
            0,
        );
    }, [cart.items]);

    const addItem = async (productId, quantity = 1) => {
        const product = await getProductById(productId);
        if (!product) return;

        if (user) {
            try {
                const next = await upsertCartItem({
                    productId,
                    quantity: Number(quantity) || 1,
                });
                const updated = { items: next.items || {}, total: 0 };
                setCart(updated);
                saveCart(updated);
                return;
            } catch {
                // Fallback to local cart below.
            }
        }

        setCart((prev) => {
            const items = { ...prev.items };
            const existing = items[productId] || { productId, quantity: 0 };
            items[productId] = {
                ...existing,
                quantity: existing.quantity + quantity,
            };
            const next = { ...prev, items };
            saveCart(next);
            return next;
        });
    };

    const removeItem = async (productId) => {
        if (user) {
            try {
                const next = await removeCartItem(productId);
                const updated = { items: next.items || {}, total: 0 };
                setCart(updated);
                saveCart(updated);
                return;
            } catch {
                // Fallback to local cart below.
            }
        }

        setCart((prev) => {
            const items = { ...prev.items };
            delete items[productId];
            const next = { ...prev, items };
            saveCart(next);
            return next;
        });
    };

    const updateQuantity = async (productId, quantity) => {
        const nextQty = Math.max(1, Number(quantity) || 1);

        if (user) {
            try {
                const next = await updateCartItemQuantity({
                    productId,
                    quantity: nextQty,
                });
                const updated = { items: next.items || {}, total: 0 };
                setCart(updated);
                saveCart(updated);
                return;
            } catch {
                // Fallback to local cart below.
            }
        }

        setCart((prev) => {
            const items = { ...prev.items };
            if (!items[productId]) return prev;
            items[productId] = {
                ...items[productId],
                quantity: nextQty,
            };
            const next = { ...prev, items };
            saveCart(next);
            return next;
        });
    };

    const clearCart = async () => {
        if (user) {
            try {
                await clearServerCart();
            } catch {
                // Ignore server clear failures and fall back to local reset.
            }
        }

        const next = { items: {}, total: 0 };
        setCart(next);
        saveCart(next);
    };

    const value = {
        items: cart.items,
        totalQuantity,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        loading,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used within CartProvider");
    }
    return ctx;
}
