/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import {
  getSession,
  saveSession,
  clearSession,
  getUsers,
  saveUsers,
  hashPassword,
} from "../utils/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSession());

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find(
      (u) => u.email === email && u.password === hashPassword(password)
    );
    if (!found) return { ok: false, message: "Invalid email or password." };
    saveSession(found);
    setUser(found);
    return { ok: true };
  };

  const register = (payload) => {
    const users = getUsers();
    if (users.some((u) => u.email === payload.email)) {
      return { ok: false, message: "Email already registered." };
    }
    const next = [
      ...users,
      {
        ...payload,
        password: hashPassword(payload.password),
      },
    ];
    saveUsers(next);
    return { ok: true };
  };

  const logout = () => {
    clearSession();
    setUser(null);
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