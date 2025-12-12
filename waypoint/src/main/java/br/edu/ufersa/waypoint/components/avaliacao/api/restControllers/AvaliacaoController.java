package br.edu.ufersa.waypoint.components.avaliacao.api.restControllers;

import br.edu.ufersa.waypoint.components.avaliacao.api.dtos.AvaliacaoRequest;
import br.edu.ufersa.waypoint.components.avaliacao.api.dtos.AvaliacaoResponse;
import br.edu.ufersa.waypoint.components.avaliacao.domain.entities.Avaliacao;
import br.edu.ufersa.waypoint.components.avaliacao.domain.service.AvaliacaoService;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rating")
@RequiredArgsConstructor
public class AvaliacaoController {
    private final AvaliacaoService service;

    @GetMapping("/{osmId}")
    public ResponseEntity<List<AvaliacaoResponse>> listarPorLocal(@PathVariable Long osmId) {
        return ResponseEntity.ok(service.listarPorOsmId(osmId));
    }

    @PostMapping
    public ResponseEntity<Avaliacao> criar(@RequestBody AvaliacaoRequest req, @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(service.avaliar(req, usuario));
    }
}