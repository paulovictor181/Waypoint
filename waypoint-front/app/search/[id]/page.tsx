"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { getRoute } from "@/lib/osm";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Calendar, Coins, MapPin, Search } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// Importação dinâmica do mapa (igual ao Builder)
const ItineraryMap = dynamic(() => import("@/components/ItineraryMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-black">
      Carregando mapa...
    </div>
  ),
});

// Cabeçalho simplificado (igual ao da busca)
function PublicHeader() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?city=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <MapPin className="h-6 w-6 text-orange-500" />
          <span className="text-xl font-bold text-gray-900">Waypoint</span>
        </Link>

        {/* Busca Rápida no Header */}
        <div className="flex-1 max-w-md w-full relative flex items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Pesquisar outro destino..."
              className="pl-10 h-9 bg-gray-100 border-transparent focus:bg-white focus:border-orange-500 rounded-full transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => router.push("/login")}
            className="text-gray-600 hover:text-orange-600 font-medium"
          >
            Fazer Login
          </Button>
          <Button
            onClick={() => router.push("/itinerary/new")}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6"
          >
            Criar Roteiro
          </Button>
        </div>
      </div>
    </header>
  );
}

export default function ItineraryViewPage() {
  const router = useRouter();
  const params = useParams();
  const itineraryId = params.id;

  const [itineraryData, setItineraryData] = useState<any>(null);
  const [dias, setDias] = useState<any[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    -5.187978, -37.344265,
  ]);
  const [loading, setLoading] = useState(true);

  // Busca os dados públicos
  useEffect(() => {
    if (itineraryId) {
      setLoading(true);
      // Nota: Usando a rota /public que criamos no backend
      api
        .get(`/itinerarios/public/${itineraryId}`)
        .then((response) => {
          const data = response.data;
          setItineraryData(data);

          if (data.cidadeLat && data.cidadeLon) {
            setMapCenter([data.cidadeLat, data.cidadeLon]);
          }

          if (data.dataInicio && data.dataFim) {
            const start = new Date(data.dataInicio + "T00:00:00");
            const end = new Date(data.dataFim + "T00:00:00");
            const diffDays = differenceInCalendarDays(end, start) + 1;

            const diasBackendMap = new Map();
            if (data.dias) {
              data.dias.forEach((d: any) => diasBackendMap.set(d.numero, d));
            }

            const diasGerados = Array.from({ length: diffDays }, (_, i) => {
              const currentDate = addDays(start, i);
              const numeroDia = i + 1;
              const diaExistente = diasBackendMap.get(numeroDia);

              return {
                dia: numeroDia,
                displayDate: format(currentDate, "dd/MM", { locale: ptBR }),
                locais:
                  diaExistente && diaExistente.locaisDTO
                    ? diaExistente.locaisDTO
                    : [],
              };
            });

            setDias(diasGerados);
          }
        })
        .catch((err) => {
          console.error("Erro ao carregar itinerário", err);
          alert("Itinerário não encontrado ou privado.");
          router.push("/");
        })
        .finally(() => setLoading(false));
    }
  }, [itineraryId, router]);

  // Calcula rota quando muda o dia
  useEffect(() => {
    if (dias.length > 0 && dias[selectedDayIndex]) {
      const locaisDoDia = dias[selectedDayIndex].locais;
      if (locaisDoDia.length > 1) {
        const points = locaisDoDia.map((l: any) => ({
          lat: l.latitude, // Nota: Backend manda como latitude/longitude
          lng: l.longitude,
        }));
        getRoute(points).then(setRoutePath);
      } else {
        setRoutePath([]);
      }
    }
  }, [dias, selectedDayIndex]);

  // Calcula custo total do dia
  const custoDia = useMemo(() => {
    if (!dias[selectedDayIndex]) return 0;
    return dias[selectedDayIndex].locais.reduce((acc: number, local: any) => {
      const totalLocal = local.custosDesteLocal
        ? local.custosDesteLocal.reduce(
            (cAcc: number, c: any) => cAcc + c.amount,
            0
          )
        : 0;
      return acc + totalLocal;
    }, 0);
  }, [dias, selectedDayIndex]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin text-orange-500">
            <svg
              className="h-10 w-10"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-500 font-medium">
            Preparando sua visualização...
          </p>
        </div>
      </div>
    );
  }

  const mapMarkers =
    dias[selectedDayIndex]?.locais.map((l: any) => ({
      lat: l.latitude,
      lng: l.longitude,
      name: l.name,
    })) || [];

  return (
    <div className="flex flex-col h-screen w-full bg-white text-gray-900 overflow-hidden">
      <PublicHeader />

      <main className="flex flex-1 overflow-hidden">
        {/* Lado Esquerdo: Lista (Read-Only) */}
        <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col p-6 overflow-y-auto border-r border-gray-200 bg-white z-10 shadow-lg md:shadow-none">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                  {itineraryData?.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                    <MapPin className="h-3 w-3" /> {itineraryData?.cidadeNome}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                    <Calendar className="h-3 w-3" />
                    {dias.length} dias
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 uppercase font-semibold">
                  Orçamento Total
                </div>
                <div className="text-xl font-bold text-green-600">
                  R$ {itineraryData?.totalOrcamento?.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Seletor de Dias */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 shrink-0 sticky top-0 bg-white z-10 py-2">
            {dias.map((d, index) => (
              <button
                key={d.dia}
                onClick={() => setSelectedDayIndex(index)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                  selectedDayIndex === index
                    ? "bg-orange-500 text-white border-orange-500 shadow-md transform scale-105"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                <div className="text-xs font-normal opacity-90">
                  {d.displayDate}
                </div>
                <div>Dia {d.dia}</div>
              </button>
            ))}
          </div>

          {/* Resumo do Dia */}
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-semibold text-gray-700">Roteiro do dia</h3>
            <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <Coins className="h-4 w-4" />
              Estimado: R$ {custoDia.toFixed(2)}
            </span>
          </div>

          {/* Lista de Locais */}
          <div className="space-y-4 pb-10">
            {dias[selectedDayIndex]?.locais.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400">
                  Nenhum local planejado para este dia.
                </p>
              </div>
            ) : (
              dias[selectedDayIndex]?.locais.map(
                (local: any, index: number) => (
                  <div
                    key={index}
                    className="group relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                  >
                    {/* Linha do tempo (bolinha) */}
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-orange-100 border-2 border-orange-500 z-10 group-hover:bg-orange-500 transition-colors"></div>

                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:border-orange-200">
                      <h4 className="font-bold text-lg text-gray-800 mb-1">
                        {local.name}
                      </h4>

                      {/* Lista de Custos (somente leitura) */}
                      {local.custosDesteLocal &&
                        local.custosDesteLocal.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-50 space-y-1">
                            {local.custosDesteLocal.map(
                              (custo: any, cIdx: number) => (
                                <div
                                  key={cIdx}
                                  className="flex justify-between text-sm text-gray-600"
                                >
                                  <span>
                                    {custo.description || "Custo diverso"}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    R$ {custo.amount.toFixed(2)}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>

        {/* Lado Direito: Mapa */}
        <div className="hidden md:block w-1/2 lg:w-7/12 h-full bg-gray-100 relative">
          <ItineraryMap
            center={mapCenter}
            markers={mapMarkers}
            onMapClick={() => {}} // Desabilita clique
            onPoiClick={() => {}} // Desabilita seleção de POI
            selectedPosition={null}
            suggestedMarkers={[]} // Não mostra sugestões na visualização
            routeCoordinates={routePath}
          />

          {/* Botão flutuante voltar */}
          <div className="absolute top-4 left-4 z-[1000]">
            <Button
              variant="secondary"
              className="shadow-lg bg-white/90 backdrop-blur"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
