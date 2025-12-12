package br.edu.ufersa.waypoint.components.local.api.dtos;

public record LocalRequestDTO(
        Long osmId,
        String name,
        Double latitude,
        Double longitude,
        Integer dia,
        Long itinerarioId,
        Long cidadeOsmId,
        String cidadeNome,
        String cidadeEstado,
        String cidadePais
) {}