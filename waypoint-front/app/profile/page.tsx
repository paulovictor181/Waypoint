"use client";

import { RightNavBar } from "@/components/rightNavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { Calendar, Mail, Loader2, MapPin, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipo correspondente a Usuario/RegisterResponse do Backend
type Usuario = {
  id: number;
  username: string;
  email: string;
  role: string;
  birthDate?: string; 
};

export default function ProfilePage() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Assumindo um endpoint protegido para obter os detalhes do usuário logado
      // que deve retornar uma estrutura similar ao RegisterResponse (Usuario)
      const response = await api.get("/users/me"); 
      
      setUser(response.data); 
    } catch (err: any) {
      console.error("Erro ao buscar perfil:", err);
      setError("Não foi possível carregar os dados do usuário.");
    } finally {
      setLoading(false);
    }
  };

  // Por enquanto, a edição está desabilitada (read-only)
  const isEditable = false; 

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      <RightNavBar />

      <main className="flex flex-1 flex-col bg-gray-50 p-8 overflow-y-auto">
        <div className="w-full max-w-xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
              <p className="text-gray-500 mt-1">
                Visualize suas informações de cadastro.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {loading ? (
              <div className="flex justify-center items-center h-48 text-orange-500">
                <Loader2 className="h-10 w-10 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center p-8 text-red-500 font-semibold">
                {error}
              </div>
            ) : user ? (
              <form className="space-y-6">
                
                {/* Avatar e Nome de Usuário */}
                <div className="flex flex-col items-center gap-4 border-b pb-6 mb-6">
                    <div className="h-20 w-20 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
                </div>


                {/* Campo Usuário */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Nome de Usuário
                  </label>
                  <Input
                    type="text"
                    value={user.username}
                    readOnly={!isEditable}
                    className="bg-gray-50 text-gray-700"
                  />
                </div>

                {/* Campo E-mail */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    E-mail
                  </label>
                  <Input
                    type="email"
                    value={user.email}
                    readOnly={!isEditable}
                    className="bg-gray-50 text-gray-700"
                  />
                </div>
                
                {/* Campo Data de Nascimento (se disponível) */}
                {user.birthDate && (
                    <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        Data de Nascimento
                    </label>
                    <Input
                        type="text"
                        // Formata a data para dd/MM/yyyy
                        value={format(new Date(user.birthDate), "dd/MM/yyyy", { locale: ptBR })}
                        readOnly
                        className="bg-gray-50 text-gray-700"
                    />
                    </div>
                )}

                {/* Campo Permissão */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    Permissão
                  </label>
                  <Input
                    type="text"
                    value={user.role}
                    readOnly
                    className="bg-gray-50 font-bold text-blue-700 uppercase"
                  />
                </div>
                
                {/* Botão de Ação (somente se for editável no futuro) */}
                {isEditable && (
                    <div className="pt-4 border-t mt-6">
                        <Button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                        >
                        Salvar Alterações
                        </Button>
                    </div>
                )}
              </form>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}