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

interface UserProfile {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  userRole: string | null; 
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  // Função para buscar a role do usuário logado
  const fetchUserProfile = async () => {
    try {
        const response = await api.get<UserProfile>("/users/me");
        setUserRole(response.data.role);
        setIsAuthenticated(true);
    } catch (e) {
        console.error("Falha ao buscar perfil do usuário.", e);
        // Se a busca falhar, limpa o token (possivelmente expirado/inválido)
        localStorage.removeItem("waypoint.token");
        localStorage.removeItem("waypoint.refreshToken");
        setIsAuthenticated(false);
        setUserRole(null);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("waypoint.token");
    if (token) {
        // Se o token existir, tentamos carregar o perfil para obter a role
        fetchUserProfile();
    } else {
        setLoading(false);
    }
  }, []);

  const login = async ({ username, password }: LoginData) => {
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const { tokenAcess, refreshToken } = response.data;

      localStorage.setItem("waypoint.token", tokenAcess);
      localStorage.setItem("waypoint.refreshToken", refreshToken);

      await fetchUserProfile(); 
      // O fetchUserProfile define isAuthenticated para true

      router.push("/dashboard"); 
    } catch (error) {
      console.error("Erro no login:", error);
      throw error; 
    }
  };

  const logout = () => {
    localStorage.removeItem("waypoint.token");
    localStorage.removeItem("waypoint.refreshToken");
    setIsAuthenticated(false);
    setUserRole(null); // Limpa a role
    router.push("/login");
  };

  const refreshUserRole = async () => {
        // Função para ser chamada externamente para re-carregar o perfil
        await fetchUserProfile(); 
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, userRole, refreshUserRole }}>
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