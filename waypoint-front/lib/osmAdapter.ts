import { fetchPOIsInBounds, getRoute } from "./osm"; // Adaptee
import { MapDataProvider } from "./mapDataProvider"; // Target
import { POI, Coordinate, RoutePath } from "./poiTypes"; 

/**
 * Adapter (Padrão Adapter)
 * Adapta a interface da API OSM (Overpass/OSRM) para a interface MapDataProvider.
 */
export class OsmAdapter implements MapDataProvider {

  /**
   * Adapta a função fetchPOIsInBounds (do osm.ts) para o contrato da interface.
   * O fetchPOIsInBounds retorna o tipo POI (que é o mesmo que o novo poiTypes.ts)
   */
  async getPointsOfInterest(
    north: number,
    south: number,
    east: number,
    west: number,
    limit?: number
  ): Promise<POI[]> {
    // Chama o método existente do Adaptee
    const pois = await fetchPOIsInBounds(north, south, east, west, limit);
    return pois;
  }

  /**
   * Adapta a função getRoute (do osm.ts) para o contrato da interface.
   */
  async calculateRoute(coordinates: Coordinate[]): Promise<RoutePath> {
    // Chama o método existente do Adaptee
    const route = await getRoute(coordinates);
    return route;
  }
}