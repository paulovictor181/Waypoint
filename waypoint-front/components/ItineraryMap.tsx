"use client";

import api from "@/lib/api";
import L from "leaflet";
import {
  Camera,
  Coffee,
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
import { StarRating } from "./StarRating";

// --- FUNÇÃO PARA CRIAR ÍCONES PERSONALIZADOS ---
const createCustomIcon = (
  icon: React.ReactNode,
  bgColor: string = "bg-blue-500"
) => {
  const iconHtml = renderToStaticMarkup(
    <div
      className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-md ${bgColor} text-white`}
    >
      {icon}
      <div
        className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b-2 border-r-2 border-white ${bgColor}`}
      ></div>
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: "",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -45],
  });
};

// Ícones pré-definidos
const savedIcon = createCustomIcon(
  <MapPin className="w-5 h-5" />,
  "bg-orange-600"
);

const tempIcon = createCustomIcon(
  <MapPin className="w-5 h-5" />,
  "bg-blue-500"
);

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

function RecenterAutomatically({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      map.setView([lat, lng]);
    }
  }, [lat, lng, map]);
  return null;
}

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
  center?: [number, number];
}

export default function ItineraryMap({
  markers,
  suggestedMarkers = [],
  onMapClick,
  onPoiClick,
  onBoundsChange,
  selectedPosition,
  routeCoordinates = [],
  center = [-5.187978, -37.344265], // Padrão
}: ItineraryMapProps) {
  const [activePOI, setActivePOI] = useState<any>(null);

  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (activePOI && activePOI.id) {
      setLoadingReviews(true);
      api
        .get(`/rating/${activePOI.id}`)
        .then((res) => setReviews(res.data))
        .catch(() => setReviews([]))
        .finally(() => setLoadingReviews(false));
    } else {
      setReviews([]);
    }
  }, [activePOI]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        {/* Componente que força a atualização do centro quando a prop muda */}
        <RecenterAutomatically lat={center[0]} lng={center[1]} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {routeCoordinates.length > 0 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "#f97316",
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

        {/* 1. Sugestões */}
        {suggestedMarkers.map((poi, idx) => (
          <Marker
            key={`poi-${poi.lat}-${poi.lng}-${idx}`}
            position={[poi.lat, poi.lng]}
            icon={getPoiIcon(poi.type)}
            zIndexOffset={0}
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

        {/* 2. Marcadores Salvos */}
        {markers.map((marker, idx) => (
          <Marker
            key={`marker-${marker.lat}-${marker.lng}-${idx}`}
            position={[marker.lat, marker.lng]}
            icon={savedIcon}
            zIndexOffset={500}
          >
            <Popup>
              <span className="font-bold text-gray-800">{marker.name}</span>
            </Popup>
          </Marker>
        ))}

        {/* 3. Marcador Selecionado */}
        {selectedPosition && (
          <Marker
            position={[selectedPosition.lat, selectedPosition.lng]}
            opacity={0.9}
            icon={tempIcon}
            zIndexOffset={1000}
          >
            <Popup>Novo local selecionado</Popup>
          </Marker>
        )}
      </MapContainer>

      {activePOI && (
        <div className="absolute bottom-6 left-6 z-[500] w-80 bg-white rounded-xl shadow-2xl border-l-4 border-orange-500 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300 max-h-[80vh] flex flex-col">
          {/* Cabeçalho do Card (com scroll se necessário) */}
          <div className="p-4 relative overflow-y-auto">
            <button
              onClick={() => setActivePOI(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 pr-6 leading-tight mb-1">
              {activePOI.name}
            </h3>

            {/* ... (Tags de tipo, telefone, site existentes) ... */}
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {/* Mantenha os detalhes existentes aqui (Phone, Website, etc) */}
              {activePOI.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{activePOI.phone}</span>
                </div>
              )}
            </div>

            {/* SEÇÃO DE AVALIAÇÕES */}
            <div className="border-t border-gray-100 pt-3">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm flex justify-between items-center">
                Avaliações da Comunidade
                <span className="text-xs font-normal text-gray-500">
                  {reviews.length} opiniões
                </span>
              </h4>

              {loadingReviews ? (
                <div className="text-center py-2 text-xs text-gray-400">
                  Carregando...
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-3 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                  {reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 p-2 rounded-lg text-sm"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-orange-600">
                          {review.nomeUsuario}
                        </span>
                        <StarRating rating={review.nota} size={12} />
                      </div>
                      <p className="text-gray-700 text-xs italic">
                        "{review.comentario}"
                      </p>
                      {review.fotoUrl && (
                        <img
                          src={review.fotoUrl}
                          alt="Foto da avaliação"
                          className="mt-2 w-full h-24 object-cover rounded-md"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-2">
                  Nenhuma avaliação ainda. Seja o primeiro!
                </p>
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400 italic">
              Clique no mapa para fechar
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
