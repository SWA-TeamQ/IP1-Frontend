/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { apiClient } from "../services/api.js";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites(new Set());
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const res = await apiClient.get("/favorites");
      const ids = (res.data.data || []).map(p => p.id);
      setFavorites(new Set(ids));
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  const toggleFavorite = async (id) => {
    if (!id) return;
    if (!user) {
      // For guests, we could use localStorage, but let's stick to backend for now
      return;
    }

    try {
      const res = await apiClient.post(`/favorites/${id}`);
      const isFavorited = res.data.data.favorited;
      
      setFavorites((prev) => {
        const next = new Set(prev);
        if (isFavorited) next.add(id);
        else next.delete(id);
        return next;
      });
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const list = useMemo(() => Array.from(favorites), [favorites]);

  const value = {
    favorites,
    list,
    toggleFavorite,
    isFavorite: (id) => favorites.has(id),
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}