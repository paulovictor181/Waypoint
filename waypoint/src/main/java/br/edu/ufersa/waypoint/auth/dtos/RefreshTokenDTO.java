package br.edu.ufersa.waypoint.auth.dtos;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenDTO(@NotBlank String refreshToken) {
}
