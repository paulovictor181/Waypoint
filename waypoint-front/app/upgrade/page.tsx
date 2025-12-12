// waypoint-front/app/upgrade/page.tsx
"use client";

import { RightNavBar } from "@/components/rightNavBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api"; 
import { useAuth } from "@/context/AuthContext"; 

export default function UpgradePage() {
  const router = useRouter();
  const { refreshUserRole } = useAuth(); 

  const handleSubscription = async () => {
    try {
        // 1. Chamada API para o upgrade
        await api.put("/users/upgrade"); 
        
        // 2. Refrescar a role no contexto global
        await refreshUserRole();
        
        alert("Sucesso! Seu plano foi atualizado para Premium.");
        router.push("/dashboard"); 

    } catch (error: any) {
        console.error("Erro ao fazer upgrade:", error);
        // Exibe a mensagem de erro do backend (ex: "Usuário já está no plano Premium.")
        const errorMessage = error.response?.data?.message || "Erro ao processar o upgrade. Verifique o console.";
        alert(`Falha: ${errorMessage}`);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      <RightNavBar />

      <main className="flex flex-1 flex-col bg-gray-50 p-8 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 -ml-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>

          <div className="text-center mb-10">
            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <h1 className="text-4xl font-bold text-gray-800">
              Torne-se Waypoint Premium
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Desbloqueie viagens ilimitadas e funcionalidades exclusivas.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-400">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">
              Plano Premium
            </h2>
            <p className="text-4xl font-extrabold mb-6 text-gray-900">
              R$ 9.99<span className="text-lg font-normal text-gray-500">/mês</span>
            </p>

            <ul className="space-y-3 mb-8 text-gray-700">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                Crie itinerários Ilimitados (Sem restrições)
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                Acesso a todos os perfis de rota (Caminhada, Bike, etc.)
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                Suporte prioritário
              </li>
            </ul>

            <Button
              onClick={handleSubscription}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold h-12 text-lg"
            >
              Assinar Agora
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}