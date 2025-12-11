package br.edu.ufersa.waypoint.components.local.api.dtos;

public record LocalRequestDTO(
        String name,
        Double latitude,
        Double longitude,
        Long itinerarioId,
        Long cidadeOsmId,
        String cidadeNome,
        String cidadeEstado,
        String cidadePais
) {}