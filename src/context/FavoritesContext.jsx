/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import { storageGetJson, storageSetJson } from "../utils/storage.js";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "favorites";

function loadFavorites() {
  return new Set(storageGetJson(STORAGE_KEY, []));
}

function persistFavorites(set) {
  storageSetJson(STORAGE_KEY, Array.from(set));
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites());

  const toggleFavorite = (id) => {
    if (!id) return;
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persistFavorites(next);
      return next;
    });
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