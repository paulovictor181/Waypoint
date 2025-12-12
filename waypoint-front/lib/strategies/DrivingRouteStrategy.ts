import { getRoute } from "../osm"; // Adaptee
import { Coordinate, RoutePath, RouteProfile, RouteStrategy } from "../routeStrategy";

/**
 * Concrete Strategy: Estratégia para rotas de carro.
 */
export class DrivingRouteStrategy implements RouteStrategy {
  profile: RouteProfile = "driving";

  async calculate(coordinates: Coordinate[]): Promise<RoutePath> {
    return getRoute(coordinates);
  }
}