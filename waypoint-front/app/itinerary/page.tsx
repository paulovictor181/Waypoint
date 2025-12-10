"use client";

import { RightNavBar } from "@/components/rightNavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchNearbyPOIs, POI } from "@/lib/osm"; // Importe a função criada
import { MapPin, Plus, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

// Importação dinâmica do mapa para evitar erro de 'window not found'
const ItineraryMap = dynamic(() => import("@/components/ItineraryMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-black">
      Carregando mapa...
    </div>
  ),
});

// Tipos baseados nas suas entidades Java
type Custo = {
  description: string;
  amount: number;
};

type Local = {
  name: string;
  lat: number;
  lng: number;
  custos: Custo[];
};

type DiaItinerario = {
  dia: number;
  locais: Local[];
};

export default function ItineraryPage() {
  // Estado do Itinerário
  const [nomeItinerario, setNomeItinerario] = useState("");
  const [dias, setDias] = useState<DiaItinerario[]>([{ dia: 1, locais: [] }]);

  // Estado temporário para adição
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [tempLocation, setTempLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [tempLocationName, setTempLocationName] = useState("");
  // Novo estado para os POIs sugeridos pelo mapa (pontos azuis/verdes, por exemplo)
  const [suggestedPOIs, setSuggestedPOIs] = useState<POI[]>([]);
  const [isLoadingPOIs, setIsLoadingPOIs] = useState(false);

  // Modifique o handleMapClick para, além de selecionar o ponto, buscar o que tem em volta
  const handleMapClick = async (lat: number, lng: number) => {
    setTempLocation({ lat, lng });
    setTempLocationName("Carregando endereço..."); // Feedback visual

    // 1. Tentar descobrir o nome da rua/local (Geocoding Reverso do Nominatim)
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await resp.json();
      setTempLocationName(data.display_name.split(",")[0]); // Pega só a primeira parte do endereço
    } catch (e) {
      setTempLocationName("Local Selecionado");
    }

    // 2. Buscar locais interessantes ao redor (Overpass)
    setIsLoadingPOIs(true);
    const pois = await fetchNearbyPOIs(lat, lng, 2000); // Raio de 2km
    setSuggestedPOIs(pois);
    setIsLoadingPOIs(false);
  };

  // Função auxiliar para quando clicar em um POI sugerido, preencher o formulário
  const selectPOI = (poi: POI) => {
    setTempLocation({ lat: poi.lat, lng: poi.lng });
    setTempLocationName(poi.name);
  };

  // Adicionar novo dia
  const addDay = () => {
    setDias([...dias, { dia: dias.length + 1, locais: [] }]);
  };

  // Confirmar local selecionado no mapa para o dia ativo
  const addLocationToDay = () => {
    if (!tempLocation || !tempLocationName) return;

    const newLocais = [...dias[selectedDayIndex].locais];
    newLocais.push({
      name: tempLocationName,
      lat: tempLocation.lat,
      lng: tempLocation.lng,
      custos: [],
    });

    const newDias = [...dias];
    newDias[selectedDayIndex].locais = newLocais;
    setDias(newDias);

    // Resetar campos temporários
    setTempLocation(null);
    setTempLocationName("");
  };

  // Adicionar custo a um local específico
  const addCostToLocation = (dayIndex: number, locationIndex: number) => {
    const newDias = [...dias];
    newDias[dayIndex].locais[locationIndex].custos.push({
      description: "",
      amount: 0,
    });
    setDias(newDias);
  };

  // Atualizar valor do custo
  const updateCost = (
    dayIndex: number,
    locIndex: number,
    costIndex: number,
    field: keyof Custo,
    value: string | number
  ) => {
    const newDias = [...dias];
    const custo = newDias[dayIndex].locais[locIndex].custos[costIndex];
    if (field === "amount") custo.amount = Number(value);
    else custo.description = String(value);
    setDias(newDias);
  };

  // Calcular total (para exibir como no seu Java BigDecimal totalOrcamento)
  const totalOrcamento = useMemo(() => {
    return dias.reduce((acc, dia) => {
      return (
        acc +
        dia.locais.reduce((accLoc, local) => {
          return (
            accLoc +
            local.custos.reduce(
              (accCost, custo) => accCost + (custo.amount || 0),
              0
            )
          );
        }, 0)
      );
    }, 0);
  }, [dias]);

  // Preparar marcadores para o mapa
  const mapMarkers = dias.flatMap((d) =>
    d.locais.map((l) => ({ lat: l.lat, lng: l.lng, name: l.name }))
  );

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      {/* Navbar Lateral */}
      <RightNavBar />

      <main className="flex flex-1 overflow-hidden">
        {/* Lado Esquerdo: Formulário (50%) */}
        <div className="w-1/2 flex flex-col p-6 overflow-y-auto border-r border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-orange-600">
            Planejar Itinerário
          </h1>

          <div className="mb-6 space-y-2">
            <label className="text-sm font-semibold">Nome do Itinerário</label>
            <Input
              placeholder="Ex: Férias em Natal"
              value={nomeItinerario}
              onChange={(e) => setNomeItinerario(e.target.value)}
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500">
              Orçamento Total Estimado:{" "}
              <span className="font-bold text-green-600">
                R$ {totalOrcamento.toFixed(2)}
              </span>
            </p>
          </div>

          {/* Seleção de Dias */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 shrink-0 sticky top-0 bg-white z-10 py-4 border-b border-gray-100">
            {dias.map((d, index) => (
              <button
                key={d.dia}
                onClick={() => setSelectedDayIndex(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedDayIndex === index
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Dia {d.dia}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addDay}
              className="rounded-full shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Área de Adição de Local */}
          <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-100">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              Adicionar local ao Dia {selectedDayIndex + 1}
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Clique no mapa para selecionar as coordenadas.
            </p>

            <div className="flex gap-2">
              <Input
                placeholder="Nome do local (ex: Praia de Ponta Negra)"
                value={tempLocationName}
                onChange={(e) => setTempLocationName(e.target.value)}
                className="bg-white"
              />
              <Button
                onClick={addLocationToDay}
                disabled={!tempLocation || !tempLocationName}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Adicionar
              </Button>
            </div>
            {tempLocation && (
              <p className="text-xs text-green-600 mt-2">
                Ponto selecionado: {tempLocation.lat.toFixed(4)},{" "}
                {tempLocation.lng.toFixed(4)}
              </p>
            )}
          </div>

          {/* Lista de Locais do Dia Selecionado */}
          <div className="space-y-6">
            {dias[selectedDayIndex].locais.length === 0 && (
              <p className="text-gray-400 text-center italic mt-10">
                Nenhum local adicionado para este dia.
              </p>
            )}

            {dias[selectedDayIndex].locais.map((local, locIndex) => (
              <div
                key={locIndex}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-lg">{local.name}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Custos do Local */}
                <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                  {local.custos.map((custo, costIndex) => (
                    <div key={costIndex} className="flex gap-2 items-center">
                      <Input
                        placeholder="Descrição (ex: Jantar)"
                        value={custo.description}
                        onChange={(e) =>
                          updateCost(
                            selectedDayIndex,
                            locIndex,
                            costIndex,
                            "description",
                            e.target.value
                          )
                        }
                        className="flex-1 h-8 text-sm"
                      />
                      <div className="relative w-32">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                          R$
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={custo.amount}
                          onChange={(e) =>
                            updateCost(
                              selectedDayIndex,
                              locIndex,
                              costIndex,
                              "amount",
                              e.target.value
                            )
                          }
                          className="h-8 text-sm pl-6"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      addCostToLocation(selectedDayIndex, locIndex)
                    }
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-xs p-0 h-auto mt-2"
                  >
                    + Adicionar custo
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6">
              Salvar Itinerário
            </Button>
          </div>
        </div>

        {/* Lado Direito: Mapa (50%) */}
        <div className="w-1/2 h-full bg-gray-100 relative">
          <ItineraryMap
            markers={mapMarkers}
            onMapClick={handleMapClick}
            selectedPosition={tempLocation}
          />
        </div>
      </main>
    </div>
  );
}
