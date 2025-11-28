// Waypoint/waypoint-front/app/login/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <MapPin className="h-10 w-10 text-orange-500" />
      <span className="text-3xl font-bold text-gray-900">Waypoint</span>
    </div>
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ username, password });
      // O redirecionamento é feito pelo contexto
    } catch (err: any) {
      // Tratamento de erros HTTP comuns
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError("Usuário ou senha incorretos.");
      } else {
        setError("Erro de conexão. Tente novamente mais tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <Logo />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Usuário</label>
            <Input
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 bg-gray-50 border-gray-300 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-gray-50 border-gray-300 text-gray-900"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center font-medium">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="mt-4 bg-orange-500 text-white font-semibold hover:bg-orange-500/90 w-full"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Fazer Login"
            )}
          </Button>

          <div className="text-center mt-2">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <hr className="my-4 border-gray-300" />

          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => router.push("/cadastrar")}
            className="w-full border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50"
          >
            Criar nova conta
          </Button>
        </form>
      </div>
    </div>
  );
}
