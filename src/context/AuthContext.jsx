/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { apiClient } from "../api/api.js";
import {
  saveToken,
  clearToken,
} from "../utils/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await apiClient.get("/auth/me");
          setUser(userData);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      // response is the 'data' object from { status, message, data }
      const { token, user } = response;
      saveToken(token);
      setUser(user);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || "Login failed" };
    }
  };

  const register = async (payload) => {
    try {
      await apiClient.post("/auth/register", payload);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || "Registration failed" };
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, register, logout, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}