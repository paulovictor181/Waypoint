// waypoint-front/app/dashboard/page.tsx
"use client";

import { RightNavBar } from "@/components/rightNavBar";
import { Button } from "@/components/ui/button";
import api from "@/lib/api"; // Para buscar dados
import { Calendar, DollarSign, MapPin, Plus, Loader2, ArrowRight, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

type ItinerarioResumo = {
  id: number;
  name: string; // Adicionado para exibição
  dataInicio: string; // Adicionado para exibição
  dataFim: string; // Adicionado para exibição
  cidadeNome: string; // Adicionado para exibição
  totalOrcamento: number;
  custoTotal: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const { userRole } = useAuth(); // Usando a role do contexto
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState({
    totalItinerarios: 0,
    orcamentoAcumulado: 0,
    custoTotalAcumulado: 0,
  });
  
  const [ultimosItinerarios, setUltimosItinerarios] = useState<ItinerarioResumo[]>([]);

  useEffect(() => {
    fetchResumoDados();
  }, []);

  const fetchResumoDados = async () => {
    try {
      const response = await api.get("/itinerarios"); 
      const data: ItinerarioResumo[] = response.data;
      
      const orcamentoAcumulado = data.reduce(
        (acc, item) => acc + (item.totalOrcamento || 0),
        0
      );
      const custoTotalAcumulado = data.reduce(
        (acc, item) => acc + (item.custoTotal || 0),
        0
      );

      setResumo({
        totalItinerarios: data.length,
        orcamentoAcumulado: orcamentoAcumulado,
        custoTotalAcumulado: custoTotalAcumulado,
      });

      const sortedItineraries = data
        .sort((a, b) => b.id - a.id) // Ordena por ID decrescente
        .slice(0, 3); // Pega os 3 primeiros
        
      setUltimosItinerarios(sortedItineraries);


    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const ResumoCard = ({ icon, title, value, color }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-lg">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color.replace("text", "bg")}/10 ${color}`}>
        {icon}
      </div>
    </div>
  );

  const QuickAccessCard = ({ itinerary }: { itinerary: ItinerarioResumo }) => (
    <Link 
      href={`/itinerary/builder?id=${itinerary.id}`}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between transition-all hover:shadow-md hover:border-orange-300 group"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-lg text-gray-800 truncate pr-4">
          {itinerary.name}
        </h4>
        <ArrowRight className="h-4 w-4 text-orange-500 group-hover:translate-x-1 transition-transform shrink-0" />
      </div>
      
      <div className="text-sm text-gray-500 space-y-1">
        <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span className="truncate">{itinerary.cidadeNome || "Destino Desconhecido"}</span>
        </div>
        <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-gray-400" />
            {itinerary.dataInicio && itinerary.dataFim 
                ? `${format(new Date(itinerary.dataInicio), "dd/MM")} - ${format(new Date(itinerary.dataFim), "dd/MM")}`
                : "Período não definido"}
        </div>
      </div>
    </Link>
  );


  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      <RightNavBar />

      <main className="flex flex-1 flex-col overflow-hidden bg-gray-50 p-8">
        {/* Cabeçalho e Ação Principal */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Olá! Bem-vindo ao Waypoint
            </h1>
            <p className="text-gray-500 mt-1">
                {userRole === "ROLE_PREMIUM" ? "Você está no plano Premium. Crie itinerários ilimitados!" : "Seu painel de controle de viagens."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* NOVO: Botão de Upgrade para ROLE_USER */}
            {userRole === "ROLE_USER" && (
                <Button
                    onClick={() => router.push("/upgrade")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-6 rounded-xl shadow-lg transition-all hover:-translate-y-1"
                >
                    <Crown className="mr-2 h-5 w-5 fill-white" /> Seja Premium
                </Button>
            )}

            <Button
                onClick={() => router.push("/itinerary/new")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-6 rounded-xl shadow-lg transition-all hover:-translate-y-1"
            >
                <Plus className="mr-2 h-5 w-5" /> Nova Viagem
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-orange-500">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResumoCard
                icon={<MapPin className="h-6 w-6" />}
                title="Total de Viagens"
                value={resumo.totalItinerarios.toString()}
                color="text-indigo-600"
              />
              <ResumoCard
                icon={<DollarSign className="h-6 w-6" />}
                title="Orçamento Planejado"
                value={`R$ ${resumo.orcamentoAcumulado.toFixed(2)}`}
                color="text-green-600"
              />
              <ResumoCard
                icon={<Calendar className="h-6 w-6" />}
                title="Gastos Totais Reais"
                value={`R$ ${resumo.custoTotalAcumulado.toFixed(2)}`}
                color="text-red-500"
              />
            </div>
            
            {/* Acesso Rápido aos Últimos Itinerários */}
            {ultimosItinerarios.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Acesso Rápido (Últimos Roteiros)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {ultimosItinerarios.map((it) => (
                            <QuickAccessCard key={it.id} itinerary={it} />
                        ))}
                    </div>
                </div>
            )}
            
            {/* Seção de Destaques */}
            <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Próximos Passos
                </h2>
                <ul className="space-y-3 text-gray-600">
                  {/* Exibe a restrição se for USER e já tiver itinerário */}
                    {userRole === "ROLE_USER" && resumo.totalItinerarios >= 1 && (
                        <li className="flex items-center gap-3 font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                            <Crown className="h-5 w-5 text-red-600 shrink-0 fill-red-300" />
                            Você atingiu o limite de 1 itinerário no plano Básico.
                            <Link href="/upgrade" className="text-blue-600 hover:underline ml-2 whitespace-nowrap">
                                Clique para ser Premium
                            </Link>
                        </li>
                    )}
                    <li className="flex items-center gap-3">
                        <Plus className="h-5 w-5 text-orange-500 shrink-0" />
                        Planeje seu próximo destino clicando em "Nova Viagem".
                    </li>
                    <li className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-orange-500 shrink-0" />
                        Confira seus itinerários salvos na seção "Itinerários".
                    </li>
                    <li className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-orange-500 shrink-0" />
                        Mantenha os custos atualizados para controlar seu orçamento.
                    </li>
                </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}