"use client";

import { RightNavBar } from "@/components/rightNavBar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  MapPin,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock de dados (depois virá do backend)
const MOCK_ITINERARIES = [
  {
    id: 1,
    nome: "Eurotrip 2025",
    dataInicio: "2025-06-10",
    dataFim: "2025-06-20",
    totalEstimado: 15000,
    locais: 12,
  },
  {
    id: 2,
    nome: "Fim de semana na Serra",
    dataInicio: "2025-08-05",
    dataFim: "2025-08-07",
    totalEstimado: 2500,
    locais: 5,
  },
];

export default function ItineraryListPage() {
  const router = useRouter();

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
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-6 rounded-xl shadow-lg shadow-orange-200 transition-all hover:-translate-y-1"
          >
            <Plus className="mr-2 h-5 w-5" /> Criar Novo
          </Button>
        </div>

        {/* Lista de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
          {MOCK_ITINERARIES.map((it) => (
            <div
              key={it.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer"
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

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {it.nome}
              </h3>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {new Date(it.dataInicio).toLocaleDateString()} -{" "}
                  {new Date(it.dataFim).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  R$ {it.totalEstimado.toFixed(2)}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  {it.locais} locais
                </span>
                <span className="text-sm font-semibold text-orange-500 group-hover:underline">
                  Ver detalhes →
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
      </main>
    </div>
  );
}
