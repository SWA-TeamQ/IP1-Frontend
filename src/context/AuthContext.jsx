/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSession, saveSession, clearSession } from "../utils/auth.js";
import {
    fetchCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
} from "../services/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getSession());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetchCurrentUser().then((result) => {
            if (!mounted) return;
            if (result.ok) {
                saveSession(result.data);
                setUser(result.data);
            } else {
                clearSession();
                setUser(null);
            }
            setLoading(false);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const login = async (email, password) => {
        const result = await loginUser({ email, password });
        if (!result.ok) return result;
        const nextUser = result.data?.user || null;
        if (nextUser) {
            saveSession(nextUser);
            setUser(nextUser);
        }
        return { ok: true };
    };

    const register = async (payload) => {
        const result = await registerUser(payload);
        if (!result.ok) return result;
        const nextUser = result.data?.user || null;
        if (nextUser) {
            saveSession(nextUser);
            setUser(nextUser);
        }
        return { ok: true };
    };

    const logout = async () => {
        await logoutUser();
        clearSession();
        setUser(null);
    };

    const value = useMemo(
        () => ({ user, login, register, logout, loading }),
        [user, loading],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
