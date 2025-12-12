package br.edu.ufersa.waypoint.components.itinerario.domain.service;

import br.edu.ufersa.waypoint.components.cidade.domain.entities.Cidade;
import br.edu.ufersa.waypoint.components.cidade.domain.repository.CidadeRepository;
import br.edu.ufersa.waypoint.components.custo.api.dtos.CustoRequest;
import br.edu.ufersa.waypoint.components.custo.domain.entities.Custo;
import br.edu.ufersa.waypoint.components.custo.domain.repository.CustoRepository;
import br.edu.ufersa.waypoint.components.dia.api.dtos.DiaRequest;
import br.edu.ufersa.waypoint.components.dia.api.dtos.DiaResponse;
import br.edu.ufersa.waypoint.components.dia.domain.entities.Dia;
import br.edu.ufersa.waypoint.components.dia.domain.repository.DiaRepository;
import br.edu.ufersa.waypoint.components.itinerario.api.dtos.ItinerarioDetalhadoDTO;
import br.edu.ufersa.waypoint.components.itinerario.api.dtos.ItinerarioRequest;
import br.edu.ufersa.waypoint.components.itinerario.api.dtos.ItinerarioResumoDTO;
import br.edu.ufersa.waypoint.components.itinerario.api.dtos.ItinerarioUpdateRequest;
import br.edu.ufersa.waypoint.components.itinerario.domain.entities.Itinerario;
import br.edu.ufersa.waypoint.components.itinerario.domain.repository.ItinerarioRepository;
import br.edu.ufersa.waypoint.components.local.api.dtos.LocalRequest;
import br.edu.ufersa.waypoint.components.local.api.dtos.LocalResponse;
import br.edu.ufersa.waypoint.components.local.domain.entities.Local;
import br.edu.ufersa.waypoint.components.local.domain.repository.LocalRepository;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItinerarioService {

    private final ItinerarioRepository itinerarioRepository;
    private final CidadeRepository cidadeRepository;
    private final CustoRepository custoRepository;
    private final LocalRepository localRepository;
    private final DiaRepository diaRepository;

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

    public ItinerarioDetalhadoDTO buscarPorIdDetalhado(Long id, Usuario usuario) {
        Itinerario it = itinerarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Itinerário não encontrado"));

        if(!it.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Acesso negado");
        }

        return toDetalhadoDTO(it);
    }

    public List<ItinerarioResumoDTO> buscarPorCidade(String nomeCidade) {
        List<Itinerario> lista = itinerarioRepository.findByCidadeNomeContainingIgnoreCase(nomeCidade);
        return lista.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ItinerarioDetalhadoDTO buscarPorIdPublico(Long id) {
        Itinerario it = itinerarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Itinerário não encontrado"));
        return toDetalhadoDTO(it);
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

    @Transactional
    public ItinerarioResumoDTO atualizar(Long id, ItinerarioUpdateRequest request, Usuario usuario) {

        Itinerario itinerario = itinerarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Itinerário não encontrado"));

        if (!itinerario.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Acesso negado: Você não pode editar este itinerário.");
        }

        itinerario.setName(request.name());
        itinerario.setInicio(request.inicio());
        itinerario.setFim(request.fim());
        itinerario.setTotalOrcamento(request.totalOrcamento());


        List<Custo> custosAntigos = custoRepository.findByItinerarioId(itinerario.getId());
        custoRepository.deleteAll(custosAntigos);

        itinerario.getDias().clear();
        itinerarioRepository.saveAndFlush(itinerario);

        if (request.dias() != null) {
            for (DiaRequest diaRequest : request.dias()) {

                Dia novoDia = Dia.builder()
                        .numero(diaRequest.Numeracao())
                        .itinerario(itinerario)
                        .locais(new ArrayList<>())
                        .build();

                if (diaRequest.locais() != null) {
                    for (LocalRequest localReq : diaRequest.locais()) {
                        Local local = localRepository.findByOsmId(localReq.osmId())
                                .orElseGet(() -> localRepository.save(Local.builder()
                                        .osmId(localReq.osmId())
                                        .name(localReq.name())
                                        .latitude(localReq.latitude())
                                        .longitude(localReq.longitude())
                                        .build()));

                        novoDia.getLocais().add(local);
                    }
                }

                novoDia = diaRepository.save(novoDia);
                itinerario.getDias().add(novoDia);

                if (diaRequest.locais() != null) {
                    for (LocalRequest localReq : diaRequest.locais()) {
                        Local local = localRepository.findByOsmId(localReq.osmId()).orElseThrow();

                        if (localReq.custos() != null) {
                            for (CustoRequest custoReq : localReq.custos()) {
                                Custo custo = Custo.builder()
                                        .description(custoReq.description())
                                        .amount(custoReq.amount())
                                        .itinerario(itinerario)
                                        .dia(novoDia)
                                        .local(local)
                                        .usuario(usuario)
                                        .build();
                                custoRepository.save(custo);
                            }
                        }
                    }
                }
            }
        }

        itinerarioRepository.save(itinerario);

        return toDTO(itinerario);
    }

    private ItinerarioResumoDTO toDTO(Itinerario it) {
        return new ItinerarioResumoDTO(
                it.getId(),
                it.getName(),
                it.getInicio(),
                it.getFim(),
                it.getTotalOrcamento(),
                it.calcularCustoTotal(),
                it.getCidade() != null ? it.getCidade().getNome() : null,
                it.getCidade() != null ? it.getCidade().getLatitude() : null,
                it.getCidade() != null ? it.getCidade().getLongitude() : null
        );
    }

    private ItinerarioDetalhadoDTO toDetalhadoDTO(Itinerario it) {
        List<DiaResponse> diasResp = it.getDias().stream().map(dia -> {

            List<LocalResponse> locaisResp = dia.getLocais().stream().map(local -> {

                List<Custo> custos = custoRepository.findByDiaIdAndLocalId(dia.getId(), local.getId());

                return new LocalResponse(
                        local.getId(),
                        local.getOsmId(),
                        local.getName(),
                        local.getLatitude(),
                        local.getLongitude(),
                        0,
                        custos
                );
            }).toList();

            return new DiaResponse(dia.getNumero(), locaisResp);
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
                diasResp
        );
    }
}