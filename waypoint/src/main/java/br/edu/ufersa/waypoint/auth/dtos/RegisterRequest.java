package br.edu.ufersa.waypoint.auth.dtos;

import jakarta.validation.constraints.NotBlank;
import org.aspectj.weaver.ast.Not;

public record RegisterRequest(
        @NotBlank String email,
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank String role
) {
}
