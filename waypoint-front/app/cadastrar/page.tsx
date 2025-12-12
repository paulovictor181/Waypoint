"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <MapPin className="h-10 w-10 text-orange-500" />
      <span className="text-3xl font-bold text-gray-900">Waypoint</span>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username || !password || !email || !birthDate) {
      setError("Todos os campos são obrigatórios");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", {
        username,
        password,
        email,
        birthDate,
        role: "ROLE_USER",
      });

      router.push("/login");
    } catch (err: any) {
      console.error(err);

      if (err.response) {
        if (err.response.status === 409) {
          setError(
            err.response.data.message || "Usuário ou E-mail já cadastrados."
          );
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Erro ao processar o cadastro.");
        }
      } else {
        setError("Erro de conexão. Verifique se o servidor está rodando.");
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
              placeholder="Escolha seu usuário"
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
              placeholder="Crie uma senha forte"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-gray-50 border-gray-300 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-gray-50 border-gray-300 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Data de nascimento
            </label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-1 bg-gray-50 border-gray-300 text-gray-900"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center font-semibold">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 mt-4">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="bg-orange-500 text-white font-semibold hover:bg-orange-500/90"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Cadastre-se"}
            </Button>

            <Button
              type="button"
              size="lg"
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
            >
              Voltar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
function setIsLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
