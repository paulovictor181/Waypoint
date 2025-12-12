package br.edu.ufersa.waypoint.components.avaliacao.api.dtos;

public record AvaliacaoRequest(
        Long localOsmId,
        String nomeLocal,
        Double lat,
        Double lon,
        Integer nota,
        String comentario,
        String fotoUrl
) {}