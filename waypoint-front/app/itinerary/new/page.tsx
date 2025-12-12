"use client";

import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { RightNavBar } from "@/components/rightNavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { ArrowLeft, Loader2, MapPin, Plane } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

export default function NewItineraryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const [cityQuery, setCityQuery] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (cityQuery.length > 2 && !selectedCity) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${cityQuery}&addressdetails=1&limit=5`
          );
          const data = await res.json();
          setCitySuggestions(data);
        } catch (error) {
          console.error("Erro ao buscar cidades", error);
        }
      } else {
        setCitySuggestions([]);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [cityQuery, selectedCity]);

  const handleSelectCity = (city: any) => {
    setSelectedCity(city);
    setCityQuery(city.display_name);
    setCitySuggestions([]);
  };

  const handleCreate = async () => {
    if (
      !nome ||
      !selectedCity ||
      !orcamento ||
      !dateRange?.from ||
      !dateRange?.to
    ) {
      alert(
        "Por favor, preencha todos os campos e selecione uma cidade válida."
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: nome,
        inicio: dateRange.from.toISOString().split("T")[0],
        fim: dateRange.to.toISOString().split("T")[0],
        totalOrcamento: parseFloat(orcamento),

        cidadeOsmId: parseInt(selectedCity.osm_id),
        cidadeNome:
          selectedCity.address.city ||
          selectedCity.address.town ||
          selectedCity.address.village ||
          selectedCity.name,
        cidadeEstado: selectedCity.address.state || "",
        cidadePais: selectedCity.address.country || "",
        cidadeLat: parseFloat(selectedCity.lat),
        cidadeLon: parseFloat(selectedCity.lon),
      };

      const response = await api.post("/itinerarios", payload);
      const novoItinerario = response.data;

      router.push(`/itinerary/builder?id=${novoItinerario.id}`);
    } catch (error) {
      console.error("Erro ao criar itinerário:", error);
      alert("Erro ao criar itinerário. Verifique os dados.");
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
            className="mb-6 -ml-4"
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
                <p className="text-gray-500">Defina o destino e data.</p>
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

                {/* Input de Cidade com Autosuggest */}
                <div className="space-y-2 relative">
                  <label className="text-sm font-semibold text-gray-700">
                    Destino Principal
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Busque uma cidade..."
                      value={cityQuery}
                      onChange={(e) => {
                        setCityQuery(e.target.value);
                        setSelectedCity(null); // Reseta se o usuário editar
                      }}
                      className="pl-10"
                    />
                  </div>

                  {/* Lista de Sugestões */}
                  {citySuggestions.length > 0 && (
                    <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                      {citySuggestions.map((city) => (
                        <li
                          key={city.place_id}
                          className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0"
                          onClick={() => handleSelectCity(city)}
                        >
                          {city.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
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
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 px-8 rounded-xl"
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
