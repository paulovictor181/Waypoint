// waypoint-front/lib/osm.ts

import { POI, PoiFactory } from "./poiFactory";

export type { POI };

export async function fetchPOIsInBounds(
  north: number,
  south: number,
  east: number,
  west: number,
  limit: number = 100
): Promise<POI[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["tourism"](${south},${west},${north},${east});
      node["amenity"="restaurant"](${south},${west},${north},${east});
      node["amenity"="cafe"](${south},${west},${north},${east});
    );
    out body ${limit};
  `;

  const url = `https://overpass.private.coffee/api/interpreter?data=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (!data.elements) return [];

    return data.elements
      .map((el: any) => PoiFactory.createFromOsmElement(el))
      .filter((poi: POI) => poi.name !== "Local sem nome");
  } catch (error) {
    console.error("Erro de conexão com Overpass API:", error);
    return [];
  }
}

export async function getRoute(
  coordinates: { lat: number; lng: number }[]
): Promise<[number, number][]> {
  if (coordinates.length < 2) return [];

  const coordsString = coordinates.map((c) => `${c.lng},${c.lat}`).join(";");

  const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      return [];
    }

    const geojsonCoords = data.routes[0].geometry.coordinates;
    return geojsonCoords.map((coord: number[]) => [coord[1], coord[0]]);
  } catch (error) {
    console.error("Erro ao buscar rota:", error);
    return [];
  }
}
