package br.edu.ufersa.waypoint.auth.dtos;

import jakarta.validation.constraints.NotBlank;

public record RegisterResponse(@NotBlank Long id,
                               @NotBlank String email,
                               @NotBlank String username,
                               @NotBlank String password,
                               @NotBlank String role
                               ) {
}
