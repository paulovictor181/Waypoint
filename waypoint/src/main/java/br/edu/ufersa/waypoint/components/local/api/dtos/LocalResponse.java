package br.edu.ufersa.waypoint.components.local.api.dtos;

import br.edu.ufersa.waypoint.components.custo.domain.entities.Custo;

import java.util.List;

public record LocalResponse(
        Long id,
        Long osmId,
        String name,
        Double latitude,
        Double longitude,
        Integer numero,
        List<Custo> custosDesteLocal,
        Double mediaNota,
        String ultimaFoto
) {}
