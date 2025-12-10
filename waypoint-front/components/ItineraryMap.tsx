"use client";

import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

// 1. Ícone Padrão (Marcador Azul) - Forçando o uso de CDN para evitar erros de importação
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

// 2. Ícone de POI (Sugestões - Violeta)
const poiIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers-default/violet-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Componente para capturar cliques no mapa
function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface ItineraryMapProps {
  markers: { lat: number; lng: number; name: string }[];
  suggestedMarkers?: { lat: number; lng: number; name: string; type: string }[];
  onMapClick: (lat: number, lng: number) => void;
  onPoiClick?: (poi: any) => void;
  selectedPosition: { lat: number; lng: number } | null;
}

export default function ItineraryMap({
  markers,
  suggestedMarkers = [],
  onMapClick,
  onPoiClick,
  selectedPosition,
}: ItineraryMapProps) {
  return (
    <MapContainer
      center={[-5.187978, -37.344265]} // Mossoró
      zoom={13}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker onLocationSelect={onMapClick} />

      {/* Marcadores já salvos (Itinerário) - AQUI ESTAVA O ERRO, AGORA USA O defaultIcon */}
      {markers.map((marker, idx) => (
        <Marker
          key={idx}
          position={[marker.lat, marker.lng]}
          icon={defaultIcon}
        >
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}

      {/* Marcador temporário (o que o usuário acabou de clicar) */}
      {selectedPosition && (
        <Marker
          position={[selectedPosition.lat, selectedPosition.lng]}
          opacity={0.6}
          icon={defaultIcon}
        >
          <Popup>Novo local selecionado</Popup>
        </Marker>
      )}

      {/* Renderiza os POIs Sugeridos (Restaurantes, Atrações) */}
      {suggestedMarkers.map((poi, idx) => (
        <Marker
          key={`poi-${idx}`}
          position={[poi.lat, poi.lng]}
          icon={poiIcon}
          eventHandlers={{
            click: () => {
              if (onPoiClick) onPoiClick(poi);
            },
          }}
        >
          <Popup>
            <strong>{poi.name}</strong>
            <br />
            <span className="capitalize text-xs text-gray-500">{poi.type}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
