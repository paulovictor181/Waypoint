"use client";

import { RightNavBar } from "@/components/rightNavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { fetchPOIsInBounds, getRoute, POI } from "@/lib/osm";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, Plus, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const ItineraryMap = dynamic(() => import("@/components/ItineraryMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-black">
      Carregando mapa...
    </div>
  ),
});

type Custo = {
  id?: number;
  description: string;
  amount: number;
};

type Local = {
  id: number;
  osmId: number;
  name: string;
  lat: number;
  lng: number;
  dia: number;
  custos: Custo[];
};

type DiaItinerario = {
  dia: number;
  displayDate: string;
  locais: Local[];
};

export default function ItineraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [nomeItinerario, setNomeItinerario] = useState("");
  const [orcamentoTotal, setOrcamentoTotal] = useState<number | string>("");
  const [dias, setDias] = useState<DiaItinerario[]>([
    { dia: 1, displayDate: "", locais: [] },
  ]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [tempLocation, setTempLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [tempLocationName, setTempLocationName] = useState("");

  const [suggestedPOIs, setSuggestedPOIs] = useState<POI[]>([]);
  const [isLoadingPOIs, setIsLoadingPOIs] = useState(false);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const itineraryId = searchParams.get("id");
  const [itineraryData, setItineraryData] = useState<any>(null);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    -5.187978, -37.344265,
  ]);

  const handleSaveItinerary = async () => {
    if (!itineraryId || !itineraryData) return;

    try {
      const payload = {
        name: nomeItinerario,
        inicio: itineraryData.inicio,
        fim: itineraryData.fim,
        totalOrcamento: parseFloat(orcamentoTotal.toString()),
        dias: dias.map((dia) => ({
          Numeracao: dia.dia,
          locais: dia.locais.map((local) => ({
            osmId: local.osmId,
            name: local.name,
            latitude: local.lat,
            longitude: local.lng,
            custos: local.custos.map((custo) => ({
              description: custo.description,
              amount: custo.amount,
            })),
          })),
        })),
      };

      console.log("Enviando Payload:", JSON.stringify(payload, null, 2));

      await api.put(`/itinerarios/${itineraryId}`, payload);

      alert("Itinerário salvo com sucesso!");

      await fetchItinerary();
    } catch (error) {
      console.error("Erro ao salvar itinerário:", error);
      alert("Erro ao salvar. Verifique o console.");
    }
  };

  useEffect(() => {
    if (itineraryId) {
      api
        .get(`/itinerarios/${itineraryId}`)
        .then((response) => {
          const data = response.data;
          setItineraryData(data);

          setNomeItinerario(data.name || "");
          setOrcamentoTotal(data.totalOrcamento || 0);

          if (data.cidadeLat && data.cidadeLon) {
            setMapCenter([data.cidadeLat, data.cidadeLon]);
          }

          if (data.dataInicio && data.dataFim) {
            const start = new Date(data.dataInicio + "T00:00:00");
            const end = new Date(data.dataFim + "T00:00:00");

            const diffDays = differenceInCalendarDays(end, start) + 1;

            const diasGerados = Array.from({ length: diffDays }, (_, i) => {
              const currentDate = addDays(start, i);
              return {
                dia: i + 1,
                displayDate: format(currentDate, "dd/MM", { locale: ptBR }),
                locais: [],
              };
            });

            setDias(diasGerados);
          }
        })
        .catch((err) => console.error("Erro ao carregar itinerário", err));
    }
  }, [itineraryId]);

  const displayName = itineraryData?.name || "Novo Itinerário";

  useEffect(() => {
    const locaisDoDia = dias[selectedDayIndex].locais;

    if (locaisDoDia.length > 1) {
      const points = locaisDoDia.map((l) => ({ lat: l.lat, lng: l.lng }));

      getRoute(points).then((path) => {
        setRoutePath(path);
      });
    } else {
      setRoutePath([]); // Limpa a rota se tiver menos de 2 pontos
    }
  }, [dias, selectedDayIndex]);

  const handleMapMove = (bounds: any) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setIsLoadingPOIs(true);
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const east = bounds.getEast();
      const west = bounds.getWest();

      const pois = await fetchPOIsInBounds(north, south, east, west, 100);
      setSuggestedPOIs(pois);
      setIsLoadingPOIs(false);
    }, 1000);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setTempLocation({ lat, lng });
    setTempLocationName("Carregando endereço...");

    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await resp.json();
      setTempLocationName(
        data.display_name
          ? data.display_name.split(",")[0]
          : "Local Selecionado"
      );
    } catch (e) {
      setTempLocationName("Local Selecionado");
    }
  };

  const selectPOI = (poi: POI) => {
    setTempLocation({ lat: poi.lat, lng: poi.lng });
    setTempLocationName(poi.name);
  };

  const addDay = () => {
    const lastDay = dias[dias.length - 1];
    let nextDateLabel = "Dia " + (dias.length + 1);

    if (itineraryData?.dataInicio) {
      const start = new Date(itineraryData.dataInicio + "T00:00:00");
      const nextDate = addDays(start, dias.length);
      nextDateLabel = format(nextDate, "dd/MM", { locale: ptBR });
    }

    setDias([
      ...dias,
      { dia: dias.length + 1, displayDate: nextDateLabel, locais: [] },
    ]);
  };

  const addLocationToDay = () => {
    if (!tempLocation || !tempLocationName) return;
    const newLocais = [...dias[selectedDayIndex].locais];
    newLocais.push({
      name: tempLocationName,
      lat: tempLocation.lat,
      lng: tempLocation.lng,
      custos: [],
      id: 0,
      osmId: 0,
      dia: 0,
    });
    const newDias = [...dias];
    newDias[selectedDayIndex].locais = newLocais;
    setDias(newDias);
    setTempLocation(null);
    setTempLocationName("");
  };

  const removeLocation = (dayIndex: number, locIndex: number) => {
    setDias((prevDias) => {
      const newDias = [...prevDias];
      const diaAtualizado = { ...newDias[dayIndex] };
      diaAtualizado.locais = diaAtualizado.locais.filter(
        (_, i) => i !== locIndex
      );

      newDias[dayIndex] = diaAtualizado;
      return newDias;
    });
  };

  const addCostToLocation = (dayIndex: number, locationIndex: number) => {
    const newDias = [...dias];
    newDias[dayIndex].locais[locationIndex].custos.push({
      description: "",
      amount: 0,
    });
    setDias(newDias);
  };

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

  const mapMarkers =
    dias[selectedDayIndex]?.locais.map((l) => ({
      lat: l.lat,
      lng: l.lng,
      name: l.name,
    })) || [];

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      <RightNavBar />

      <main className="flex flex-1 overflow-hidden">
        {/* Lado Esquerdo */}
        <div className="w-1/2 flex flex-col p-6 overflow-y-auto border-r border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-orange-600">
            Planejar Itinerário
          </h1>

          <div className="mb-6 space-y-4">
            {/* Campo Nome do Itinerário */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Nome do Itinerário
              </label>
              <Input
                placeholder="Ex: Férias em Natal"
                value={nomeItinerario}
                onChange={(e) => setNomeItinerario(e.target.value)}
                className="bg-gray-50"
              />
            </div>

            {/* Campo Orçamento Inicial (Agora editável) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Orçamento Inicial (R$)
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={orcamentoTotal}
                onChange={(e) => setOrcamentoTotal(e.target.value)}
                className="bg-gray-50"
              />
            </div>

            {/* Resumo Financeiro */}
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-1">
              <p className="text-sm text-gray-500 flex justify-between">
                <span>Total Planejado (Gastos):</span>
                <span className="font-bold text-orange-600">
                  R$ {totalOrcamento.toFixed(2)}
                </span>
              </p>

              <p className="text-sm text-gray-500 flex justify-between">
                <span>Saldo Restante:</span>
                <span
                  className={`font-bold ${
                    Number(orcamentoTotal) - totalOrcamento >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  R$ {(Number(orcamentoTotal) - totalOrcamento).toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 shrink-0 sticky top-0 bg-white z-10 py-4 border-b border-gray-100">
            {dias.map((d, index) => (
              <button
                key={d.dia}
                onClick={() => setSelectedDayIndex(index)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${
                  selectedDayIndex === index
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {d.displayDate || `Dia ${d.dia}`}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addDay}
              className="rounded-full shrink-0 aspect-square p-0 w-9 h-9 flex items-center justify-center border-dashed border-gray-400 text-gray-500 hover:text-orange-600 hover:border-orange-500"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-100">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              Adicionar ao dia {dias[selectedDayIndex]?.displayDate}{" "}
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Clique no mapa para selecionar as coordenadas.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Nome do local"
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
          </div>

          {/* Lista de Locais */}
          <div className="space-y-6">
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
                    onClick={() => removeLocation(selectedDayIndex, locIndex)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                  {local.custos.map((custo, costIndex) => (
                    <div key={costIndex} className="flex gap-2 items-center">
                      <Input
                        placeholder="Descrição"
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
                        className="w-24 h-8 text-sm"
                      />
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      addCostToLocation(selectedDayIndex, locIndex)
                    }
                    className="text-orange-600 text-xs p-0 h-auto mt-2"
                  >
                    + Adicionar custo
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6">
            <Button
              onClick={handleSaveItinerary}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
            >
              Salvar Itinerário
            </Button>
          </div>
        </div>

        {/* Lado Direito: Mapa */}
        <div className="w-1/2 h-full bg-gray-100 relative">
          <ItineraryMap
            center={mapCenter}
            markers={mapMarkers}
            onMapClick={handleMapClick}
            selectedPosition={tempLocation}
            suggestedMarkers={suggestedPOIs}
            onPoiClick={selectPOI}
            onBoundsChange={handleMapMove}
            routeCoordinates={routePath}
          />
          {isLoadingPOIs && (
            <div className="absolute top-4 right-4 z-[1000] bg-white px-3 py-1 rounded shadow text-xs font-medium text-orange-600">
              Buscando locais...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
function fetchItinerary() {
  throw new Error("Function not implemented.");
}
