package br.edu.ufersa.waypoint.components.dia.api.dtos;

import br.edu.ufersa.waypoint.components.local.api.dtos.LocalResponseDTO;

import java.util.List;

public record DiaResponseDTO(Integer numero, List<LocalResponseDTO> locaisDTO) {
}
