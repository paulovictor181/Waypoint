import { Coordinate, RoutePath, RouteProfile, RouteStrategy } from "../routeStrategy";
import { getRoute } from "../osm"; // Adaptee

/**
 * Concrete Strategy: Estratégia para rotas de bicicleta.
 */
export class CyclingRouteStrategy implements RouteStrategy {
  profile: RouteProfile = "cycling";

  async calculate(coordinates: Coordinate[]): Promise<RoutePath> {
    console.warn("Aviso: A rota de Cycling (bicicleta) está usando o perfil 'driving' do osm.ts até que a dependência seja atualizada.");
    
    // **Implementação correta para o padrão, mas limitada pelo Adaptee atual:**
    // const url = `https://router.project-osrm.org/route/v1/${this.profile}/...`;
    
    return getRoute(coordinates);
  }
}