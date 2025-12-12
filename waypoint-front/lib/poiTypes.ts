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

// O tipo de Coordenada usado para rotas
export type Coordinate = {
  lat: number;
  lng: number;
};

// O tipo de Rota retornado (Array de [latitude, longitude])
export type RoutePath = [number, number][];