// waypoint-front/lib/osm.ts

export interface POI {
  lat: number;
  lng: number;
  name: string;
  type: string;
  address?: string;
  phone?: string;
  website?: string;
  cuisine?: string;
}

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
      .map((el: any) => {
        // LÓGICA DE IDIOMA AQUI:
        // 1. Tenta nome em Português do Brasil
        // 2. Tenta nome em Português (Portugal/Geral)
        // 3. Tenta nome padrão (língua local do lugar)
        const name =
          el.tags["name:pt-BR"] ||
          el.tags["name:pt"] ||
          el.tags.name ||
          "Local sem nome";

        // Formatação do endereço
        const street = el.tags["addr:street"] || "";
        const number = el.tags["addr:housenumber"] || "";
        const city = el.tags["addr:city"] || "";
        const suburb = el.tags["addr:suburb"] || "";

        let address = "";
        if (street) address += street;
        if (number) address += `, ${number}`;
        if (suburb) address += ` - ${suburb}`;
        if (city) address += ` - ${city}`;

        return {
          lat: el.lat,
          lng: el.lon,
          name: name,
          type: el.tags.tourism || el.tags.amenity,
          address: address || undefined,
          phone: el.tags.phone || el.tags["contact:phone"],
          website: el.tags.website || el.tags["contact:website"],
          cuisine: el.tags.cuisine,
        };
      })
      .filter((poi: POI) => poi.name !== "Local sem nome");
  } catch (error) {
    console.error("Erro de conexão com Overpass API:", error);
    return [];
  }
}
