import { RouteStrategy, RouteProfile } from "./routeStrategy";
import { Coordinate, RoutePath } from "./poiTypes";
import { DrivingRouteStrategy } from "./strategies/DrivingRouteStrategy";

/**
 * Context (Padrão Strategy)
 * Mantém uma referência à estratégia concreta e permite que o cliente a troque.
 */
export class RouteContext {
  private strategy: RouteStrategy;

  constructor(initialStrategy: RouteStrategy = new DrivingRouteStrategy()) {
    this.strategy = initialStrategy;
  }

  /**
   * Permite que o cliente defina a estratégia em tempo de execução.
   */
  public setStrategy(strategy: RouteStrategy): void {
    this.strategy = strategy;
    console.log(`Estratégia de rota alterada para: ${strategy.profile}`);
  }

  /**
   * Executa o algoritmo da estratégia atual.
   */
  public async executeStrategy(coordinates: Coordinate[]): Promise<RoutePath> {
    if (coordinates.length < 2) {
      return [];
    }
    return this.strategy.calculate(coordinates);
  }

  /**
   * Retorna o perfil ativo (ex: "driving", "walking").
   */
  public getActiveProfile(): RouteProfile {
    return this.strategy.profile;
  }
}