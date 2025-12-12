package br.edu.ufersa.waypoint.components.custo.api.dtos;

import java.math.BigDecimal;

public record CustoRequest(
        String description,
        BigDecimal amount
) {}