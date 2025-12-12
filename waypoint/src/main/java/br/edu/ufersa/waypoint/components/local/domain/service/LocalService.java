package br.edu.ufersa.waypoint.components.local.domain.service;

import br.edu.ufersa.waypoint.components.dia.domain.entities.Dia;
import br.edu.ufersa.waypoint.components.dia.domain.repository.DiaRepository;
import br.edu.ufersa.waypoint.components.itinerario.domain.entities.Itinerario;
import br.edu.ufersa.waypoint.components.itinerario.domain.repository.ItinerarioRepository;
import br.edu.ufersa.waypoint.components.local.api.dtos.LocalRequest;
import br.edu.ufersa.waypoint.components.local.domain.entities.Local;
import br.edu.ufersa.waypoint.components.local.domain.repository.LocalRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LocalService {
    private final LocalRepository localRepository;
    private final DiaRepository diaRepository;


    @Transactional
    public void removerLocal(Long id, Long diaId) {
        Dia dia = diaRepository.findById(diaId)
                .orElseThrow(() -> new RuntimeException("Dia não encontrado"));

        Local local = localRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Local não encontrado"));

        dia.getLocais().remove(local);
        diaRepository.save(dia);
    }
}