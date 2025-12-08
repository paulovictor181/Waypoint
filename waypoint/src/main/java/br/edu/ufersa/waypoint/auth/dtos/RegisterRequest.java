package br.edu.ufersa.waypoint.auth.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.aspectj.weaver.ast.Not;

import java.time.LocalDate;

public record RegisterRequest(
        @NotBlank String email,
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank String role,
        @NotNull LocalDate birthDate
) {
}
