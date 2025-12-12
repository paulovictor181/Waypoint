package br.edu.ufersa.waypoint.components.dia.api.dtos;

import br.edu.ufersa.waypoint.components.local.api.dtos.LocalRequest;

import java.util.List;

public record DiaRequest(
        Integer Numeracao,
        List<LocalRequest> locais)
{}
