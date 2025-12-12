package br.edu.ufersa.waypoint.components.dia.api.dtos;

import br.edu.ufersa.waypoint.components.local.api.dtos.LocalResponse;

import java.util.List;

public record DiaResponse(Integer numero, List<LocalResponse> locaisDTO) {
}
