"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Role = "admin";

export interface User {
  id: string;
  name: string;
  roles: Role[];
}

interface AuthContextValue {
  user: User | null;
  roles: Role[];
  isAdmin: boolean;
  loginAsAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Инициализация из localStorage или query-параметра ?admin=1
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("app_user");
    if (stored) {
      try {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem("app_user");
      }
    } else if (window.location.search.includes("admin=1")) {
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

  const value: AuthContextValue = {
    user,
    roles: user?.roles ?? [],
    isAdmin: (user?.roles ?? []).includes("admin"),
    loginAsAdmin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// Безопасный хук, возвращает false если провайдер не подключён (полезно в unit-тестах)
export const useIsAdmin = () => {
  const ctx = useContext(AuthContext);
  return ctx?.isAdmin ?? false;
};
