package br.edu.ufersa.waypoint.components.avaliacao.api.dtos;

public record AvaliacaoResponse(
    Long id,
    Integer nota,
    String comentario,
    String fotoUrl,
    String nomeUsuario
) {}