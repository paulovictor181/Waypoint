import { Coordinate, RoutePath } from "./poiTypes";

export type RouteProfile = "driving" | "walking" | "cycling";

/**
 * Interface Strategy (Padrão Strategy)
 * Define o contrato para todas as estratégias de cálculo de rota.
 */
export interface RouteStrategy {
  profile: RouteProfile;

  /**
   * Calcula a rota utilizando o perfil de transporte específico desta estratégia.
   * @param coordinates Array de objetos de coordenada (lat, lng).
   * @returns Uma promessa que resolve para o caminho da rota.
   */
  calculate(coordinates: Coordinate[]): Promise<RoutePath>;
}

export type { Coordinate, RoutePath };
