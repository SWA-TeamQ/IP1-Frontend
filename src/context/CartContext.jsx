/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import { storageGetJson, storageSetJson } from "../utils/storage.js";
import { getProductById } from "../services/products.js";

const CartContext = createContext(null);
const STORAGE_KEY = "shop_cart_v2"; // Incremented version to clear out old flat objects

function loadCart() {
  // Items are now stored indexed by product ID, but store both the backend line item ID and product information
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
      const existing = items[productId];

      if (existing) {
        // Item exists, update its quantity while maintaining its sequence cart_item_id
        items[productId] = {
          ...existing,
          quantity: existing.quantity + quantity,
        };
      } else {
        // New item entry: Generate a temporary numerical ID for client operation 
        // (If syncing to backend on action, replace this with the returned ID from POST /api/cart)
        const temporaryCartItemId = Date.now() + Math.floor(Math.random() * 1000);

        items[productId] = {
          id: temporaryCartItemId, // This holds your row sequence ID (cart_item_id)
          productId,
          quantity: quantity,
        };
      }

      const next = { ...prev, items };
      saveCart(next);
      return next;
    });
  };

  // Restructured to use the relational line sequence ID to target mutations safely
  const removeItemByCartItemId = (cartItemId) => {
    setCart((prev) => {
      const items = { ...prev.items };
      
      // Find the key tracking this specific database row ID
      const targetKey = Object.keys(items).find(
        (key) => items[key].id === cartItemId
      );

      if (targetKey) {
        delete items[targetKey];
      }

      const next = { ...prev, items };
      saveCart(next);
      return next;
    });
  };

  // Restructured to identify line modification targets by relational row configurations
  const updateQuantityByCartItemId = (cartItemId, quantity) => {
    setCart((prev) => {
      const items = { ...prev.items };
      
      const targetKey = Object.keys(items).find(
        (key) => items[key].id === cartItemId
      );

      if (!targetKey) return prev;

      items[targetKey] = {
        ...items[targetKey],
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
    removeItem: removeItemByCartItemId,
    updateQuantity: updateQuantityByCartItemId,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}