package br.edu.ufersa.waypoint.components.avaliacao.domain.service;

import br.edu.ufersa.waypoint.components.avaliacao.api.dtos.AvaliacaoRequest;
import br.edu.ufersa.waypoint.components.avaliacao.api.dtos.AvaliacaoResponse;
import br.edu.ufersa.waypoint.components.avaliacao.domain.entities.Avaliacao;
import br.edu.ufersa.waypoint.components.avaliacao.domain.repository.AvaliacaoRepository;
import br.edu.ufersa.waypoint.components.local.domain.entities.Local;
import br.edu.ufersa.waypoint.components.local.domain.repository.LocalRepository;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {
    private final AvaliacaoRepository avaliacaoRepository;
    private final LocalRepository localRepository;

    public List<AvaliacaoResponse> listarPorOsmId(Long osmId) {
        return localRepository.findByOsmId(osmId)
                .map(local -> avaliacaoRepository.findByLocalId(local.getId())
                        .stream()
                        .map(a -> new AvaliacaoResponse(
                                a.getId(),
                                a.getNota(),
                                a.getComentario(),
                                a.getFotoUrl(),
                                a.getUsuario().getUsername()
                        ))
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    @Transactional
    public Avaliacao avaliar(AvaliacaoRequest req, Usuario usuario) {
        Local local = localRepository.findByOsmId(req.localOsmId())
                .orElseGet(() -> localRepository.save(Local.builder()
                        .osmId(req.localOsmId())
                        .name(req.nomeLocal())
                        .latitude(req.lat())
                        .longitude(req.lon())
                        .build()));

        Avaliacao avaliacao = Avaliacao.builder()
                .nota(req.nota())
                .comentario(req.comentario())
                .fotoUrl(req.fotoUrl())
                .local(local)
                .usuario(usuario)
                .build();

        return avaliacaoRepository.save(avaliacao);
    }
}