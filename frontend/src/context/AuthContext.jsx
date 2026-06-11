import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const { data } = await api.get("/auth/me");
        if (active) setUser(data.user);
      } catch (_error) {
        localStorage.removeItem("job_portal_token");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSession();
    return () => {
      active = false;
    };
  }, []);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("job_portal_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("job_portal_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("job_portal_token");
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

