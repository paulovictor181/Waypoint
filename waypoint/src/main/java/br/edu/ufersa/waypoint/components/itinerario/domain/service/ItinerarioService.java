package br.edu.ufersa.waypoint.components.itinerario.domain.service;

import br.edu.ufersa.waypoint.components.cidade.domain.entities.Cidade;
import br.edu.ufersa.waypoint.components.cidade.domain.repository.CidadeRepository;
import br.edu.ufersa.waypoint.components.itinerario.api.dtos.ItinerarioRequest;
import br.edu.ufersa.waypoint.components.itinerario.api.dtos.ItinerarioResumoDTO;
import br.edu.ufersa.waypoint.components.itinerario.domain.entities.Itinerario;
import br.edu.ufersa.waypoint.components.itinerario.domain.repository.ItinerarioRepository;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItinerarioService {

    private final ItinerarioRepository itinerarioRepository;
    private final CidadeRepository cidadeRepository;

    public List<ItinerarioResumoDTO> listarPorUsuario(Usuario usuario) {
        List<Itinerario> lista = itinerarioRepository.findByUsuarioId(usuario.getId());

        return lista.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ItinerarioResumoDTO buscarPorId(Long id, Usuario usuario) {
        Itinerario it = itinerarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Itinerário não encontrado"));

        if(!it.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Acesso negado");
        }
        return toDTO(it);
    }

    @Transactional
    public ItinerarioResumoDTO criar(ItinerarioRequest request, Usuario usuario) {

        Cidade cidade =
                cidadeRepository.findByOsmId(request.cidadeOsmId())
                .orElseGet(() -> {
                    Cidade nova = Cidade.builder()
                            .osmId(request.cidadeOsmId())
                            .nome(request.cidadeNome())
                            .estado(request.cidadeEstado())
                            .pais(request.cidadePais())
                            .latitude(request.cidadeLat())
                            .longitude(request.cidadeLon())
                            .build();
                    return cidadeRepository.save(nova);
                });

        Itinerario novo = Itinerario.builder()
                .name(request.name())
                .cidade(cidade)
                .inicio(request.inicio())
                .fim(request.fim())
                .totalOrcamento(request.totalOrcamento())
                .usuario(usuario)
                .build();

        itinerarioRepository.save(novo);
        return toDTO(novo);
    }

    private ItinerarioResumoDTO toDTO(Itinerario it) {
        return new ItinerarioResumoDTO(
                it.getId(),
                it.getName(),
                it.getInicio(),
                it.getFim(),
                it.getTotalOrcamento()
        );
    }
}