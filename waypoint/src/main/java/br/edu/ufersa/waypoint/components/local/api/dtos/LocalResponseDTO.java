package br.edu.ufersa.waypoint.components.local.api.dtos;

import br.edu.ufersa.waypoint.components.custo.domain.entities.Custo;

import java.util.List;

public record LocalResponseDTO(Long id, String name, Double latitude, Double longitude, Integer numero, List<Custo> custosDesteLocal) {
}
