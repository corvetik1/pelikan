"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Roles available in the application. Extend when new roles appear.
 */
export type Role = "admin" | "user";

/**
 * Minimal user representation stored on the client.
 */
export interface User {
  id: string;
  name: string;
  roles: Role[];
}

/**
 * Shape of the context exposed to components.
 */
interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  loginAsAdmin(): void;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Extract user from different sources. Runs both on server (during SSR) and on client.
 * Priority: 1) session cookie  2) localStorage (CSR only)  3) query param ?admin=1 (CSR only)
 */
const getInitialUser = (): User | null => {
  // 1. CSR-readable cookie (works on both CSR & after hydration)
  if (typeof document !== "undefined") {
    const cookiePair = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("session="));
    const value = cookiePair?.split("=")[1];
    if (value === "admin") return { id: "admin", name: "Admin", roles: ["admin"] };
  }

  // 2. SSR-only cookie reading via next/headers (no window available)
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { cookies } = require("next/headers");
      const v: string | undefined = cookies()?.get?.("session")?.value;
      if (v === "admin") return { id: "admin", name: "Admin", roles: ["admin"] };
    } catch {
      /* silent – next/headers not available outside app router */
    }
  }

  // 3. CSR localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("app_user");
    if (stored) {
      try {
        return JSON.parse(stored) as User;
      } catch {
        localStorage.removeItem("app_user");
      }
    }

    // 4. CSR query-param shortcut for quick login during dev (?admin=1)
    if (window.location.search.includes("admin=1")) {
      return { id: "admin", name: "Admin", roles: ["admin"] };
    }
  }

  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getInitialUser());

  // CSR sync – keep localStorage in sync & handle ?admin=1 param on first load
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("app_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User);
        return;
      } catch {
        localStorage.removeItem("app_user");
      }
    }

    if (window.location.search.includes("admin=1")) {
      const adminUser: User = { id: "admin", name: "Admin", roles: ["admin"] };
      setUser(adminUser);
      localStorage.setItem("app_user", JSON.stringify(adminUser));
    }
  }, []);

  const loginAsAdmin = () => {
    const adminUser: User = { id: "admin", name: "Admin", roles: ["admin"] };
    setUser(adminUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("app_user", JSON.stringify(adminUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("app_user");
    }
  };

  const contextValue: AuthContextValue = {
    user,
    isAdmin: (user?.roles ?? []).includes("admin"),
    loginAsAdmin,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * Strict hook – must be used inside provider.
 */
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/**
 * Safe helper: returns false if provider missing (useful in unit tests)
 */
export const useIsAdmin = (): boolean => {
  return useContext(AuthContext)?.isAdmin ?? false;
};
