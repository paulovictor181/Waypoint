package br.edu.ufersa.waypoint.auth.dtos;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO(@NotBlank String username, @NotBlank String password) {
}
