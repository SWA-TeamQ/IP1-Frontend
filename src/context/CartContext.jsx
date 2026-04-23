/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import { storageGetJson, storageSetJson } from "../utils/storage.js";
import { getProductById } from "../services/products.js";

const CartContext = createContext(null);
const STORAGE_KEY = "shop_cart_v1";

function loadCart() {
  return storageGetJson(STORAGE_KEY, { items: {}, total: 0 });
}

function saveCart(cart) {
  storageSetJson(STORAGE_KEY, cart);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart());

  const totalQuantity = useMemo(() => {
    return Object.values(cart.items).reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
  }, [cart.items]);

  const addItem = async (productId, quantity = 1) => {
    const product = await getProductById(productId);
    if (!product) return;

    setCart((prev) => {
      const items = { ...prev.items };
      const existing = items[productId] || { 
        productId, 
        quantity: 0,
        name: product.name,
        price: product.salePrice ?? product.price,
        image: product.images?.[0]
      };
      items[productId] = {
        ...existing,
        quantity: existing.quantity + quantity,
      };
      const next = { ...prev, items };
      saveCart(next);
      return next;
    });
  };

  const removeItem = (productId) => {
    setCart((prev) => {
      const items = { ...prev.items };
      delete items[productId];
      const next = { ...prev, items };
      saveCart(next);
      return next;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prev) => {
      const items = { ...prev.items };
      if (!items[productId]) return prev;
      items[productId] = {
        ...items[productId],
        quantity: Math.max(1, Number(quantity) || 1),
      };
      const next = { ...prev, items };
      saveCart(next);
      return next;
    });
  };

  const clearCart = () => {
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}