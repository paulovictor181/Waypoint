package br.edu.ufersa.waypoint.components.itinerario.api.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ItinerarioRequest(
        @NotBlank String name,
        @NotNull LocalDate inicio,
        @NotNull LocalDate fim,
        @NotNull BigDecimal totalOrcamento,
        @NotNull Long cidadeOsmId,
        @NotBlank String cidadeNome,
        String cidadeEstado,
        String cidadePais,
        Double cidadeLat,
        Double cidadeLon
) {}
