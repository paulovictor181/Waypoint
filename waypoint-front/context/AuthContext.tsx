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
import { LoginDTO } from "@/app/login/page"; // Podemos definir a interface aqui ou importar

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: LoginDTO) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verifica se já existe token ao carregar a página
    const token = localStorage.getItem("waypoint.token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async ({ username, password }: LoginDTO) => {
    try {
      // Chama seu AuthController: @PostMapping("/login")
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const { tokenAcess, refreshToken } = response.data;

      // Salva os tokens
      localStorage.setItem("waypoint.token", tokenAcess);
      localStorage.setItem("waypoint.refreshToken", refreshToken);

      setIsAuthenticated(true);
      router.push("/dashboard"); // ou '/'
    } catch (error) {
      console.error("Erro ao fazer login", error);
      throw error; // Repassa o erro para o componente tratar (exibir msg)
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
