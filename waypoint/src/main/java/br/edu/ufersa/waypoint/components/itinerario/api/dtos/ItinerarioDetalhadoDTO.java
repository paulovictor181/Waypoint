package br.edu.ufersa.waypoint.components.itinerario.api.dtos;

import br.edu.ufersa.waypoint.components.dia.api.dtos.DiaResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ItinerarioDetalhadoDTO(
        Long id,
        String name,
        LocalDate dataInicio,
        LocalDate dataFim,
        BigDecimal totalOrcamento,
        String cidadeNome,
        Double cidadeLat,
        Double cidadeLon,
        List<DiaResponse> dias
) {}
