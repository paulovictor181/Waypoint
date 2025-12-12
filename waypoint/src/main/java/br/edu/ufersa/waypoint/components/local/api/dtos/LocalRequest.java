package br.edu.ufersa.waypoint.components.local.api.dtos;

import br.edu.ufersa.waypoint.components.custo.api.dtos.CustoRequest;

import java.util.List;

public record LocalRequest(
        Long osmId,
        String name,
        Double latitude,
        Double longitude,
        List<CustoRequest> custos
) {}