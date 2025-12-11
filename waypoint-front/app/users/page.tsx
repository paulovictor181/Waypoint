"use client";

import { RightNavBar } from "@/components/rightNavBar";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { Mail, Search, Shield } from "lucide-react";
import { useEffect, useState } from "react";

// Tipo igual ao RegisterResponse do Java
type Usuario = {
  id: number;
  username: string;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtro simples no front-end
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      <RightNavBar />

      <main className="flex flex-1 flex-col bg-gray-50 p-8 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gerenciar Usuários
            </h1>
            <p className="text-gray-500 mt-1">
              Visualize todos os usuários cadastrados no sistema.
            </p>
          </div>
        </div>

        {/* Barra de Busca */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-center">
          <Search className="text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            className="border-none shadow-none focus-visible:ring-0 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="text-sm text-gray-400 whitespace-nowrap">
            Total: {filteredUsers.length}
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-sm uppercase sticky top-0">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">E-mail</th>
                <th className="px-6 py-4">Permissão</th>
                <th className="px-6 py-4 text-right">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">
                          {user.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400 text-sm">
                      #{user.id}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
