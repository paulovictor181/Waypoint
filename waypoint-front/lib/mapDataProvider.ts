import { POI, Coordinate, RoutePath } from "./poiTypes";

/**
 * Target Interface (Padrão Adapter)
 * Define o contrato que qualquer provedor de dados de mapa (OSM, Google Maps, etc.) deve seguir.
 */
export interface MapDataProvider {
  /**
   * Busca Pontos de Interesse dentro de uma caixa delimitadora.
   * @param north Latitude Norte
   * @param south Latitude Sul
   * @param east Longitude Leste
   * @param west Longitude Oeste
   * @param limit Limite de resultados (opcional)
   * @returns Uma promessa que resolve para um array de POIs.
   */
  getPointsOfInterest(
    north: number,
    south: number,
    east: number,
    west: number,
    limit?: number
  ): Promise<POI[]>;

  /**
   * Calcula a rota otimizada entre um conjunto de coordenadas.
   * @param coordinates Array de objetos de coordenada (lat, lng).
   * @returns Uma promessa que resolve para o caminho da rota.
   */
  calculateRoute(coordinates: Coordinate[]): Promise<RoutePath>;
}