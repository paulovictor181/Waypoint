package br.edu.ufersa.waypoint.components.itinerario.api.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ItinerarioResumoDTO(
        Long id,
        String name,
        LocalDate dataInicio,
        LocalDate dataFim,
        BigDecimal totalOrcamento,
        BigDecimal custoTotal,
        String cidadeNome,
        Double cidadeLat,
        Double cidadeLon
) {}