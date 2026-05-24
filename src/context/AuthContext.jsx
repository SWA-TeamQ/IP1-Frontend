/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import {
  getSession,
  saveSession,
  clearSession,
} from "../utils/auth.js";
import { apiClient } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSession());

  const user = useMemo(() => session?.user || null, [session]);

  const login = async (email, password) => {
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      const data = res.data.data; // { token, user }
      saveSession(data);
      setSession(data);
      return { ok: true };
    } catch (err) {
      console.error("Login failed:", err);
      return { 
        ok: false, 
        message: err.response?.data?.message || "Invalid email or password." 
      };
    }
  };

  const register = async (payload) => {
    try {
      // Backend expects firstName, lastName, email, password
      await apiClient.post("/auth/register", payload);
      return { ok: true };
    } catch (err) {
      console.error("Registration failed:", err);
      return { 
        ok: false, 
        message: err.response?.data?.message || "Registration failed." 
      };
    }
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user]
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
