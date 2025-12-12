// waypoint-front/lib/poiFactory.ts

// 1. O Produto (Interface)
export interface POI {
  id: number;
  lat: number;
  lng: number;
  name: string;
  type: string;
  address?: string;
  phone?: string;
  website?: string;
  cuisine?: string;
}

// 2. (Factory)
export class PoiFactory {
  static createFromOsmElement(el: any): POI {
    // LÓGICA DE IDIOMA
    const name =
      el.tags["name:pt-BR"] ||
      el.tags["name:pt"] ||
      el.tags.name ||
      "Local sem nome";

    const street = el.tags["addr:street"] || "";
    const number = el.tags["addr:housenumber"] || "";
    const city = el.tags["addr:city"] || "";
    const suburb = el.tags["addr:suburb"] || "";

    let address = "";
    if (street) address += street;
    if (number) address += `, ${number}`;
    if (suburb) address += ` - ${suburb}`;
    if (city) address += ` - ${city}`;

    // LÓGICA DE TIPO
    const type = el.tags.tourism || el.tags.amenity || "unknown";

    // Retorna o Produto (Objeto POI formatado)
    return {
      id: el.id,
      lat: el.lat,
      lng: el.lon,
      name: name,
      type: type,
      address: address || undefined,
      phone: el.tags.phone || el.tags["contact:phone"],
      website: el.tags.website || el.tags["contact:website"],
      cuisine: el.tags.cuisine,
    };
  }
}
