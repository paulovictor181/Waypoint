package br.edu.ufersa.waypoint.components.itinerario.api.restControllers;

import br.edu.ufersa.waypoint.components.itinerario.api.dtos.*;
import br.edu.ufersa.waypoint.components.itinerario.domain.service.ItinerarioService;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{id}")
    public ResponseEntity<ItinerarioDetalhadoDTO> buscarPorId(@PathVariable Long id, @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(itinerarioService.buscarPorIdDetalhado(id, usuario));
    }

    @PostMapping
    public ResponseEntity<ItinerarioResumoDTO> criar(@RequestBody @Valid ItinerarioRequest request, @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(itinerarioService.criar(request, usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItinerarioResumoDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ItinerarioUpdateRequest request,
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.ok(itinerarioService.atualizar(id, request, usuario));
    }
}
