package br.edu.ufersa.waypoint.components.itinerario.api.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ItinerarioRequest(@NotBlank String name,
                                @NotBlank String destination,
                                @NotNull LocalDate inicio,
                                @NotNull LocalDate fim,
                                @NotNull BigDecimal totalOrcamento ) {
}
