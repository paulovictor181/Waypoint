"use client";

import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { RightNavBar } from "@/components/rightNavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api"; // Axios configurado
import { ArrowLeft, Loader2, Plane } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function NewItineraryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estado do formulário
  const [nome, setNome] = useState("");
  const [destino, setDestino] = useState(""); // Novo campo
  const [orcamento, setOrcamento] = useState(""); // Novo campo
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleCreate = async () => {
    if (!nome || !destino || !orcamento || !dateRange?.from || !dateRange?.to) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // 1. Envia para o Backend
      const response = await api.post("/itinerarios", {
        name: nome,
        destination: destino,
        startDate: dateRange.from.toISOString().split("T")[0], // YYYY-MM-DD
        endDate: dateRange.to.toISOString().split("T")[0],
        totalBudget: parseFloat(orcamento),
      });

      const novoItinerario = response.data;

      // 2. Redireciona para o Builder passando o ID
      router.push(`/itinerary/builder?id=${novoItinerario.id}`);
    } catch (error) {
      console.error("Erro ao criar itinerário:", error);
      alert("Erro ao criar itinerário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      <RightNavBar />

      <main className="flex flex-1 flex-col bg-gray-50 p-6 md:p-12 items-center justify-center overflow-y-auto">
        <div className="w-full max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-gray-500 hover:text-gray-900 -ml-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>

          <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
                <Plane className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Nova Viagem
                </h1>
                <p className="text-gray-500">
                  Defina os detalhes iniciais do seu roteiro.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Nome do Itinerário
                  </label>
                  <Input
                    placeholder="Ex: Mochilão Europa"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Destino Principal
                  </label>
                  <Input
                    placeholder="Ex: Paris, França"
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Período
                </label>
                <DatePickerWithRange
                  date={dateRange}
                  setDate={setDateRange}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Orçamento Total (R$)
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 5000.00"
                  value={orcamento}
                  onChange={(e) => setOrcamento(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                onClick={handleCreate}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 px-8 rounded-xl text-lg shadow-lg"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  "Criar e Planejar"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
