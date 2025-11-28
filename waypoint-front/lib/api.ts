import axios from "axios";

// Tipagem baseada no seu TokenDTO.java
interface TokenResponse {
  tokenAcess: string; // Mantendo a grafia do seu backend
  refreshToken: string;
}

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de Requisição: Adiciona o Token
api.interceptors.request.use(
  (config) => {
    // Evita loop infinito se for a rota de refresh
    if (config.url?.includes("/auth/refresh-token")) {
      return config;
    }

    const token = localStorage.getItem("waypoint.token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta: Trata o Refresh Token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 403 (Forbidden) e não for uma tentativa de refresh já falhada
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("waypoint.refreshToken");

        if (!refreshToken) {
          // Sem refresh token, força logout
          localStorage.removeItem("waypoint.token");
          localStorage.removeItem("waypoint.refreshToken");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }

        // Chama o endpoint de refresh do seu AuthController
        const response = await axios.post<TokenResponse>(
          "http://localhost:8080/api/auth/refresh-token",
          { refreshToken: refreshToken } // Body conforme RefreshTokenDTO
        );

        const { tokenAcess, refreshToken: newRefreshToken } = response.data;

        // Salva os novos tokens
        localStorage.setItem("waypoint.token", tokenAcess);
        localStorage.setItem("waypoint.refreshToken", newRefreshToken);

        // Atualiza o header da requisição original e tenta novamente
        api.defaults.headers.common["Authorization"] = `Bearer ${tokenAcess}`;
        originalRequest.headers["Authorization"] = `Bearer ${tokenAcess}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Se o refresh falhar (expirou também), desloga o usuário
        console.error("Sessão expirada", refreshError);
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