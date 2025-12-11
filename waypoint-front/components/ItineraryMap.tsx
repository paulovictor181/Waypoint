"use client";

import L from "leaflet";
import {
  Camera,
  Coffee,
  Globe,
  Landmark,
  MapPin,
  Phone,
  Store,
  Utensils,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

// --- FUNÇÃO PARA CRIAR ÍCONES PERSONALIZADOS ---
// Transforma um ícone React (Lucide) em um Marcador Leaflet com Tailwind
const createCustomIcon = (
  icon: React.ReactNode,
  bgColor: string = "bg-blue-500"
) => {
  const iconHtml = renderToStaticMarkup(
    <div
      className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-md ${bgColor} text-white`}
    >
      {icon}
      {/* Triângulo (ponta do pino) */}
      <div
        className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b-2 border-r-2 border-white ${bgColor}`}
      ></div>
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: "", // Remove classes padrão do Leaflet para não atrapalhar
    iconSize: [32, 42], // Tamanho total aproximado
    iconAnchor: [16, 42], // Ponto que toca o mapa (meio embaixo)
    popupAnchor: [0, -45], // Onde o popup abre
  });
};

// Ícone Padrão (Azul - Para locais salvos)
const savedIcon = createCustomIcon(
  <MapPin className="w-5 h-5" />,
  "bg-blue-600"
);

// Ícone Temporário (Laranja - Seleção atual)
const tempIcon = createCustomIcon(
  <MapPin className="w-5 h-5" />,
  "bg-orange-500"
);

// Função para escolher ícone baseado no tipo do POI
const getPoiIcon = (type: string) => {
  let icon = <MapPin className="w-4 h-4" />;
  let color = "bg-gray-500";

  if (type === "restaurant" || type === "food") {
    icon = <Utensils className="w-4 h-4" />;
    color = "bg-red-500";
  } else if (type === "cafe") {
    icon = <Coffee className="w-4 h-4" />;
    color = "bg-amber-600";
  } else if (
    type === "attraction" ||
    type === "tourism" ||
    type === "artwork" ||
    type === "museum"
  ) {
    icon = <Camera className="w-4 h-4" />;
    color = "bg-purple-600";
  } else if (type === "hotel" || type === "guest_house") {
    icon = <Store className="w-4 h-4" />;
    color = "bg-indigo-600";
  } else {
    icon = <Landmark className="w-4 h-4" />;
    color = "bg-emerald-600";
  }

  return createCustomIcon(icon, color);
};

// ... (Resto do componente Handler mantém igual) ...
function MapEventsHandler({
  onLocationSelect,
  onBoundsChange,
  onMapClickEmpty,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  onBoundsChange?: (bounds: L.LatLngBounds) => void;
  onMapClickEmpty: () => void;
}) {
  const map = useMap();

  useMapEvents({
    click(e) {
      onMapClickEmpty();
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
    moveend() {
      if (onBoundsChange) {
        onBoundsChange(map.getBounds());
      }
    },
  });

  useEffect(() => {
    if (onBoundsChange) {
      onBoundsChange(map.getBounds());
    }
  }, [map, onBoundsChange]);

  return null;
}

interface ItineraryMapProps {
  markers: { lat: number; lng: number; name: string }[];
  suggestedMarkers?: {
    lat: number;
    lng: number;
    name: string;
    type: string;
    address?: string;
    phone?: string;
    website?: string;
    cuisine?: string;
  }[];
  onMapClick: (lat: number, lng: number) => void;
  onPoiClick?: (poi: any) => void;
  onBoundsChange?: (bounds: any) => void;
  selectedPosition: { lat: number; lng: number } | null;
  routeCoordinates?: [number, number][];
}

export default function ItineraryMap({
  markers,
  suggestedMarkers = [],
  onMapClick,
  onPoiClick,
  onBoundsChange,
  selectedPosition,
  routeCoordinates = [],
}: ItineraryMapProps) {
  const [activePOI, setActivePOI] = useState<any>(null);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[-5.187978, -37.344265]}
        zoom={13}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* --- DESENHO DA ROTA --- */}
        {routeCoordinates.length > 0 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "#3b82f6",
              weight: 5,
              opacity: 0.7,
              dashArray: "10, 10",
            }}
          />
        )}

        <MapEventsHandler
          onLocationSelect={onMapClick}
          onBoundsChange={onBoundsChange}
          onMapClickEmpty={() => setActivePOI(null)}
        />

        {/* Marcadores do Itinerário (Azul) */}
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={[marker.lat, marker.lng]}
            icon={savedIcon}
          >
            <Popup>
              <span className="font-bold text-gray-800">{marker.name}</span>
            </Popup>
          </Marker>
        ))}

        {/* Marcador Selecionado (Laranja) */}
        {selectedPosition && (
          <Marker
            position={[selectedPosition.lat, selectedPosition.lng]}
            opacity={0.8}
            icon={tempIcon}
          >
            <Popup>Novo local selecionado</Popup>
          </Marker>
        )}

        {/* Sugestões (Dinâmicos) */}
        {suggestedMarkers.map((poi, idx) => (
          <Marker
            key={`poi-${idx}`}
            position={[poi.lat, poi.lng]}
            // AQUI ESTÁ A MÁGICA: Ícone muda conforme o tipo
            icon={getPoiIcon(poi.type)}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                setActivePOI(poi);
                if (onPoiClick) onPoiClick(poi);
              },
            }}
          >
            <Popup>
              <span className="font-semibold text-gray-700">{poi.name}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* CARD DE DETALHES (Mantido igual ao anterior) */}
      {activePOI && (
        <div className="absolute bottom-6 left-6 z-[500] w-80 bg-white rounded-xl shadow-2xl border-l-4 border-orange-500 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="p-4 relative">
            <button
              onClick={() => setActivePOI(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 pr-6 leading-tight mb-1">
              {activePOI.name}
            </h3>
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 capitalize mb-3">
              {activePOI.type?.replace(/_/g, " ")}
            </span>

            <div className="space-y-2 text-sm text-gray-600">
              {activePOI.cuisine && (
                <div className="flex items-start gap-2">
                  <Utensils className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <span className="capitalize">
                    {activePOI.cuisine.replace(/;/g, ", ")}
                  </span>
                </div>
              )}

              {activePOI.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <span>{activePOI.address}</span>
                </div>
              )}

              {activePOI.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{activePOI.phone}</span>
                </div>
              )}

              {activePOI.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                  <a
                    href={activePOI.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate block max-w-[200px]"
                  >
                    Visitar site
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 italic">
              Clique no mapa para fechar
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
