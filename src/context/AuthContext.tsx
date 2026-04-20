import React, { createContext, useContext, useState, useEffect } from "react";
import { loginClient, registerClient, getCurrentClient, RegisterClientPayload } from "@/api/clients";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterClientPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "diary-token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) { setLoading(false); return; }
    getCurrentClient(stored)
      .then((data) => {
        setUser(data.client ?? data);
        setToken(stored);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginClient(email, password);
    const jwt = data.token ?? data.access_token ?? data.accessToken;
    const profile = data.client ?? data.user ?? data;
    localStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);
    setUser(profile);
  };

  const register = async (payload: RegisterClientPayload) => {
    const data = await registerClient(payload);
    const jwt = data.token ?? data.access_token ?? data.accessToken;
    const profile = data.client ?? data.user ?? data;
    if (jwt) {
      localStorage.setItem(TOKEN_KEY, jwt);
      setToken(jwt);
      setUser(profile);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
