// Waypoint/waypoint-front/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

// Interface para os dados do login
interface LoginData {
  username?: string;
  password?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verifica token ao carregar a aplicação
    const token = localStorage.getItem("waypoint.token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async ({ username, password }: LoginData) => {
    try {
      // POST para /auth/login (somado à baseURL /api fica /api/auth/login)
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      // Extrai tokens da resposta (TokenDTO)
      const { tokenAcess, refreshToken } = response.data;

      localStorage.setItem("waypoint.token", tokenAcess);
      localStorage.setItem("waypoint.refreshToken", refreshToken);

      setIsAuthenticated(true);
      router.push("/dashboard"); // Redireciona após sucesso
    } catch (error) {
      console.error("Erro no login:", error);
      throw error; // Lança o erro para a página exibir feedback visual
    }
  };

  const logout = () => {
    localStorage.removeItem("waypoint.token");
    localStorage.removeItem("waypoint.refreshToken");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
