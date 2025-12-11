package br.edu.ufersa.waypoint.components.itinerario.domain.service;

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

    public List<ItinerarioResumoDTO> listarPorUsuario(Usuario usuario) {
        List<Itinerario> lista = itinerarioRepository.findByUsuarioId(usuario.getId());

        return lista.stream().map(it -> new ItinerarioResumoDTO(
                it.getId(),
                it.getName(),
                it.getInicio(),
                it.getFim(),
                it.getTotalOrcamento()
        )).collect(Collectors.toList());
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
        Itinerario novo = Itinerario.builder()
                .name(request.name())
                .destino(request.destination())
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