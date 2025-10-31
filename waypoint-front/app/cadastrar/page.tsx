"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !email || !birthDate) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    try {
      console.log("Cadastro enviado:", { username, email, birthDate });

      router.push("/login");
    } catch (err) {
      setError("Falha ao cadastrar. Tente novamente.");
      console.error(err);
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
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 bg-gray-50 border-gray-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-gray-50 border-gray-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-gray-50 border-gray-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Data de nascimento
            </label>
            <Input
              type="date" // Tipo 'date' é mais apropriado
              placeholder="Data de nascimento"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-1 bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex flex-col gap-3 mt-4">
            <Button
              type="submit"
              size="lg"
              className="bg-orange-500 text-white font-semibold hover:bg-orange-500/90"
            >
              Cadastre-se
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
