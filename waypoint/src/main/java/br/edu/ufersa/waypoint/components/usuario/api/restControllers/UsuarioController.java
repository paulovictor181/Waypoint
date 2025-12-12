package br.edu.ufersa.waypoint.components.usuario.api.restControllers;

import br.edu.ufersa.waypoint.auth.dtos.RegisterResponse;
import br.edu.ufersa.waypoint.components.usuario.api.mappers.UsuarioMapper;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import br.edu.ufersa.waypoint.components.usuario.domain.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<RegisterResponse>> listarTodos() {
        List<Usuario> usuarios = usuarioService.findAll();

        List<RegisterResponse> response = usuarios.stream()
                .map(UsuarioMapper::EntityToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/me")
    public ResponseEntity<RegisterResponse> buscarMeuPerfil(@AuthenticationPrincipal Usuario usuario) {
        // O Spring Security injeta o objeto Usuario (Principal) do usuário logado
        // O UsuarioMapper converte a entidade para o DTO de resposta
        return ResponseEntity.ok(UsuarioMapper.EntityToResponse(usuario));
    }
}
