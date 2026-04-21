/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storageGetJson, storageSetJson } from "../utils/storage.js";
import {
    fetchFavorites,
    toggleFavorite as toggleFavoriteRemote,
} from "../services/favorites.js";
import { useAuth } from "./AuthContext.jsx";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "favorites";

function loadFavorites() {
    return new Set(storageGetJson(STORAGE_KEY, []));
}

function persistFavorites(set) {
    storageSetJson(STORAGE_KEY, Array.from(set));
}

export function FavoritesProvider({ children }) {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState(loadFavorites());

    useEffect(() => {
        let mounted = true;

        if (!user) {
            setTimeout(() => {
                if (mounted) setFavorites(loadFavorites());
            }, 0);
            return () => {
                mounted = false;
            };
        }

        fetchFavorites()
            .then((ids) => {
                if (!mounted) return;
                const next = new Set(ids);
                setFavorites(next);
                persistFavorites(next);
            })
            .catch(() => {
                if (!mounted) return;
                setFavorites(loadFavorites());
            });

        return () => {
            mounted = false;
        };
    }, [user]);

    const toggleFavorite = async (id) => {
        if (!id) return;

        if (user) {
            try {
                const ids = await toggleFavoriteRemote(id);
                const next = new Set(ids);
                setFavorites(next);
                persistFavorites(next);
                return;
            } catch {
                // Continue with local fallback below.
            }
        }

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
