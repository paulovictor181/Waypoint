package br.edu.ufersa.waypoint.components.itinerario.domain.service;

import br.edu.ufersa.waypoint.components.cidade.domain.entities.Cidade;
import br.edu.ufersa.waypoint.components.cidade.domain.repository.CidadeRepository;
import br.edu.ufersa.waypoint.components.custo.domain.entities.Custo;
import br.edu.ufersa.waypoint.components.custo.domain.repository.CustoRepository;
import br.edu.ufersa.waypoint.components.dia.api.dtos.DiaResponseDTO;
import br.edu.ufersa.waypoint.components.itinerario.api.dtos.ItinerarioDetalhadoDTO;
import br.edu.ufersa.waypoint.components.itinerario.api.dtos.ItinerarioRequest;
import br.edu.ufersa.waypoint.components.itinerario.api.dtos.ItinerarioResumoDTO;
import br.edu.ufersa.waypoint.components.itinerario.domain.entities.Itinerario;
import br.edu.ufersa.waypoint.components.itinerario.domain.repository.ItinerarioRepository;
import br.edu.ufersa.waypoint.components.local.api.dtos.LocalResponseDTO;
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
    private final CustoRepository custoRepository;

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

    private ItinerarioDetalhadoDTO toDetalhadoDTO(Itinerario it) {
        // Busca TODOS os custos desse itinerário de uma vez
        List<Custo> todosCustosDoItinerario = custoRepository.findByItinerarioId(it.getId());

        List<DiaResponseDTO> diasDTO = it.getDias().stream().map(dia -> {

            // Para cada dia, mapeamos os locais
            List<LocalResponseDTO> locaisDTO = dia.getLocais().stream().map(local -> {

                // Filtra os custos que pertencem a ESTE dia e a ESTE local
                List<Custo> custosDesteLocal = todosCustosDoItinerario.stream()
                        .filter(c -> c.getDia().getId().equals(dia.getId()) &&
                                c.getLocal().getId().equals(local.getId()))
                        .toList();

                return new LocalResponseDTO(
                        local.getId(),
                        local.getName(),
                        local.getLatitude(),
                        local.getLongitude(),
                        dia.getNumero(),
                        custosDesteLocal // Anexa apenas os custos corretos
                );
            }).toList();

            return new DiaResponseDTO(dia.getNumero(), locaisDTO);
        }).toList();

        return new ItinerarioDetalhadoDTO(
                it.getId(),
                it.getName(),
                it.getInicio(),
                it.getFim(),
                it.getTotalOrcamento(),
                it.getCidade() != null ? it.getCidade().getNome() : null,
                it.getCidade() != null ? it.getCidade().getLatitude() : null,
                it.getCidade() != null ? it.getCidade().getLongitude() : null,
                diasDTO // Nova estrutura com dias
        );
    }

    private ItinerarioResumoDTO toDTO(Itinerario it) {
        return new ItinerarioResumoDTO(
                it.getId(),
                it.getName(),
                it.getInicio(),
                it.getFim(),
                it.getTotalOrcamento(),
                it.getCidade() != null ? it.getCidade().getNome() : null,
                it.getCidade() != null ? it.getCidade().getLatitude() : null,
                it.getCidade() != null ? it.getCidade().getLongitude() : null
        );
    }
}