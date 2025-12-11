package br.edu.ufersa.waypoint.components.local.domain.service;

import br.edu.ufersa.waypoint.components.cidade.domain.entities.Cidade;
import br.edu.ufersa.waypoint.components.cidade.domain.repository.CidadeRepository;
import br.edu.ufersa.waypoint.components.itinerario.domain.repository.ItinerarioRepository;
import br.edu.ufersa.waypoint.components.local.api.dtos.LocalRequestDTO;
import br.edu.ufersa.waypoint.components.local.domain.entities.Local;
import br.edu.ufersa.waypoint.components.local.domain.repository.LocalRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LocalService {

    private final LocalRepository localRepository;

}