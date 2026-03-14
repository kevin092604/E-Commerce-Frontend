import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("perfume-token");
    if (token) {
      api.get("/auth/me")
        .then(setUser)
        .catch(() => localStorage.removeItem("perfume-token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    localStorage.setItem("perfume-token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, phone) => {
    const data = await api.post("/auth/register", { name, email, password, phone });
    localStorage.setItem("perfume-token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("perfume-token");
    setUser(null);
  };

  const updateProfile = async (data) => {
    const updated = await api.put("/auth/me", data);
    setUser((u) => ({ ...u, ...updated }));
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
