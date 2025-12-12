package br.edu.ufersa.waypoint.components.itinerario.api.dtos;

import br.edu.ufersa.waypoint.components.dia.api.dtos.DiaRequest;
import br.edu.ufersa.waypoint.components.dia.api.dtos.DiaResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ItinerarioUpdateRequest(
        String name,
        LocalDate inicio,
        LocalDate fim,
        BigDecimal totalOrcamento,
        List<DiaRequest> dias) {
}
