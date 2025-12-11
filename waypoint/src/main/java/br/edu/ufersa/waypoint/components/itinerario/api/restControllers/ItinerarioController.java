package br.edu.ufersa.waypoint.components.itinerario.api.restControllers;

import br.edu.ufersa.waypoint.components.itinerario.api.dtos.ItinerarioResumoDTO;
import br.edu.ufersa.waypoint.components.itinerario.domain.service.ItinerarioService;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/itinerarios")
@RequiredArgsConstructor
public class ItinerarioController {

    private final ItinerarioService itinerarioService;

    @GetMapping
    public ResponseEntity<List<ItinerarioResumoDTO>> listarMeusItinerarios(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(itinerarioService.listarPorUsuario(usuario));
    }
}
