import { Coordinate, RoutePath, RouteProfile, RouteStrategy } from "../routeStrategy";
import { getRoute } from "../osm"; // Adaptee

/**
 * Concrete Strategy: Estratégia para rotas a pé.
 */
export class WalkingRouteStrategy implements RouteStrategy {
  profile: RouteProfile = "walking";

  async calculate(coordinates: Coordinate[]): Promise<RoutePath> {
    console.warn("Aviso: A rota de Walking (a pé) está usando o perfil 'driving' do osm.ts até que a dependência seja atualizada.");
    
    // **Implementação correta para o padrão, mas limitada pelo Adaptee atual:**
    // const coordsString = coordinates.map(c => `${c.lng},${c.lat}`).join(';');
    // const url = `https://router.project-osrm.org/route/v1/${this.profile}/${coordsString}?overview=full&geometries=geojson`;
    // ... buscar rota com URL de walking ...
    
    return getRoute(coordinates);
  }
}