"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
// ATENÇÃO: Você ainda não tem o 'api.post("/auth/login"...)' no backend
// Este é um exemplo de como seria.

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // ESTE É O FLUXO JWT (que precisa ser implementado no backend)
      // const response = await api.post('/auth/login', { username, password });

      // Simulação de login por enquanto:
      if (username === "admin" && password === "12345") {
        // Suponha que o backend retornou um token
        const fakeToken = "dummy.jwt.token";
        login(fakeToken); // Salva o token no contexto
        router.push("/dashboard"); // Redireciona para uma página protegida
      } else {
        setError("Credenciais inválidas");
      }
    } catch (err) {
      setError("Falha no login. Verifique o console.");
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label>Usuário:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
