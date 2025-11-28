// Waypoint/waypoint-front/lib/api.ts
import axios from "axios";

// Interface compatível com o seu TokenDTO.java
interface TokenResponse {
  tokenAcess: string; // Atenção: mantida a grafia do backend
  refreshToken: string;
}

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Base para todas as chamadas
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Adiciona o Token em todas as requisições
api.interceptors.request.use(
  (config) => {
    // Não adiciona token se for a rota de refresh para evitar loops ou erros
    if (config.url?.includes("/auth/refresh-token")) {
      return config;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("waypoint.token")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Trata erros e faz o Refresh Token automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se receber 403 (Forbidden) e não for uma tentativa repetida
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("waypoint.refreshToken");

        if (!refreshToken) {
          throw new Error("Sem refresh token");
        }

        // Chama a rota de refresh (api/auth/refresh-token)
        // Nota: Usamos axios direto para não passar pelos interceptors do 'api'
        const response = await axios.post<TokenResponse>(
          "http://localhost:8080/api/auth/refresh-token",
          { refreshToken: refreshToken } // Payload conforme RefreshTokenDTO
        );

        const { tokenAcess, refreshToken: newRefreshToken } = response.data;

        // Atualiza os tokens no storage
        localStorage.setItem("waypoint.token", tokenAcess);
        localStorage.setItem("waypoint.refreshToken", newRefreshToken);

        // Atualiza o header da requisição que falhou e tenta novamente
        api.defaults.headers.common["Authorization"] = `Bearer ${tokenAcess}`;
        originalRequest.headers["Authorization"] = `Bearer ${tokenAcess}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Se falhar o refresh, limpa tudo e força logout
        console.error("Sessão expirada ou refresh inválido", refreshError);
        localStorage.removeItem("waypoint.token");
        localStorage.removeItem("waypoint.refreshToken");

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
