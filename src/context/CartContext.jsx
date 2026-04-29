/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { storageGetJson, storageSetJson } from "../utils/storage.js";
import { getProductById } from "../services/products.js";
import { useAuth } from "./AuthContext.jsx";
import { apiClient } from "../api/api.js";

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
  const { user } = useAuth();

  // Sync cart from API if logged in
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const items = await apiClient.get("/cart");
          // items is already the unwrapped array
          const itemsMap = {};
          (items || []).forEach(item => {
            itemsMap[item.product_id] = {
              productId: item.product_id,
              quantity: item.quantity,
              name: item.name,
              price: (item.price_cents || 0) / 100,
              image: item.images?.[0] || item.image
            };
          });
          setCart({ items: itemsMap, total: 0 });
        } catch (err) {
          console.error("Failed to fetch cart from API", err);
        }
      };
      fetchCart();
    }
  }, [user]);

  const totalQuantity = useMemo(() => {
    return Object.values(cart.items).reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
  }, [cart.items]);

  const addItem = async (productId, quantity = 1) => {
    const product = await getProductById(productId);
    if (!product) return;

    if (user) {
      try {
        await apiClient.post("/cart", { product_id: productId, quantity });
      } catch (err) {
        console.error("Failed to add item to API cart", err);
      }
    }

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

  const removeItem = async (productId) => {
    // API might not have DELETE /cart/:id in contract but usually does
    // For now we just update local state and let user know it's not implemented in contract
    setCart((prev) => {
      const items = { ...prev.items };
      delete items[productId];
      const next = { ...prev, items };
      saveCart(next);
      return next;
    });
  };

  const updateQuantity = async (productId, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    
    if (user) {
        // Contract says POST /cart increments quantity if exists
        // If we want to SET quantity, we might need another endpoint or just rely on local state
        // for now let's just update local
    }

    setCart((prev) => {
      const items = { ...prev.items };
      if (!items[productId]) return prev;
      items[productId] = {
        ...items[productId],
        quantity: qty,
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