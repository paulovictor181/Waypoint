"use client";

import L from "leaflet";
import { Globe, MapPin, Phone, Utensils, X } from "lucide-react"; // Ícones para o card
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

const defaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const poiIcon = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconRetinaUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-violet.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
}

export default function ItineraryMap({
  markers,
  suggestedMarkers = [],
  onMapClick,
  onPoiClick,
  onBoundsChange,
  selectedPosition,
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEventsHandler
          onLocationSelect={onMapClick}
          onBoundsChange={onBoundsChange}
          onMapClickEmpty={() => setActivePOI(null)}
        />

        {/* Marcadores do Itinerário */}
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={[marker.lat, marker.lng]}
            icon={defaultIcon}
          >
            <Popup>
              <span className="font-bold text-gray-800">{marker.name}</span>
            </Popup>
          </Marker>
        ))}

        {/* Marcador Selecionado */}
        {selectedPosition && (
          <Marker
            position={[selectedPosition.lat, selectedPosition.lng]}
            opacity={0.6}
            icon={defaultIcon}
          >
            <Popup>Novo local selecionado</Popup>
          </Marker>
        )}

        {/* Sugestões */}
        {suggestedMarkers.map((poi, idx) => (
          <Marker
            key={`poi-${idx}`}
            position={[poi.lat, poi.lng]}
            icon={poiIcon}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                setActivePOI(poi);
                if (onPoiClick) onPoiClick(poi);
              },
            }}
          >
            {/* Popup simplificado apenas com o nome */}
            <Popup>
              <span className="font-semibold text-purple-700">{poi.name}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* CARD DE DETALHES FLUTUANTE (Overlay) */}
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
              {activePOI.type.replace(/_/g, " ")}
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
