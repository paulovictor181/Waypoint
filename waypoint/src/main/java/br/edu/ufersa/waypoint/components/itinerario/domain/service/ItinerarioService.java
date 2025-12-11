package br.edu.ufersa.waypoint.components.itinerario.domain.service;

import br.edu.ufersa.waypoint.components.itinerario.api.dtos.ItinerarioResumoDTO;
import br.edu.ufersa.waypoint.components.itinerario.domain.entities.Itinerario;
import br.edu.ufersa.waypoint.components.itinerario.domain.repository.ItinerarioRepository;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
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

}