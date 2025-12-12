package br.edu.ufersa.waypoint.components.usuario.api.mappers;

import br.edu.ufersa.waypoint.auth.dtos.RegisterRequest;
import br.edu.ufersa.waypoint.auth.dtos.RegisterResponse;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public static Usuario RequestToEntity(RegisterRequest request) {
        if (request == null) {
            return null;
        }

        return Usuario.builder()
                .email(request.email())
                .username(request.username())
                .password(request.password())
                .role(request.role())
                .birthDate(request.birthDate())
                .build();
    }

    public static RegisterResponse EntityToResponse(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        return new RegisterResponse(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getUsername(),
                usuario.getPassword(),
                usuario.getRole()
            );
    }
}
