package br.edu.ufersa.waypoint.components.avaliacao.domain.service;

import br.edu.ufersa.waypoint.components.avaliacao.api.dtos.AvaliacaoRequest;
import br.edu.ufersa.waypoint.components.avaliacao.domain.entities.Avaliacao;
import br.edu.ufersa.waypoint.components.avaliacao.domain.repository.AvaliacaoRepository;
import br.edu.ufersa.waypoint.components.local.domain.entities.Local;
import br.edu.ufersa.waypoint.components.local.domain.repository.LocalRepository;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {
    private final AvaliacaoRepository avaliacaoRepository;
    private final LocalRepository localRepository;

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