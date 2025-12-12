"use client";

import { RightNavBar } from "@/components/rightNavBar";
import { Button } from "@/components/ui/button";
import api from "@/lib/api"; // API Client
import {
  Calendar,
  DollarSign,
  Loader2,
  MapPin,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Tipo correspondente ao ItinerarioResumoDTO do Backend
type Itinerario = {
  id: number;
  name: string;
  dataInicio: string; // O Backend envia como startDate, verifique o JSON
  dataFim: string;
  totalOrcamento: number;
  custoTotal: number;
};

export default function ItineraryListPage() {
  const router = useRouter();
  const [itineraries, setItineraries] = useState<Itinerario[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca dados reais ao carregar
  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await api.get("/itinerarios");
      // Mapeando caso o nome dos campos varie um pouco (ex: startDate vs dataInicio)
      // Ajuste conforme o retorno exato do seu DTO Java
      const data = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        dataInicio: item.startDate || item.dataInicio,
        dataFim: item.endDate || item.dataFim,
        totalOrcamento: item.totalOrcamento || item.totalBudget,
        custoTotal: item.custoTotal || 0,
      }));
      setItineraries(data);
    } catch (error) {
      console.error("Erro ao buscar itinerários", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      <RightNavBar />

      <main className="flex flex-1 flex-col overflow-hidden bg-gray-50 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Meus Itinerários
            </h1>
            <p className="text-gray-500 mt-1">Gerencie suas próximas viagens</p>
          </div>
          <Button
            onClick={() => router.push("/itinerary/new")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-6 rounded-xl shadow-lg transition-all hover:-translate-y-1"
          >
            <Plus className="mr-2 h-5 w-5" /> Criar Novo
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-orange-500">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
            {itineraries.map((it) => (
              <div
                key={it.id}
                onClick={() => router.push(`/itinerary/builder?id=${it.id}`)} // Vai para o builder com o ID
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer hover:border-orange-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-gray-600"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                  {it.name}
                </h3>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {new Date(it.dataInicio).toLocaleDateString()} -{" "}
                    {new Date(it.dataFim).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    R$ {it.totalOrcamento?.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-orange-500" />
                    Gastos Reais:
                  </span>
                  <span
                    className={`font-bold ${
                      it.custoTotal > it.totalOrcamento
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    R$ {it.custoTotal?.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    Ver roteiro
                  </span>
                  <span className="text-sm font-semibold text-orange-500 group-hover:translate-x-1 transition-transform">
                    Acessar →
                  </span>
                </div>
              </div>
            ))}

            {/* Card Vazio para criar */}
            <button
              onClick={() => router.push("/itinerary/new")}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all min-h-[250px]"
            >
              <Plus className="h-12 w-12 mb-4 opacity-50" />
              <span className="font-semibold">Planejar nova viagem</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
