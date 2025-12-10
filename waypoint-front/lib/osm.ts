// waypoint-front/lib/osm.ts

export interface POI {
  lat: number;
  lng: number;
  name: string;
  type: string;
}

export async function fetchNearbyPOIs(
  lat: number,
  lng: number,
  radius: number = 1000
): Promise<POI[]> {
  // Consulta Overpass QL: Busca nós (node) com tags de turismo ou alimentação ao redor do ponto
  const query = `
    [out:json];
    (
      node["tourism"](around:${radius},${lat},${lng});
      node["amenity"="restaurant"](around:${radius},${lat},${lng});
      node["amenity"="cafe"](around:${radius},${lat},${lng});
    );
    out body;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.elements
      .map((el: any) => ({
        lat: el.lat,
        lng: el.lon,
        name: el.tags.name || "Local sem nome",
        type: el.tags.tourism || el.tags.amenity,
      }))
      .filter((poi: POI) => poi.name !== "Local sem nome"); // Filtra locais sem nome para limpar o mapa
  } catch (error) {
    console.error("Erro ao buscar POIs:", error);
    return [];
  }
}
