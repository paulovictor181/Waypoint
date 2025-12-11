"use client";

import { RightNavBar } from "@/components/rightNavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar as CalendarIcon, Plane } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewItineraryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    dataInicio: "",
    dataFim: "",
  });

  const handleContinue = () => {
    if (!formData.nome || !formData.dataInicio || !formData.dataFim) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Passa os dados via URL params para a tela de builder
    const params = new URLSearchParams();
    params.set("name", formData.nome);
    params.set("start", formData.dataInicio);
    params.set("end", formData.dataFim);

    router.push(`/itinerary/builder?${params.toString()}`);
  };

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      <RightNavBar />

      <main className="flex flex-1 flex-col bg-gray-50 p-6 md:p-12 items-center justify-center">
        <div className="w-full max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8 text-gray-500 hover:text-gray-900 -ml-4"
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
                  Vamos começar!
                </h1>
                <p className="text-gray-500">
                  Dê um nome e escolha as datas da sua viagem.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Nome da Viagem
                </label>
                <Input
                  placeholder="Ex: Férias em Natal, Mochilão Europa..."
                  className="h-12 text-lg bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" /> Data de
                    Ida
                  </label>
                  <Input
                    type="date"
                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white"
                    value={formData.dataInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, dataInicio: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" /> Data de
                    Volta
                  </label>
                  <Input
                    type="date"
                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white"
                    value={formData.dataFim}
                    onChange={(e) =>
                      setFormData({ ...formData, dataFim: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                onClick={handleContinue}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 px-8 rounded-xl text-lg shadow-lg shadow-orange-200 transition-transform active:scale-95"
              >
                Criar Itinerário
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
