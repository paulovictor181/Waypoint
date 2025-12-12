package br.edu.ufersa.waypoint.components.local.domain.service;

import br.edu.ufersa.waypoint.components.cidade.domain.entities.Cidade;
import br.edu.ufersa.waypoint.components.cidade.domain.repository.CidadeRepository;
import br.edu.ufersa.waypoint.components.dia.domain.entities.Dia;
import br.edu.ufersa.waypoint.components.dia.domain.repository.DiaRepository;
import br.edu.ufersa.waypoint.components.itinerario.domain.entities.Itinerario;
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
    private final ItinerarioRepository itinerarioRepository;
    private final DiaRepository diaRepository;

    @Transactional
    public Local adicionarLocal(LocalRequestDTO dto) {
        Itinerario itinerario = itinerarioRepository.findById(dto.itinerarioId())
                .orElseThrow(() -> new RuntimeException("Itinerário não encontrado"));

        Dia dia = diaRepository.findByItinerarioIdAndNumero(itinerario.getId(), dto.dia())
                .orElseGet(() -> {
                    Dia novoDia = Dia.builder()
                            .numero(dto.dia())
                            .itinerario(itinerario)
                            .build();
                    return diaRepository.save(novoDia);
                });

        Local local = localRepository.findByOsmId(dto.osmId())
                .orElseGet(() -> {
                    Local novoLocal = Local.builder()
                            .osmId(dto.osmId()) // Importante salvar o ID do OSM
                            .name(dto.name())
                            .latitude(dto.latitude())
                            .longitude(dto.longitude())
                            .build();
                    return localRepository.save(novoLocal);
                });

        if (!dia.getLocais().contains(local)) {
            dia.getLocais().add(local);
            diaRepository.save(dia);
        }

        return local;
    }

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