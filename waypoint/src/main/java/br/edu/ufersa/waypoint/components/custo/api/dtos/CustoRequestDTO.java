package br.edu.ufersa.waypoint.components.custo.api.dtos;

import java.math.BigDecimal;

public record CustoRequestDTO(
        String description,
        BigDecimal amount,
        Long localId,
        Long diaId,
        Long itinerarioId
) {}